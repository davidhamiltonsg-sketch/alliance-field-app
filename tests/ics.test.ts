import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KIT } from "@/data/kit";
import {
  CARE_CHECKIN_RRULE,
  WEEKLY_RESET_MINUTES,
  WEEKLY_RESET_RRULE,
  buildKeepGoingIcs,
  buildStartPlanIcs,
  buildPauseReturnIcs,
  buildWeeklyResetIcs,
  escapeText,
  foldLine,
  isValidTime,
  keepGoingIcsText,
  startPlanIcsText,
  weeklyResetIcsText,
  pauseReturnIcsText,
  nextFirstSundayAt,
  nextSundayAt,
} from "@/lib/ics";

let captured: Blob | null = null;

/** RFC 5545 unfolding: a CRLF followed by one space joins the lines. */
const unfold = (text: string) => text.replace(/\r\n /g, "");

beforeEach(() => {
  captured = null;
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    captured = blob as Blob;
    return "blob:test";
  });
});
afterEach(() => vi.restoreAllMocks());

async function build(from: Date) {
  const result = buildWeeklyResetIcs(from);
  const text = await captured!.text();
  return { result, text, lines: unfold(text).split("\r\n") };
}

const field = (lines: string[], name: string) => lines.find((l) => l.startsWith(`${name}:`))?.slice(name.length + 1);

describe("buildWeeklyResetIcs", () => {
  it("returns an object URL and a stable filename", async () => {
    const { result } = await build(new Date("2026-03-02T09:30:00Z"));
    expect(result).toEqual({ url: "blob:test", filename: "alliance-weekly-reset.ics" });
    expect(captured!.type).toBe("text/calendar;charset=utf-8");
  });

  it("is a CRLF VCALENDAR with one weekly VEVENT", async () => {
    const { text, lines } = await build(new Date("2026-03-02T09:30:00Z"));
    expect(text).not.toMatch(/[^\r]\n/);
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines.at(-1)).toBe("END:VCALENDAR");
    expect(lines.filter((l) => l === "BEGIN:VEVENT")).toHaveLength(1);
    expect(field(lines, "RRULE")).toBe("FREQ=WEEKLY;INTERVAL=1");
  });

  it("starts 7 calendar days later at the same local (floating) time and lasts the canonical 40 minutes", async () => {
    const { lines } = await build(new Date(2026, 2, 2, 9, 30, 41));
    expect(WEEKLY_RESET_MINUTES).toBe(KIT.weeklyResetMinutes);
    expect(field(lines, "DTSTART")).toBe("20260309T093000");
    expect(field(lines, "DTEND")).toBe("20260309T101000");
  });

  it("rolls over month and year boundaries", async () => {
    const { lines } = await build(new Date(2026, 11, 28, 23, 50));
    expect(field(lines, "DTSTART")).toBe("20270104T235000");
    expect(field(lines, "DTEND")).toBe("20270105T003000");
  });

  it("describes the canonical agenda and the flooding rule", async () => {
    const { lines } = await build(new Date("2026-03-02T09:30:00Z"));
    const description = field(lines, "DESCRIPTION")!;
    expect(description).toContain("check the load");
    expect(description).toContain("Pause + Return");
    expect(description).not.toMatch(/care audit/i);
  });
});

describe("buildStartPlanIcs", () => {
  it("is a daily, seven-occurrence, 10-minute reminder starting tomorrow at the chosen local time", async () => {
    const from = new Date(2026, 2, 2, 9, 30);
    const result = buildStartPlanIcs("19:45", from);
    expect(result.filename).toBe("alliance-start-plan.ics");
    const lines = unfold(await captured!.text()).split("\r\n");
    expect(field(lines, "RRULE")).toBe("FREQ=DAILY;COUNT=7");
    expect(field(lines, "DTSTART")).toBe("20260303T194500");
    expect(field(lines, "DTEND")).toBe("20260303T195500");
    expect(field(lines, "DESCRIPTION")).toContain("Pause + Return");
    expect(field(lines, "SUMMARY")).toBe("Reminder (10 min)");
  });

  it("refuses an empty or invalid time instead of silently using midnight (L9)", () => {
    expect(isValidTime("19:45")).toBe(true);
    for (const bad of ["", "7pm", "24:00", "19:60", "1:05"]) expect(isValidTime(bad), bad).toBe(false);
    expect(() => buildStartPlanIcs("")).toThrow(/valid time/);
    expect(() => keepGoingIcsText("")).toThrow(/valid time/);
  });
});

