import { KIT } from "@/data/kit";

/**
 * Builds downloadable .ics files (RFC 5545): the recurring Weekly Reset, the
 * 7-day start plan reminder, "Keep it going" and the Pause + Return time.
 * Every text value goes through escapeText and every line through foldLine.
 */

/** Escapes a TEXT value: backslash, semicolon, comma and newlines. */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

const utf8 = new TextEncoder();

/**
 * Folds a content line to at most 75 octets per physical line (CRLF + one
 * space before each continuation), never splitting a UTF-8 character.
 */
export function foldLine(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const n = utf8.encode(ch).length;
    if (bytes + n > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
      limit = 74; // the leading space counts towards the 75
    }
    current += ch;
    bytes += n;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** A property whose value is free text (escaped). */
const text = (name: string, value: string) => `${name}:${escapeText(value)}`;

/** Joins raw content lines into a folded CRLF calendar body. */
function calendar(lines: string[]): string {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ALLIANCE PROTOCOLS//Field App//EN", ...lines, "END:VCALENDAR"]
    .map(foldLine)
    .join("\r\n");
}

function toBlobUrl(ics: string, filename: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  return { url: URL.createObjectURL(blob), filename };
}

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

/** Local wall-clock "floating" time (no Z, no TZID): the event stays at 7pm wherever the user is, across DST changes. */
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

/** Adds minutes on the local clock (so a 40-minute event ends 40 wall-clock minutes later). */
function addLocalMinutes(d: Date, minutes: number) {
  const e = new Date(d);
  e.setMinutes(e.getMinutes() + minutes);
  return e;
}

/** True for a 24-hour "HH:MM" time, as <input type="time"> gives it. Empty is not a time. */
export function isValidTime(time: string): boolean {
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  return !!m && Number(m[1]) <= 23 && Number(m[2]) <= 59;
}

function parseTime(time: string) {
  if (!isValidTime(time)) throw new Error(`Not a valid time: "${time}"`);
  const [h, m] = time.split(":").map(Number);
  return { h, m };
}

/**
 * The Weekly Reset as a recurring event: same local time, 7 calendar days
 * from `fromDate` (not 7 × 24 hours, which drifts by an hour across a DST
 * change), 40 minutes, at a floating local time so it stays put.
 */
export function weeklyResetIcsText(fromDate = new Date()): string {
  const start = new Date(fromDate);
  start.setSeconds(0, 0);
  start.setDate(start.getDate() + 7);
  const end = addLocalMinutes(start, WEEKLY_RESET_MINUTES);
  return calendar([
    "BEGIN:VEVENT",
    `UID:alliance-weekly-reset-${toFloatingDate(start)}@allianceprotocols.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toFloatingDate(start)}`,
    `DTEND:${toFloatingDate(end)}`,
    text("SUMMARY", "Weekly Reset (Alliance Protocols)"),
    text(
      "DESCRIPTION",
      "Your weekly check-in (about 40 minutes): appreciation, check the load, one friction point, requests, next steps. Not the place to have the fight: if either of you is flooded, Pause + Return and pick another time."
    ),
    "RRULE:FREQ=WEEKLY;INTERVAL=1",
    "END:VEVENT",
  ]);
}

/** Returns an object URL for the Weekly Reset calendar event (see weeklyResetIcsText). */
export function buildWeeklyResetIcs(fromDate = new Date()): { url: string; filename: string } {
  return toBlobUrl(weeklyResetIcsText(fromDate), "alliance-weekly-reset.ics");
}

/**
 * A daily 10-minute reminder for the 7-day start plan, at the given local
 * time ("HH:MM", floating, so every day is at that clock time even across a
 * DST change), starting tomorrow. Throws on an empty or invalid time.
 */
export function startPlanIcsText(time = "20:00", fromDate = new Date(), days = 7): string {
  const { h, m } = parseTime(time);
  const start = new Date(fromDate);
  start.setDate(start.getDate() + 1);
  start.setHours(h, m, 0, 0);
  const end = addLocalMinutes(start, 10);
  return calendar([
    "BEGIN:VEVENT",
    `UID:alliance-start-plan-${toFloatingDate(start)}@allianceprotocols.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toFloatingDate(start)}`,
    `DTEND:${toFloatingDate(end)}`,
    `RRULE:FREQ=DAILY;COUNT=${days}`,
    // Neutral title: it shows on lock screens and in shared calendars.
    text("SUMMARY", "Reminder (10 min)"),
    text(
      "DESCRIPTION",
      "Today’s step of the 7-day plan — open the Field App at /start. Day 7 is your first Weekly Reset (about 40 minutes). If either of you is flooded, Pause + Return first."
    ),
    "END:VEVENT",
  ]);
}

export function buildStartPlanIcs(time = "20:00", fromDate = new Date(), days = 7): { url: string; filename: string } {
  return toBlobUrl(startPlanIcsText(time, fromDate, days), "alliance-start-plan.ics");
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
 * monthly reminder to add the monthly part to the first Weekly Reset of the
 * month (10 more minutes, not a separate meeting).
 */
export function keepGoingIcsText(time = "19:00", fromDate = new Date()): string {
  const weekly = nextSundayAt(fromDate, time);
  const monthly = nextFirstSundayAt(fromDate, time);
  const stamp = toIcsDate(new Date());

  const event = (uid: string, start: Date, rrule: string, summary: string, description: string, minutes: number = WEEKLY_RESET_MINUTES) => [
    "BEGIN:VEVENT",
    `UID:${uid}-${start.getTime()}@allianceprotocols.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toFloatingDate(start)}`,
    `DTEND:${toFloatingDate(addLocalMinutes(start, minutes))}`,
    `RRULE:${rrule}`,
    text("SUMMARY", summary),
    text("DESCRIPTION", description),
    "END:VEVENT",
  ];

  return calendar([
    ...event(
      "alliance-keep-going-weekly-reset",
      weekly,
      WEEKLY_RESET_RRULE,
      "Weekly Reset (Alliance Protocols)",
      "Five parts, about 40 minutes: appreciation, check the load, one friction point, requests, next steps. Not the place to have the fight: if either of you is flooded, Pause + Return and pick another time."
    ),
    ...event(
      "alliance-keep-going-care-checkin",
      monthly,
      CARE_CHECKIN_RRULE,
      "Monthly part of your Weekly Reset",
      "First Weekly Reset of the month: the monthly part of your Weekly Reset adds 10 minutes. Look back over the whole month, area by area, and ask if the load felt fair. It is part of the same meeting, not an extra meeting. Open the Field App at /weekly-reset.",
      WEEKLY_RESET_MINUTES + 10
    ),
  ]);
}

/** Returns an object URL for the "Keep it going" calendar (Weekly Reset + the monthly part). */
export function buildKeepGoingIcs(time = "19:00", fromDate = new Date()): { url: string; filename: string } {
  return toBlobUrl(keepGoingIcsText(time, fromDate), "alliance-keep-it-going.ics");
}

/** Title and alarm text for the return-time event. */
export const PAUSE_REMINDER_TITLE = "Reminder";

/**
 * The Pause + Return time as a one-off event with an alarm at the return
 * time — a backstop for phones that silence the in-app chime in the background.
 * Everything in it is neutral (no tool names, no reason): the title shows on
 * lock screens, and a shared calendar shows the whole event to others.
 */
export function pauseReturnIcsText(returnAt: Date, now = new Date()): string {
  const end = new Date(returnAt.getTime() + 5 * 60 * 1000);
  return calendar([
    "BEGIN:VEVENT",
    `UID:reminder-${returnAt.getTime()}@allianceprotocols.com`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(returnAt)}`,
    `DTEND:${toIcsDate(end)}`,
    text("SUMMARY", PAUSE_REMINDER_TITLE),
    text("DESCRIPTION", "The time you set."),
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    text("DESCRIPTION", PAUSE_REMINDER_TITLE),
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
  ]);
}

export function buildPauseReturnIcs(returnAt: Date, now = new Date()): { url: string; filename: string } {
  return toBlobUrl(pauseReturnIcsText(returnAt, now), "reminder.ics");
}
