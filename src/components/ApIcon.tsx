import type { CSSProperties } from "react";
import { ICON_ACCENT, ICON_STROKE, icons, type IconId } from "@/data/icons";

export type { IconId };

/** New tool slugs that still use the older glyph ids until the icon set is renamed. */
const ICON_ALIASES: Record<string, IconId> = {
  "check-up": "uninvestment-check",
  "team-agreement": "unity-anchor",
  "daily-rhythm": "morning-evening-rhythm",
  "full-repair": "full-recovery",
};

function resolve(id: string): IconId | null {
  if (Object.prototype.hasOwnProperty.call(icons, id)) return id as IconId;
  return ICON_ALIASES[id] ?? null;
}

/** True when `id` (or a new-slug alias of it) names an icon in the shared set. */
export function isIconId(id: string): id is IconId {
  return resolve(id) !== null;
}

function Paths({ id, mono }: { id: IconId; mono: boolean }) {
  const i = icons[resolve(id) ?? id];
  const accent = "accent" in i ? i.accent : undefined;
  return (
    <>
      {i.paths.map((d, k) => (
        <path key={k} d={d} />
      ))}
      {accent ? <path className="ap-accent" d={accent} stroke={mono ? "currentColor" : ICON_ACCENT} /> : null}
    </>
  );
}

/**
 * One glyph per concept, from the shared Alliance Protocols icon set
 * (24 grid, 1.75 stroke, round caps and joins, at most one brass accent).
 * Always place it beside a text label: it is decorative (aria-hidden) unless
 * `label` is given. Pass `mono` on tinted safety/stop panels or reversed
 * surfaces so the accent takes the text colour.
 */
export function ApIcon({
  id,
  size = 24,
  label,
  mono = false,
  className = "",
}: {
  id: IconId;
  size?: number;
  label?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Paths id={id} mono={mono} />
    </svg>
  );
}

/** The same glyph placed inside a larger SVG drawing at (x, y), `size` units square. */
export function ApIconG({
  id,
  x,
  y,
  size = 16,
  color = "currentColor",
  mono = false,
  className,
  style,
}: {
  id: IconId;
  x: number;
  y: number;
  size?: number;
  color?: string;
  mono?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const s = Number((size / 24).toFixed(4));
  return (
    <g className={className} style={style}>
      <g
        transform={`translate(${Number(x.toFixed(2))} ${Number(y.toFixed(2))}) scale(${s})`}
        fill="none"
        stroke={color}
        color={color}
        strokeWidth={ICON_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Paths id={id} mono={mono} />
      </g>
    </g>
  );
}

export type IconTone = "accent" | "pause" | "repair" | "safety" | "stop" | "connection";

const chipTone: Record<IconTone, string> = {
  accent: "bg-accent/[0.07] text-accent",
  pause: "bg-pause/10 text-pause",
  repair: "bg-repair/[0.08] text-repair",
  safety: "bg-safety/10 text-safety",
  stop: "bg-failure/[0.08] text-failure",
  connection: "bg-brass/15 text-accent",
};

const chipSize = { sm: { box: "h-9 w-9 rounded-[10px]", icon: 22 }, md: { box: "h-11 w-11 rounded-xl", icon: 26 }, lg: { box: "h-14 w-14 rounded-2xl", icon: 32 } };

/** A concept glyph on a soft tinted square, for list rows and page headers. Decorative: keep a text label beside it. */
export function IconChip({
  id,
  tone = "accent",
  size = "md",
  className = "",
}: {
  id: IconId;
  tone?: IconTone;
  size?: keyof typeof chipSize;
  className?: string;
}) {
  const s = chipSize[size];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${s.box} ${chipTone[tone]} ${className}`} aria-hidden>
      <ApIcon id={id} size={s.icon} mono={tone === "safety" || tone === "stop"} />
    </span>
  );
}