describe("keep it going (Weekly Reset + the monthly part)", () => {
  const events = (text: string) =>
    unfold(text)
      .split("BEGIN:VEVENT")
      .slice(1)
      .map((chunk) => chunk.split("END:VEVENT")[0].split("\r\n").filter(Boolean));

  it("uses a weekly Sunday rule and a first-Sunday-of-the-month rule", () => {
    expect(WEEKLY_RESET_RRULE).toBe("FREQ=WEEKLY;BYDAY=SU");
    expect(CARE_CHECKIN_RRULE).toBe("FREQ=MONTHLY;BYDAY=1SU");
    const [weekly, monthly] = events(keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0)));
    expect(field(weekly, "RRULE")).toBe("FREQ=WEEKLY;BYDAY=SU");
    expect(field(monthly, "RRULE")).toBe("FREQ=MONTHLY;BYDAY=1SU");
  });

  it("is one CRLF calendar with exactly two events", () => {
    const text = keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0));
    expect(text).not.toMatch(/[^\r]\n/);
    const lines = unfold(text).split("\r\n");
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines.at(-1)).toBe("END:VCALENDAR");
    expect(events(text)).toHaveLength(2);
  });

  it("starts at floating local time on the next Sunday and next first Sunday: 40 minutes weekly, 50 on the monthly part (+10 minutes)", () => {
    // Wednesday 30 September 2026 → Sunday 4 October (also the first Sunday of October).
    const [weekly, monthly] = events(keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0)));
    expect(field(weekly, "DTSTART")).toBe("20261004T190000");
    expect(field(weekly, "DTEND")).toBe("20261004T194000");
    expect(field(monthly, "DTSTART")).toBe("20261004T190000");
    expect(field(monthly, "DTEND")).toBe("20261004T195000");
    for (const e of [weekly, monthly]) expect(field(e, "DTSTART")).not.toMatch(/Z$/);
  });

  it("honours the chosen time and rolls past a first Sunday that has already gone", () => {
    // Monday 5 October 2026: next Sunday is the 11th; next first Sunday is 1 November.
    const [weekly, monthly] = events(keepGoingIcsText("18:30", new Date(2026, 9, 5, 9, 0)));
    expect(field(weekly, "DTSTART")).toBe("20261011T183000");
    expect(field(monthly, "DTSTART")).toBe("20261101T183000");
  });

  it("skips today when the Sunday slot has already passed, and crosses year ends", () => {
    expect(nextSundayAt(new Date(2026, 9, 4, 20, 0), "19:00")).toEqual(new Date(2026, 9, 11, 19, 0));
    expect(nextSundayAt(new Date(2026, 9, 4, 18, 0), "19:00")).toEqual(new Date(2026, 9, 4, 19, 0));
    expect(nextFirstSundayAt(new Date(2026, 11, 6, 20, 0), "19:00")).toEqual(new Date(2027, 0, 3, 19, 0));
  });

  it("keeps the monthly part inside the Weekly Reset, with canonical names", () => {
    const text = keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0));
    const [weekly, monthly] = events(text);
    expect(field(weekly, "SUMMARY")).toBe("Weekly Reset (Alliance Protocols)");
    expect(field(monthly, "SUMMARY")).toBe("Monthly part of your Weekly Reset");
    expect(field(monthly, "DESCRIPTION")).toContain("the monthly part of your Weekly Reset adds 10 minutes");
    expect(field(monthly, "DESCRIPTION")).toContain("not an extra meeting");
    expect(field(weekly, "DESCRIPTION")).toContain("Pause + Return");
    expect(text).not.toMatch(/care audit/i);
    expect(new Set(events(text).map((e) => field(e, "UID"))).size).toBe(2);
  });

  it("returns an object URL and a stable filename", async () => {
    const result = buildKeepGoingIcs("19:00", new Date(2026, 8, 30, 12, 0));
    expect(result).toEqual({ url: "blob:test", filename: "alliance-keep-it-going.ics" });
    expect(captured!.type).toBe("text/calendar;charset=utf-8");
    expect(await captured!.text()).toContain("RRULE:FREQ=MONTHLY;BYDAY=1SU");
  });
});

describe("escaping and folding (shared by every calendar)", () => {
  it("escapes backslash, semicolon, comma and newlines", () => {
    expect(escapeText("a\\b;c,d\ne\r\nf")).toBe("a\\\\b\\;c\\,d\\ne\\nf");
    expect(escapeText("plain")).toBe("plain");
  });

  it("folds at 75 octets without splitting UTF-8 characters", () => {
    const long = "DESCRIPTION:" + "é—".repeat(60);
    const folded = foldLine(long);
    const physical = folded.split("\r\n");
    expect(physical.length).toBeGreaterThan(1);
    const enc = new TextEncoder();
    for (const line of physical) expect(enc.encode(line).length).toBeLessThanOrEqual(75);
    for (const line of physical.slice(1)) expect(line.startsWith(" ")).toBe(true);
    expect(unfold(folded)).toBe(long);
    expect(foldLine("SHORT:x")).toBe("SHORT:x");
  });

  it("every generated calendar has lines of at most 75 octets and escaped text", async () => {
    const enc = new TextEncoder();
    const texts = [
      keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0)),
      pauseReturnIcsText(new Date("2026-09-30T20:00:00Z"), new Date("2026-09-30T19:00:00Z")),
    ];
    buildWeeklyResetIcs(new Date("2026-03-02T09:30:00Z"));
    texts.push(await captured!.text());
    buildStartPlanIcs("19:45", new Date(2026, 2, 2, 9, 30));
    texts.push(await captured!.text());
    for (const text of texts) {
      for (const line of text.split("\r\n")) expect(enc.encode(line).length).toBeLessThanOrEqual(75);
      for (const line of unfold(text).split("\r\n").filter((l) => /^(SUMMARY|DESCRIPTION):/.test(l))) {
        expect(line.slice(line.indexOf(":") + 1)).not.toMatch(/(^|[^\\])[,;]/);
      }
    }
  });
});

