import type { Tier } from "@/data/types";
import { TIER_LABEL } from "./tierLabels";

/** Tier badge: the plain-word label only (Learn first / When it comes up / Build over time). */
export function TierBadge({ tier, className = "" }: { tier: Tier; className?: string }) {
  return (
    <span className={`inline-block text-sm font-medium leading-none text-accent ${className}`}>
      {TIER_LABEL[tier]}
      <span className="sr-only"> tier</span>
    </span>
  );
}
