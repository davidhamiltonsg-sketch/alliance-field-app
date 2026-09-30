# alliance-field-app

THE ALLIANCE · Field App — Built for precision. Designed for connection.

The pocket companion to THE ALLIANCE Operating Manual and Field Kit, by David
Hamilton and Dr Zhongming Shi: a Situation Map that routes you to the right
protocol card, a Pause + Return timer, the Weekly Reset wizard, Profile
Calibration and Connection Cards. Next.js (App Router) + Tailwind CSS v4,
installable as an offline PWA.

## Setup

Requires Node 22.12 or newer (Vitest 5; CI uses Node 22).

```bash
npm ci          # or npm install
npm run dev     # http://localhost:3000
```

## Scripts

| Script              | What it does                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`       | Dev server. `predev` first generates `public/sw.js`.                          |
| `npm run build`     | Production build. `prebuild` generates icons, launch images and `sw.js`.     |
| `npm start`         | Serve the production build.                                                  |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript).                                  |
| `npm run typecheck` | `tsc --noEmit`.                                                              |
| `npm test`          | Vitest: calibration scoring, storage, `.ics`, timer, data consistency.       |
| `npm run icons`     | Regenerate icons and iOS launch images only.                                 |
| `npm run sw`        | Regenerate `public/sw.js` only.                                              |

CI (`.github/workflows/ci.yml`) runs `npm ci`, lint, `tsc --noEmit`, tests and
the build on every push and pull request.

## Prebuild: icons and launch images (sharp)

`scripts/generate-icons.mjs` rasterises the vector brand marks with
[sharp](https://sharp.pixelplumbing.com/) (a devDependency, so Vercel installs
it) into `public/favicon.ico`, `apple-touch-icon.png`, `icon-192.png`,
`icon-512.png`, `icon-maskable-512.png` and `public/splash/launch-*.png`.

- Sources: `public/icon.svg`, `public/alliance-mark.svg`,
  `scripts/brand/icon-square.svg`, `scripts/brand/icon-maskable.svg`.
- The iOS launch-screen sizes live in `src/data/launch-screens.json`, shared by
  the script and `src/app/layout.tsx` (which emits the startup-image links).
- The generated PNG/ICO files are build outputs and are git-ignored. If sharp
  can't load, the script keeps any existing files and warns about missing ones.

## Offline service worker and cache versioning

`public/sw.js` is generated (and git-ignored). Edit `scripts/sw.template.js`;
`scripts/generate-sw.mjs` runs in `predev`/`prebuild` and injects:

- **Cache version**: `alliance-field-<git SHA>` (from `VERCEL_GIT_COMMIT_SHA`,
  `GITHUB_SHA` or `git rev-parse`; a timestamp is appended for uncommitted
  builds, and used alone outside git). Every deploy therefore ships a
  byte-different worker, the browser installs it, and `activate` deletes the
  older `alliance-field-*` caches.
- **Precache list**: every static route found under `src/app` (including
  `/calibrate`, `/connect`, `/help`), every `/protocols/[slug]` page from
  `src/data/cards/*.json`, plus the manifest and icons. Each URL is added on
  its own (`Promise.allSettled`), so one missing file can't fail the install.

At runtime, navigations are network-first with a cache fallback (then `/`);
other same-origin GETs are stale-while-revalidate. Only `ok`, same-origin
responses are written to the cache.

## Where data is stored

Nowhere but this device. There is no account, backend or analytics, and the
app sends no user data over the network. Everything is in `localStorage`
under keys starting with `alliance.` (see `src/lib/storage.ts`): pause return
time, Weekly Reset draft and history, calibration answers (and Partner A's
privacy choice), favourites, recent protocols, and whether the intro was
seen. The offline copy of the app lives in Cache Storage.

**Delete all my data** (`/help#your-data`, linked from About) calls
`wipeAll()`, which removes every `alliance.*` key and clears Cache Storage.
The Weekly Reset "Clear entries" button can also clear history.

On a shared device, Profile Calibration asks Partner A before the hand-over
whether Partner B may see A's individual profile (private by default); B then
sees only the couple report.

## Safety page

`/help` (header "Help" link, About, the Situation Map's first row, and the
Green Rule / Pause + Return / Unity Anchor / Intimacy Pact / Trust Recovery /
Uninvestment Check cautions) holds the canonical Help Lines as `tel:`/`sms:`
links and the "when not to use this app" guidance. The numbers are in
`src/data/help.ts` and must match the printed Manual and Kit exactly.
Safety routing always comes first; "unsafe" is never routed to Pause + Return
(Pause + Return is for flooding, never for fear).

## Content and visuals

- Protocol cards: `src/data/cards/*.json` (15 protocol cards; the Kit's 16th
  card is Read This First). Counts shared with the printed products are in
  `src/data/kit.ts`; `tests/data-consistency.test.ts` checks them.
- Step diagrams: `src/data/visuals/protocol-diagrams.ts`, maintained by hand.
  A diagram only renders when it has exactly as many steps as its card.
- Protocol and section icons: `src/components/visuals/ProtocolIcon.tsx`, and
  the v2 visual language primitives in `src/components/visuals/v2.tsx`. These
  were originally ported by `scripts/brand/port-visuals.py` from the external
  visuals library (not in this repo; set `VISUALS_DIR` to use it). Re-running
  it would overwrite hand edits in `protocol-diagrams.ts`, so don't.
- Intro diagrams: `src/components/intro/diagrams.tsx` (animated inline SVG).
