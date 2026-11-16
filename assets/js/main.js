(function () {
  var header = document.querySelector('.header');
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  // Header com sombra ao rolar
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  function closeMenu() {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }
  toggle.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  mobileNav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Depoimentos em loop contínuo
  var tTrack = document.querySelector('.t-marquee .t-track');
  if (tTrack && tTrack.children.length === 1) {
    var clone = tTrack.children[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    tTrack.appendChild(clone);
  }

  // Link ativo no menu
  var links = document.querySelectorAll('.nav a');
  var sections = Array.prototype.map.call(links, function (a) {
    var h = a.getAttribute('href');
    if (h.charAt(0) !== '#') {
      // link para outra página: ativo quando é a página atual
      if (h === location.pathname) links.forEach(function (l) { l.classList.toggle('is-active', l === a); });
      return null;
    }
    return document.querySelector(h);
  });
  if ('IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = sections.indexOf(en.target);
        links.forEach(function (l, j) { l.classList.toggle('is-active', j === i); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) navObs.observe(s); });

    // Revelar ao rolar: cards e itens de grade surgem um a um
    ['.tb-grid', '.int-grid', '.plan-grid', '.aud-grid', '.feature-stack'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (grid) {
        grid.removeAttribute('data-reveal');
        Array.prototype.forEach.call(grid.children, function (el, i) {
          el.setAttribute('data-reveal', '');
          el.style.transitionDelay = Math.min(i, 6) * 90 + 'ms';
        });
      });
    });
    // Revelar ao rolar
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { revObs.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
  }
})();

/* VSL do topo: começa sozinha e muda (autoplay só é permitido sem som). Toque no Play ou no vídeo
   reinicia do começo com som. A barra verde mostra o progresso REAL (currentTime/duration), suavizada
   por requestAnimationFrame (exibição acelerada no início, ver paint); a faixa clara atrás é o trecho já carregado (buffer).
   Eventos: o pc-track.js (PostHog) já registra pc_video_* sozinho a partir do <video>. Aqui só vão para o
   Meta Pixel os marcos com som (vsl_unmute, vsl_25..vsl_100), uma vez por carregamento, sem duplicar o PostHog. */
