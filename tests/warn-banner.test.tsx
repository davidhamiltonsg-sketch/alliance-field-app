// @vitest-environment jsdom
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WarnBanner } from "@/components/WarnBanner";
import { ProtocolLayout } from "@/components/ProtocolLayout";
import { protocols } from "@/data/protocols";
import type { Protocol } from "@/data/types";

describe("WarnBanner: help comes first", () => {
  it("never offers the pause timer unless asked", () => {
    const html = renderToStaticMarkup(<WarnBanner safetyLink>Afraid?</WarnBanner>);
    expect(html).toContain('href="/help"');
    expect(html).not.toContain('href="/pause"');
  });

  it("lists Help before the timer when both are asked for", () => {
    const html = renderToStaticMarkup(
      <WarnBanner safetyLink pauseLink>
        Flooded or afraid
      </WarnBanner>,
    );
    expect(html.indexOf('href="/help"')).toBeGreaterThan(-1);
    expect(html.indexOf('href="/help"')).toBeLessThan(html.indexOf('href="/pause"'));
  });

  /** The rendered warning note of a protocol page (the first role="note"). */
  const bannerOf = (protocol: Protocol) => {
    const doc = new DOMParser().parseFromString(renderToStaticMarkup(<ProtocolLayout protocol={protocol} />), "text/html");
    return doc.querySelector('[role="note"]');
  };

  it("is a static note, not an alert (M9)", () => {
    const html = renderToStaticMarkup(<WarnBanner safetyLink>Afraid?</WarnBanner>);
    expect(html).toContain('role="note"');
    expect(html).toContain('aria-label="Safety"');
    expect(html).not.toContain('role="alert"');
    expect(renderToStaticMarkup(<WarnBanner pauseLink>Flooded?</WarnBanner>)).toContain('aria-label="Caution"');
  });

  it("every card whose warning mentions fear, threats or coercion routes to Help, never the timer (L15)", () => {
    const fearful = protocols.filter((p) => p.warn && /\b(fear|afraid|threat|coerc)/i.test(p.warn));
    expect(fearful.length).toBeGreaterThan(3);
    for (const p of fearful) {
      const banner = bannerOf(p)!;
      expect(banner, p.slug).not.toBeNull();
      expect(banner.querySelector('a[href="/help"]'), p.slug).not.toBeNull();
      expect(banner.querySelector('a[href="/pause"]'), p.slug).toBeNull();
    }
  });

  it("…even when a card forgets its safetyLink flag", () => {
    const base = protocols.find((p) => p.slug === "full-recovery")!;
    for (const warn of ["If fear or coercion appear, stop.", "Threats mean this tool is not for you.", "Afraid? Get help."]) {
      const banner = bannerOf({ ...base, warn, safetyLink: false })!;
      expect(banner.querySelector('a[href="/help"]'), warn).not.toBeNull();
      expect(banner.querySelector('a[href="/pause"]'), warn).toBeNull();
    }
    // A plain flooding caution still offers the timer.
    const plain = bannerOf({ ...base, warn: "Not during active conflict.", safetyLink: false })!;
    expect(plain.querySelector('a[href="/pause"]')).not.toBeNull();
  });

  it("no page's fear or coercion warning offers the pause timer", () => {
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
    const files = walk(join(__dirname, "../src")).filter((f) => f.endsWith(".tsx"));
    for (const f of files) {
      for (const m of readFileSync(f, "utf8").matchAll(/<WarnBanner([^>]*)>([\s\S]*?)<\/WarnBanner>/g)) {
        const offersPause = /\bpauseLink(?!=\{false\})/.test(m[1]);
        if (/\b(fear|afraid|threat|coercion|violence)/i.test(m[2])) expect(offersPause, `${f}: ${m[2].trim().slice(0, 80)}`).toBe(false);
      }
    }
  });
});
