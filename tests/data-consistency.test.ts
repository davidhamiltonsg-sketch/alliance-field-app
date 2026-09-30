import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { authors, publishedAuthors } from "@/data/authors";
import { coreFive, coreFiveSlugs } from "@/data/core5";
import { KIT } from "@/data/kit";
import { emergencyNumbers, helpRegions } from "@/data/help";
import { getProtocol, protocolSlugs, protocols } from "@/data/protocols";
import { situations } from "@/data/situations";
import { START_PLAN_DAYS, startDays } from "@/data/start";
import { protocolDiagrams } from "@/data/visuals/protocol-diagrams";
import { precacheUrls } from "../scripts/generate-sw.mjs";

const cardsDir = join(__dirname, "../src/data/cards");
const cardFiles = readdirSync(cardsDir).filter((f) => f.endsWith(".json"));

describe("protocol cards", () => {
  it("has the canonical 15 protocol cards, all registered", () => {
    expect(protocols).toHaveLength(KIT.protocolCards);
    expect(cardFiles).toHaveLength(KIT.protocolCards);
    expect(new Set(protocolSlugs).size).toBe(protocolSlugs.length);
    for (const f of cardFiles) {
      const slug = JSON.parse(readFileSync(join(cardsDir, f), "utf8")).slug;
      expect(f).toBe(`${slug}.json`);
      expect(getProtocol(slug)).toBeDefined();
    }
  });

  it("every card has a step diagram with the same number of steps", () => {
    for (const p of protocols) {
      const diagram = protocolDiagrams[p.slug];
      expect(diagram, `diagram for ${p.slug}`).toBeDefined();
      expect(diagram.steps.length, `${p.slug} step count`).toBe(p.steps.length);
    }
  });

  it("has no diagram without a card", () => {
    for (const slug of Object.keys(protocolDiagrams)) expect(protocolSlugs).toContain(slug);
  });

  it("cross-links only point at real routes", () => {
    const routes = new Set(precacheUrls());
    for (const p of protocols) {
      for (const link of p.crossLinks) {
        if (link.href) expect(routes, `${p.slug} → ${link.href}`).toContain(link.href);
      }
    }
  });
});

describe("CANON numbers and wording", () => {
  it("Pause + Return is 20 minutes to 24 hours", () => {
    const badge = protocolDiagrams["pause-and-return"].steps.find((s) => s.title === "Time")?.badge;
    expect(badge).toBe("20 min – 24 h");
    expect(getProtocol("pause-and-return")!.steps.join(" ")).toContain("20 minutes minimum, 24 hours max");
    expect(KIT.pauseMinMinutes).toBe(20);
    expect(KIT.pauseMaxMinutes).toBe(1440);
  });

  it("no card or diagram offers a pause shorter than 20 minutes", () => {
    const collect = (v: unknown): string[] =>
      typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(collect) : [];
    const strings = collect([protocols, protocolDiagrams])
      .flatMap((text) => text.split(/(?<=[.!?”])\s+/))
      .filter((sentence) => /pause/i.test(sentence));
    expect(strings.length).toBeGreaterThan(0);
    for (const sentence of strings) {
      expect(sentence).not.toMatch(/\b(10|15|ten|fifteen)[- ]?min/i);
    }
  });

  it("Weekly Reset is five parts, about 40 minutes (5/15/15/5)", () => {
    const card = getProtocol("weekly-reset")!;
    expect(card.steps).toHaveLength(KIT.weeklyResetParts);
    expect(card.activity).toContain("40-minute timer");
    const badges = protocolDiagrams["weekly-reset"].steps.map((s) => s.badge ?? "");
    const minutes = badges.map((b) => Number(b.match(/^(\d+) min/)?.[1] ?? 0));
    expect(minutes.reduce((a, b) => a + b, 0)).toBe(KIT.weeklyResetMinutes);
  });

  it("Uninvestment Check lists 8 signs and the 0–2 / 3+ bands", () => {
    const card = getProtocol("uninvestment-check")!;
    expect(card.activity.match(/\(\d\)/g)).toHaveLength(8);
    expect(card.steps.join(" ")).toContain("0–2 signs");
    expect(card.steps.join(" ")).toContain("3 or more signs");
  });

  it("uses canonical names", () => {
    const text = JSON.stringify(protocols);
    expect(text).not.toMatch(/Care Audit|Tempo Mismatch|Manager Imbalance|Abuse guardrail|push-pull/i);
  });

  it("states the anti-weaponisation guardrails on the relevant cards", () => {
    expect(getProtocol("intimacy-pact")!.warn).toContain("needs no script, reason, or substitute");
    expect(getProtocol("unity-anchor")!.warn).toContain("never how much access a relative gets");
    expect(getProtocol("trust-recovery")!.warn).toContain("never becomes monitoring");
    expect(JSON.stringify(getProtocol("unity-anchor"))).not.toMatch(/how much access they get/);
  });
});

