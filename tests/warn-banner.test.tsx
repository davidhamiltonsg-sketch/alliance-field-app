import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WarnBanner } from "@/components/WarnBanner";
import { ProtocolLayout } from "@/components/ProtocolLayout";
import { protocols } from "@/data/protocols";

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

  it("no protocol's safety warning offers the pause timer", () => {
    for (const p of protocols.filter((p) => p.warn && p.safetyLink)) {
      const html = renderToStaticMarkup(<ProtocolLayout protocol={p} />);
      const banner = html.slice(html.indexOf('role="alert"'), html.indexOf("</div>", html.indexOf('role="alert"') + 2000));
      expect(banner, p.slug).toContain('href="/help"');
      expect(banner, p.slug).not.toContain("Open Pause + Return timer");
    }
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
