/**
 * THE ALLIANCE mark: two rising strokes meeting at a peak, with a soft
 * double-arch wave beneath — the same brandmark used across the Manual,
 * Field Kit, and companion book. Vector, so it stays crisp at any size.
 * `color` sets the two peak strokes (defaults to currentColor); pass
 * `waveColor` for the two-tone treatment used on paper backgrounds
 * (accent legs, warm tan wave) — omit it for a single-colour mark, used
 * on reversed/accent backgrounds and subtle or low-opacity placements.
 */
const LEG_LEFT = "M60 14L26 106";
const LEG_RIGHT = "M60 14L94 106";
const WAVE = "M40 74Q50 63 60 74Q70 63 80 74";

export function AllianceMark({
  size = 32,
  color = "currentColor",
  waveColor,
  title,
  className = "",
}: {
  size?: number | string;
  color?: string;
  waveColor?: string;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <g fill="none" strokeLinecap="round">
        <path d={LEG_LEFT} stroke={color} strokeWidth="10" />
        <path d={LEG_RIGHT} stroke={color} strokeWidth="10" />
        <path d={WAVE} stroke={waveColor || color} strokeWidth="8.5" />
      </g>
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function AllianceLockup({
  size = "md",
  subtitle = "Field App",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  subtitle?: string | null;
  className?: string;
}) {
  const s = {
    sm: { mark: 28, name: "text-[13px] tracking-[0.14em]", sub: "text-[11px]" },
    md: { mark: 40, name: "text-[17px] tracking-[0.14em]", sub: "text-[11px]" },
    lg: { mark: 72, name: "text-[20px] tracking-[0.14em]", sub: "text-[11px]" },
  }[size];
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <AllianceMark size={s.mark} className="shrink-0 text-accent" waveColor="#A8895A" />
      <span className="flex flex-col leading-none">
        <span className={`font-medium text-ink ${s.name}`}>THE ALLIANCE</span>
        {subtitle ? (
          <span
            className={`mt-1.5 font-medium uppercase tracking-[0.08em] text-accent ${s.sub}`}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
