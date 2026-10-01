import { describe, expect, it } from "vitest";
import { precacheUrls, readTemplate, renderServiceWorker } from "../scripts/generate-sw.mjs";

describe("service worker template", () => {
  const template = readTemplate();

  it("has exactly one of each placeholder", () => {
    expect(template.split("__CACHE_VERSION__")).toHaveLength(2);
    expect(template.split("__PRECACHE_URLS__")).toHaveLength(2);
  });

  it("replaces the version and precache list, leaving no placeholders", () => {
    const sw = renderServiceWorker(template, "abc123def456", precacheUrls());
    expect(sw).not.toMatch(/__CACHE_VERSION__|__PRECACHE_URLS__/);
    expect(sw).toContain("abc123def456");
    expect(sw).toContain('"/protocols/pause-and-return"');
    // The rendered worker is valid JavaScript.
    expect(() => new Function(sw)).not.toThrow();
  });

  it("never precaches the lock screen", () => {
    const sw = renderServiceWorker(template, "v1", precacheUrls());
    const list = sw.slice(sw.indexOf("const PRECACHE_URLS"), sw.indexOf("];", sw.indexOf("const PRECACHE_URLS")));
    expect(list).toContain('"/help"');
    expect(list).not.toContain('"/unlock"');
    expect(precacheUrls()).not.toContain("/unlock");
  });

  it("refuses a template with a missing or duplicated placeholder", () => {
    expect(() => renderServiceWorker("no tokens", "v", [])).toThrow(/__CACHE_VERSION__/);
    expect(() => renderServiceWorker(template + "__CACHE_VERSION__", "v", [])).toThrow();
  });

  it("opens the timer when the pause notification is tapped", () => {
    expect(template).toContain("notificationclick");
    expect(template).toContain('openWindow("/pause")');
  });
});

describe("precache list: build assets (H1)", () => {
  it("pulls every /_next/static chunk, stylesheet and font out of prerendered HTML", async () => {
    const { staticAssetUrlsInHtml } = await import("../scripts/generate-sw.mjs");
    const html = `<!DOCTYPE html><html><head>
      <link rel="stylesheet" href="/_next/static/chunks/2237eick7u_-q.css" data-precedence="next"/>
      <link rel="preload" href="/_next/static/media/68d4-s.p.20at.woff2" as="font" type="font/woff2"/>
      <script src="/_next/static/chunks/turbopack-43vu.js" async=""></script>
      <script>self.__next_f.push([1,"3:I[\\"[project]/src/components/PauseTimer.tsx\\",[\\"static/chunks/0bma92pht_c97.js\\"],\\"PauseTimer\\"]"])</script>
      <a href="/protocols/green-rule">x</a></head></html>`;
    expect(staticAssetUrlsInHtml(html).sort()).toEqual([
      "/_next/static/chunks/0bma92pht_c97.js",
      "/_next/static/chunks/2237eick7u_-q.css",
      "/_next/static/chunks/turbopack-43vu.js",
      "/_next/static/media/68d4-s.p.20at.woff2",
    ]);
  });

  it("scans a build directory: prerendered pages plus every JS/CSS file in .next/static", async () => {
    const { mkdtempSync, mkdirSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { buildAssetUrls } = await import("../scripts/generate-sw.mjs");
    const dir = mkdtempSync(join(tmpdir(), "sw-build-"));
    mkdirSync(join(dir, "server/app/protocols"), { recursive: true });
    mkdirSync(join(dir, "static/chunks"), { recursive: true });
    mkdirSync(join(dir, "static/BUILD123"), { recursive: true });
    writeFileSync(join(dir, "server/app/index.html"), '<script src="/_next/static/chunks/main.js"></script>');
    writeFileSync(join(dir, "server/app/protocols/green-rule.html"), '<script src="/_next/static/chunks/page-green.js"></script><link rel="preload" href="/_next/static/media/font.woff2">');
    writeFileSync(join(dir, "server/app/protocols/green-rule.rsc"), "/_next/static/chunks/not-from-html.js");
    writeFileSync(join(dir, "static/chunks/lazy.js"), "");
    writeFileSync(join(dir, "static/chunks/app.css"), "");
    writeFileSync(join(dir, "static/BUILD123/_buildManifest.js"), "");
    expect(buildAssetUrls(dir)).toEqual([
      "/_next/static/BUILD123/_buildManifest.js",
      "/_next/static/chunks/app.css",
      "/_next/static/chunks/lazy.js",
      "/_next/static/chunks/main.js",
      "/_next/static/chunks/page-green.js",
      "/_next/static/media/font.woff2",
    ]);
    expect(buildAssetUrls(join(dir, "missing"))).toEqual([]);
  });

  it("runs after `next build`, so the deployed worker lists the build's chunks", async () => {
    const { readFileSync } = await import("node:fs");
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    expect(pkg.scripts.postbuild).toBe("node scripts/generate-sw.mjs --after-build");
  });
});

/** Runs the rendered worker against fake browser APIs and records what it caches. */
function runWorker(responses: Record<string, Partial<Response> & { redirected?: boolean; url?: string }>) {
  const ORIGIN = "https://app.test";
  const handlers: Record<string, (e: unknown) => void> = {};
  const stored = new Map<string, unknown>();
  const abs = (u: string | { url: string }) => new URL(typeof u === "string" ? u : u.url, ORIGIN).href;
  const cache = { put: async (k: string | { url: string }, v: unknown) => void stored.set(abs(k), v) };
  const caches = {
    open: async () => cache,
    keys: async () => [],
    delete: async () => true,
    match: async (k: string | { url: string }) => stored.get(abs(k)),
  };
  const fetch = async (input: string | { url: string }) => {
    const r = responses[new URL(abs(input)).pathname];
    if (!r) throw new TypeError("offline");
    return { ok: true, type: "basic", redirected: false, url: abs(input), clone() { return this; }, ...r };
  };
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (type: string, h: (e: unknown) => void) => (handlers[type] = h),
    skipWaiting() {},
    clients: { claim: async () => {} },
  };
  const sw = renderServiceWorker(readTemplate(), "test", Object.keys(responses));
  new Function("self", "caches", "fetch", sw)(self, caches, fetch);
  return { handlers, stored, ORIGIN };
}

