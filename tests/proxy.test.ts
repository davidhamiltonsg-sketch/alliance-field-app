import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { config, proxy } from "../src/proxy";
import { ACCESS_COOKIE, issueAccessToken } from "../src/lib/launch-lock";

const ORIGIN = "https://allianceprotocols.com";
const CODE = "Alliance-2026";

const get = (path: string, cookie?: string) =>
  new NextRequest(`${ORIGIN}${path}`, cookie ? { headers: { cookie: `${ACCESS_COOKIE}=${cookie}` } } : undefined);

const postForm = (fields: Record<string, string>) =>
  new NextRequest(`${ORIGIN}/unlock`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  });

const location = (res: Response) => {
  const loc = res.headers.get("location");
  return loc ? new URL(loc) : null;
};

/** NextResponse.next() marks pass-through with this header. */
const passedThrough = (res: Response) => res.headers.get("x-middleware-next") === "1";

describe("proxy: no lock configured", () => {
  beforeEach(() => vi.stubEnv("LAUNCH_ACCESS_CODE", ""));
  afterEach(() => vi.unstubAllEnvs());

  it("passes every page through", async () => {
    for (const p of ["/", "/about", "/sw.js", "/unlock"]) expect(passedThrough(await proxy(get(p))), p).toBe(true);
  });

  it("404s a POST to /unlock", async () => {
    const res = await proxy(postForm({ code: CODE }));
    expect(res.status).toBe(404);
  });
});

