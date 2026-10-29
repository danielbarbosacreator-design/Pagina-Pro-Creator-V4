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
  var tTrack = document.querySelector('.t-track');
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

/* Vídeo de demonstração do topo (mesmo comportamento da V3: começa mudo, clique para ouvir do início) */
(function () {
  var vsl = document.querySelector('[data-vsl]');
  if (!vsl) return;
  var video = vsl.querySelector('[data-vsl-video]');
  var unmute = vsl.querySelector('[data-vsl-unmute]');
  var playIc = vsl.querySelector('[data-vsl-play]');
  var progress = vsl.querySelector('[data-vsl-progress]');
  var withSound = false;
  video.muted = true;
  video.play().catch(function () {});
  video.addEventListener('timeupdate', function () {
    if (!withSound || !video.duration) return;
    progress.style.width = (Math.pow(video.currentTime / video.duration, 0.6) * 100) + '%';
  });
  video.addEventListener('play', function () { playIc.hidden = true; });
  video.addEventListener('pause', function () { if (withSound) playIc.hidden = false; });
  video.addEventListener('ended', function () { progress.style.width = '100%'; });
  vsl.addEventListener('click', function () {
    if (!withSound) {
      withSound = true;
      unmute.hidden = true;
      video.loop = false;
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(function () {});
    } else if (video.paused) {
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  });
})();
