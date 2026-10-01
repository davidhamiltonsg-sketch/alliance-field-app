# alliance-field-app

ALLIANCE PROTOCOLS · Field App — Built for precision. Designed for connection.

The pocket companion to the Alliance Protocols Operating Manual and Field Kit, by David
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
| `npm test`          | Vitest: calibration, storage, `.ics`, timer, data consistency, lock/proxy, security headers, service worker. |
| `npm run icons`     | Regenerate icons and iOS launch images only.                                 |
| `npm run sw`        | Regenerate `public/sw.js` only.                                              |

CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm audit --omit=dev
--audit-level=high`, lint, `tsc --noEmit`, tests and the build on every push
and pull request.

## Environment variables

All optional. `NEXT_PUBLIC_*` values are baked in at **build time**: set them
in Vercel's project env vars (or `.env.local` locally) and redeploy.

| Variable                      | Purpose                                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| `LAUNCH_ACCESS_CODE`          | Turns on the pre-launch lock (see below). Unset = launched, no lock.                                      |
| `LAUNCH_COOKIE_SECRET`        | Key for the access cookie's HMAC. Recommended while locked; if unset, a key is derived from the code.      |
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Contact address on /privacy and the signup mailto: fallback. Default `hello@allianceprotocols.com`.        |
| `NEXT_PUBLIC_FULL_SYSTEM_URL` | https store page for the Manual + Field Kit. Unset: the buy button is replaced by "Coming soon".           |
| `NEXT_PUBLIC_SIGNUP_ENDPOINT` | Email signup endpoint (see *Email signup* below). Its origin is added to the CSP.                          |

## Pre-launch lock

While `LAUNCH_ACCESS_CODE` is set, `src/proxy.ts` sends every page except
`/help`, `/privacy` and `/unlock` to `/unlock`, which asks for the code
(case-insensitive, surrounding spaces ignored). Locked pages are `noindex`,
and `/sw.js` 404s so a locked visitor never installs the offline worker.

- The right code sets `ap_access` (httpOnly, Secure, SameSite=Lax, 30 days)
  holding `HMAC-SHA256(key, code)`, never the code. The key is
  `LAUNCH_COOKIE_SECRET`, or (if unset) derived from the code, which is fine
  for a gate whose only secret is the code. Set a long random
  `LAUNCH_COOKIE_SECRET` so a leaked cookie can't be brute-forced offline;
  changing it signs everyone out.
- Codes and cookies are compared in constant time. A wrong code waits
  ~600 ms before answering; malformed bodies bounce back with an error.
- After unlocking, `next` must be a same-origin path (backslashes and control
  characters are rejected, then the URL must resolve to the same origin).
- **Rate limiting:** the delay only slows a single client. On Vercel, add a
  Firewall rate-limit rule for `POST /unlock` (for example 10 requests per
  minute per IP) before sharing the code widely.
- **To launch:** delete `LAUNCH_ACCESS_CODE` (and `LAUNCH_COOKIE_SECRET`) in
  Vercel and redeploy. `/unlock` then 404s, the cookie is no longer set, and
  existing ones simply expire.

## Security headers

`next.config.ts` sends, on every response (see `src/lib/security-headers.ts`):
a Content-Security-Policy (`default-src 'self'`; no third-party scripts,
styles, fonts or frames; `img-src 'self' data: blob:`; `connect-src` and
`form-action` add only the signup endpoint's origin; `frame-ancestors
'none'`; `object-src 'none'`; `base-uri 'self'`), `X-Content-Type-Options:
nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()`,
`X-Frame-Options: DENY` and `Cross-Origin-Opener-Policy: same-origin`, with
`X-Powered-By` turned off. `sw.js` is served `no-cache`.

`script-src` keeps `'unsafe-inline'`: the App Router streams its page data as
inline `self.__next_f.push(…)` scripts whose contents change per page and per
build, so they can't be allow-listed by hash, and adding any hash would make
browsers ignore `'unsafe-inline'` and break hydration. The strict alternative,
a per-request nonce, forces every page to render dynamically (no static HTML
or CDN caching), which this offline-first app doesn't need: it renders no
user-supplied HTML. `'unsafe-eval'` is added only under `next dev`.

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
`scripts/generate-sw.mjs` runs in `predev`/`prebuild` (routes and icons) and
again in `postbuild` (`--after-build`, adding the build's assets), and injects:

- **Cache version**: `alliance-field-<git SHA>` (from `VERCEL_GIT_COMMIT_SHA`,
  `GITHUB_SHA` or `git rev-parse`; a timestamp is appended for uncommitted
  builds, and used alone outside git). Every deploy therefore ships a
  byte-different worker, the browser installs it, and `activate` deletes the
  older `alliance-field-*` caches.
- **Precache list**: every static route found under `src/app` (including
  `/calibrate`, `/connect`, `/help`), every `/protocols/[slug]` page from
  `src/data/cards/*.json`, plus the manifest and icons. After `next build`,
  the postbuild step adds every `/_next/static` asset the build produced: the
  JS/CSS chunks and fonts referenced by the prerendered HTML in
  `.next/server/app`, plus every JS/CSS file in `.next/static` (chunks loaded
  on demand). So every precached page loads offline straight after the first
  install, not only pages already visited. (npm runs `postbuild`
  automatically after `npm run build`, on Vercel too, before the output is
  collected.) Each URL is fetched on its own (`Promise.allSettled`), so one
  missing file can't fail the install.

At runtime, navigations are network-first with a cache fallback (then `/`);
other same-origin GETs are stale-while-revalidate. Only `ok`, same-origin,
non-redirected responses are written to the cache, and nothing under
`/unlock` is ever cached: a locked page answers with a redirect to the lock
screen, and caching that would store the lock screen under the page's own
URL. "Delete all my data" unregisters the worker and clears its caches; it
isn't registered again until the next full page load.

## Where data is stored

Nowhere but this device. There is no account, backend or analytics. The only
user data the app ever sends is an email address, and only when someone
chooses to submit the "Get updates" form (see *Email signup* below). Everything is in `localStorage`
under keys starting with `alliance.` (see `src/lib/storage.ts`): pause return
time, Weekly Reset draft and history, calibration answers (and Partner A's
privacy choice), favourites, recent protocols, and whether the intro was
seen. The offline copy of the app lives in Cache Storage. The only cookie is
the pre-launch `ap_access` cookie, and only while the lock is on.

**Delete all my data** (`/help#your-data`, linked from About) calls
`wipeAll()`, which removes every `alliance.*` key, clears Cache Storage and
unregisters the service worker.
The Weekly Reset "Clear entries" button can also clear history.

On a shared device, Profile Calibration asks Partner A before the hand-over
whether Partner B may see A's individual profile (private by default); B then
sees only the couple report.

## Email signup and free download

The "Get the full system" card (`src/components/GetFullSystem.tsx`, on
About) has the store link (`FULL_SYSTEM_URL` from
`NEXT_PUBLIC_FULL_SYSTEM_URL`; "Coming soon" when unset), a free printable
Situation Map and an email signup.

| Variable                      | Purpose                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SIGNUP_ENDPOINT` | URL the signup form POSTs to, form-encoded, with a single `email` field. Optional.          |

- Works with Buttondown (`https://buttondown.com/api/emails/embed-subscribe/<you>`),
  ConvertKit/Kit form URLs and Formspree (`https://formspree.io/f/<id>`),
  or anything that accepts a form-encoded `email`.
- It is read at **build time** (it's a `NEXT_PUBLIC_` variable): set it in
  Vercel's project env vars, or `.env.local` for local builds, then rebuild.
- Unset: the form falls back to opening a `mailto:` to `CONTACT_EMAIL`.
- Cross-origin endpoints are posted with `mode: "no-cors"` (the response is
  opaque), so "Sent — check your inbox to confirm" means the request was
  delivered, not that the address was accepted; a network failure shows an
  error (`role="alert"`) with a retry and a mailto fallback. Same-origin
  endpoints also check the HTTP status. No third-party scripts are loaded.

The printable map is served from `public/downloads/situation-map.pdf`
(`SITUATION_MAP_PDF`), which is committed. Replace that file when the printed
map changes (it must match the Kit's Situation Map rows).

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
