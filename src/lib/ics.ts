import { KIT } from "@/data/kit";

/** Builds downloadable .ics files: the recurring Weekly Reset and the 7-day start plan reminder. */
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsDate(d: Date) {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    "00Z"
  );
}

/** Canonical Weekly Reset length (Manual/Kit): five parts, about 40 minutes. */
export const WEEKLY_RESET_MINUTES = KIT.weeklyResetMinutes;

/** Returns an object URL for a Weekly Reset calendar event, one week from now, 40 minutes. */
export function buildWeeklyResetIcs(fromDate = new Date()): { url: string; filename: string } {
  const start = new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + WEEKLY_RESET_MINUTES * 60 * 1000);
  const uid = `alliance-weekly-reset-${start.getTime()}@alliance-field-app`;
  const stamp = toIcsDate(new Date());

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//THE ALLIANCE//Field App//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    "SUMMARY:Weekly Reset (The Alliance)",
    "DESCRIPTION:Scheduled maintenance meeting (about 40 minutes) — appreciation, check the load, one friction point, requests, next steps. Not a fight forum: if either partner is flooded, Pause + Return and reschedule.",
    "RRULE:FREQ=WEEKLY;INTERVAL=1",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  return { url: URL.createObjectURL(blob), filename: "alliance-weekly-reset.ics" };
}

/**
 * Returns an object URL for a daily 10-minute reminder for the 7-day start
 * plan, at the given local time ("HH:MM"), starting tomorrow.
 */
export function buildStartPlanIcs(
  time = "20:00",
  fromDate = new Date(),
  days = 7
): { url: string; filename: string } {
  const [h, m] = time.split(":").map((n) => Number(n));
  const start = new Date(fromDate);
  start.setDate(start.getDate() + 1);
  start.setHours(Number.isFinite(h) ? h : 20, Number.isFinite(m) ? m : 0, 0, 0);
  const end = new Date(start.getTime() + 10 * 60 * 1000);
  const uid = `alliance-start-plan-${start.getTime()}@alliance-field-app`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//THE ALLIANCE//Field App//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `RRULE:FREQ=DAILY;COUNT=${days}`,
    "SUMMARY:Alliance start plan (10 min)",
    "DESCRIPTION:Today's step of the 7-day start plan — open the Field App at /start. Day 7 is your first Weekly Reset (about 40 minutes). If either of you is flooded, Pause + Return first.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  return { url: URL.createObjectURL(blob), filename: "alliance-start-plan.ics" };
}
