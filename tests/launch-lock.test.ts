import { describe, expect, it } from "vitest";
import { accessToken, codesMatch, isPublicPath, safeNext, timingSafeEqual, tokenMatches } from "../src/lib/launch-lock";
import { precacheUrls } from "../scripts/generate-sw.mjs";

describe("launch lock", () => {
  it("keeps safety and legal pages public", () => {
    for (const p of ["/unlock", "/help", "/help/", "/privacy"]) expect(isPublicPath(p)).toBe(true);
    for (const p of ["/", "/about", "/protocols/green-rule", "/helpful"]) expect(isPublicPath(p)).toBe(false);
  });

  it("only redirects to same-site paths after unlocking", () => {
    expect(safeNext("/start")).toBe("/start");
    expect(safeNext("/protocols/pause-and-return?x=1")).toBe("/protocols/pause-and-return?x=1");
    expect(safeNext("/a/../b")).toBe("/b");
    for (const bad of ["https://evil.example", "//evil.example", "evil", "", null, undefined, "/unlock?next=/", "/unlock/", "/unlock"]) {
      expect(safeNext(bad)).toBe("/");
    }
  });

  it("rejects backslash and control-character open-redirect vectors", () => {
    for (const bad of [
      "/\\evil.com",
      "/\\\\evil.com",
      "/\t/evil.com",
      "/\n/evil.com",
      "/\r//evil.com",
      "/\u0000/evil.com",
      "/\u007f/evil.com",
      "///evil.com",
      "/" + "a".repeat(3000),
    ]) {
      expect(safeNext(bad), JSON.stringify(bad)).toBe("/");
    }
    // Encoded characters stay encoded in the path, so they can't change the origin.
    expect(safeNext("/%2F%2Fevil.com")).toBe("/%2F%2Fevil.com");
    expect(new URL(safeNext("/%2F%2Fevil.com"), "https://allianceprotocols.com").origin).toBe("https://allianceprotocols.com");
  });

  it("compares codes ignoring case and surrounding spaces", async () => {
    expect(await codesMatch("  Alliance-2026 ", "alliance-2026")).toBe(true);
    expect(await codesMatch("alliance-2025", "alliance-2026")).toBe(false);
    expect(await codesMatch("", "alliance-2026")).toBe(false);
    expect(await codesMatch("a".repeat(10_000), "alliance-2026")).toBe(false);
  });

  it("compares tokens in constant time, and only equal-length strings can match", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
    expect(tokenMatches(undefined, "abc")).toBe(false);
    expect(tokenMatches("abc", "abc")).toBe(true);
  });

  it("stores an HMAC, not the code; stable, and keyed by LAUNCH_COOKIE_SECRET when set", async () => {
    const a = await accessToken("alliance-2026");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("alliance");
    expect(await accessToken(" ALLIANCE-2026 ")).toBe(a);
    expect(await accessToken("other")).not.toBe(a);
    const keyed = await accessToken("alliance-2026", "s3cret");
    expect(keyed).toMatch(/^[0-9a-f]{64}$/);
    expect(keyed).not.toBe(a);
    expect(await accessToken("alliance-2026", "s3cret")).toBe(keyed);
    expect(await accessToken("alliance-2026", "rotated")).not.toBe(keyed);
  });

  it("never caches the lock screen offline", () => {
    expect(precacheUrls()).not.toContain("/unlock");
  });
});

describe("service worker registration", () => {
  it("skips the lock screen, where /sw.js is withheld", async () => {
    const { readFileSync } = await import("node:fs");
    const { UNLOCK_PATH } = await import("../src/lib/launch-lock");
    const src = readFileSync(new URL("../src/components/ServiceWorkerRegister.tsx", import.meta.url), "utf8");
    expect(src).toContain(`const UNLOCK_PATH = "${UNLOCK_PATH}"`);
    expect(src).toContain("if (pathname === UNLOCK_PATH) return;");
  });
});
