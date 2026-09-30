import { describe, expect, it } from "vitest";
import { spokenMinutes, timerAnnouncement } from "@/lib/timer";

const MIN = 60 * 1000;
const say = (remainingMs: number, totalMs = 20 * MIN, expired = false) =>
  timerAnnouncement({ remainingMs, totalMs, expired, returnLabel: "8:30" });

describe("timerAnnouncement", () => {
  it("announces the start until the first 5-minute milestone", () => {
    expect(say(20 * MIN)).toBe("Pause started. Ready at 8:30.");
    expect(say(15 * MIN + 1)).toBe("Pause started. Ready at 8:30.");
  });

  it("changes only at 5-minute milestones, not every second", () => {
    expect(say(15 * MIN)).toBe("15 minutes left. Ready at 8:30.");
    expect(say(14 * MIN + 59_000)).toBe(say(10 * MIN + 1));
    expect(say(10 * MIN)).toBe("10 minutes left. Ready at 8:30.");
    expect(say(1)).toBe("5 minutes left. Ready at 8:30.");
    const distinct = new Set(Array.from({ length: 20 * 60 }, (_, s) => say((20 * 60 - s) * 1000)));
    expect(distinct.size).toBe(4); // start, 15, 10, 5
  });

  it("announces expiry", () => {
    expect(say(0, 20 * MIN, true)).toBe("Return time reached. Reconnect now.");
  });

  it("speaks hours and minutes for long pauses", () => {
    expect(say(23 * 60 * MIN, 24 * 60 * MIN)).toBe("23 hours left. Ready at 8:30.");
    expect(spokenMinutes(65)).toBe("1 hour 5 minutes");
    expect(spokenMinutes(0)).toBe("less than a minute");
  });
});