(function () {
  var vsl = document.querySelector('[data-vsl]');
  if (!vsl) return;
  var video = vsl.querySelector('[data-vsl-video]');
  var cta = vsl.querySelector('[data-vsl-unmute]');
  var playIc = vsl.querySelector('[data-vsl-play]');
  var soundBtn = vsl.querySelector('[data-vsl-sound]');
  var bar = vsl.querySelector('[data-vsl-progress]');
  var buf = vsl.querySelector('[data-vsl-buffer]');
  var withSound = false, sent = {}, raf = 0;

  function px(name, extra) {
    if (sent[name]) return; sent[name] = true;
    try { if (window.fbq) window.fbq('trackCustom', name, extra || {}); } catch (e) {}
  }
  function frac() { return video.duration ? Math.min(1, video.currentTime / video.duration) : 0; }
  function paint() {
    /* Pedido do Daniel (16/11): barra visualmente acelerada no início (curva f^0.3: 1% do vídeo ≈ 25% da barra,
       10% ≈ 50%, termina junto com o vídeo). Os eventos de % continuam usando o tempo real. */
    bar.style.transform = 'scaleX(' + Math.pow(frac(), 0.3) + ')';
    if (buf && video.duration && video.buffered.length) {
      var end = 0;
      for (var i = 0; i < video.buffered.length; i++) if (video.buffered.start(i) <= video.currentTime + 1) end = Math.max(end, video.buffered.end(i));
      buf.style.transform = 'scaleX(' + Math.min(1, end / video.duration) + ')';
    }
  }
  function loop() { paint(); raf = video.paused ? 0 : requestAnimationFrame(loop); }
  function startLoop() { if (!raf) raf = requestAnimationFrame(loop); }

  video.muted = true;
  var p = video.play(); if (p && p.catch) p.catch(function () {});
  video.addEventListener('playing', startLoop);
  video.addEventListener('seeked', paint);
  video.addEventListener('progress', paint);
  video.addEventListener('timeupdate', function () {
    if (!raf) paint();
    if (!withSound || !video.duration) return;
    var f = frac();
    [25, 50, 75].forEach(function (m) { if (f >= m / 100) px('vsl_' + m, { sound: true }); });
  });
  video.addEventListener('play', function () { playIc.hidden = true; });
  video.addEventListener('pause', function () { if (withSound && !video.ended) { playIc.hidden = false; } paint(); });
  video.addEventListener('ended', function () {
    paint();
    if (withSound) { px('vsl_100', { sound: true }); playIc.hidden = false; }
  });

  function setSoundIcon() {
    var on = !video.muted;
    soundBtn.querySelector('[data-on]').style.display = on ? '' : 'none';
    soundBtn.querySelector('[data-off]').style.display = on ? 'none' : '';
    soundBtn.setAttribute('aria-label', on ? 'Desativar o som' : 'Ativar o som');
  }
  soundBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    video.muted = !video.muted;
    setSoundIcon();
  });

  /* Retomar de onde parou: guarda o segundo assistido COM SOM (localStorage, só neste navegador).
     Na volta, se parou entre 15s e 95% do vídeo, mostra "Continuar assistindo? / Assistir do início?". */
  var KEY = 'pc_vsl_pos_v1', resume = vsl.querySelector('[data-vsl-resume]'), startAt = 0, lastSave = 0;
  function store(v) { try { if (v == null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(v)); } catch (e) {} }
  var saved = 0; try { saved = parseFloat(localStorage.getItem(KEY)) || 0; } catch (e) {}
  if (resume && saved >= 15) {
    video.addEventListener('loadedmetadata', function () {
      if (saved < video.duration * 0.95 && !withSound) { resume.hidden = false; cta.hidden = true; vsl.classList.add('is-resume'); }
    }, { once: true });
    if (video.readyState >= 1) video.dispatchEvent(new Event('loadedmetadata'));
    resume.querySelector('[data-vsl-continue]').addEventListener('click', function (e) { e.stopPropagation(); startAt = saved; px('vsl_resume', { at: Math.round(saved) }); activate(); });
    resume.querySelector('[data-vsl-restart]').addEventListener('click', function (e) { e.stopPropagation(); startAt = 0; px('vsl_replay', { from: 'resume' }); activate(); });
  }
  video.addEventListener('timeupdate', function () {
    if (!withSound) return;
    var now = Date.now(); if (now - lastSave < 4000) return; lastSave = now;
    store(video.currentTime);
  });
  video.addEventListener('ended', function () { if (withSound) store(null); });

  function activate() {
    withSound = true;
    cta.hidden = true;
    if (resume) resume.hidden = true;
    vsl.classList.remove('is-resume');
    soundBtn.hidden = false;
    vsl.classList.add('is-sound');
    video.loop = false;
    video.muted = false;
    video.currentTime = startAt;
    paint();
    setSoundIcon();
    var q = video.play(); if (q && q.catch) q.catch(function () {});
    px('vsl_unmute', { sound: true, variant: 'smart_autoplay_blue', resumed: startAt > 0 });
  }

  vsl.addEventListener('click', function () {
    if (!withSound) {
      activate();
    } else if (video.ended) {
      video.currentTime = 0; video.play();
      sent.vsl_25 = sent.vsl_50 = sent.vsl_75 = sent.vsl_100 = false;
    } else if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
})();

/* Botão de compra fixo no celular: aparece depois que o botão do topo sai da tela e some
   quando a seção de Planos (que tem o próprio botão) ou o CTA final estão visíveis. */
(function () {
  var bar = document.querySelector('[data-sticky-cta]');
  var hero = document.querySelector('.hero-actions');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;
  var link = bar.querySelector('a');
  var heroOut = false, blockers = new Set();
  function sync() {
    var show = heroOut && blockers.size === 0;
    bar.classList.toggle('is-on', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    link.tabIndex = show ? 0 : -1;
    document.body.classList.toggle('has-sticky-cta', show);
  }
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { heroOut = !e.isIntersecting && e.boundingClientRect.top < 0; });
    sync();
  }).observe(hero);
  var bo = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) blockers.add(e.target); else blockers.delete(e.target); });
    sync();
  }, { rootMargin: '0px 0px -10% 0px' });
  ['#planos', '#comecar', '.footer'].forEach(function (sel) { var el = document.querySelector(sel); if (el) bo.observe(el); });
})();

/* Leva as UTMs do anúncio para o link da Greenn (a Greenn devolve utm_* no webhook em saleMetas).
   Só acrescenta parâmetros que ainda não existem no link; não altera oferta nem ch_id. */
(function () {
  var q = new URLSearchParams(location.search);
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  if (!keys.some(function (k) { return q.get(k); })) return;
  document.querySelectorAll('a[href*="greenn.com.br"]').forEach(function (a) {
    try {
      var u = new URL(a.href);
      keys.forEach(function (k) { var v = q.get(k); if (v && !u.searchParams.has(k)) u.searchParams.set(k, v); });
      a.href = u.toString();
    } catch (e) {}
  });
})();
