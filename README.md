# ADREMA – simulátor tiesňovej linky 112

Tréning dispečerov: hlasový hovor s AI volajúcim v panike (Vapi + Claude + ElevenLabs),
lokalizácia na mape (AML / BTS / ručné vyhľadanie) a spätná väzba po každom hovore.

## Súbory

| Súbor | Obsah |
|---|---|
| `index.html` | Úvodná stránka (landing) s tlačidlom do simulátora |
| `simulator.html` | Samotný simulátor |
| `login.html` | Prihlásenie menom (bez hesla – pozri „Bezpečnosť“) |
| `onboarding.html` | Krátky úvod pri prvom prihlásení |
| `feedback.html` | Formulár spätnej väzby (zobrazí sa adminovi v záložke Spätná väzba) |
| `site.css` | Spoločný vzhľad stránok mimo simulátora |
| `config.example.js` | Šablóna nastavení – lokálne ju skopíruj ako `config.js` |
| `.htaccess` | Websupport: presmerovanie na HTTPS (bez neho nefunguje mikrofón) |
| `.github/workflows/deploy.yml` | Automatické nasadenie na Websupport po každom `git push` |
| `scripts/build-site.mjs`, `scripts/build-config.mjs` | Pri nasadení pripravia web do `_site/` a vytvoria `config.js` z premenných prostredia |
| `vercel.json`, `.vercelignore` | Nastavenia pre Vercel |
| `spustit.command` | Lokálne spustenie dvojklikom (Mac) |

`config.js` (s kľúčmi) a `zaloha/` sa do GitHubu nenahrávajú (`.gitignore`).

## Lokálne spustenie

Dvojklik na `spustit.command` → otvorí http://localhost:8000/
(ručne: `python3 -m http.server 8000` v tomto priečinku).
Ak `config.js` chýba, skopíruj `config.example.js` → `config.js` a doplň kľúče.

## Kde je web zverejnený

| Kde | Adresa | Ako sa aktualizuje |
|---|---|---|
| GitHub Pages | https://tanarehusovalyceum.github.io/ADREMA/ | automaticky po každom `git push` do `main` (`.github/workflows/pages.yml`) |
| Vercel | https://adrema.vercel.app | `npx vercel@60.1.1 deploy --prod`, alebo pripojením repozitára vo Verceli |
| Websupport | vlastná doména | ručne: Actions → *Nasadenie na Websupport* → Run workflow (alebo premenná `DEPLOY_WEBSUPPORT` = `true`) |

Repozitár: https://github.com/tanarehusovalyceum/ADREMA – kľúče sú v **Settings → Secrets and variables → Actions**
(`VAPI_PUBLIC_KEY`, `ELEVENLABS_VOICE_ID`), nie v kóde.

## Nasadenie na Vercel (aktuálne: https://adrema.vercel.app)

Projekt `adrema` je prepojený s týmto priečinkom (`.vercel/`). Kľúče sú vo Verceli ako
Environment Variables `VAPI_PUBLIC_KEY` a `ELEVENLABS_VOICE_ID`; pri builde z nich
`scripts/build-site.mjs` vytvorí `config.js` (nastavenia v `vercel.json`).

Nová verzia po úprave kódu (v tomto priečinku):

```bash
npx vercel@60.1.1 deploy --prod
```

Zmena kľúčov: vercel.com → projekt adrema → Settings → Environment Variables, potom znova nasadiť.
Automatické nasadenie po každom `git push`: vercel.com → projekt → Settings → Git → pripojiť GitHub repozitár.

## Nasadenie: GitHub → Websupport

### 1. Repozitár na GitHube
Na github.com vytvor nový repozitár (napr. `adrema`, môže byť **Private**), potom v tomto priečinku:

```bash
git init -b main
git add .
git commit -m "ADREMA simulátor"
git remote add origin https://github.com/TVOJ-UCET/adrema.git
git push -u origin main
```

### 2. FTP údaje z Websupportu
WebAdmin → tvoja doména → **FTP** (alebo Hosting → FTP účty): server, používateľ, heslo.
Pozri sa aj, do ktorého priečinka patrí web – na Websupporte býva `web` (vtedy netreba nič meniť).

### 3. GitHub Secrets
Repozitár → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Hodnota |
|---|---|
| `FTP_SERVER` | FTP server z Websupportu |
| `FTP_USERNAME` | FTP používateľ |
| `FTP_PASSWORD` | FTP heslo |
| `VAPI_PUBLIC_KEY` | Vapi → API Keys → Public Key |
| `ELEVENLABS_VOICE_ID` | Voice ID hlasu volajúceho |
| `GROQ_API_KEY` | *(voliteľné)* AI spätná väzba po hovore |
| `VAPI_LLM_MODEL`, `ELEVENLABS_MODEL` | *(voliteľné)* zmena modelov, inak predvolené |

Záložka **Variables** *(voliteľné)*: `FTP_SERVER_DIR` ak web nie je v `./web/`
(napr. `./public_html/` alebo `./`), `FTP_PROTOCOL` = `ftp` ak Websupport neprijme `ftps`.

### 4. Nasadenie
Každý `git push` do `main` web automaticky nahrá (GitHub → **Actions** ukazuje priebeh).
Ručne: Actions → *Nasadenie na Websupport* → **Run workflow**.

### 5. HTTPS na Websupporte
WebAdmin → doména → **SSL certifikát** → zapnúť bezplatný Let's Encrypt.
Bez HTTPS prehliadač nepovolí mikrofón; `.htaccess` potom presmeruje http → https.

## Bezpečnosť
- Všetko, čo je v `config.js` (Vapi public key, Voice ID, prípadne Groq kľúč), je na webe
  **verejne čitateľné** – tak fungujú všetky aplikácie bežiace v prehliadači. Vapi public key je
  na to určený; vo Vapi dashboarde si pri ňom nastav povolenú doménu. Groq kľúč na verejný web
  radšej nedávaj (každý by ho mohol použiť na tvoj účet).
- Prihlásenie je len menom a dáta (hovory, výsledky, spätná väzba) sú uložené v prehliadači
  používateľa. Nie je to skutočné zabezpečenie – kto napíše meno `admin`, uvidí admin záložky.

## Kde čo nájsť v simulator.html (hľadaj text)
- **Hovor cez Vapi** – `Vapi Web SDK (@vapi-ai/web)`, `vapi.start(`, `buildEmergencyCallerPrompt`
- **Spätná väzba pre dispečera** – `Spätná väzba pre dispečera`, `evaluateProtocol`, `evaluateWithLLM`
- **Záložka Výsledky hovorov** – `main-results`, `renderResultsView`
- **Mapa a lokalizácia volajúceho** – `LOCATION_PROFILES`, `startCallerLocalization`
