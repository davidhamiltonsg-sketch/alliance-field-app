import { KIT } from "@/data/kit";

/** Pause + Return timer helpers (no React), shared by PauseTimer and tests. */

/** Screen-reader milestones: at most one announcement every 5 minutes. */
export const ANNOUNCE_EVERY_MIN = 5;

export function spokenMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  const hs = h ? `${h} hour${h === 1 ? "" : "s"}` : "";
  const ms = m ? `${m} minute${m === 1 ? "" : "s"}` : "";
  return [hs, ms].filter(Boolean).join(" ") || "less than a minute";
}

/**
 * What the screen-reader live region says. Derived from the countdown, but
 * it only changes at the start, at each 5-minute milestone, and at expiry —
 * never every second.
 */
export function timerAnnouncement({
  remainingMs,
  totalMs,
  expired,
  returnLabel,
}: {
  remainingMs: number;
  totalMs?: number;
  expired: boolean;
  returnLabel: string;
}) {
  if (expired) return "Return time reached. Reconnect now.";
  const step = ANNOUNCE_EVERY_MIN * 60 * 1000;
  const bucket = Math.ceil(remainingMs / step);
  const startBucket = totalMs ? Math.ceil(totalMs / step) : bucket;
  if (bucket >= startBucket) {
    return `Pause started. Ready at ${returnLabel}.`;
  }
  return `${spokenMinutes(bucket * ANNOUNCE_EVERY_MIN)} left. Ready at ${returnLabel}.`;
}

// ---------------------------------------------------------------------------
// Validation for starting a pause and for a pause read back from storage.
// ---------------------------------------------------------------------------


const MINUTE = 60 * 1000;
export const PAUSE_MIN_MINUTES = KIT.pauseMinMinutes;
export const PAUSE_MAX_MINUTES = KIT.pauseMaxMinutes;
/** A finished pause is forgotten (without an alarm) once it ended this long ago. */
export const STALE_AFTER_MS = 24 * 60 * MINUTE;
/** Slack for clock changes between saving a pause and reading it back. */
const SLACK_MS = MINUTE;

export type Checked<T> = ({ ok: true } & T) | { ok: false; error: string };

/** "Custom minutes": a whole number from 20 to 1440. Decimals, exponents and signs are refused. */
export function parseCustomMinutes(input: string): Checked<{ minutes: number }> {
  const t = input.trim();
  if (!/^\d+$/.test(t)) return { ok: false, error: "Enter a whole number of minutes, 20 to 1440." };
  const minutes = Number(t);
  if (minutes < PAUSE_MIN_MINUTES) {
    return { ok: false, error: "A pause needs at least 20 minutes to calm down. Pick 20 or more." };
  }
  if (minutes > PAUSE_MAX_MINUTES) {
    return { ok: false, error: "24 hours (1440 minutes) is the maximum. Pick a shorter pause." };
  }
  return { ok: true, minutes };
}

/**
 * "Return at a clock time": the next time the clock shows HH:MM (tomorrow if
 * that time has passed today, so 00:15 chosen at 23:50 is 25 minutes away),
 * which must be 20 minutes to 24 hours from now.
 */
export function clockReturnTarget(hhmm: string, now: Date): Checked<{ target: Date }> {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return { ok: false, error: "Choose a clock time first." };
  const target = new Date(now);
  target.setHours(Number(m[1]), Number(m[2]), 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  const delta = target.getTime() - now.getTime();
  if (delta < PAUSE_MIN_MINUTES * MINUTE) return { ok: false, error: "That’s less than 20 minutes away — pick a later time." };
  if (delta > PAUSE_MAX_MINUTES * MINUTE) return { ok: false, error: "That’s more than 24 hours away — pick a sooner time." };
  return { ok: true, target };
}

export type SavedPauseCheck =
  | { state: "none" }
  | { state: "active"; returnAt: string; startedAt: string | null }
  /** Ended more than 24 hours ago: clear it quietly, no alarm. */
  | { state: "stale" }
  /** Unreadable or impossible (bad date, more than 24 h away, ends before it starts): clear it. */
  | { state: "invalid" };

/** Checks a pause read back from storage before the timer trusts it. */
export function checkSavedPause(saved: unknown, nowMs: number): SavedPauseCheck {
  if (!saved || typeof saved !== "object") return { state: "none" };
  const { returnAt, startedAt } = saved as { returnAt?: unknown; startedAt?: unknown };
  if (returnAt === null || returnAt === undefined) return { state: "none" };
  if (typeof returnAt !== "string") return { state: "invalid" };
  const end = Date.parse(returnAt);
  if (!Number.isFinite(end)) return { state: "invalid" };
  if (end - nowMs > PAUSE_MAX_MINUTES * MINUTE + SLACK_MS) return { state: "invalid" };
  let start: string | null = null;
  if (startedAt !== null && startedAt !== undefined) {
    const s = typeof startedAt === "string" ? Date.parse(startedAt) : NaN;
    const length = end - s;
    if (!Number.isFinite(s) || length < PAUSE_MIN_MINUTES * MINUTE - SLACK_MS || length > PAUSE_MAX_MINUTES * MINUTE + SLACK_MS) {
      return { state: "invalid" };
    }
    start = startedAt as string;
  }
  if (nowMs - end > STALE_AFTER_MS) return { state: "stale" };
  return { state: "active", returnAt, startedAt: start };
}
