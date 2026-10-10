// Pripraví priečinok _site so súbormi pre web + config.js z premenných prostredia.
// Používa ho Vercel (vercel.json → buildCommand) aj GitHub Actions (nasadenie na Websupport).
import { mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { buildConfig } from './build-config.mjs';

// .htaccess je len pre Websupport (Apache); Vercel a GitHub Pages ho nepoužívajú
const FILES = ['index.html', 'simulator.html', 'login.html', 'onboarding.html', 'feedback.html', 'site.css',
  ...(process.env.VERCEL || process.env.SKIP_HTACCESS ? [] : ['.htaccess'])];

try {
  const config = buildConfig();
  rmSync('_site', { recursive: true, force: true });
  mkdirSync('_site');
  FILES.forEach(f => copyFileSync(f, '_site/' + f));
  writeFileSync('_site/config.js', config);
  console.log('Web pripravený v _site/: ' + [...FILES, 'config.js'].join(', '));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
