/**
 * The Core 5: the smallest set of Field Kit tools worth learning first.
 * Everything else on /protocols is grouped as "Advanced".
 */
export interface CoreTool {
  slug: string;
  /** One line on why this is in the Core 5. */
  why: string;
}

export const coreFive: CoreTool[] = [
  {
    slug: "green-rule",
    why: "Safety first: honesty can't be punished. If it's fear, not flooding, stop and get help.",
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
    slug: "weekly-reset",
    why: "Five parts, about 40 minutes, once a week. Maintenance, not a trial.",
  },
  {
    slug: "micro-repair",
    why: "Small repairs, early — before residue hardens.",
  },
];

export const coreFiveSlugs = coreFive.map((c) => c.slug);
