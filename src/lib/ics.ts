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
    "PRODID:-//ALLIANCE PROTOCOLS//Field App//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    "SUMMARY:Weekly Reset (Alliance Protocols)",
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
    "PRODID:-//ALLIANCE PROTOCOLS//Field App//EN",
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

/** Local wall-clock "floating" time (no Z, no TZID): the event stays at 7pm wherever the user is. */
function toFloatingDate(d: Date) {
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    "00"
  );
}

function parseTime(time: string) {
  const [h, m] = time.split(":").map((n) => Number(n));
  return { h: Number.isFinite(h) ? h : 19, m: Number.isFinite(m) ? m : 0 };
}

/** The next Sunday at the given local time, strictly after `from`. */
export function nextSundayAt(from: Date, time = "19:00") {
  const { h, m } = parseTime(time);
  const d = new Date(from);
  d.setHours(h, m, 0, 0);
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  if (d <= from) d.setDate(d.getDate() + 7);
  return d;
}

/** The next first-Sunday-of-the-month at the given local time, strictly after `from`. */
export function nextFirstSundayAt(from: Date, time = "19:00") {
  const { h, m } = parseTime(time);
  for (let offset = 0; offset < 3; offset++) {
    const d = new Date(from.getFullYear(), from.getMonth() + offset, 1, h, m, 0, 0);
    d.setDate(1 + ((7 - d.getDay()) % 7));
    if (d > from) return d;
  }
  throw new Error("unreachable: a first Sunday always falls within the next two months");
}

/** Monthly rule: the first Sunday of every month (matches nextFirstSundayAt). */
export const CARE_CHECKIN_RRULE = "FREQ=MONTHLY;BYDAY=1SU";
/** Weekly rule for the ongoing Weekly Reset: every Sunday. */
export const WEEKLY_RESET_RRULE = "FREQ=WEEKLY;BYDAY=SU";

/**
 * The "Keep it going" calendar as text: two recurring events at a floating
 * local time (default Sunday 7pm) — the Weekly Reset every Sunday, and a
 * monthly reminder to run the Care Check-in inside the first Weekly Reset of
 * the month (not a separate meeting).
 */
export function keepGoingIcsText(time = "19:00", fromDate = new Date()): string {
  const weekly = nextSundayAt(fromDate, time);
  const monthly = nextFirstSundayAt(fromDate, time);
  const stamp = toIcsDate(new Date());
  const minutes = WEEKLY_RESET_MINUTES * 60 * 1000;

  const event = (uid: string, start: Date, rrule: string, summary: string, description: string) => [
    "BEGIN:VEVENT",
    `UID:${uid}-${start.getTime()}@alliance-field-app`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toFloatingDate(start)}`,
    `DTEND:${toFloatingDate(new Date(start.getTime() + minutes))}`,
    `RRULE:${rrule}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
  ];

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ALLIANCE PROTOCOLS//Field App//EN",
    ...event(
      "alliance-keep-going-weekly-reset",
      weekly,
      WEEKLY_RESET_RRULE,
      "Weekly Reset (Alliance Protocols)",
      "Five parts\\, about 40 minutes — appreciation\\, check the load\\, one friction point\\, requests\\, next steps. Not a fight forum: if either partner is flooded\\, Pause + Return and reschedule."
    ),
    ...event(
      "alliance-keep-going-care-checkin",
      monthly,
      CARE_CHECKIN_RRULE,
      "Care Check-in inside your Weekly Reset",
      "First Weekly Reset of the month: during Check the load\\, run the Care Check-in — go through each area of care and ask if the load feels fair. Same 40 minutes\\, not an extra meeting. Open the Field App at /weekly-reset."
    ),
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Returns an object URL for the "Keep it going" calendar (weekly Reset + monthly Care Check-in). */
export function buildKeepGoingIcs(time = "19:00", fromDate = new Date()): { url: string; filename: string } {
  const blob = new Blob([keepGoingIcsText(time, fromDate)], { type: "text/calendar;charset=utf-8" });
  return { url: URL.createObjectURL(blob), filename: "alliance-keep-it-going.ics" };
}
