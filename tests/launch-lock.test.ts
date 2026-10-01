import { describe, expect, it } from "vitest";
import { ACCESS_MAX_AGE_S, codesMatch, isPublicPath, issueAccessToken, safeNext, timingSafeEqual, verifyAccessToken } from "../src/lib/launch-lock";
import { precacheUrls } from "../scripts/generate-sw.mjs";

describe("launch lock", () => {
  it("keeps safety and legal pages public", () => {
    for (const p of ["/unlock", "/help", "/help/", "/privacy", "/terms"]) expect(isPublicPath(p)).toBe(true);
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

  it("compares in constant time, and only equal-length strings can match", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });

  const NOW = Date.UTC(2026, 9, 1, 12, 0, 0);
  const DAY = 24 * 60 * 60 * 1000;

  it("issues v2.<issued-at>.<HMAC over code + issued-at>, never the code", async () => {
    const t = await issueAccessToken("alliance-2026", undefined, NOW);
    expect(t).toMatch(/^v2\.\d+\.[0-9a-f]{64}$/);
    expect(t.split(".")[1]).toBe(String(NOW / 1000));
    expect(t).not.toContain("alliance");
    // Same code (any case), same time: same token. Another time: another signature.
    expect(await issueAccessToken(" ALLIANCE-2026 ", undefined, NOW)).toBe(t);
    expect((await issueAccessToken("alliance-2026", undefined, NOW + 1000)).split(".")[2]).not.toBe(t.split(".")[2]);
  });

  it("accepts a token for up to 30 days, then refuses it", async () => {
    const t = await issueAccessToken("alliance-2026", undefined, NOW);
    expect(ACCESS_MAX_AGE_S).toBe(30 * 24 * 60 * 60);
    expect(await verifyAccessToken(t, "Alliance-2026", undefined, NOW)).toBe(true);
    expect(await verifyAccessToken(t, "alliance-2026", undefined, NOW + 30 * DAY)).toBe(true);
    expect(await verifyAccessToken(t, "alliance-2026", undefined, NOW + 30 * DAY + 1000)).toBe(false);
    // Issued "in the future" (beyond a few minutes of clock skew): refused.
    expect(await verifyAccessToken(t, "alliance-2026", undefined, NOW - 10 * 60 * 1000)).toBe(false);
  });

  it("can't be extended by editing the issued-at time, or reused for another code or secret", async () => {
    const t = await issueAccessToken("alliance-2026", undefined, NOW - 40 * DAY);
    const [, iat, sig] = t.split(".");
    const forged = `v2.${Number(iat) + 20 * 86400}.${sig}`;
    expect(await verifyAccessToken(t, "alliance-2026", undefined, NOW)).toBe(false);
    expect(await verifyAccessToken(forged, "alliance-2026", undefined, NOW)).toBe(false);
    const fresh = await issueAccessToken("alliance-2026", "s3cret", NOW);
    expect(await verifyAccessToken(fresh, "alliance-2026", "s3cret", NOW)).toBe(true);
    expect(await verifyAccessToken(fresh, "alliance-2026", "rotated", NOW)).toBe(false);
    expect(await verifyAccessToken(fresh, "alliance-2026", undefined, NOW)).toBe(false);
    expect(await verifyAccessToken(fresh, "other-code", "s3cret", NOW)).toBe(false);
  });

  it("refuses malformed and old-format cookies", async () => {
    for (const bad of [undefined, "", "short", "a".repeat(64), "v1.1759320000." + "a".repeat(64), "v2.abc." + "a".repeat(64), "v2.1759320000." + "A".repeat(64), "v2.1759320000." + "a".repeat(63)]) {
      expect(await verifyAccessToken(bad, "alliance-2026", undefined, NOW), String(bad)).toBe(false);
    }
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
  });
});
