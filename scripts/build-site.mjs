// Pripraví priečinok _site so súbormi pre web + config.js z premenných prostredia.
// Používa ho Vercel (vercel.json → buildCommand) aj GitHub Actions (nasadenie na Websupport).
// simulator.html sa zverejní len zašifrovaný heslom ADREMA_ACCESS_PASSWORD, config.js je vložený v ňom.
import { mkdirSync, copyFileSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { buildConfig } from './build-config.mjs';
import { protectPage } from './protect-page.mjs';

// .htaccess je len pre Websupport (Apache); Vercel a GitHub Pages ho nepoužívajú
const FILES = ['index.html', 'login.html', 'onboarding.html', 'feedback.html', 'sukromie.html', 'podmienky.html', 'site.css', 'privacy-notice.js',
  ...(process.env.VERCEL || process.env.SKIP_HTACCESS ? [] : ['.htaccess'])];

try {
  const password = process.env.ADREMA_ACCESS_PASSWORD;
  if (!password) throw new Error('Chýba premenná prostredia ADREMA_ACCESS_PASSWORD – bez hesla sa simulátor nezverejní.');
  const config = buildConfig();
  const configTag = '<script src="config.js"></script>';
  const simulator = readFileSync('simulator.html', 'utf8');
  if (!simulator.includes(configTag)) throw new Error('simulator.html: nenašiel sa odkaz na config.js');
  rmSync('_site', { recursive: true, force: true });
  mkdirSync('_site');
  FILES.forEach(f => copyFileSync(f, '_site/' + f));
  cpSync('fotky', '_site/fotky', { recursive: true });
  writeFileSync('_site/simulator.html', protectPage(simulator.replace(configTag, () => `<script>${config}</script>`), password));
  writeFileSync('_site/robots.txt', 'User-agent: *\nDisallow: /simulator.html\nDisallow: /login.html\nDisallow: /onboarding.html\nDisallow: /feedback.html\n');
  console.log('Web pripravený v _site/: ' + [...FILES, 'simulator.html (zašifrovaný)', 'robots.txt'].join(', '));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
