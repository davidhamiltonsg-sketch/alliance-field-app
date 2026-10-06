import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/data/registry.json";
import { icons } from "@/data/icons";
import { KIT } from "@/data/kit";
import { coreSixSlugs } from "@/data/core6";
import { getProtocol, protocols } from "@/data/protocols";
import { plainEnglish } from "@/data/glossary";
import { tierInfo } from "@/data/tiers";
import { worksheets } from "@/data/worksheets";

/**
 * The app against the shared Alliance Protocols registry (design/registry.json,
 * copied to src/data/registry.json): names, tiers, icons, worksheets and the
 * banned wording variants of CANON round 4.
 */

const root = join(__dirname, "..");
const src = join(root, "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** String literals (double, single, backtick) and JSX text from a source file. */
function userText(file: string): string[] {
  let s = readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    const out: string[] = [];
    const collect = (v: unknown) => {
      if (typeof v === "string") out.push(v);
      else if (v && typeof v === "object") Object.values(v).forEach(collect);
    };
    collect(JSON.parse(s));
    return out;
  }
  s = s
    .replace(/^\s*(import|export \{)[^\n]*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    // Styling and wiring, not words: class names, ids, hrefs, keys.
    .replace(/\b(className|id|htmlFor|href|key|viewBox|d|transform|fill|stroke|style|role|type|inputMode|aria-labelledby|aria-describedby|aria-controls)=("[^"]*"|\{`[^`]*`\}|\{[^{}]*\})/g, "")
    .replace(/`[^`]*`/g, (m) => m.replace(/\$\{[^}]*\}/g, " "));
  const strings = [...s.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? m[3]);
  const jsxText = file.endsWith(".tsx") ? [...s.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]) : [];
  // Tailwind class lists held in variables are styling, not words.
  const classList = /^(?:[a-z0-9-]+:)*-?[a-z]+(?:-[\w[\].\/%#()-]+)+(?: (?:[a-z0-9-]+:)*-?[a-z]+(?:-[\w[\].\/%#()-]+)*)*$/;
  return [...strings, ...jsxText]
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter((t) => /[a-z]{3}/i.test(t) && !classList.test(t));
}

// User-facing copy: all data (except the registry and icon geometry), every
// page and component, and the libraries that write report or calendar text.
// testimonials.ts is excluded from every copy scan (curly quotes, British
// spelling, banned wording, terminology): those are real people's words and
// stay verbatim, as they were given. Never edit them to pass a test.
const scanned = [
  ...walk(join(src, "data")).filter((f) => /\.(json|ts)$/.test(f) && !/registry\.json$|icons\.ts$|testimonials\.ts$/.test(f)),
  ...walk(join(src, "app")).filter((f) => f.endsWith(".tsx")),
  ...walk(join(src, "components")).filter((f) => f.endsWith(".tsx")),
  join(src, "lib/calibration.ts"),
  join(src, "lib/ics.ts"),
];
const texts = scanned.flatMap((f) => userText(f).map((text) => ({ file: relative(root, f), text })));

describe("registry: protocols", () => {
  it("has exactly the 15 card slugs, each with the registry name and tier", () => {
    expect(registry.protocols).toHaveLength(15);
    expect(protocols).toHaveLength(15);
    expect(registry.counts.protocols).toBe(15);
    for (const r of registry.protocols) {
      const card = getProtocol(r.slug);
      expect(card, r.slug).toBeDefined();
      expect(card!.title, r.slug).toBe(r.name);
      expect(card!.tier, r.slug).toBe(r.tier);
    }
    expect(new Set(protocols.map((p) => p.slug))).toEqual(new Set(registry.protocols.map((r) => r.slug)));
  });

  it("tiers are 6 / 5 / 4: learn first, when it comes up, build over time", () => {
    const count = (tier: string) => registry.protocols.filter((r) => r.tier === tier).length;
    expect([count("core"), count("situational"), count("build")]).toEqual([6, 5, 4]);
    expect([protocols.filter((p) => p.tier === "core").length, protocols.filter((p) => p.tier === "situational").length, protocols.filter((p) => p.tier === "build").length]).toEqual([6, 5, 4]);
    expect(registry.protocols.map((r) => r.tier)).toEqual([...Array(6).fill("core"), ...Array(5).fill("situational"), ...Array(4).fill("build")]);
    expect(protocols.map((p) => p.slug)).toEqual(registry.protocols.map((r) => r.slug));
  });

  it("the learn-first tier is exactly the six to learn first, including the System Overlay", () => {
    const core = registry.protocols.filter((r) => r.tier === "core").map((r) => r.slug);
    expect(new Set(core)).toEqual(new Set(coreSixSlugs));
    expect(core).toHaveLength(6);
    expect(coreSixSlugs).toContain("system-overlay");
    expect(getProtocol("system-overlay")!.tier).toBe("core");
  });

  it("tier badges are the three plain labels, with no dots or glyph text", () => {
    expect(tierInfo.core.label).toBe("Learn first");
    expect(tierInfo.situational.label).toBe("When it comes up");
    expect(tierInfo.build.label).toBe("Build over time");
    for (const key of ["core", "situational", "build"] as const) {
      const r = registry.tiers[key];
      expect(tierInfo[key].label).toBe(r.label);
      expect(tierInfo[key].icon).toBe(r.icon);
      expect(r).not.toHaveProperty("dots");
      expect(r).not.toHaveProperty("glyph");
      expect(tierInfo[key]).not.toHaveProperty("dots");
      expect(r.label).not.toMatch(/[●•]/);
    }
  });

  it("safety green is for safety content only", () => {
    for (const p of protocols.filter((p) => p.accentHint === "safety")) expect(p.slug).toBe("green-rule");
  });
});

describe("registry: icons", () => {
  it("every registry icon id exists in the icon set", () => {
    const ids = new Set<string>();
    for (const p of registry.protocols) ids.add(p.icon);
    for (const c of Object.values(registry.concepts)) if ("icon" in c && c.icon) ids.add(c.icon);
    for (const t of Object.values(registry.tiers)) if (typeof t === "object" && t.icon) ids.add(t.icon);
    for (const s of registry.sections.order) if (s.icon && !s.icon.includes("*")) ids.add(s.icon);
    expect(ids.size).toBeGreaterThan(20);
    for (const id of ids) expect(icons, id).toHaveProperty(id);
  });

  it("every protocol slug is its own icon id, and labels use the canonical names", () => {
    for (const r of registry.protocols) {
      expect(r.icon).toBe(r.slug);
      expect(icons[r.icon as keyof typeof icons].label, r.slug).toBe(r.name);
    }
  });

  it("uses the safety glyph only on safety content", () => {
    const allowed = new Set([
      "src/components/Marker.tsx", // SAFETY and HELP markers
      "src/components/visuals/v2.tsx", // safety step glyph
      "src/components/SituationCard.tsx", // the safety (danger) row
      "src/components/intro/diagrams.tsx", // the safety row of the intro map
      "src/app/page.tsx", // "I'm afraid or not safe" → Help
      "src/components/PauseTimer.tsx", // the Help link in the calm pause view
      "src/app/together/page.tsx", // the Help & safety card on the Together hub
    ]);
    const users = walk(src)
      .filter((f) => /\.tsx?$/.test(f) && !f.endsWith("icons.ts"))
      .filter((f) => /"(help-safety|section-safety)"/.test(readFileSync(f, "utf8")))
      .map((f) => relative(root, f));
    for (const f of users) expect(allowed, f).toContain(f);
  });
});

describe("registry: banned wording", () => {
  // Reviewed exceptions (CANON: "review hits by hand"): web tracking on the
  // privacy page, and the CANON guardrail that names location tracking as
  // monitoring. "(formerly Kill-Switch)" is allowed once, checked below.
  const allowed = [/\(formerly Kill-Switch\)/g, /location tracking|tracking location/gi, /tracking pixels|trackers|tracking\b(?= by| cookies| of any kind|\.)/gi];
  const patterns = registry.bannedPatterns.patterns.map((p) => new RegExp(p, "i"));

  it("scans a meaningful amount of copy", () => {
    expect(scanned.length).toBeGreaterThan(60);
    expect(texts.length).toBeGreaterThan(1000);
    // JSX text, JSON values and aria labels are all picked up.
    const all = texts.map((t) => t.text);
    expect(all).toContain("What’s happening right now?");
    expect(all).toContain("Daily Rhythm");
    expect(all).toContain("Learn first");
  });

  it("no user-facing string matches a banned pattern", () => {
    const hits: string[] = [];
    for (const { file, text } of texts) {
      const cleaned = allowed.reduce((t, re) => t.replace(re, ""), text);
      for (const re of patterns) if (re.test(cleaned)) hits.push(`${file}: /${re.source}/ in “${text.slice(0, 120)}”`);
    }
    expect(hits).toEqual([]);
  });

  it("never shows the retired name 'Kill-Switch' (CANON Round 10)", () => {
    const all = texts.map((t) => t.text).join("\n");
    expect(all).not.toMatch(/Kill-?Switch/i);
  });

  it("names Daily Rhythm one way only, with a morning hello and an evening catch-up", () => {
    const all = texts.map((t) => t.text).join("\n");
    expect(all).not.toMatch(/Morning ?(\/|&|and|\+) ?Evening Rhythm/);
    expect(all).toContain("Daily Rhythm");
    expect(all).toMatch(/morning hello/i);
    expect(all).toMatch(/evening catch-up/i);
  });

  it("phrases the monthly and yearly parts as parts of the Weekly Reset (no separate review names)", () => {
    const phrase = registry.concepts["care-check-in"].phrase;
    expect(phrase).toBe("the monthly part of your Weekly Reset");
    const all = texts.map((t) => t.text).join("\n");
    expect(all).not.toMatch(/Care Check-?in|Monthly Review|Yearly Review|monthly look-back/i);
    const card = getProtocol("weekly-reset")!;
    expect(card.steps.at(-1)).toMatch(/^Monthly part, once a month, adds 10 minutes/);
    expect(card.note).toMatch(/^Yearly part, 1 to 2 hours/);
  });

  it("uses the renamed terms everywhere", () => {
    const all = texts.map((t) => t.text).join("\n");
    expect(all).not.toMatch(/Safety Gate/i);
    expect(all).not.toMatch(/\bcircuits?\b/i);
    expect(all).not.toMatch(/Yearly Alignment|Weaponi[sz]ation Check/);
    expect(all).not.toMatch(/Honesty Gate|Loop Library|Unity Anchor|Full Recovery|Pulling-Away Check/);
    expect(all).toContain("Green Rule");
    expect(all).toContain("Full Repair");
    expect(all).toContain("Check-Up");
  });
});

describe("registry: plain-English subtitles", () => {
  it("match the registry", () => {
    // The app sets apostrophes typographically (’); the registry uses plain ones.
    const subs = Object.fromEntries(
      Object.entries(registry.plainEnglishSubtitles)
        .filter(([k]) => k !== "rule")
        .map(([k, v]) => [k, String(v).replace(/'/g, "’")]),
    );
    expect(plainEnglish).toEqual(subs);
  });

  it("each coined term that appears in the app has its subtitle shown", () => {
    const viaGlossary = new Set(["System Overlay", "Proof item"]);
    const own = texts.filter((t) => !t.file.endsWith("glossary.ts"));
    for (const [term, sub] of Object.entries(plainEnglish)) {
      const used = own.some((t) => new RegExp(`\\b${term}\\b`).test(t.text));
      if (!used) continue;
      const shown = viaGlossary.has(term) || own.some((t) => t.text.toLowerCase().includes(sub.toLowerCase()));
      expect(shown, term).toBe(true);
    }
  });
});

describe("registry: worksheets", () => {
  it("counts 6 worksheets, with the registry names", () => {
    expect(registry.worksheetCount).toBe(6);
    expect(registry.counts.worksheets).toBe(6);
    expect(KIT.worksheets).toBe(6);
    expect(worksheets).toHaveLength(6);
    expect(worksheets.map((w) => w.name)).toEqual(["Pause times", "Weekly Reset agenda", "Profile Calibration", "Consistency Pact: my private check", "Pacts sheet", "Check-Up sheet"]);
    expect(worksheets.map((w) => w.name)).toEqual(registry.worksheets.map((w) => w.name));
    expect(worksheets.map((w) => w.id)).toEqual(registry.worksheets.map((w) => w.id));
  });

  it("every worksheet points at real cards, and each card's worksheets exist", () => {
    for (const w of worksheets) for (const slug of w.protocols) expect(getProtocol(slug), `${w.id} → ${slug}`).toBeDefined();
    const ids = new Set(worksheets.map((w) => w.id));
    for (const r of registry.protocols) for (const id of (r as { worksheets?: string[] }).worksheets ?? []) expect(ids, `${r.slug} → ${id}`).toContain(id);
  });
});

describe("Go deeper pointers", () => {
  it("manualChapters is the new 16-chapter list, in order, matching the registry", async () => {
    const { manualChapters } = await import("@/data/go-deeper");
    const chapters = Object.values(manualChapters);
    expect(chapters).toHaveLength(16);
    expect(KIT.manualChapters).toBe(16);
    expect(registry.counts.chapters).toBe(16);
    expect(chapters.map((c) => c.num)).toEqual(Array.from({ length: 16 }, (_, i) => String(i + 1)));
    expect(chapters.map((c) => c.title)).toEqual(registry.manualChapters);
    expect(chapters[9].title).toBe("When It’s Already a Fight");
    expect(chapters[11].title).toBe("The Check-Up");
    expect(chapters[15].title).toBe("Team Agreement: When Pressure Comes From Outside");
  });

  it("names a real Manual chapter (and Companion chapter) for every tool", async () => {
    const { goDeeper, manualChapters } = await import("@/data/go-deeper");
    expect(Object.keys(goDeeper).sort()).toEqual(protocols.map((p) => p.slug).sort());
    for (const [slug, g] of Object.entries(goDeeper)) {
      expect(manualChapters, `${slug} → chapter ${g.chapter}`).toHaveProperty(g.chapter);
      // Volume A chapters as headed in Volume A (I–XI) or its authors' note.
      if (g.companion) expect(g.companion).toMatch(/^Volume A(?:, Ch (?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI)|: The Third Voice)$/);
    }
  });

  it("“In the books” gives one plain line per book, with the chapter’s title", async () => {
    const { goDeeper, manualLine, companionLine } = await import("@/data/go-deeper");
    expect(manualLine("3")).toBe("Volume B, Chapter 3: When Your Body Takes Over");
    expect(companionLine("Volume A, Ch II")).toBe("Volume A, Chapter II: Two Nervous Systems, One Kitchen");
    for (const g of Object.values(goDeeper)) {
      if (g.companion) expect(companionLine(g.companion)).toMatch(/^Volume A(, Chapter [IVX]+)?: \S/);
    }
    const layout = readFileSync(join(process.cwd(), "src/components/ProtocolLayout.tsx"), "utf8");
    expect(layout).toContain("In the books");
    expect(layout).not.toMatch(/Go deeper|Operating Manual:/);
  });

  it("each tool points at the new chapter that covers it", async () => {
    const { goDeeper } = await import("@/data/go-deeper");
    const expected: Record<string, string> = {
      "green-rule": "2", "pause-and-return": "3", "60-second-reset": "3", "micro-repair": "9", "weekly-reset": "8", "system-overlay": "2",
      "full-repair": "10", "trust-recovery": "11", "check-up": "12", "team-agreement": "16", "sun-memory": "15",
      "daily-rhythm": "7", "intimacy-pact": "14", "consistency-pact": "13", "profile-calibration": "5",
    };
    for (const [slug, chapter] of Object.entries(expected)) expect(goDeeper[slug].chapter, slug).toBe(chapter);
  });

  it("every Situation Map row's tool exists as a card and has a go-deeper entry", async () => {
    const { goDeeper } = await import("@/data/go-deeper");
    const { situations } = await import("@/data/situations");
    for (const s of situations) {
      const hrefs = [s.primaryHref, ...(s.secondaryHrefs ?? []).map((l) => l.href)];
      for (const href of hrefs.filter((h) => h.startsWith("/protocols/"))) {
        const slug = href.replace("/protocols/", "");
        expect(getProtocol(slug), `${s.id} → ${slug}`).toBeDefined();
        expect(goDeeper, `${s.id} → ${slug}`).toHaveProperty(slug);
      }
      // Rows that route elsewhere go to a real non-card route.
      if (!s.primaryHref.startsWith("/protocols/")) expect(["/help", "/weekly-reset", "/calibrate", "/together"]).toContain(s.primaryHref);
    }
  });
});

describe("typography", () => {
  it("uses curly apostrophes and quotes in user-facing copy", () => {
    const straight = texts.filter((t) => /[A-Za-z]'[A-Za-z]|&apos;|\\"[A-Za-z]/.test(t.text));
    expect(straight.map((t) => `${t.file}: ${t.text}`)).toEqual([]);
  });
});

describe("registry: protocol shape (CANON round 5)", () => {
  it("each card has the registry step count, tone and canonical phrases", () => {
    for (const r of registry.protocols) {
      const card = getProtocol(r.slug)!;
      expect(card.steps.length, r.slug).toBe(r.stepCount);
      expect(card.accentHint ?? "accent", r.slug).toBe(r.appAccentHint);
      const raw = JSON.stringify(card);
      for (const phrase of (r as { canonicalPhrases?: string[] }).canonicalPhrases ?? []) {
        expect(raw, `${r.slug}: ${phrase}`).toContain(phrase.replace(/'/g, "’"));
      }
    }
  });

  it("the Team Agreement has one step list: Believe first, then the four steps", async () => {
    const { teamAgreement } = await import("@/data/together");
    const names = ["Believe first", "Pause before reacting", "Trace the source", "Name the unit", "Agree your response"];
    expect(teamAgreement.steps).toHaveLength(5);
    names.forEach((n, i) => expect(teamAgreement.steps[i].startsWith(n), n).toBe(true));
  });
});

describe("step diagrams use plain step names", () => {
  it("diagram titles are the card's own step names", async () => {
    const { protocolDiagrams } = await import("@/data/visuals/protocol-diagrams");
    for (const card of protocols) {
      const d = protocolDiagrams[card.slug];
      expect(d, card.slug).toBeDefined();
      expect(d.steps.length, card.slug).toBe(card.steps.length);
      card.steps.forEach((step, i) => expect(step.startsWith(d.steps[i].title), `${card.slug} step ${i + 1}`).toBe(true));
    }
    const all = Object.values(protocolDiagrams).flatMap((d) => d.steps.map((s) => s.title));
    for (const retired of ["Signal", "Time", "Separate", "Name", "Contact", "Warmth", "Safety", "Expression", "Request", "Alignment", "Words", "Intent", "Morning Reset", "Evening Check-in", "Evening Landing"]) {
      expect(all, retired).not.toContain(retired);
    }
  });
});
