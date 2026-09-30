// Writes public/sw.js from scripts/sw.template.js (runs in `predev` and
// `prebuild`). Injects a per-build cache version and the precache list:
// every static route under src/app, every /protocols/[slug] page (from
// src/data/cards/*.json), and the icons/manifest in public/.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "src/app");

/** Static routes: every page.tsx outside a [dynamic] segment. */
function staticRoutes(dir = appDir) {
  const routes = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!name.startsWith("[")) routes.push(...staticRoutes(full));
    } else if (name === "page.tsx") {
      const rel = relative(appDir, dir).split(sep).join("/");
      routes.push(rel ? `/${rel}` : "/");
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const version = cacheVersion();
  const urls = precacheUrls();
  const template = readFileSync(join(root, "scripts/sw.template.js"), "utf8");
  for (const token of ["__CACHE_VERSION__", "__PRECACHE_URLS__"]) {
    if (template.split(token).length !== 2) throw new Error(`[sw] expected exactly one ${token} in the template`);
  }
  const out = template
    .replace("__CACHE_VERSION__", version)
    .replace("__PRECACHE_URLS__", JSON.stringify(urls, null, 2));
  writeFileSync(join(root, "public/sw.js"), out);
  console.log(`[sw] public/sw.js: cache ${version}, ${urls.length} precached URLs`);
}
