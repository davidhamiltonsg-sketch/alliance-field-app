import { describe, expect, it } from "vitest";
import { protocols } from "@/data/protocols";
import { isSafetyQuery, searchTools } from "@/lib/toolSearch";
import { PLAIN_SUBTITLE, TOOL_ORDER } from "@/components/tierLabels";

const top = (q: string) => searchTools(protocols, q).map((p) => p.slug);

describe("tool search (/protocols)", () => {
  it("finds something sensible for everyday words", () => {
    for (const q of ["money", "stonewalling", "he yells", "sex", "jealous", "hit", "threat", "controls my phone"]) {
      expect(top(q).length, q).toBeGreaterThan(0);
    }
    expect(top("money").slice(0, 3)).toContain("weekly-reset");
    expect(top("stonewalling").slice(0, 3)).toContain("pause-and-return");
    expect(top("he yells").slice(0, 3)).toEqual(expect.arrayContaining(["pause-and-return"]));
    expect(top("jealous")).toContain("trust-recovery");
  });

  it("ranks title and synonym hits above body text", () => {
    expect(top("sex")[0]).toBe("intimacy-pact");
    expect(top("green rule")[0]).toBe("green-rule");
    expect(top("housemates")[0]).toBe("check-up");
  });

  it("pins the Help Lines card for words that may mean fear or control", () => {
    for (const q of ["jealous", "jealousy", "he yells", "yelling", "hit", "hits", "threat", "threaten", "afraid", "scared", "controls my phone", "keeps checking my phone", "forced"]) {
      expect(isSafetyQuery(q), q).toBe(true);
    }
    for (const q of ["money", "sex", "housemates", "white lies", "history"]) expect(isSafetyQuery(q), q).toBe(false);
  });

  it("returns every tool, in card order, for an empty search", () => {
    expect(top("  ")).toEqual(TOOL_ORDER);
  });

  it("gives every tool a plain one-line subtitle", () => {
    for (const p of protocols) expect(PLAIN_SUBTITLE[p.slug], p.slug).toMatch(/^[A-Z].{5,60}$/);
  });
});
