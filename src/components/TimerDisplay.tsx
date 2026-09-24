"use client";

export function TimerDisplay({
  remainingMs,
  expired,
}: {
  remainingMs: number;
  expired: boolean;
}) {
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const label =
    h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return (
    <div className="rounded-lg border border-pause/40 bg-surface-warn px-4 py-8 text-center">
      <p
        className={`text-5xl font-semibold tabular-nums tracking-tight ${
          expired ? "text-failure" : "text-pause"
        }`}
        aria-live="polite"
      >
        {expired ? "00:00" : label}
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        {expired ? "Return time passed — reconnect now" : "Until return"}
      </p>
    </div>
  );
}
