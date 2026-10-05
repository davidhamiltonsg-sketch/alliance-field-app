import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/data/registry.json";
import nextConfig from "../next.config";
import { icons } from "@/data/icons";
import { protocols, getProtocol } from "@/data/protocols";
import { goDeeper, manualChapters } from "@/data/go-deeper";
import { situations } from "@/data/situations";
import { startDays } from "@/data/start";
import { HELP_LINES_PRINTED } from "@/data/help";
import { glossary } from "@/data/glossary";

/**
 * Spec v2 checks that cut across files: the 15 tools, retired names, the Help
 * Lines list kept identical in help.ts, the registry and the README, times
 * stated once, and the old routes redirecting.
 */

const root = join(__dirname, "..");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Retired names (SPEC section 2). Case-sensitive for capitalised names; slugs (hyphenated) are not matched. */
const RETIRED: RegExp[] = [
  /60-Second Alliance Reset/, /Second Alliance Reset/, /\bAlliance Reset\b/,
  /Honesty Gate/,
  /Morning \+ Evening Rhythm/, /Evening Rhythm/, /daily floor/i,
  /Monthly Review/, /monthly look-back/i, /Yearly Review/, /deeper check/i,
  /Drift Check/, /Loop Spotter/, /Pulling-Away Check/,
  /Team Frame/, /Unity Anchor/,
  /Full Recovery/,
  /Proof Protocol/, /Proof Over Promises/,
  /Housemate Drift/, /Tone Spiral/, /Hope Fog/, /Carrying It Alone/,
  /Warm Decline/, /Partner-First/, /Settling Plan/, /holding signal/i,
  /Loop Library/,
  /Your First 7 Days/, /The First Week/,
  /Return Defaults/, /Pacts Worksheet/, /Sensory Comfort Inventory/,
  /\bCore [56]\b/,
  /Layer Scan/,
];

// testimonials.ts holds real people's words, verbatim; this file holds the list itself.
const SKIP = /testimonials\.ts$|spec-v2\.test\.ts$/;

describe("the 15 tools", () => {
  it("are exactly these, in tier order", () => {
    expect(protocols.map((p) => p.slug)).toEqual([
      "green-rule", "pause-and-return", "60-second-reset", "micro-repair", "weekly-reset", "system-overlay",
      "full-repair", "trust-recovery", "check-up", "team-agreement", "sun-memory",
      "daily-rhythm", "intimacy-pact", "consistency-pact", "profile-calibration",
    ]);
    expect(protocols.map((p) => p.title)).toEqual([
      "Green Rule", "Pause + Return", "60-Second Reset", "Micro-Repair", "Weekly Reset", "System Overlay",
      "Full Repair", "Trust Recovery", "Check-Up", "Team Agreement", "Sun Memory",
      "Daily Rhythm", "Intimacy Pact", "Consistency Pact", "Profile Calibration",
    ]);
  });

  it("every card has an icon of its own slug, labelled with its name", () => {
    for (const p of protocols) {
      expect(icons, p.slug).toHaveProperty(p.slug);
      expect(icons[p.slug as keyof typeof icons].label, p.slug).toBe(p.title);
    }
    for (const retired of ["full-recovery", "uninvestment-check", "unity-anchor", "morning-evening-rhythm"]) expect(icons).not.toHaveProperty(retired);
  });

  it("every card href in cross-links is a /protocols/<slug> of one of the 15", () => {
    const slugs = new Set(protocols.map((p) => p.slug));
    for (const p of protocols) {
      for (const l of p.crossLinks) {
        if (l.href?.startsWith("/protocols/")) expect(slugs, `${p.slug} → ${l.href}`).toContain(l.href.replace("/protocols/", ""));
      }
    }
  });

  it("the Situation Map sends every row to a card that exists and has a go-deeper entry", () => {
    for (const s of situations) {
      for (const href of [s.primaryHref, ...(s.secondaryHrefs ?? []).map((l) => l.href)]) {
        if (!href.startsWith("/protocols/")) continue;
        const slug = href.replace("/protocols/", "");
        expect(getProtocol(slug), `${s.id} → ${slug}`).toBeDefined();
        expect(goDeeper, `${s.id} → ${slug}`).toHaveProperty(slug);
      }
    }
  });

  it("every go-deeper chapter exists in manualChapters, with the right title", () => {
    for (const [slug, g] of Object.entries(goDeeper)) expect(manualChapters[g.chapter], slug).toBeDefined();
    expect(Object.keys(manualChapters)).toHaveLength(16);
  });

  it("the First Week days all use real cards and chapters", () => {
    for (const d of startDays) expect(goDeeper, d.slug).toHaveProperty(d.slug);
  });

  it("the glossary has about 25 entries, each pointing at a real chapter", () => {
    expect(glossary.length).toBeGreaterThanOrEqual(24);
    expect(glossary.length).toBeLessThanOrEqual(30);
    for (const g of glossary) if (g.chapter) expect(manualChapters, g.term).toHaveProperty(g.chapter);
    expect(new Set(glossary.map((g) => g.term)).size).toBe(glossary.length);
  });
});

