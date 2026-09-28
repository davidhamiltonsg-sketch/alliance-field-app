import { ProtocolIcon } from "./ProtocolIcon";

export type TabletTone = "accent" | "safety" | "pause" | "repair";

const toneText: Record<TabletTone, string> = {
  accent: "text-accent",
  safety: "text-safety",
  pause: "text-pause",
  repair: "text-repair",
};

const dims = {
  xs: { w: 24, h: 28, icon: 15 },
  sm: { w: 30, h: 34, icon: 18 },
  md: { w: 38, h: 43, icon: 22 },
  lg: { w: 44, h: 50, icon: 25 },
};

/**
 * v2 icon seat (library `icon_medallion` / icon set sheet): the icon inside
 * an arch tablet with a brass hairline rim set off by a paper gap.
 */
export function IconTablet({
  slug,
  tone = "accent",
  size = "md",
  className = "",
}: {
  slug: string;
  tone?: TabletTone;
  size?: keyof typeof dims;
  className?: string;
}) {
  const d = dims[size];
  return (
    <span
      className={`v2-tablet relative inline-flex shrink-0 items-end justify-center ${toneText[tone]} ${className}`}
      style={{ width: d.w, height: d.h }}
      aria-hidden
    >
      <ProtocolIcon slug={slug} size={d.icon} className="relative mb-[18%]" />
    </span>
  );
}
