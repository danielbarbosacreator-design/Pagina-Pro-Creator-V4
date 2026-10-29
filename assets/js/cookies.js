/* Google Analytics 4 + eventos do Meta Pixel, sempre ativos (decisão de 2026-10-29: sem aviso de cookies).
   O pixel e o PageView ficam no <head> de cada página; aqui entram só ViewContent e o clique de checkout.
   InitiateCheckout e Purchase continuam com a Greenn. */
(function () {
  var GA_ID = 'G-K3W4TG5CV5';
  var META_ID = '912571467763616';
  var h = location.hostname;
  var isPreview = !h || h === 'localhost' || h === '127.0.0.1' || /claude|deploy-preview/i.test(h);

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

  function loadMeta() {
    if (window.__metaLoaded) return;
    window.__metaLoaded = true;
    if (!window.fbq) {
      /* Página sem o pixel no <head>: carrega aqui, com um PageView só. */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', META_ID);
      window.fbq('track', 'PageView');
    }
    var planos = document.getElementById('planos');
    if (planos && 'IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) {
          window.fbq('track', 'ViewContent', { content_name: 'Planos Pro Creator', content_category: 'Planos', value: 67.90, currency: 'BRL' });
          vo.disconnect();
        }
      }, { rootMargin: "0px 0px -30% 0px" });
      vo.observe(planos);
    }
    document.querySelectorAll('[data-plan][data-value]').forEach(function (a) {
      a.addEventListener('click', function () {
        window.fbq('trackCustom', 'LandingCheckoutClick', { content_name: a.dataset.plan, value: Number(a.dataset.value), currency: 'BRL' });
      });
    });
  }

  loadGA();
  if (!isPreview) loadMeta();
})();
