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
