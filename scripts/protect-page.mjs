// Zašifruje stránku heslom (AES-256-GCM, kľúč z PBKDF2). Na webe je len zašifrovaný obsah,
// takže simulátor ani kľúče v ňom sa bez hesla nedajú prečítať (ani zo zdrojového kódu stránky).
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';

const SALT = 'adrema-gate-v1'; // stála hodnota: po novom nasadení netreba heslo zadávať znova
const ITERATIONS = 600000;

export function protectPage(html, password) {
  const key = pbkdf2Sync(password, SALT, ITERATIONS, 32, 'sha256');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(html, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return gatePage(iv.toString('base64'), data.toString('base64'));
}

function gatePage(iv, data) {
  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Chránený prístup – ADREMA</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=swap" rel="stylesheet" />
  <link href="site.css" rel="stylesheet" />
  <script>
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') document.documentElement.classList.add('dark');
      if (theme === 'light') document.documentElement.classList.add('light');
    } catch (e) { }
  </script>
</head>
<body>
  <header><a class="logo" href="index.html">ADREMA</a></header>
  <main>
    <form class="card" id="gate-form" style="max-width:420px" hidden>
      <div class="badge"><span class="material-symbols-outlined">lock</span>Chránený prístup</div>
      <h1>Zadaj heslo</h1>
      <p class="sub">Simulátor je dostupný len pre pozvaných používateľov.</p>
      <label class="field" for="gate-password">Heslo</label>
      <input id="gate-password" type="password" autocomplete="current-password" required />
      <p class="note" id="gate-error" role="alert" style="color:var(--accent)" hidden></p>
      <button class="btn" type="submit" style="width:100%">
        <span class="material-symbols-outlined">lock_open</span>Vstúpiť
      </button>
    </form>
  </main>
  <script>
    (function () {
      var KEY = 'adrema_access_key_v1';
      var IV = '${iv}';
      var DATA = '${data}';
      var form = document.getElementById('gate-form');
      var error = document.getElementById('gate-error');
      var bytes = function (b64) { return Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); }); };
      var base64 = function (buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); };
      var fail = function (message) { error.textContent = message; error.hidden = false; form.hidden = false; };

      function open(rawKey) {
        return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt'])
          .then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(IV) }, key, bytes(DATA)); })
          .then(function (plain) {
            try { localStorage.setItem(KEY, base64(rawKey)); } catch (e) { }
            var html = new TextDecoder().decode(plain);
            var show = function () {
              document.open();
              document.write(html);
              document.close();
            };
            // Prepísať stránku možno až po jej úplnom načítaní, inak by na nej ostal pôvodný obsah
            if (document.readyState === 'complete') show();
            else window.addEventListener('load', function () { setTimeout(show, 0); }, { once: true });
          });
      }

      function derive(password) {
        return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
          .then(function (base) {
            return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode('${SALT}'), iterations: ${ITERATIONS} }, base, 256);
          });
      }

      if (!window.crypto || !crypto.subtle) { fail('Tento prehliadač nepodporuje šifrovanie. Otvor stránku cez https v aktuálnom prehliadači.'); return; }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        error.hidden = true;
        derive(document.getElementById('gate-password').value).then(open).catch(function () { fail('Nesprávne heslo. Skús to znova.'); });
      });

      // Na tomto zariadení už heslo raz zadané → rovno do simulátora
      var saved = null;
      try { saved = localStorage.getItem(KEY); } catch (e) { }
      if (saved) {
        open(bytes(saved)).catch(function () {
          try { localStorage.removeItem(KEY); } catch (e) { }
          form.hidden = false;
        });
      } else {
        form.hidden = false;
      }
    })();
  </script>
</body>
</html>
`;
}
