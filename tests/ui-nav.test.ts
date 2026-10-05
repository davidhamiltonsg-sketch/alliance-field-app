import { describe, expect, it } from "vitest";
import { navItems } from "@/data/nav";
import { TIER_LABEL, SEARCH_HINTS } from "@/components/tierLabels";
import { splashBootScript } from "@/components/splash/boot";
import manifest from "../public/manifest.json";
import { currentStartDay } from "@/components/StartPlan";

describe("UI shell", () => {
  it("has five tabs: Now, Tools, Pause, Week, Together", () => {
    expect(navItems.map((n) => n.label)).toEqual(["Now", "Tools", "Pause", "Week", "Together"]);
  });
  it("uses the three plain-word tier labels", () => {
    expect(Object.values(TIER_LABEL)).toEqual(["Learn first", "When it comes up", "Build over time"]);
  });
  it("maps plain words to tools", () => {
    expect(SEARCH_HINTS["check-up"]).toContain("housemates");
    expect(SEARCH_HINTS["trust-recovery"]).toContain("lied");
    expect(SEARCH_HINTS["consistency-pact"]).toContain("jealous");
  });
  it("never redirects a first visit to /intro", () => {
    expect(splashBootScript).not.toContain("/intro");
  });
  it("manifest shortcuts are Pause, Help, Now", () => {
    expect(manifest.shortcuts.map((s) => s.url)).toEqual(["/pause", "/help", "/"]);
  });
  it("/start opens only the current day: Day 1 for someone new, else the first day not ticked", () => {
    expect(currentStartDay([])).toBe(1);
    expect(currentStartDay([1, 2])).toBe(3);
    expect(currentStartDay([2, 3])).toBe(1);
    expect(currentStartDay([1, 2, 3, 4, 5, 6, 7])).toBe(7);
  });
});
