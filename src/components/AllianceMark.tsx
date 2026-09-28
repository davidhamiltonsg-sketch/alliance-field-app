import { useId } from "react";

/**
 * THE ALLIANCE mark: a single continuous ribbon forming two interlocking
 * loops around a central leaf, with an over/under weave. Vector, so it stays
 * crisp at any size. Colour defaults to currentColor.
 */
const RIBBON =
  "M46 95H38A20 20 0 0 1 18 75V36A16 16 0 0 1 34 20H38C44 20 48 22.5 52 27L69 47C76 55 80 62 80 71C80 84 70 95 60 104C50 95 40 84 40 71C40 62 44 55 51 47L68 27C72 22.5 76 20 82 20H86A16 16 0 0 1 102 36V75A20 20 0 0 1 82 95H74";
const OVER_DIAGONAL = "M51 47L68 27";
const OVER_TIP = "M80 71C80 84 70 95 60 104C50 95 40 84 40 71";
const GAP_DIAGONAL = "M53 44.65L66 29.35";
const GAP_TIP =
  "M78.28 80.38C75 89.38 67.5 97.25 60 104C52.5 97.25 45 89.38 41.72 80.38";

export function AllianceMark({
  size = 32,
  color = "currentColor",
  title,
  className = "",
}: {
  size?: number | string;
  color?: string;
  title?: string;
  className?: string;
}) {
  const maskId = `am-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
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
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="-10"
          y="-10"
          width="140"
          height="140"
        >
          <rect x="-10" y="-10" width="140" height="140" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth="19" strokeLinejoin="round">
            <path d={GAP_DIAGONAL} />
            <path d={GAP_TIP} />
          </g>
        </mask>
      </defs>
      <g
        transform="translate(0 -2)"
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeMiterlimit="4"
      >
        <path mask={`url(#${maskId})`} d={RIBBON} />
        <path d={OVER_DIAGONAL} />
        <path d={OVER_TIP} />
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
      <AllianceMark size={s.mark} className="shrink-0 text-accent" />
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