describe("proxy: locked", () => {
  beforeEach(() => {
    vi.stubEnv("LAUNCH_ACCESS_CODE", CODE);
    vi.stubEnv("LAUNCH_COOKIE_SECRET", "");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("redirects locked pages to /unlock with a safe next and noindex", async () => {
    const res = await proxy(get("/protocols/green-rule?x=1"));
    expect(res.status).toBe(307);
    const loc = location(res)!;
    expect(loc.pathname).toBe("/unlock");
    expect(loc.searchParams.get("next")).toBe("/protocols/green-rule?x=1");
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
  });

  it("keeps /help, /privacy and /unlock public (noindex while locked)", async () => {
    for (const p of ["/help", "/privacy", "/unlock", "/help/"]) {
      const res = await proxy(get(p));
      expect(passedThrough(res), p).toBe(true);
      expect(res.headers.get("x-robots-tag")).toBe("noindex");
    }
  });

  it("404s the service worker for locked visitors", async () => {
    expect((await proxy(get("/sw.js"))).status).toBe(404);
  });

  it("lets a visitor with the right cookie through, and rejects a wrong one", async () => {
    const token = await issueAccessToken(CODE);
    const ok = await proxy(get("/about", token));
    expect(passedThrough(ok)).toBe(true);
    expect(ok.headers.get("x-robots-tag")).toBeNull();
    expect((await proxy(get("/sw.js", token))).status).toBe(200);

    const bad = await proxy(get("/about", token.replace(/.$/, (c) => (c === "0" ? "1" : "0"))));
    expect(bad.status).toBe(307);
    expect((await proxy(get("/about", "short"))).status).toBe(307);
  });

  it("refuses a correctly signed token issued more than 30 days ago", async () => {
    const old = await issueAccessToken(CODE, undefined, Date.now() - 31 * 24 * 60 * 60 * 1000);
    expect((await proxy(get("/about", old))).status).toBe(307);
    const recent = await issueAccessToken(CODE, undefined, Date.now() - 29 * 24 * 60 * 60 * 1000);
    expect(passedThrough(await proxy(get("/about", recent)))).toBe(true);
  });

  it("keeps /terms public while locked", async () => {
    expect(passedThrough(await proxy(get("/terms")))).toBe(true);
  });

  it("uses LAUNCH_COOKIE_SECRET when set", async () => {
    vi.stubEnv("LAUNCH_COOKIE_SECRET", "rotate-me");
    const derived = await issueAccessToken(CODE);
    expect((await proxy(get("/about", derived))).status).toBe(307);
    const keyed = await issueAccessToken(CODE, "rotate-me");
    expect(passedThrough(await proxy(get("/about", keyed)))).toBe(true);
  });

  it("sets an httpOnly 30-day cookie and redirects to next on the right code (any case)", async () => {
    const res = await proxy(postForm({ code: " alliance-2026 ", next: "/start" }));
    expect(res.status).toBe(303);
    expect(location(res)!.pathname).toBe("/start");
    expect(location(res)!.origin).toBe(ORIGIN);
    const cookie = res.headers.get("set-cookie")!;
    const value = cookie.match(new RegExp(`${ACCESS_COOKIE}=([^;]+)`))![1];
    expect(value).toMatch(/^v2\.\d+\.[0-9a-f]{64}$/);
    expect(Math.abs(Number(value.split(".")[1]) - Date.now() / 1000)).toBeLessThan(60);
    // The cookie it sets is the one it accepts.
    expect(passedThrough(await proxy(get("/start", value)))).toBe(true);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/Secure/i);
    expect(cookie).toMatch(/SameSite=lax/i);
    expect(cookie).toMatch(/Max-Age=2592000/);
  });

  it("slows down and bounces a wrong code without setting a cookie", async () => {
    const t0 = Date.now();
    const res = await proxy(postForm({ code: "guess", next: "/start" }));
    expect(Date.now() - t0).toBeGreaterThanOrEqual(550);
    expect(res.status).toBe(303);
    const loc = location(res)!;
    expect(loc.pathname).toBe("/unlock");
    expect(loc.searchParams.get("error")).toBe("1");
    expect(loc.searchParams.get("next")).toBe("/start");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("handles a malformed or empty body by redirecting with error=1", async () => {
    for (const init of [
      { method: "POST", headers: { "content-type": "application/json" }, body: '{"code":"x"}' },
      { method: "POST" },
      { method: "POST", headers: { "content-type": "multipart/form-data; boundary=zzz" }, body: "garbage" },
    ]) {
      const res = await proxy(new NextRequest(`${ORIGIN}/unlock`, init));
      expect(res.status).toBe(303);
      expect(location(res)!.pathname).toBe("/unlock");
      expect(location(res)!.searchParams.get("error")).toBe("1");
      expect(res.headers.get("set-cookie")).toBeNull();
    }
  });

  it("never redirects off-site after unlocking", async () => {
    for (const next of ["//evil.com", "/\\evil.com", "/\t/evil.com", "https://evil.com", "/unlock?next=//evil.com"]) {
      const res = await proxy(postForm({ code: CODE, next }));
      const loc = location(res)!;
      expect(loc.origin, next).toBe(ORIGIN);
      expect(loc.pathname, next).toBe("/");
    }
  });
});

describe("/unlock page", () => {
  it("reads the lock at request time (a build without the env var must not bake in a 404)", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync(new URL("../src/app/unlock/page.tsx", import.meta.url), "utf8");
    const at = (s: string) => src.indexOf(s);
    expect(at("await connection()")).toBeGreaterThan(-1);
    expect(at("await connection()")).toBeLessThan(at("notFound()"));
  });
});

describe("proxy matcher (L15)", () => {
  // Next compiles each matcher source into an anchored path regexp; this is the same pattern.
  const matchers = config.matcher.map((m) => new RegExp(`^${m}$`));
  const runs = (path: string) => matchers.some((re) => re.test(path));

  it("runs on every page, the worker and the unlock form", () => {
    for (const p of ["/", "/about", "/help", "/privacy", "/terms", "/unlock", "/sw.js", "/protocols/green-rule", "/calibrate/report", "/intro"]) {
      expect(runs(p), p).toBe(true);
    }
  });

  it("skips build assets and brand files, which hold nothing locked", () => {
    for (const p of ["/_next/static/chunks/a.js", "/_next/image", "/favicon.ico", "/icon-192.png", "/icon.svg", "/apple-touch-icon.png", "/manifest.json", "/splash/launch-750x1334.png", "/alliance-mark.svg", "/og-image.png"]) {
      expect(runs(p), p).toBe(false);
    }
  });
});
