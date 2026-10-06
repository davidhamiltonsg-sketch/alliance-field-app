# alliance-field-app

ALLIANCE PROTOCOLS · Field App — Built for precision. Designed for connection.

The free app that goes with the Alliance Protocols books, Volume A (The
Architecture of Staying), Volume B (the Operating Manual) and the Field Kit, by David
Hamilton and Dr Zhongming Shi: a Situation Map that routes you to the right
tool, 15 tools in three plain groups (the six to learn first, five for when it
comes up, four to build over time), a Pause + Return timer, the Weekly Reset
wizard, Profile Calibration and Connection Cards. Five tabs: Now, Tools, Pause,
Week, Together; Help is always in the header (alone: Pause is a tab). Next.js (App Router) + Tailwind
CSS v4, installable as an offline PWA.

## The 15 tools

| Group (internal key)               | Tools                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Learn first (`core`), 6            | Green Rule, Pause + Return, 60-Second Reset, Micro-Repair, Weekly Reset, System Overlay        |
| When it comes up (`situational`), 5 | Full Repair, Trust Recovery, Check-Up, Team Agreement, Sun Memory                              |
| Build over time (`build`), 4       | Daily Rhythm, Intimacy Pact, Consistency Pact, Profile Calibration                             |

Each tool is one card in `src/data/cards/<slug>.json` and one page at
`/protocols/<slug>`. Old addresses redirect (`next.config.ts`):
`full-recovery` to `full-repair`, `uninvestment-check` to `check-up`,
`unity-anchor` to `team-agreement`, `morning-evening-rhythm` to `daily-rhythm`,
`proof-protocol` to `trust-recovery`, `conflict-protocol` to `system-overlay`.

Times, stated once in `src/data/registry.json` (`times`) and mirrored on the
cards: Pause 20 minutes to 24 hours; 60-Second Reset 1 minute; Weekly Reset 40
minutes (15 is fine to start; the monthly part adds 10 minutes; the yearly part
is 1 to 2 hours); Micro-Repair start within minutes, finish within 24 hours;
Full Repair 60 to 90 minutes; Check-Up about every few months, 20 minutes;
Proof windows 1 to 2 weeks (2 to 4 for a breach).

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
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Contact address on /privacy and /terms. Unset (or not an address): no address is shown, only "via allianceprotocols.com". |
| `NEXT_PUBLIC_STORE_URL_KIT` | https store page for the Field Kit. |
| `NEXT_PUBLIC_STORE_URL_MANUAL` | https store page for Volume B (the Operating Manual). |
| `NEXT_PUBLIC_STORE_URL_VOLUME_A` | https store page for Volume A (The Architecture of Staying). |
| `NEXT_PUBLIC_STORE_URL_COMPLETE` | https store page for the Complete Edition (Volumes A and B in one document). |
| `NEXT_PUBLIC_STORE_URL_BUNDLE` | https store page for the Bundle (Kit + Complete Edition + both volumes as separate files). |
| `NEXT_PUBLIC_SIGNUP_ENDPOINT` | Email signup endpoint (see *Email signup* below). Its origin is added to the CSP.                          |
| `NEXT_PUBLIC_EMAIL_PROVIDER_NAME` | Name of the mailing-list service (e.g. `Buttondown`), named on /privacy. The sign-up form is live only when this **and** the endpoint are set. |

Each product's buy button appears only when its own `NEXT_PUBLIC_STORE_URL_*` is a valid https URL; there is no shared fallback, so two products never open the same page. With none set, the card says the books aren't on sale yet. Prices are shown in US dollars, "plus any VAT/GST calculated at checkout".

## Pre-launch lock

While `LAUNCH_ACCESS_CODE` is set, `src/proxy.ts` sends every page except
`/help`, `/privacy`, `/terms` and `/unlock` to `/unlock`, which asks for the
code. Locked pages are `noindex`, and `/sw.js` 404s so a locked visitor never
installs the offline worker.

- The right code sets `ap_access` (httpOnly, Secure, SameSite=Lax, 30 days)
  holding `v2.<issued-at>.<HMAC-SHA256(key, code + issued-at)>`, never the
  code. The issued-at time (Unix seconds) is signed, so it can't be edited,
  and the proxy refuses a token more than 30 days old (or dated in the
  future) even if a browser kept the cookie longer or it was copied. The key
  is `LAUNCH_COOKIE_SECRET`, or (if unset) derived from the code, which is
  fine for a gate whose only secret is the code. Set a long random
  `LAUNCH_COOKIE_SECRET` so a leaked cookie can't be brute-forced offline;
  changing it signs everyone out. Cookies from before this format (`v1`)
  are refused, so early-access users enter the code once more.
- Codes are compared **case-insensitively**, ignoring surrounding spaces, on
  purpose: the code is passed on by word of mouth and typed on phones that
  auto-capitalise. That costs little entropy if the code is long (4+ random
  words, or 12+ random characters); choose one like that.
- Codes and signatures are compared in constant time. A wrong code waits
  ~600 ms before answering; malformed bodies bounce back with an error.
- After unlocking, `next` must be a same-origin path (backslashes and control
  characters are rejected, then the URL must resolve to the same origin).
