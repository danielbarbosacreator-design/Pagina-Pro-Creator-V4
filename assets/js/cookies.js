/* Aviso de cookies (LGPD) + Google Analytics 4.
   O GA4 só carrega depois do "Aceitar". Preencha GA_ID com o ID de medição (G-XXXXXXXXXX). */
(function () {
  var GA_ID = 'G-K3W4TG5CV5';
  var KEY = 'pc_cookie_consent';
  var ls = {
    get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  };

  function loadGA() {
    if (!GA_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function banner() {
    var b = document.createElement('div');
    b.className = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML =
      '<p>Usamos cookies para o funcionamento do site, para medir o uso (Google Analytics) e para anúncios (Meta). ' +
      'Saiba mais na <a href="/politica-de-cookies/">Política de Cookies</a> e na <a href="/politica-de-privacidade/">Política de Privacidade</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn ghost" data-v="necessary">Apenas necessários</button>' +
      '<button type="button" class="cookie-btn" data-v="all">Aceitar todos</button></div>';
    b.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute('data-v');
      if (!v) return;
      ls.set(v);
      b.parentNode.removeChild(b);
      if (v === 'all') loadGA();
    });
    document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add('on'); }); });
  }

  var c = ls.get();
  if (c === 'all') loadGA();
  else if (!c) {
    var show = function () { setTimeout(banner, 1500); };
    if (document.readyState === 'complete') show(); else window.addEventListener('load', show);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!t) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (x) {}
    if (!document.querySelector('.cookie-banner')) banner();
  });
})();
