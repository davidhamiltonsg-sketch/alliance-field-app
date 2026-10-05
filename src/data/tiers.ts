import type { IconId } from "./icons";
import type { Protocol, Tier } from "./types";

/**
 * Three plain tier labels (SPEC section 1). The internal keys stay core /
 * situational / build; people only ever see the labels. No dots or glyph text.
 */
export const tierInfo: Record<Tier, { label: string; icon: IconId; meaning: string }> = {
  core: { label: "Learn first", icon: "tier-core", meaning: "Start here. These six cover most evenings." },
  situational: { label: "When it comes up", icon: "tier-situational", meaning: "For when the Situation Map sends you there." },
  build: { label: "Build over time", icon: "tier-build", meaning: "Habits to add once the first six feel familiar." },
};

export const tierOrder: Tier[] = ["core", "situational", "build"];

/** Protocols grouped by tier, in tier order, keeping each group's given order. */
export function groupByTier(list: Protocol[]): { tier: Tier; protocols: Protocol[] }[] {
  return tierOrder
    .map((tier) => ({ tier, protocols: list.filter((p) => p.tier === tier) }))
    .filter((g) => g.protocols.length > 0);
}