- **Rate limiting (do this before sharing the code):** the proxy is
  stateless, so it can't count attempts per IP; the delay only slows a
  single client that waits for each answer. Add a Vercel Firewall rule
  (Project → Firewall → Configure → New rule): *If* Request Path *equals*
  `/unlock` *and* Method *equals* `POST`, *then* **Rate Limit**, fixed
  window, 60 s, 10 requests, keyed on IP, action Deny (429). Publish it,
  then check it under Firewall → Rules.
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
About) has a buy link per product (`STORE_URLS`: Field Kit, Volume A,
Volume B, Complete Edition, Bundle, each only from its own
`NEXT_PUBLIC_STORE_URL_*`; "The books aren't on sale yet" when none is set),
a free printable Situation Map and an email signup.

| Variable                      | Purpose                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SIGNUP_ENDPOINT` | URL the signup form POSTs to, form-encoded, with a single `email` field. Optional.          |

- Works with Buttondown (`https://buttondown.com/api/emails/embed-subscribe/<you>`),
  ConvertKit/Kit form URLs and Formspree (`https://formspree.io/f/<id>`),
  or anything that accepts a form-encoded `email`.
- It is read at **build time** (it's a `NEXT_PUBLIC_` variable): set it in
  Vercel's project env vars, or `.env.local` for local builds, then rebuild.
- The form is shown only when `NEXT_PUBLIC_EMAIL_PROVIDER_NAME` is set too,
  so /privacy can name who holds the list. Otherwise the card says sign-up
  isn't open yet, and /privacy says the sign-up is not active.
- Cross-origin endpoints are posted with `mode: "no-cors"` (the response is
  opaque), so the success message is deliberately careful: "If the address
  is right, a confirmation email will arrive shortly." A network failure
  shows an error (`role="alert"`) with a retry. Same-origin endpoints also
  check the HTTP status. No third-party scripts are loaded.

## Legal pages

`/privacy` (plain-English privacy notice: on-device data, the email list,
Gumroad purchases, transfers outside Singapore, retention, deletion requests,
the pre-launch cookie) and `/terms` (website terms: who runs the site, not
therapy, no warranty, acceptable use, statutory rights). Both are public
while the lock is on and linked from the home footer and About. Before
launch, the owner must complete the governing-law and registered-address
details noted in a code comment at the top of `src/app/terms/page.tsx`.

The printable map is served from `public/downloads/situation-map.pdf`
(`SITUATION_MAP_PDF`), which is committed. Replace that file when the printed
map changes (it must match the Kit's Situation Map rows).

## Safety page

`/help` (header "Help" link, About, the Situation Map's first row, and the
Green Rule / Pause + Return / Team Agreement / Intimacy Pact / Trust Recovery /
Check-Up cautions) holds the canonical Help Lines as `tel:`/`sms:`
links and the "when not to use this app" guidance. The numbers are in
`src/data/help.ts` and must match the printed Manual and Kit exactly. The
printed list is `HELP_LINES_PRINTED` in `help.ts`; `registry.json`
(`concepts.help-safety.helpLines`) and this README repeat it word for word, and
`tests/spec-v2.test.ts` fails if they drift. Numbers checked October 2026.
Safety routing always comes first; "unsafe" is never routed to Pause + Return
(Pause + Return is for flooding, never for fear).

### Help Lines (checked October 2026)

```
Immediate danger: your local emergency number (999 UK/SG police · 995 SG ambulance · 911 US · 000 AU · 112 EU)
US: National Domestic Violence Hotline 1-800-799-7233 (text START to 88788) · 988 Suicide & Crisis Lifeline (call/text 988)
UK: National Domestic Abuse Helpline (Refuge) 0808 2000 247 · Samaritans 116 123
Australia: 1800RESPECT 1800 737 732 · Lifeline 13 11 14
Singapore: National Anti-Violence & Sexual Harassment Helpline 1800 777 0000 · SOS 1767
Sexual violence, including from a partner: US RAINN 800-656-4673 (text HOPE to 64673) · UK Rape Crisis England & Wales 0808 500 2222 · Australia 1800RESPECT (1800 737 732) · Singapore AWARE Sexual Assault Care Centre 6779 0282 (weekdays 10am to 6pm)
EU: Helpline for women experiencing violence 116 016, where available
Worried about a child: your local child-protection service, or your emergency number if a child is in danger.
Elsewhere: your local emergency number or national helpline.
```

## Content and visuals

- Tool cards: `src/data/cards/*.json` (15 cards, each with a `synonyms` list used
  by search; the Kit adds Read This First). The master text is the Kit's; the
  Manual and this app mirror it word for word. Counts shared with the printed
  products (15 cards, 6 worksheets, 16 Manual chapters) are in `src/data/kit.ts`;
  `tests/data-consistency.test.ts` and `tests/spec-v2.test.ts` check them.
- Groups and labels: `src/data/tiers.ts` (internal keys `core`, `situational`,
  `build`; people see "Learn first", "When it comes up", "Build over time").
  The six to learn first: `src/data/core6.ts`.
- Situation Map rows: `src/data/situations.ts`; Your First Week: `src/data/start.ts`;
  go-deeper pointers and the 16 Manual chapters: `src/data/go-deeper.ts`; glossary:
  `src/data/glossary.ts`.
- Step diagrams: `src/data/visuals/protocol-diagrams.ts`, maintained by hand.
  A diagram only renders when it has exactly as many steps as its card.
- Protocol and section icons: `src/components/visuals/ProtocolIcon.tsx`, and
  the v2 visual language primitives in `src/components/visuals/v2.tsx`. These
  were originally ported by `scripts/brand/port-visuals.py` from the external
  visuals library (not in this repo; set `VISUALS_DIR` to use it). Re-running
  it would overwrite hand edits in `protocol-diagrams.ts`, so don't.
- Intro diagrams: `src/components/intro/diagrams.tsx` (animated inline SVG).
