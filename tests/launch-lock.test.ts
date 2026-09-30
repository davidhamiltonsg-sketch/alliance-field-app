import { describe, expect, it } from "vitest";
import { accessToken, codesMatch, isPublicPath, safeNext } from "../src/lib/launch-lock";
import { precacheUrls } from "../scripts/generate-sw.mjs";

describe("launch lock", () => {
  it("keeps safety and legal pages public", () => {
    for (const p of ["/unlock", "/help", "/help/", "/privacy"]) expect(isPublicPath(p)).toBe(true);
    for (const p of ["/", "/about", "/protocols/green-rule", "/helpful"]) expect(isPublicPath(p)).toBe(false);
  });

  it("only redirects to same-site paths after unlocking", () => {
    expect(safeNext("/start")).toBe("/start");
    expect(safeNext("/protocols/pause-and-return?x=1")).toBe("/protocols/pause-and-return?x=1");
    for (const bad of ["https://evil.example", "//evil.example", "evil", "", null, undefined, "/unlock?next=/"]) {
      expect(safeNext(bad)).toBe("/");
    }
  });

  it("compares codes ignoring case and surrounding spaces", () => {
    expect(codesMatch("  Alliance-2026 ", "alliance-2026")).toBe(true);
    expect(codesMatch("alliance-2025", "alliance-2026")).toBe(false);
  });

  it("stores a hash, not the code, and the hash is stable", async () => {
    const a = await accessToken("alliance-2026");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("alliance");
    expect(await accessToken(" alliance-2026 ")).toBe(a);
    expect(await accessToken("other")).not.toBe(a);
  });

  it("never caches the lock screen offline", () => {
    expect(precacheUrls()).not.toContain("/unlock");
  });
});
