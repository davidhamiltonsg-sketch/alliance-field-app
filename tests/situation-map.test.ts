import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/data/registry.json";
import { SITUATION_MAP_FOOTER, SITUATION_MAP_RULE, situations } from "@/data/situations";

/**
 * tests/fixtures/situation-map.json is a byte copy of the canonical Situation
 * Map (spec/situation-map.json, the source for the Manual, the Field Kit and
 * this app). Every app row must match it word for word: label, description,
 * row text, primary tool, second tools and order.
 */
type Row = {
  n: number;
  id: string;
  question: string;
  description: string;
  mapNote: string;
  answer: string;
  kitRow: string;
  tools: { name: string; slug: string }[];
};
const map = JSON.parse(readFileSync(join(__dirname, "fixtures/situation-map.json"), "utf8")) as {
  rule: string;
  footer: string;
  rows: Row[];
};

const hrefFor = (slug: string) => (slug === "help" ? "/help" : `/protocols/${slug}`);

describe("Situation Map matches the canonical JSON, row by row", () => {
  it("has the same 12 rows in the same order", () => {
    expect(map.rows).toHaveLength(12);
    expect(situations.map((s) => s.id)).toEqual(map.rows.map((r) => r.id));
    expect(map.rows.map((r) => r.n)).toEqual(map.rows.map((_, i) => i + 1));
  });

  it("has the same rule and footer", () => {
    expect(SITUATION_MAP_RULE).toBe(map.rule);
    expect(SITUATION_MAP_FOOTER).toBe(map.footer);
  });

  for (const row of map.rows) {
    it(`row ${row.n} (${row.id}) is word for word`, () => {
      const s = situations[row.n - 1];
      expect(s.id).toBe(row.id);
      expect(s.label).toBe(row.question);
      expect(s.description).toBe(row.description);
      expect(s.firstMove).toBe(row.answer);
      // The app’s note is the map note’s first sentence (the rest is about the printed page).
      if (s.note) expect(row.mapNote.startsWith(s.note)).toBe(true);
      expect(s.primaryHref).toBe(hrefFor(row.tools[0].slug));
      // Second tools, in order, before any app-only action links (a timer, a route).
      const toolLinks = (s.secondaryHrefs ?? []).filter((l) => l.href.startsWith("/protocols/") || l.href === "/help");
      const expected = row.tools.slice(1).map((t) => ({ label: t.name, href: hrefFor(t.slug) }));
      expect(toolLinks.slice(0, expected.length)).toEqual(expected);
      expect((s.secondaryHrefs ?? []).slice(0, expected.length)).toEqual(expected);
      expect(!!s.danger).toBe(row.n === 1);
    });
  }

  it("the registry rows are the same rows, word for word", () => {
    const rows = registry.concepts["situation-map"].rowsCanonical as {
      id: string;
      label: string;
      description: string;
      route: string;
      answer: string;
      kitRow: string;
      note?: string;
    }[];
    expect(rows).toEqual(
      map.rows.map((r) => ({
        id: r.id,
        label: r.question,
        description: r.description,
        route: r.tools.map((t) => t.name).join(" · "),
        answer: r.answer,
        kitRow: r.kitRow,
        ...(r.mapNote ? { note: r.mapNote } : {}),
      })),
    );
  });
});