describe("retired names (SPEC section 2)", () => {
  const strip = (text: string) => text.replace(/\/protocols\/[a-z0-9-]+/g, "");

  it("none appears anywhere in src/data", () => {
    const hits: string[] = [];
    for (const f of walk(join(root, "src/data")).filter((f) => /\.(ts|json)$/.test(f) && !SKIP.test(f))) {
      let text = readFileSync(f, "utf8");
      if (f.endsWith("registry.json")) {
        const r = JSON.parse(text);
        delete r.bannedVariants;
        delete r.bannedPatterns;
        text = JSON.stringify(r);
      }
      for (const re of RETIRED) if (re.test(strip(text))) hits.push(`${relative(root, f)}: ${re}`);
    }
    expect(hits).toEqual([]);
  });

  it("none appears in the other tests", () => {
    const hits: string[] = [];
    for (const f of readdirSync(join(root, "tests")).filter((f) => /\.tsx?$/.test(f))) {
      const text = readFileSync(join(root, "tests", f), "utf8");
      if (SKIP.test(f)) continue;
      // The older tests that assert a name is gone mention it inside a negative match; those lines are allowed.
      const lines = text.split("\n").filter((l) => !/not\.(toMatch|toContain|toBe)|expect\(all, retired\)|\bretired\b/.test(l));
      for (const re of RETIRED) if (re.test(strip(lines.join("\n")))) hits.push(`tests/${f}: ${re}`);
    }
    expect(hits).toEqual([]);
  });

  it("the registry's banned patterns include every retired name", () => {
    const patterns = registry.bannedPatterns.patterns.map((p) => new RegExp(p, "i"));
    for (const sample of ["60-Second Alliance Reset", "Honesty Gate", "Morning + Evening Rhythm", "Monthly Review", "Drift Check", "Loop Spotter", "Pulling-Away Check", "Unity Anchor", "Full Recovery", "Proof Protocol", "Hope Fog", "Loop Library", "Your First 7 Days", "Core 6"]) {
      expect(patterns.some((re) => re.test(sample)), sample).toBe(true);
    }
  });
});

describe("Help Lines are identical in help.ts, the registry and the README", () => {
  const readme = readFileSync(join(root, "README.md"), "utf8");

  it("the registry's printed list is help.ts's, verbatim", () => {
    expect(registry.concepts["help-safety"].helpLines).toEqual(HELP_LINES_PRINTED);
  });

  it("the README carries every line, verbatim", () => {
    for (const line of HELP_LINES_PRINTED) expect(readme, line).toContain(line);
  });

  it("includes the sexual-violence line, 995, the verified numbers and the check date", () => {
    const printed = HELP_LINES_PRINTED.join("\n");
    expect(printed).toContain("(999 UK/SG police · 995 SG ambulance · 911 US · 000 AU · 112 EU)");
    expect(printed).toContain("Sexual violence, including from a partner: US RAINN 800-656-4673 (text HOPE to 64673) · UK Rape Crisis England & Wales 0808 500 2222 · Australia 1800RESPECT (1800 737 732) · Singapore AWARE Sexual Assault Care Centre 6779 0282 (weekdays 10am to 6pm)");
    expect(printed).toContain("Samaritans 116 123");
    expect(printed).toContain("116 016");
    // The sexual-violence line comes right after Singapore.
    const i = HELP_LINES_PRINTED.findIndex((l) => l.startsWith("Singapore:"));
    expect(HELP_LINES_PRINTED[i + 1]).toMatch(/^Sexual violence, including from a partner:/);
    expect(registry.concepts["help-safety"].checked).toBe("October 2026");
    expect(readme).toContain("checked October 2026");
  });
});