describe("pause return time", () => {
  it("is one event at the return time with an alarm", async () => {
    const at = new Date("2026-09-30T20:15:00Z");
    const result = buildPauseReturnIcs(at, new Date("2026-09-30T19:00:00Z"));
    expect(result.filename).toBe("reminder.ics");
    const lines = unfold(await captured!.text()).split("\r\n");
    expect(field(lines, "DTSTART")).toBe("20260930T201500Z");
    expect(lines).toContain("BEGIN:VALARM");
    expect(lines).toContain("TRIGGER:PT0M");
  });

  it("is neutral: titled “Reminder”, alarm too, with no tool names or reasons (lock screens, shared calendars)", async () => {
    const text = unfold(pauseReturnIcsText(new Date("2026-09-30T20:15:00Z"), new Date("2026-09-30T19:00:00Z")));
    const ls = text.split("\r\n");
    expect(field(ls, "SUMMARY")).toBe("Reminder");
    expect(ls.filter((l) => l.startsWith("DESCRIPTION:")).at(-1)).toBe("DESCRIPTION:Reminder");
    const shown = ls.filter((l) => /^(SUMMARY|DESCRIPTION|LOCATION):/.test(l)).join("\n");
    expect(shown).not.toMatch(/Pause|Return|Alliance|afraid|flooded|help|fight/i);
  });
});

/**
 * DST (M5): calendar events are written as floating local times, so they stay
 * at the chosen clock time across a daylight-saving change, and "next week"
 * is 7 calendar days, not 7 × 24 hours.
 */
describe("daylight saving time", () => {
  const originalTZ = process.env.TZ;
  afterEach(() => {
    process.env.TZ = originalTZ;
  });
  const lines = (text: string) => unfold(text).split("\r\n");
  const all = (ls: string[], name: string) => ls.filter((l) => l.startsWith(`${name}:`)).map((l) => l.slice(name.length + 1));

  it("Europe/London, clocks go back on 25 Oct 2026: the Weekly Reset stays at 7pm", () => {
    process.env.TZ = "Europe/London";
    const from = new Date(2026, 9, 20, 19, 0); // Tue 20 Oct, 19:00 BST
    expect(from.getTimezoneOffset()).toBe(-60);
    expect(new Date(2026, 9, 27, 19, 0).getTimezoneOffset()).toBe(0); // GMT by then
    const ls = lines(weeklyResetIcsText(from));
    expect(field(ls, "DTSTART")).toBe("20261027T190000");
    expect(field(ls, "DTEND")).toBe("20261027T194000");
    // No UTC instant that would show as 6pm or 8pm after the change.
    expect(field(ls, "DTSTART")).not.toMatch(/Z$/);
  });

  it("Europe/London: the 7-day plan reminder is 8pm every day through 25 Oct", () => {
    process.env.TZ = "Europe/London";
    const ls = lines(startPlanIcsText("20:00", new Date(2026, 9, 22, 12, 0)));
    expect(field(ls, "DTSTART")).toBe("20261023T200000");
    expect(field(ls, "RRULE")).toBe("FREQ=DAILY;COUNT=7");
  });

  it("America/New_York, clocks go back on 1 Nov 2026: next week is 7 calendar days", () => {
    process.env.TZ = "America/New_York";
    const from = new Date(2026, 9, 28, 19, 30); // Wed 28 Oct, 19:30 EDT
    expect(from.getTimezoneOffset()).toBe(240);
    const ls = lines(weeklyResetIcsText(from));
    expect(field(ls, "DTSTART")).toBe("20261104T193000");
    expect(field(ls, "DTEND")).toBe("20261104T201000");
  });

  it("America/New_York: Keep it going lands on Sunday 1 Nov at 7pm, the day the clocks change", () => {
    process.env.TZ = "America/New_York";
    const ls = lines(keepGoingIcsText("19:00", new Date(2026, 9, 30, 12, 0)));
    expect(all(ls, "DTSTART")).toEqual(["20261101T190000", "20261101T190000"]);
    expect(all(ls, "DTEND")).toEqual(["20261101T194000", "20261101T195000"]);
  });

  it("America/New_York: the 7-day plan starting 31 Oct stays at 9pm", () => {
    process.env.TZ = "America/New_York";
    const ls = lines(startPlanIcsText("21:00", new Date(2026, 9, 30, 8, 0)));
    expect(field(ls, "DTSTART")).toBe("20261031T210000");
    expect(field(ls, "DTEND")).toBe("20261031T211000");
  });
});
