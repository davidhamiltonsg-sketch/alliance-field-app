// Writes public/sw.js from scripts/sw.template.js. Injects a per-build cache
// version and the precache list: every static route under src/app, every
// /protocols/[slug] page (from src/data/cards/*.json), and the icons/manifest
// in public/.
//
// Runs twice in a production build:
//   prebuild  (no flag)        routes and icons only, so `next build` and
//                              `next dev` always have a valid worker.
//   postbuild (--after-build)  adds every /_next/static asset the build
//                              produced: the JS/CSS chunks and fonts that the
//                              prerendered pages in .next/server/app load,
//                              plus every JS/CSS file in .next/static (for
//                              chunks loaded on demand). Without these, a
//                              precached page's HTML would load offline but
//                              its scripts wouldn't ("couldn't load").
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "src/app");

/** Pages that must never be cached offline (the pre-launch lock screen). */
const NOT_PRECACHED = new Set(["/unlock"]);

/** Static routes: every page.tsx outside a [dynamic] segment. */
function staticRoutes(dir = appDir) {
  const routes = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!name.startsWith("[")) routes.push(...staticRoutes(full));
    } else if (name === "page.tsx") {
      const rel = relative(appDir, dir).split(sep).join("/");
      const route = rel ? `/${rel}` : "/";
      if (!NOT_PRECACHED.has(route)) routes.push(route);
    }
  }
  return routes;
}

export function protocolRoutes() {
  const dir = join(root, "src/data/cards");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")).slug)
    .map((slug) => `/protocols/${slug}`);
}

const assets = [
  "/manifest.json",
  "/icon.svg",
  "/alliance-mark.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
];

function cacheVersion() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (sha) return sha.slice(0, 12);
  try {
    const head = execSync("git rev-parse --short=12 HEAD", { cwd: root, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    const dirty = execSync("git status --porcelain", { cwd: root, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    // Uncommitted local builds get a timestamp so they still bust the cache.
    return dirty ? `${head}-${Date.now().toString(36)}` : head;
  } catch {
    return `t${Date.now().toString(36)}`;
  }
}

export const precacheUrls = () => [...new Set([...staticRoutes().sort(), ...protocolRoutes().sort(), ...assets])];

function filesUnder(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? filesUnder(full) : [full];
  });
}

/** /_next/static URLs referenced by an HTML page (script tags, CSS and font links, and the inline RSC payload). */
export function staticAssetUrlsInHtml(html) {
  const urls = new Set();
  for (const m of html.matchAll(/(?:\/_next\/)?static\/(?:chunks|css|media)\/[^"'\\\s()<>?#]+/g)) {
    const path = m[0].startsWith("/_next/") ? m[0] : `/_next/${m[0]}`;
    // Only real files: skip template fragments like "static/chunks/" + name.
    if (/\.(?:js|css|woff2?|ttf|otf|png|jpe?g|webp|avif|svg|ico)$/.test(path)) urls.add(path);
  }
  return [...urls];
}

/**
 * Every /_next/static asset a production build needs offline: the assets the
 * prerendered pages reference, plus every .js/.css file in .next/static.
 * Returns [] when there is no build (e.g. before `next build`).
 */
export function buildAssetUrls(nextDir = join(root, ".next")) {
  const urls = new Set();
  for (const file of filesUnder(join(nextDir, "server/app")).filter((f) => f.endsWith(".html"))) {
    for (const u of staticAssetUrlsInHtml(readFileSync(file, "utf8"))) urls.add(u);
  }
  const staticDir = join(nextDir, "static");
  for (const file of filesUnder(staticDir).filter((f) => /\.(?:js|css)$/.test(f))) {
    urls.add(`/_next/static/${relative(staticDir, file).split(sep).join("/")}`);
  }
  return [...urls].sort();
}

/** Renders the worker from the template: exactly one of each placeholder, both replaced. */
export function renderServiceWorker(template, version, urls) {
  for (const token of ["__CACHE_VERSION__", "__PRECACHE_URLS__"]) {
    if (template.split(token).length !== 2) throw new Error(`[sw] expected exactly one ${token} in the template`);
  }
  return template.replace("__CACHE_VERSION__", version).replace("__PRECACHE_URLS__", JSON.stringify(urls, null, 2));
}

export const readTemplate = () => readFileSync(join(root, "scripts/sw.template.js"), "utf8");

if (import.meta.url === `file://${process.argv[1]}`) {
  const afterBuild = process.argv.includes("--after-build");
  const version = cacheVersion();
  const built = afterBuild ? buildAssetUrls() : [];
  if (afterBuild && built.length === 0) {
    throw new Error("[sw] --after-build: no assets found in .next (run after `next build`)");
  }
  const urls = [...precacheUrls(), ...built];
  const out = renderServiceWorker(readTemplate(), version, urls);
  writeFileSync(join(root, "public/sw.js"), out);
  console.log(`[sw] public/sw.js: cache ${version}, ${urls.length} precached URLs (${built.length} build assets)`);
}
