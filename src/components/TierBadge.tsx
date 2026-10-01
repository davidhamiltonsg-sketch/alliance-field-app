import type { Tier } from "@/data/types";
import { tierInfo } from "@/data/tiers";
import { ApIcon } from "./ApIcon";

/** Tier badge: the dots glyph beside its text label (Core / Situational / Build). */
export function TierBadge({ tier, className = "" }: { tier: Tier; className?: string }) {
  const t = tierInfo[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium uppercase leading-none tracking-[0.08em] text-accent ${className}`}
    >
      <ApIcon id={t.icon} size={16} />
      {t.label}
      <span className="sr-only"> tier</span>
    </span>
  );
}
