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

/** Returns an object URL for a Weekly Reset calendar event, one week from now, 40 minutes. */
export function buildWeeklyResetIcs(fromDate = new Date()): { url: string; filename: string } {
  const start = new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + WEEKLY_RESET_MINUTES * 60 * 1000);
  const uid = `alliance-weekly-reset-${start.getTime()}@allianceprotocols.com`;
  const stamp = toIcsDate(new Date());

  const ics = calendar([
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    text("SUMMARY", "Weekly Reset (Alliance Protocols)"),
    text(
      "DESCRIPTION",
      "Scheduled maintenance meeting (about 40 minutes) — appreciation, check the load, one friction point, requests, next steps. Not a fight forum: if either partner is flooded, Pause + Return and reschedule."
    ),
    "RRULE:FREQ=WEEKLY;INTERVAL=1",
    "END:VEVENT",
  ]);
  return toBlobUrl(ics, "alliance-weekly-reset.ics");
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
  const uid = `alliance-start-plan-${start.getTime()}@allianceprotocols.com`;

  const ics = calendar([
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `RRULE:FREQ=DAILY;COUNT=${days}`,
    text("SUMMARY", "Alliance start plan (10 min)"),
    text(
      "DESCRIPTION",
      "Today’s step of the 7-day start plan — open the Field App at /start. Day 7 is your first Weekly Reset (about 40 minutes). If either of you is flooded, Pause + Return first."
    ),
    "END:VEVENT",
  ]);
  return toBlobUrl(ics, "alliance-start-plan.ics");
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
    `UID:${uid}-${start.getTime()}@allianceprotocols.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toFloatingDate(start)}`,
    `DTEND:${toFloatingDate(new Date(start.getTime() + minutes))}`,
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
      "Five parts, about 40 minutes — appreciation, check the load, one friction point, requests, next steps. Not a fight forum: if either partner is flooded, Pause + Return and reschedule."
    ),
    ...event(
      "alliance-keep-going-care-checkin",
      monthly,
      CARE_CHECKIN_RRULE,
      "Monthly Care Check-in (inside the Weekly Reset)",
      "First Weekly Reset of the month: during Check the load, run the monthly Care Check-in (inside the Weekly Reset) — go through each area of care and ask if the load feels fair. Same 40 minutes, not an extra meeting. Open the Field App at /weekly-reset."
    ),
  ]);
}

/** Returns an object URL for the "Keep it going" calendar (weekly Reset + monthly Care Check-in). */
export function buildKeepGoingIcs(time = "19:00", fromDate = new Date()): { url: string; filename: string } {
  return toBlobUrl(keepGoingIcsText(time, fromDate), "alliance-keep-it-going.ics");
}

/**
 * The Pause + Return time as a one-off event with an alarm at the return
 * time — a backstop for phones that silence the in-app chime in the background.
 */
export function pauseReturnIcsText(returnAt: Date, now = new Date()): string {
  const end = new Date(returnAt.getTime() + 5 * 60 * 1000);
  return calendar([
    "BEGIN:VEVENT",
    `UID:alliance-pause-return-${returnAt.getTime()}@allianceprotocols.com`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(returnAt)}`,
    `DTEND:${toIcsDate(end)}`,
    text("SUMMARY", "Return time (Pause + Return)"),
    text(
      "DESCRIPTION",
      "Time to come back, as promised. Restart with warmth, then safety; don’t restart where you left off. If you’re afraid, not just flooded, don’t return — get outside help."
    ),
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    text("DESCRIPTION", "Return time (Pause + Return)"),
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
  ]);
}

export function buildPauseReturnIcs(returnAt: Date, now = new Date()): { url: string; filename: string } {
  return toBlobUrl(pauseReturnIcsText(returnAt, now), "alliance-return-time.ics");
}
