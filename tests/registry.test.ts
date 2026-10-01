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
const scanned = [
  ...walk(join(src, "data")).filter((f) => /\.(json|ts)$/.test(f) && !/registry\.json$|icons\.ts$/.test(f)),
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
    expect(all.some((t) => t.startsWith("Remove from favourites"))).toBe(true);
  });

  it("no user-facing string matches a banned pattern", () => {
    const hits: string[] = [];
    for (const { file, text } of texts) {
      const cleaned = allowed.reduce((t, re) => t.replace(re, ""), text);
      for (const re of patterns) if (re.test(cleaned)) hits.push(`${file}: /${re.source}/ in “${text.slice(0, 120)}”`);
    }
    expect(hits).toEqual([]);
  });

  it("says 'Kill-Switch' at most once, as '(formerly Kill-Switch)'", () => {
    const all = texts.map((t) => t.text).join("\n");
    expect((all.match(/Kill-?Switch/gi) ?? []).length).toBeLessThanOrEqual(1);
    expect((all.match(/\(formerly Kill-Switch\)/g) ?? []).length).toBeLessThanOrEqual(1);
  });

  it("names Morning + Evening Rhythm one way only", () => {
    const all = texts.map((t) => t.text).join("\n");
    expect(all).not.toMatch(/Morning ?(\/|&|and) ?Evening Rhythm/);
    expect(all).toContain("Morning + Evening Rhythm");
  });

  it("phrases the Care Check-in as the monthly item inside the Weekly Reset", () => {
    const phrase = registry.concepts["care-check-in"].phrase;
    const mentions = texts.filter((t) => /Care Check-in/.test(t.text) && !/^Care Check-in$/.test(t.text));
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) {
      expect(m.text.toLowerCase(), `${m.file}: ${m.text}`).toContain(phrase.toLowerCase().replace(/^the /, ""));
    }
  });

  it("Sun Memory: Quick (a few minutes, one ritual) and Full (2–24 hours)", () => {
    const sun = texts.filter((t) => /Sun Memory \(formerly/.test(t.text));
    expect(sun).toHaveLength(1);
    expect(sun[0].text).toMatch(/Quick: a few minutes inside one ritual/);
    expect(sun[0].text).toMatch(/Full: a declared window of 2–24 hours/);
    expect(sun[0].text).toMatch(/either of you can end it by naming a safety concern/);
  });
});

describe("registry: plain-English subtitles", () => {
  it("match the registry", () => {
    const subs = Object.fromEntries(Object.entries(registry.plainEnglishSubtitles).filter(([k]) => k !== "rule"));
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
