"use client";

const SIZE = 232;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Large tabular countdown inside a pause-amber progress ring. */
export function TimerDisplay({
  remainingMs,
  totalMs,
  expired,
  idleLabel,
  caption,
}: {
  remainingMs: number;
  totalMs?: number;
  expired: boolean;
  /** When set, shows an idle ring with this text instead of a countdown. */
  idleLabel?: string;
  caption?: string;
}) {
  const idle = idleLabel !== undefined;
  const progress = idle
    ? 1
    : expired
      ? 0
      : totalMs && totalMs > 0
        ? Math.min(1, Math.max(0, remainingMs / totalMs))
        : 1;
  const label = idle ? idleLabel : expired ? "00:00" : formatRemaining(remainingMs);
  const long = label.length > 5;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-pause/15"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            className={`transition-[stroke-dashoffset] duration-300 ease-linear ${
              expired ? "text-failure" : idle ? "text-pause/35" : "text-pause"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p
            className={`tabular font-medium leading-none tracking-[-0.03em] ${
              long ? "text-[44px]" : "text-[56px]"
            } ${expired ? "text-failure" : idle ? "text-ink/80" : "text-ink"}`}
          >
            {label}
          </p>
          <p
            className={`mt-2 text-[11px] font-medium uppercase tracking-[0.08em] ${
              expired ? "text-failure" : "text-pause-text"
            }`}
          >
            {caption ?? (expired ? "Reconnect now" : "Until return")}
          </p>
        </div>
      </div>
      {expired && !idle && (
        <p className="mt-2 text-[15px] font-medium text-failure">
          Return time passed — reconnect now
        </p>
      )}
    </div>
  );
}
