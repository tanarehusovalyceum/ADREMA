// Spodná lišta s upozorneniami a súhlasom (jedným kliknutím).
// Používateľ potvrdí: tréningová simulácia (nie linka 112), volajúci je AI so syntetickým hlasom,
// náročný obsah, spracúvanie údajov, orientačné hodnotenie, podmienky používania.
// Hovor v simulátore sa spustí až po súhlase (window.adremaRequireConsent).
(function () {
  var KEY = 'adrema_consent_v2';

  function hasConsent() {
    try { return !!JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return false; }
  }

  function isDark() {
    var root = document.documentElement;
    if (root.classList.contains('dark')) return true;
    if (root.classList.contains('light')) return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  var POINTS = [
    ['<b>Tréningová simulácia, nie skutočná linka 112.</b> V skutočnej núdzi volajte <b>112</b>. Nejde o oficiálny produkt IZS, HZS ani MV SR.'],
    ['<b>Volajúci je umelá inteligencia</b> a jeho hlas je umelo vytvorený. Mená a príbehy sú vymyslené.'],
    ['Hovory môžu byť <b>emocionálne náročné</b> (zranenia, deti, panika). Hovor môžete kedykoľvek ukončiť.'],
    ['Váš hlas z mikrofónu spracúvajú služby <b>Vapi, Anthropic, ElevenLabs</b> a ďalšie (aj mimo EÚ), nahrávky sa ukladajú vo Vapi. Nepoužívame reklamné ani analytické cookies.'],
    ['Hodnotenie hovoru je <b>orientačné</b> – nie je to certifikácia a rady AI nemusia byť vždy správne.']
  ];

  function render() {
    if (document.getElementById('adrema-consent')) return document.getElementById('adrema-consent');
    var dark = isDark();
    var c = dark
      ? { bg: '#1c2026', text: '#e2e2e6', border: '#2e3440', link: '#a6c8ff', btnBg: '#a6c8ff', btnText: '#111418', warn: '#ffb4ab' }
      : { bg: '#ffffff', text: '#191c1e', border: '#c2c6d3', link: '#003b72', btnBg: '#003b72', btnText: '#ffffff', warn: '#ba1a1a' };

    var bar = document.createElement('div');
    bar.id = 'adrema-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Upozornenia a súhlas');
    bar.style.cssText = [
      'position:fixed', 'left:12px', 'right:12px',
      'bottom:calc(12px + env(safe-area-inset-bottom, 0px))',
      'z-index:2147483000', 'max-width:860px', 'margin:0 auto',
      'max-height:min(70vh, 560px)', 'overflow-y:auto',
      'padding:16px 18px', 'border-radius:14px',
      'font:13.5px/1.5 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'box-shadow:0 12px 36px -10px rgba(0,0,0,0.4)',
      'background:' + c.bg, 'color:' + c.text, 'border:1px solid ' + c.border,
      'transition:transform .2s'
    ].join(';');

    var title = document.createElement('p');
    title.style.cssText = 'margin:0 0 8px;font-weight:800;font-size:15px;';
    title.textContent = 'Pred použitím simulátora, prosím, berte na vedomie:';

    var list = document.createElement('ul');
    list.style.cssText = 'margin:0 0 12px;padding-left:18px;display:grid;gap:4px;';
    POINTS.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = p[0];
      list.appendChild(li);
    });

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;';

    var links = document.createElement('p');
    links.style.cssText = 'margin:0;font-size:13px;';
    links.innerHTML = 'Podrobnosti: <a href="podmienky.html" style="color:' + c.link + '">Podmienky používania</a> · ' +
      '<a href="sukromie.html" style="color:' + c.link + '">Ochrana súkromia</a>';

    var ok = document.createElement('button');
    ok.type = 'button';
    ok.id = 'adrema-consent-accept';
    ok.textContent = 'Súhlasím a rozumiem';
    ok.style.cssText = 'padding:10px 20px;border-radius:10px;border:0;cursor:pointer;font:inherit;font-size:14px;font-weight:700;' +
      'background:' + c.btnBg + ';color:' + c.btnText + ';';
    ok.addEventListener('click', function () {
      try { localStorage.setItem(KEY, JSON.stringify({ at: new Date().toISOString(), version: 2 })); } catch (e) { }
      bar.remove();
    });

    var hint = document.createElement('p');
    hint.id = 'adrema-consent-hint';
    hint.style.cssText = 'display:none;margin:0 0 10px;font-weight:700;color:' + c.warn + ';';
    hint.textContent = 'Hovor spustíte až po potvrdení tejto lišty.';

    row.appendChild(links);
    row.appendChild(ok);
    bar.appendChild(title);
    bar.appendChild(hint);
    bar.appendChild(list);
    bar.appendChild(row);
    document.body.appendChild(bar);
    return bar;
  }

  // Simulátor volá pred štartom hovoru: true = môže pokračovať, false = zobrazí lištu
  window.adremaHasConsent = hasConsent;
  window.adremaRequireConsent = function () {
    if (hasConsent()) return true;
    var bar = render();
    var hint = document.getElementById('adrema-consent-hint');
    if (hint) hint.style.display = 'block';
    bar.style.transform = 'translateY(-6px)';
    setTimeout(function () { bar.style.transform = ''; }, 200);
    var btn = document.getElementById('adrema-consent-accept');
    if (btn) btn.focus();
    return false;
  };

  if (hasConsent()) return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
