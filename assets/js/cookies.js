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

  /* Meta Pixel (912571467763616): só carrega depois do "Aceitar todos", junto com o GA4.
     Não carrega em localhost nem em prévias. InitiateCheckout e Purchase continuam com a Greenn. */
  var META_ID = '912571467763616';
  function loadMeta() {
    var h = location.hostname;
    if (window.__metaLoaded || !h || h === 'localhost' || h === '127.0.0.1' || /claude|deploy-preview/i.test(h)) return;
    window.__metaLoaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_ID);
    window.fbq('track', 'PageView');
    var planos = document.getElementById('planos');
    if (planos && 'IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) {
          window.fbq('track', 'ViewContent', { content_name: 'Planos Pro Creator', content_category: 'Planos', value: 67.90, currency: 'BRL' });
          vo.disconnect();
        }
      }, { threshold: 0.25 });
      vo.observe(planos);
    }
    document.querySelectorAll('[data-plan][data-value]').forEach(function (a) {
      a.addEventListener('click', function () {
        window.fbq('trackCustom', 'LandingCheckoutClick', { content_name: a.dataset.plan, value: Number(a.dataset.value), currency: 'BRL' });
      });
    });
  }
  function loadAll() { loadGA(); loadMeta(); }

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
      if (v === 'all') loadAll();
    });
    document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add('on'); }); });
  }

  var c = ls.get();
  if (c === 'all') loadAll();
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
