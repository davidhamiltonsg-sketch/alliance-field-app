// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { questions, scoreKeys } from "@/data/calibration/questions";
import type { ChoiceKey, PersonAnswers } from "@/data/calibration/types";
import { getProtocol, protocolSlugs } from "@/data/protocols";
import { KIT } from "@/data/kit";
import {
  CALIBRATION_KEY,
  answeredCount,
  emptyCalibration,
  firstUnansweredIndex,
  generateCoupleReport,
  generateProfile,
  isComplete,
  NO_DIFFERENCE_SUMMARY,
  readCalibration,
  writeCalibration,
} from "@/lib/calibration";

const all = (choice: ChoiceKey): PersonAnswers => Object.fromEntries(questions.map((q) => [q.id, choice]));

/** Expected score for one key when every question is answered `choice` (start 50, add deltas, clamp). */
function expectedScore(key: (typeof scoreKeys)[number], choice: ChoiceKey) {
  const raw = questions.reduce((sum, q) => sum + (q.effects[choice][key] ?? 0), 50);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

beforeEach(() => window.localStorage.clear());

describe("question bank", () => {
  it("has the canonical number of questions with unique ids", () => {
    expect(questions).toHaveLength(KIT.calibrationQuestions);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it("only touches known score keys", () => {
    for (const q of questions) {
      for (const choice of ["a", "b"] as const) {
        for (const key of Object.keys(q.effects[choice])) expect(scoreKeys).toContain(key);
      }
    }
  });
});

describe("progress helpers", () => {
  it("counts answered questions and completeness", () => {
    expect(answeredCount({})).toBe(0);
    expect(isComplete({})).toBe(false);
    const partial = { [questions[0].id]: "a", [questions[1].id]: "b" } as PersonAnswers;
    expect(answeredCount(partial)).toBe(2);
    expect(isComplete(all("a"))).toBe(true);
  });

  it("ignores answers to unknown question ids", () => {
    expect(answeredCount({ nope: "a" })).toBe(0);
  });

  it("finds the first unanswered question, or the last one when complete", () => {
    expect(firstUnansweredIndex({})).toBe(0);
    expect(firstUnansweredIndex({ [questions[0].id]: "a" })).toBe(1);
    expect(firstUnansweredIndex(all("b"))).toBe(questions.length - 1);
  });
});

describe("storage round-trip", () => {
  it("defaults to empty named partners and a non-private A", () => {
    expect(readCalibration()).toEqual(emptyCalibration());
    expect(emptyCalibration().aPrivate).toBe(false);
  });

  it("persists answers, names and the privacy choice", () => {
    const state = { ...emptyCalibration(), aPrivate: true };
    state.personA = { name: "Sam", answers: { q01: "a" } };
    writeCalibration(state);
    const back = readCalibration();
    expect(back.personA).toEqual({ name: "Sam", answers: { q01: "a" } });
    expect(back.aPrivate).toBe(true);
  });

  it("repairs missing fields in older saved data", () => {
    window.localStorage.setItem(CALIBRATION_KEY, JSON.stringify({ personA: { name: "" } }));
    const back = readCalibration();
    expect(back.personA).toEqual({ name: "Partner A", answers: {} });
    expect(back.personB.name).toBe("Partner B");
    expect(back.aPrivate).toBe(false);
  });
});

describe("generateProfile", () => {
  it("scores by summing effects from a 50 baseline and clamping to 0-100", () => {
    for (const choice of ["a", "b"] as const) {
      const profile = generateProfile("A", { name: "Sam", answers: all(choice) });
      for (const key of scoreKeys) {
        expect(profile.scores[key]).toBe(expectedScore(key, choice));
        expect(profile.scores[key]).toBeGreaterThanOrEqual(0);
        expect(profile.scores[key]).toBeLessThanOrEqual(100);
      }
    }
  });

  it("leaves every score at the 50 baseline with no answers", () => {
    const profile = generateProfile("B", { name: "", answers: {} });
    expect(new Set(Object.values(profile.scores))).toEqual(new Set([50]));
    expect(profile.name).toBe("Partner B");
    expect(profile.primaryPattern).toBe("No one pattern stands out yet.");
  });

  it("reports at most five distinct patterns and uses the name in the narrative", () => {
    const profile = generateProfile("A", { name: "  Sam  ", answers: all("a") });
    expect(profile.name).toBe("Sam");
    expect(profile.patterns.length).toBeGreaterThan(0);
    expect(profile.patterns.length).toBeLessThanOrEqual(5);
    expect(new Set(profile.patterns).size).toBe(profile.patterns.length);
    expect(profile.primaryPattern).toBe(profile.patterns[0]);
    expect(profile.likelyMisreads).toHaveLength(3);
    for (const line of [profile.safetyLogic, profile.careStyle, profile.conflictResponse, ...profile.likelyMisreads]) {
      expect(line).toContain("Sam");
    }
  });

  it("reflects the answers: 'space' answers raise privacy, 'closeness' answers raise closeness", () => {
    const closeness = generateProfile("A", { name: "A", answers: all("a") });
    const space = generateProfile("B", { name: "B", answers: all("b") });
    expect(space.scores.privacyNeed).toBeGreaterThan(closeness.scores.privacyNeed);
    expect(closeness.scores.closenessNeed).toBeGreaterThan(space.scores.closenessNeed);
    expect(space.scores.withdrawalUnderStress).toBeGreaterThan(closeness.scores.withdrawalUnderStress);
  });
});

describe("generateCoupleReport", () => {
  it("shows full layer health and no divergence for identical profiles", () => {
    const a = generateProfile("A", { name: "A", answers: all("a") });
    const b = generateProfile("B", { name: "B", answers: all("a") });
    const report = generateCoupleReport(a, b);
    expect(Object.values(report.layerHealth)).toEqual([100, 100, 100, 100, 100]);
    expect(report.coreMismatch).toEqual([
      "No one difference stands out yet. Keep using the tools and come back to this in a few weeks.",
    ]);
  });

  it("drops the “next step” line when no difference stands out, so it never points at nothing (voice pass 21)", () => {
    const a = generateProfile("A", { name: "A", answers: all("a") });
    const b = generateProfile("B", { name: "B", answers: all("a") });
    const report = generateCoupleReport(a, b);
    expect(report.executiveSummary).toBe(NO_DIFFERENCE_SUMMARY);
    expect(report.executiveSummary).toBe("Nothing big stands out. Pick any layer you’d like to talk about (Atmosphere, Structure, Repair, Protection or Insight) and start there.");
    expect(report.executiveSummary).not.toMatch(/next step|turn it into/);
  });

  it("offers the next step only when a difference exists", () => {
    const report = generateCoupleReport(
      generateProfile("A", { name: "Sam", answers: all("a") }),
      generateProfile("B", { name: "Alex", answers: all("b") }),
    );
    expect(report.executiveSummary).toContain("A good next step: turn it into one small agreement");
    expect(report.executiveSummary).not.toContain(NO_DIFFERENCE_SUMMARY);
  });

  it("keeps each profile to one “may” line (voice pass 21)", () => {
    for (const choice of ["a", "b"] as const) {
      const p = generateProfile("A", { name: "Sam", answers: all(choice) });
      const lines = [...p.patterns, p.safetyLogic, p.careStyle, p.conflictResponse, p.privacyAutonomy, ...p.likelyMisreads];
      expect(lines.join(" ").match(/\bmay\b/g)?.length ?? 0, choice).toBeLessThanOrEqual(1);
    }
  });

  it("lowers layer health and names divergences for opposite profiles", () => {
    const a = generateProfile("A", { name: "Sam", answers: all("a") });
    const b = generateProfile("B", { name: "Alex", answers: all("b") });
    const report = generateCoupleReport(a, b);
    expect(Math.min(...Object.values(report.layerHealth))).toBeLessThan(100);
    expect(report.coreMismatch.length).toBeGreaterThan(0);
    expect(report.coreMismatch.length).toBeLessThanOrEqual(4);
    expect(report.misreadRisks.length).toBeLessThanOrEqual(5);
    expect(report.conflictPattern).toMatch(/Sam|Alex|Both of you/);
  });

  it("uses the System Overlay card’s Say This lines, word for word", () => {
    const report = generateCoupleReport(
      generateProfile("A", { name: "A", answers: all("a") }),
      generateProfile("B", { name: "B", answers: all("b") }),
    );
    expect(report.scriptPack).toEqual(getProtocol("system-overlay")!.phrases.map((p) => p.text));
    expect(report.scriptPack.length).toBeGreaterThan(0);
  });

  it("is symmetric in layer health", () => {
    const a = generateProfile("A", { name: "A", answers: all("a") });
    const b = generateProfile("B", { name: "B", answers: all("b") });
    expect(generateCoupleReport(a, b).layerHealth).toEqual(generateCoupleReport(b, a).layerHealth);
  });

  it("only recommends real protocol cards, without duplicates, and brackets the sequence", () => {
    const combos: [ChoiceKey, ChoiceKey][] = [["a", "a"], ["a", "b"], ["b", "a"], ["b", "b"]];
    for (const [ca, cb] of combos) {
      const report = generateCoupleReport(
        generateProfile("A", { name: "A", answers: all(ca) }),
        generateProfile("B", { name: "B", answers: all(cb) }),
      );
      expect(report.recommendedTools.length).toBeGreaterThan(0);
      for (const t of report.recommendedTools) expect(protocolSlugs).toContain(t.slug);
      expect(report.recommendedSequence[0]).toBe("One warm, true sentence");
      expect(report.recommendedSequence.at(-1)).toBe("Look back at the Weekly Reset");
      expect(new Set(report.recommendedSequence).size).toBe(report.recommendedSequence.length);
    }
  });
});
