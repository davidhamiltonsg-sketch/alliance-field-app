import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KIT } from "@/data/kit";
import { WEEKLY_RESET_MINUTES, buildStartPlanIcs, buildWeeklyResetIcs } from "@/lib/ics";

let captured: Blob | null = null;

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
  return { result, text, lines: text.split("\r\n") };
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
    const lines = (await captured!.text()).split("\r\n");
    expect(field(lines, "RRULE")).toBe("FREQ=DAILY;COUNT=7");
    const start = new Date(2026, 2, 3, 19, 45);
    const iso = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    expect(field(lines, "DTSTART")).toBe(iso(start));
    expect(field(lines, "DTEND")).toBe(iso(new Date(start.getTime() + 10 * 60 * 1000)));
    expect(field(lines, "DESCRIPTION")).toContain("Pause + Return");
  });
});
