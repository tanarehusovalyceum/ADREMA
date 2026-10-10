// Vytvorí obsah config.js z premenných prostredia (GitHub Secrets / Vercel Environment Variables).
// Skutočný config.js s kľúčmi preto nemusí byť v repozitári (je v .gitignore).
import { pathToFileURL } from 'node:url';

export function buildConfig(env = process.env) {
  const missing = ['VAPI_PUBLIC_KEY', 'ELEVENLABS_VOICE_ID'].filter(k => !env[k]);
  if (missing.length) {
    throw new Error('Chýbajú premenné prostredia: ' + missing.join(', ') +
      ' (GitHub: Settings → Secrets and variables → Actions, Vercel: Project → Settings → Environment Variables)');
  }
  const processEnv = {
    REACT_APP_VAPI_PUBLIC_KEY: env.VAPI_PUBLIC_KEY,
    REACT_APP_ELEVENLABS_VOICE_ID: env.ELEVENLABS_VOICE_ID,
    REACT_APP_VAPI_LLM_MODEL: env.VAPI_LLM_MODEL || '',
    REACT_APP_ELEVENLABS_MODEL: env.ELEVENLABS_MODEL || ''
  };
  const windowEnv = {
    GROQ_API_KEY: env.GROQ_API_KEY || '',
    SUPABASE_URL: env.SUPABASE_URL || '',
    SUPABASE_KEY: env.SUPABASE_KEY || ''
  };
  return `// Vygenerované pri nasadení (scripts/build-config.mjs) – neupravovať na serveri ručne.
window.process = window.process || {};
window.process.env = Object.assign(window.process.env || {}, ${JSON.stringify(processEnv, null, 2)});
window.ENV = Object.assign(window.ENV || {}, ${JSON.stringify(windowEnv, null, 2)});
`;
}

// Spustené priamo: vypíše config.js na výstup
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.stdout.write(buildConfig()); } catch (e) { console.error(e.message); process.exit(1); }
}
