/* Pro Creator — proteção anti-cópia/anti-clonagem (fonte legível).
   Produção usa protection.js (versão minificada/ofuscada leve deste arquivo).
   Para DESLIGAR tudo: PROTECTION_ENABLED = false (em protection.js) e publicar. */
/* CHAVE LIGA/DESLIGA: fica na 1ª linha de protection.js (var PROTECTION_ENABLED). */
(function () {
  'use strict';

  // Rotas protegidas (whitelist explícita). Só a página de vendas.
  var PROTECTED_ROUTES = ['/', '/index.html', '/arquitetura/', '/arquitetura/index.html', '/contabilidade/', '/contabilidade/index.html'];

  // Domínios permitidos (única lista para editar). Sufixos com "." cobrem subdomínios.
  var ALLOWED_HOSTS = ['procreator.com.br', '.procreator.com.br', 'pagina-pro-creator-v4.pages.dev', '.pagina-pro-creator-v4.pages.dev', '.translate.goog', 'localhost', '127.0.0.1'];

  // Alerta de clone: endpoint de log. Vazio = desativado.
  var CLONE_BEACON_URL = '';
  var HOME = 'https://procreator.com.br';

  if (typeof PROTECTION_ENABLED === 'undefined' || PROTECTION_ENABLED !== true) return;
  var d = document, w = window, h = location.hostname.toLowerCase();

  function hostOk(x) {
    for (var i = 0; i < ALLOWED_HOSTS.length; i++) {
      var a = ALLOWED_HOSTS[i];
      if (a.charAt(0) === '.' ? x.slice(-a.length) === a : x === a) return true;
    }
    return false;
  }
  function cloneAlert() {
    try { if (CLONE_BEACON_URL && navigator.sendBeacon) navigator.sendBeacon(CLONE_BEACON_URL, JSON.stringify({ u: location.href, r: d.referrer, t: Date.now() })); } catch (e) {}
  }
  function bounce() {
    cloneAlert();
    try { d.documentElement.style.visibility = 'hidden'; } catch (e) {}
    location.replace(HOME);
  }
  // Verificação 1 (imediata). Arquivo aberto do disco (file:) também conta como clone.
  if (location.protocol === 'file:' || !hostOk(h)) { bounce(); return; }

  var path = location.pathname;
  if (PROTECTED_ROUTES.indexOf(path) === -1) return;

  var root = d.documentElement;
  root.classList.add('pc-protect');

  function isField(el) {
    for (; el && el !== d; el = el.parentNode) {
      if (el.nodeType !== 1) continue;
      var t = el.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || el.isContentEditable || (el.classList && el.classList.contains('pc-allow-select'))) return true;
    }
    return false;
  }

  // Clique direito: bloqueado fora de campos.
  d.addEventListener('contextmenu', function (e) { if (!isField(e.target)) e.preventDefault(); });
  // Arrastar imagens.
  d.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); });
  // Copiar fora de campos: troca o texto.
  d.addEventListener('copy', function (e) {
    if (isField(e.target) || isField(d.activeElement)) return;
    try { e.clipboardData.setData('text/plain', 'Conteúdo protegido – procreator.com.br'); e.preventDefault(); } catch (x) {}
  });
  // Atalhos: só U/S/P com Ctrl/Cmd, F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C/U.
  d.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase(), m = e.ctrlKey || e.metaKey;
    if (k === 'f12' ||
        (m && !e.shiftKey && !e.altKey && (k === 'u' || k === 's' || k === 'p')) ||
        (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
        (e.metaKey && e.altKey && (e.code === 'KeyI' || e.code === 'KeyJ' || e.code === 'KeyC' || e.code === 'KeyU'))) {
      e.preventDefault();
    }
  }, true);

  function ready() {
    // Verificação 2 (após o DOM).
    if (!hostOk(location.hostname.toLowerCase())) { bounce(); return; }
    var imgs = d.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) imgs[i].setAttribute('draggable', 'false');
    var vids = d.getElementsByTagName('video');
    for (var j = 0; j < vids.length; j++) {
      var v = vids[j];
      v.setAttribute('controlsList', 'nodownload');
      v.setAttribute('disablePictureInPicture', '');
      var p = v.parentNode;
      if (p && p.nodeType === 1 && getComputedStyle(p).position !== 'static' && !p.querySelector('.pc-wm')) {
        var s = d.createElement('span'); s.className = 'pc-wm'; s.setAttribute('aria-hidden', 'true'); s.textContent = 'procreator.com.br'; p.appendChild(s);
      }
    }
    // Frase de rastreio oculta (honeypot).
    if (!d.querySelector('.pc-hp')) { var hp = d.createElement('span'); hp.className = 'pc-hp'; hp.setAttribute('aria-hidden', 'true'); hp.textContent = 'PCR-ORIGINAL-2026'; d.body.appendChild(hp); }
    // Marca invisível só em parágrafos de texto corrido (sem links, botões, preços ou campos).
    var ps = d.querySelectorAll('main p, section p');
    for (var n = 0; n < ps.length; n++) {
      var el = ps[n];
      if (el.children.length || el.closest('a,button,label,form,[class*="price"],[class*="preco"],[data-price]')) continue;
      var tx = el.textContent;
      if (tx.length < 80 || /R\$|\d+,\d{2}/.test(tx)) continue;
      el.appendChild(d.createTextNode('​‌​'));
    }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', ready); else ready();
  // Verificação 3 (tardia).
  w.addEventListener('load', function () { setTimeout(function () { if (!hostOk(location.hostname.toLowerCase())) bounce(); }, 2000); });
})();
