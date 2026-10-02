/**
 * The Core 5: the smallest set of Field Kit tools worth learning first.
 * Order follows the registry (Green Rule first). Everything else on
 * /protocols is grouped by tier: Situational, then Build.
 */
export interface CoreTool {
  slug: string;
  /** One line on why this is in the Core 5. */
  why: string;
}

export const coreFive: CoreTool[] = [
  {
    slug: "green-rule",
    why: "Safety first: honesty can’t be punished. If it’s fear, not flooding, stop and get help.",
  },
  {
    slug: "pause-and-return",
    why: "Space with an exact return time — 20 minutes to 24 hours.",
  },
  {
    slug: "60-second-reset",
    why: "One minute to stop a fight to win, then book a time to talk.",
  },
  {
    slug: "micro-repair",
    why: "Small repairs, early — before a sting hardens.",
  },
  {
    slug: "weekly-reset",
    why: "Five parts, about 40 minutes, once a week, appreciation first.",
  },
];

export const coreFiveSlugs = coreFive.map((c) => c.slug);
