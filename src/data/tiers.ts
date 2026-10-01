import type { IconId } from "./icons";
import type { Protocol, Tier } from "./types";

/** CANON round 4 tiers: dots plus a text label, always shown together. */
export const tierInfo: Record<Tier, { label: string; dots: number; icon: IconId; meaning: string }> = {
  core: { label: "Core", dots: 1, icon: "tier-core", meaning: "Learn these first." },
  situational: { label: "Situational", dots: 2, icon: "tier-situational", meaning: "Pulled when the Situation Map routes you." },
  build: { label: "Build", dots: 3, icon: "tier-build", meaning: "Ongoing practices." },
};

export const tierOrder: Tier[] = ["core", "situational", "build"];

/** Protocols grouped by tier, in tier order, keeping each group's given order. */
export function groupByTier(list: Protocol[]): { tier: Tier; protocols: Protocol[] }[] {
  return tierOrder
    .map((tier) => ({ tier, protocols: list.filter((p) => p.tier === tier) }))
    .filter((g) => g.protocols.length > 0);
}