describe("service worker behaviour (L1)", () => {
  it("never stores the lock screen or a redirect to it, at install or at runtime", async () => {
    const { handlers, stored, ORIGIN } = runWorker({
      "/": { redirected: true, url: "https://app.test/unlock?next=%2F" },
      "/help": {},
      "/protocols/green-rule": {},
      "/_next/static/chunks/a.js": {},
    });
    let installed: Promise<unknown> = Promise.resolve();
    handlers.install({ waitUntil: (p: Promise<unknown>) => (installed = p) });
    await installed;
    expect([...stored.keys()].sort()).toEqual([
      `${ORIGIN}/_next/static/chunks/a.js`,
      `${ORIGIN}/help`,
      `${ORIGIN}/protocols/green-rule`,
    ]);

    // A request for the lock screen is left to the network entirely.
    let responded = false;
    handlers.fetch({ request: { method: "GET", url: `${ORIGIN}/unlock?next=%2F`, mode: "navigate" }, respondWith: () => (responded = true) });
    expect(responded).toBe(false);

    // A navigation that comes back redirected (to /unlock) is passed on, not stored.
    let pending: Promise<unknown> = Promise.resolve();
    handlers.fetch({ request: { method: "GET", url: `${ORIGIN}/`, mode: "navigate" }, respondWith: (p: Promise<unknown>) => (pending = p) });
    await pending;
    await new Promise((r) => setTimeout(r, 0));
    expect(stored.has(`${ORIGIN}/`)).toBe(false);
  });

  it("serves a precached page offline", async () => {
    const { handlers, ORIGIN } = runWorker({ "/help": {}, "/": {} });
    let installed: Promise<unknown> = Promise.resolve();
    handlers.install({ waitUntil: (p: Promise<unknown>) => (installed = p) });
    await installed;
    let pending: Promise<unknown> = Promise.resolve();
    handlers.fetch({ request: { method: "GET", url: `${ORIGIN}/protocols/not-cached`, mode: "navigate" }, respondWith: (p: Promise<unknown>) => (pending = p) });
    // Offline (the fake fetch has no entry): falls back to the cached home page.
    expect(await pending).toMatchObject({ url: `${ORIGIN}/` });
  });
});
