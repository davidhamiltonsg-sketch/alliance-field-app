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
  keepGoingIcsText,
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

  it("starts one week later (UTC) and lasts the canonical 40 minutes", async () => {
    const { lines } = await build(new Date("2026-03-02T09:30:00Z"));
    expect(WEEKLY_RESET_MINUTES).toBe(KIT.weeklyResetMinutes);
    expect(field(lines, "DTSTART")).toBe("20260309T093000Z");
    expect(field(lines, "DTEND")).toBe("20260309T101000Z");
  });

  it("rolls over month and year boundaries", async () => {
    const { lines } = await build(new Date("2026-12-28T23:50:00Z"));
    expect(field(lines, "DTSTART")).toBe("20270104T235000Z");
    expect(field(lines, "DTEND")).toBe("20270105T003000Z");
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
    const start = new Date(2026, 2, 3, 19, 45);
    const iso = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    expect(field(lines, "DTSTART")).toBe(iso(start));
    expect(field(lines, "DTEND")).toBe(iso(new Date(start.getTime() + 10 * 60 * 1000)));
    expect(field(lines, "DESCRIPTION")).toContain("Pause + Return");
  });
});

describe("keep it going (weekly Reset + monthly Care Check-in)", () => {
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

  it("starts at floating local time on the next Sunday and next first Sunday, 40 minutes long", () => {
    // Wednesday 30 September 2026 → Sunday 4 October (also the first Sunday of October).
    const [weekly, monthly] = events(keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0)));
    expect(field(weekly, "DTSTART")).toBe("20261004T190000");
    expect(field(weekly, "DTEND")).toBe("20261004T194000");
    expect(field(monthly, "DTSTART")).toBe("20261004T190000");
    expect(field(monthly, "DTEND")).toBe("20261004T194000");
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

  it("keeps the Care Check-in inside the Weekly Reset, with canonical names", () => {
    const text = keepGoingIcsText("19:00", new Date(2026, 8, 30, 12, 0));
    const [weekly, monthly] = events(text);
    expect(field(weekly, "SUMMARY")).toBe("Weekly Reset (Alliance Protocols)");
    expect(field(monthly, "SUMMARY")).toBe("Monthly Care Check-in (inside the Weekly Reset)");
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
    expect(result.filename).toBe("alliance-return-time.ics");
    const lines = unfold(await captured!.text()).split("\r\n");
    expect(field(lines, "DTSTART")).toBe("20260930T201500Z");
    expect(lines).toContain("BEGIN:VALARM");
    expect(lines).toContain("TRIGGER:PT0M");
    expect(field(lines, "DESCRIPTION")).toContain("get outside help");
  });
});
