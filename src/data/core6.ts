/**
 * The six to learn first: the smallest set of Field Kit tools worth learning first.
 * Order follows the registry (Green Rule first). The "Learn first" tier is exactly
 * these six, including the System Overlay; everything else on /protocols is
 * grouped as "When it comes up", then "Build over time".
 */
export interface CoreTool {
  slug: string;
  /** One line on why this is in the six to learn first. */
  why: string;
}

export const coreSix: CoreTool[] = [
  {
    slug: "green-rule",
    why: "Either of you can say the honest thing without paying for it. If it’s fear, not flooding, stop and get help.",
  },
  {
    slug: "pause-and-return",
    why: "Time apart that ends when you said it would: 20 minutes to 24 hours.",
  },
  {
    slug: "60-second-reset",
    why: "One minute, still in the room, to stop trying to win and start talking again. Then pick a time.",
  },
  {
    slug: "micro-repair",
    why: "Small repairs, early — before a sting hardens.",
  },
  {
    slug: "weekly-reset",
    why: "Forty minutes once a week (15 is fine to start), appreciation first, so small things get said before they pile up.",
  },
  {
    slug: "system-overlay",
    why: "One order for any hard conversation, with a 90-second quick version, so it ends with who does what.",
  },
];

export const coreSixSlugs = coreSix.map((c) => c.slug);
