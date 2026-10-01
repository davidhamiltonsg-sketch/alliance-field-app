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
    expect(sw).not.toContain('"/unlock"');
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
