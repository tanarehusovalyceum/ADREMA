// Nenápadná informačná lišta o súkromí (nie súhlas s cookies – ADREMA nepoužíva sledovacie cookies).
// Zobrazí sa raz; po kliknutí na „Rozumiem“ sa to zapamätá v prehliadači.
(function () {
  var KEY = 'adrema_privacy_ack_v1';
  try { if (localStorage.getItem(KEY) === 'true') return; } catch (e) { }

  function isDark() {
    var root = document.documentElement;
    if (root.classList.contains('dark')) return true;
    if (root.classList.contains('light')) return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function show() {
    if (document.getElementById('adrema-privacy-notice')) return;
    var dark = isDark();
    var bar = document.createElement('div');
    bar.id = 'adrema-privacy-notice';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Informácia o ochrane súkromia');
    bar.style.cssText = [
      'position:fixed', 'left:16px', 'right:16px',
      'bottom:calc(16px + env(safe-area-inset-bottom, 0px))',
      'z-index:2147483000', 'max-width:720px', 'margin:0 auto',
      'display:flex', 'flex-wrap:wrap', 'align-items:center', 'gap:10px 16px',
      'padding:14px 16px', 'border-radius:14px',
      'font:14px/1.5 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'box-shadow:0 10px 30px -10px rgba(0,0,0,0.35)',
      dark ? 'background:#1c2026;color:#e2e2e6;border:1px solid #2e3440' : 'background:#ffffff;color:#191c1e;border:1px solid #c2c6d3'
    ].join(';');

    var text = document.createElement('p');
    text.style.cssText = 'margin:0;flex:1 1 320px;';
    text.textContent = 'ADREMA nepoužíva reklamné ani analytické cookies. Ukladáme len údaje potrebné na fungovanie simulátora (vo vašom prehliadači). Hlasový hovor spracúvajú poskytovatelia Vapi, ElevenLabs a Anthropic.';

    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';

    var more = document.createElement('a');
    more.href = 'sukromie.html';
    more.textContent = 'Viac informácií';
    more.style.cssText = 'padding:8px 14px;border-radius:10px;text-decoration:none;font-weight:600;' +
      (dark ? 'color:#a6c8ff;border:1px solid #2e3440' : 'color:#003b72;border:1px solid #c2c6d3');

    var ok = document.createElement('button');
    ok.type = 'button';
    ok.textContent = 'Rozumiem';
    ok.style.cssText = 'padding:8px 16px;border-radius:10px;border:0;cursor:pointer;font:inherit;font-weight:700;' +
      (dark ? 'background:#a6c8ff;color:#111418' : 'background:#003b72;color:#ffffff');
    ok.addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'true'); } catch (e) { }
      bar.remove();
    });

    actions.appendChild(more);
    actions.appendChild(ok);
    bar.appendChild(text);
    bar.appendChild(actions);
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
})();