describe("safety routing", () => {
  it("puts the safety row first, routed to Help, never to Pause", () => {
    expect(situations[0].danger).toBe(true);
    expect(situations[0].primaryHref).toBe("/help");
    for (const s of situations.filter((s) => s.danger)) {
      expect(s.primaryHref).not.toMatch(/pause/);
      expect(s.secondaryHrefs ?? []).toEqual([]);
    }
  });

  it("lists the canonical help lines as dialable links", () => {
    expect(emergencyNumbers.map((n) => n.display)).toEqual(["999", "911", "000", "112"]);
    const all = helpRegions.flatMap((r) => r.lines.map((l) => l.display));
    for (const n of ["1-800-799-7233", "88788", "988", "0808 2000 247", "116 123", "1800 737 732", "13 11 14", "1800 777 0000", "1767"]) {
      expect(all).toContain(n);
    }
    for (const line of [...emergencyNumbers, ...helpRegions.flatMap((r) => r.lines)]) {
      expect(line.href).toMatch(/^(tel|sms):\d/);
    }
  });

  it("Green Rule and Pause + Return link to Help", () => {
    expect(getProtocol("green-rule")!.safetyLink).toBe(true);
    expect(getProtocol("pause-and-return")!.safetyLink).toBe(true);
  });
});

describe("Core 5 and the 7-day start plan", () => {
  it("Core 5 is five distinct, real protocol cards, Green Rule first", () => {
    expect(coreFive).toHaveLength(5);
    expect(new Set(coreFiveSlugs).size).toBe(5);
    for (const slug of coreFiveSlugs) expect(getProtocol(slug), slug).toBeDefined();
    expect(coreFiveSlugs[0]).toBe("green-rule");
    expect(coreFiveSlugs).toEqual(
      expect.arrayContaining(["green-rule", "pause-and-return", "60-second-reset", "weekly-reset", "micro-repair"])
    );
  });

  it("/start has days 1–7, each linked to a real card and route", () => {
    const routes = new Set(precacheUrls());
    expect(routes).toContain("/start");
    expect(startDays.map((d) => d.day)).toEqual(Array.from({ length: START_PLAN_DAYS }, (_, i) => i + 1));
    for (const d of startDays) {
      expect(getProtocol(d.slug), `day ${d.day} → ${d.slug}`).toBeDefined();
      expect(routes).toContain(`/protocols/${d.slug}`);
      if (d.tool) expect(routes, `day ${d.day} → ${d.tool.href}`).toContain(d.tool.href);
    }
  });

  it("ends with the first Weekly Reset on day 7 and covers every Core 5 tool", () => {
    const last = startDays.at(-1)!;
    expect(last.day).toBe(7);
    expect(last.slug).toBe("weekly-reset");
    expect(last.task).toContain("40-minute timer");
    for (const slug of coreFiveSlugs) expect(startDays.map((d) => d.slug)).toContain(slug);
    for (const d of startDays.slice(0, -1)) expect(d.minutes).toBeLessThanOrEqual(10);
  });

  it("never offers a pause shorter than 20 minutes", () => {
    for (const d of startDays) expect(d.task).not.toMatch(/\b(10|15|ten|fifteen)[- ]?min(ute)? (pause|break)/i);
    expect(startDays.find((d) => d.slug === "pause-and-return")!.task).toContain("20 minutes minimum, 24 hours max");
  });
});

describe("About the authors", () => {
  it("credits both authors and never renders a [[placeholder]] bio", () => {
    expect(authors.map((a) => a.name)).toEqual(["David Hamilton", "Dr Zhongming Shi"]);
    for (const a of publishedAuthors()) expect(a.bio.trim().startsWith("[[")).toBe(false);
    expect(publishedAuthors([{ name: "X", role: "", bio: "[[BIO_X]]" }])).toEqual([]);
    expect(publishedAuthors([{ name: "X", role: "", bio: "Real bio." }])).toHaveLength(1);
  });
});

describe("offline precache", () => {
  it("covers every static route and every protocol page", () => {
    const urls = precacheUrls();
    for (const route of ["/", "/about", "/calibrate", "/connect", "/help", "/pause", "/protocols", "/start", "/weekly-reset"]) {
      expect(urls).toContain(route);
    }
    for (const slug of protocolSlugs) expect(urls).toContain(`/protocols/${slug}`);
    expect(urls.some((u) => u.includes("["))).toBe(false);
  });
});
