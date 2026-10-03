import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/data/registry.json";
import { icons } from "@/data/icons";
import { KIT } from "@/data/kit";
import { coreFiveSlugs } from "@/data/core5";
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
  it("has all 15 card slugs, each with the registry name and tier", () => {
    expect(registry.protocols).toHaveLength(15);
    expect(protocols).toHaveLength(15);
    for (const r of registry.protocols) {
      const card = getProtocol(r.slug);
      expect(card, r.slug).toBeDefined();
      expect(card!.title, r.slug).toBe(r.name);
      expect(card!.tier, r.slug).toBe(r.tier);
    }
    expect(new Set(protocols.map((p) => p.slug))).toEqual(new Set(registry.protocols.map((r) => r.slug)));
  });

  it("the Core tier is exactly the Core 5", () => {
    const core = registry.protocols.filter((r) => r.tier === "core").map((r) => r.slug);
    expect(new Set(core)).toEqual(new Set(coreFiveSlugs));
  });

  it("tier badges match the registry (label and dots)", () => {
    for (const key of ["core", "situational", "build"] as const) {
      const t = registry.tiers[key];
      expect(tierInfo[key].label).toBe(t.label);
      expect(tierInfo[key].dots).toBe(t.dots);
      expect(tierInfo[key].icon).toBe(t.icon);
    }
  });

  it("safety green is for safety content only: Unity Anchor is forest", () => {
    expect(getProtocol("unity-anchor")!.accentHint).toBe("accent");
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
    expect(all).toContain("Morning + Evening Rhythm");
    expect(all).toContain("Favourites only");
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

  it("names Morning + Evening Rhythm one way only", () => {
    const all = texts.map((t) => t.text).join("\n");
    expect(all).not.toMatch(/Morning ?(\/|&|and) ?Evening Rhythm/);
    expect(all).toContain("Morning + Evening Rhythm");
  });

  it("phrases the Care Check-in as the monthly item inside the Weekly Reset", () => {
    const phrase = registry.concepts["care-check-in"].phrase;
    // The Weekly Reset's own "Check the load" step (card and diagram) is already inside the
    // Weekly Reset; it uses the Field Kit's shorter wording (voice pass 10), and the
    // Weekly Reset wizard's step 2 is also inside the Weekly Reset, so (voice pass 22) it points at the
    // Care Check-in table in short; the monthly calendar reminder carries the full phrase (once per product).
    // The Situation Map's weekly row is routed to the
    // Weekly Reset, so its short line (voice pass 18) says "Once a month, it includes the Care Check-in."
    const mentions = texts.filter((t) => /Care Check-in/.test(t.text) && !/^Care Check-in$/.test(t.text) && !/whether the load feels fair\. Once a month, this part is the Care Check-in\.$/.test(t.text) && !/^Weekly Reset: about 40 minutes\. Once a month, it includes the Care Check-in\.$/.test(t.text) && !/^Each week, talk through who’s carrying what\. First Sunday of the month\? Use the Care Check-in table below for this part\.$/.test(t.text));
    expect(mentions.length).toBeGreaterThan(0);
    expect(mentions.some((m) => m.file.endsWith("lib/ics.ts") && m.text.includes(phrase.replace(/^the /, "")))).toBe(true);
    for (const m of mentions) {
      expect(m.text.toLowerCase(), `${m.file}: ${m.text}`).toContain(phrase.toLowerCase().replace(/^the /, ""));
    }
  });

  it("Sun Memory: Quick (a few minutes) and Full (2–24 hours)", () => {
    const sun = texts.filter((t) => /^Sun Memory: /.test(t.text));
    expect(sun).toHaveLength(1);
    // Kit wording, mirrored word for word (voice pass 38).
    expect(sun[0].text).toMatch(/Quick: a few minutes inside one ritual, to put the to-do list down\./);
    // Voice pass 43: the Kit's new wording, still literally "2–24 hours".
    expect(sun[0].text).toMatch(/Full: 2–24 hours with no talk about the tools\./);
    expect(sun[0].text).toMatch(/Everything else carries on: safety, childcare, the shopping, any repair you’ve already booked\./);
    expect(sun[0].text).toMatch(/[Ee]ither of you can end it by naming a safety concern/);
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
    const viaGlossary = new Set(["System Overlay", "Proof", "Layer Scan"]);
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
  it("counts 7 worksheets, with the registry names", () => {
    expect(registry.worksheetCount).toBe(7);
    expect(KIT.worksheets).toBe(7);
    expect(worksheets).toHaveLength(7);
    expect(worksheets.map((w) => w.name)).toEqual(registry.worksheets.map((w) => w.name));
    expect(worksheets.map((w) => w.id)).toEqual(registry.worksheets.map((w) => w.id));
  });
});

describe("Go deeper pointers", () => {
  // Chapter numbers and titles from the Operating Manual's table of contents.
  const MANUAL = new Map<string, string>([
    ["I", "The Short Version"], ["II", "Fast Start"], ["III", "Introduction"],
    ["IV", "When Your Body Takes Over"], ["V-A", "How Each of You Reaches for Closeness"],
    ["V-B", "When Hurt Gets Explained Away"], ["VI", "The Four Phases"], ["VII", "How Couples Drift"],
    ["VIII", "Hearing the Need Underneath"], ["IX", "Team Over Self"],
    ["X", "Two Ways of Caring"], ["XI", "Daily Rhythm"], ["XI-A", "Sensory Comfort"],
    ["XII", "Weekly Reset"], ["XIII", "Conflict Protocol"], ["XIII-A", "Micro-Repairs"],
    ["XIII-B", "Full Recovery"], ["XIII-C", "Why the Tools Are Built This Way"],
    ["XIII-D", "When One of You Pulls Away"], ["XIV", "The Intimacy Pact"],
    ["XV", "Proof Over Promises"], ["XVI", "Trust Recovery"], ["XVII", "Consistency Pact"],
    ["XVIII", "Making Room for Joy"], ["XVIII-A", "The Sun Memory Protocol"], ["XIX", "Regular Reviews"],
  ]);

  it("names a real Manual chapter (and Companion chapter) for every protocol", async () => {
    const { goDeeper, manualChapters } = await import("@/data/go-deeper");
    expect(Object.keys(goDeeper).sort()).toEqual(protocols.map((p) => p.slug).sort());
    for (const c of Object.values(manualChapters)) expect(MANUAL.get(c.num)).toBe(c.title);
    // Companion chapters as headed in the Companion Book (I–VIII) or its founders' note.
    for (const g of Object.values(goDeeper)) {
      if (g.companion) expect(g.companion).toMatch(/^Companion(?: Ch (?:I|II|III|IV|V|VI|VII|VIII)|: The Third Voice)$/);
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

  it("Unity Anchor uses the four canonical step names", () => {
    const r = registry.protocols.find((p) => p.slug === "unity-anchor") as { steps: string[] };
    const card = getProtocol("unity-anchor")!;
    expect(card.steps.map((s) => s.split(" — ")[0])).toEqual(r.steps);
  });
});

describe("step diagrams use plain step names (CANON round 5)", () => {
  it("diagram titles equal the card's own step names where the card names them", async () => {
    const { protocolDiagrams } = await import("@/data/visuals/protocol-diagrams");
    for (const card of protocols) {
      const d = protocolDiagrams[card.slug];
      if (!d) continue;
      expect(d.steps.length, card.slug).toBe(card.steps.length);
      card.steps.forEach((step, i) => {
        const m = step.match(/^([^—:]+?)(?: \([^)]*\))? — /);
        // The title may keep a qualifier that is part of the name, e.g. "Touch (only if welcome)".
        if (m && m[1].split(" ").length <= 6) expect([m[1], m[0].replace(/ — $/, "")], `${card.slug} step ${i + 1}`).toContain(d.steps[i].title);
      });
    }
    const all = Object.values(protocolDiagrams).flatMap((d) => d.steps.map((s) => s.title));
    for (const retired of ["Signal", "Time", "Separate", "Name", "Contact", "Warmth", "Safety", "Expression", "Request", "Alignment", "Words", "Intent", "Morning Reset", "Evening Check-in", "Evening Landing"]) {
      expect(all, retired).not.toContain(retired);
    }
  });
});
