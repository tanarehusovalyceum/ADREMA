// Šablóna: skopíruj ako config.js a doplň kľúče (config.js je v .gitignore, na web ho vytvorí GitHub Actions).
// Simulátor nie je React/Node projekt, preto premenné "process.env.*" definujeme tu pre prehliadač.
window.process = window.process || {};
window.process.env = Object.assign(window.process.env || {}, {
  // Vapi Dashboard → Organization → API Keys → Public Key
  REACT_APP_VAPI_PUBLIC_KEY: 'SEM_VLOZ_VAPI_PUBLIC_KEY',

  // ElevenLabs → Voices → Voice ID (hlas volajúceho)
  REACT_APP_ELEVENLABS_VOICE_ID: 'SEM_VLOZ_ELEVENLABS_VOICE_ID',

  // Voliteľné: pevne nastaví LLM model (predvolene 'claude-haiku-4-5-20251001')
  REACT_APP_VAPI_LLM_MODEL: '',

  // Voliteľné: hlasový model ElevenLabs (predvolene 'eleven_v3' – znie najľudskejšie; rýchlejší je 'eleven_multilingual_v2')
  REACT_APP_ELEVENLABS_MODEL: ''
});

// Voliteľné: AI spätná väzba pre dispečera po hovore (Groq, https://console.groq.com/keys).
// Bez kľúča dostane dispečer automatické vyhodnotenie podľa protokolu 112.
window.ENV = Object.assign(window.ENV || {}, {
  GROQ_API_KEY: ''
});