describe("times are stated once and mirrored", () => {
  const t = registry.times;
  const card = (slug: string) => JSON.stringify(getProtocol(slug));

  it("the registry states each time, and the cards say the same", () => {
    expect(t.pause).toBe("20 minutes to 24 hours");
    expect(card("pause-and-return")).toContain("from 20 minutes to 24 hours");
    expect(t.reset60).toBe("1 minute");
    expect(t.weeklyReset).toMatch(/^40 minutes \(15 is fine to start\); the monthly part adds 10 minutes; the yearly part is 1–2 hours/);
    expect(card("weekly-reset")).toContain("About 40 minutes");
    expect(card("weekly-reset")).toContain("15 minutes is fine to start");
    expect(card("weekly-reset")).toContain("adds 10 minutes");
    expect(card("weekly-reset")).toContain("1 to 2 hours");
    expect(t.microRepair).toBe("start within minutes, finish within 24 hours");
    expect(card("micro-repair").toLowerCase()).toContain("start within minutes");
    expect(card("micro-repair")).toContain("within 24 hours");
    expect(t.fullRepair).toBe("60–90 minutes");
    expect(card("full-repair")).toContain("60 to 90 minutes");
    expect(t.checkUp).toBe("about every few months, 20 minutes");
    expect(card("check-up")).toContain("About every few months, 20 minutes");
    expect(t.proofWindows).toBe("1–2 weeks (2–4 for a breach)");
    expect(card("trust-recovery")).toContain("two to four weeks to start (1 to 2 weeks for a smaller Proof item)");
    expect(t.dailyRhythm).toBe("morning hello 5 minutes or less; evening catch-up about 10 minutes");
    expect(card("daily-rhythm")).toContain("Morning hello (5 minutes or less)");
    expect(card("daily-rhythm")).toContain("Evening catch-up (about 10 minutes)");
  });

  it("the Situation Map and First Week use the same numbers", () => {
    const week = startDays.map((d) => d.task).join(" ");
    expect(week).toContain("Take 20 minutes apart");
    expect(week).toContain("15 minutes is fine");
    expect(week).toContain("40-minute timer");
    expect(week).toContain("finish within 24 hours");
    expect(situations.find((s) => s.id === "weekly-maintenance")!.firstMove).toContain("about 40 minutes (15 is fine to start)");
  });
});

describe("old routes redirect (next.config.ts)", () => {
  it("every retired slug lands on its new tool", async () => {
    const redirects = await nextConfig.redirects!();
    const map = Object.fromEntries(redirects.map((r) => [r.source, r.destination]));
    expect(map["/protocols/full-recovery"]).toBe("/protocols/full-repair");
    expect(map["/protocols/uninvestment-check"]).toBe("/protocols/check-up");
    expect(map["/protocols/unity-anchor"]).toBe("/protocols/team-agreement");
    expect(map["/protocols/morning-evening-rhythm"]).toBe("/protocols/daily-rhythm");
    expect(map["/protocols/proof-protocol"]).toBe("/protocols/trust-recovery");
    expect(map["/protocols/conflict-protocol"]).toBe("/protocols/system-overlay");
    expect(map["/install"]).toBe("/start");
    const slugs = new Set(protocols.map((p) => p.slug));
    for (const r of redirects) {
      expect(r.permanent).toBe(true);
      const dest = r.destination.replace("/protocols/", "");
      if (r.destination.startsWith("/protocols/")) expect(slugs, r.source).toContain(dest);
      expect(slugs, `${r.source} must not shadow a live card`).not.toContain(r.source.replace("/protocols/", ""));
    }
  });
});
