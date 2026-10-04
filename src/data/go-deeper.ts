/**
 * "Go deeper" pointers (CANON round 4 format roles): the Operating Manual
 * chapter, the Field Kit card and the Companion Book chapter for each protocol. Chapter numbers and
 * titles are the Manual's own (checked by tests/registry.test.ts). Names
 * are registry names (CANON round 5).
 */
export interface ManualChapter {
  /** Chapter number as printed, e.g. "14". */
  num: string;
  title: string;
}

export const manualChapters = {
  "2": { num: "2", title: "The Short Version" },
  "3": { num: "3", title: "When Your Body Takes Over" },
  "4": { num: "4", title: "Getting Started" },
  "9": { num: "9", title: "Team Over Self" },
  "12": { num: "12", title: "Daily Rhythm" },
  "13": { num: "13", title: "Weekly Reset" },
  "14": { num: "14", title: "Micro-Repairs" },
  "15": { num: "15", title: "When It’s Already a Fight" },
  "16": { num: "16", title: "Full Recovery" },
  "18": { num: "18", title: "Proof Over Promises" },
  "19": { num: "19", title: "Trust Recovery" },
  "20": { num: "20", title: "Consistency Pact" },
  "21": { num: "21", title: "When One of You Pulls Away" },
  "22": { num: "22", title: "The Intimacy Pact" },
} as const satisfies Record<string, ManualChapter>;

type ChapterKey = keyof typeof manualChapters;

/**
 * Manual chapter and Companion Book chapter for each protocol. The Kit card
 * carries the registry name (the protocol title). Companion chapters match
 * the Manual's own "Go deeper" lines; "The Third Voice" is the founders'
 * note, not a numbered chapter.
 */
export const goDeeper: Record<string, { chapter: ChapterKey; companion?: string }> = {
  "green-rule": { chapter: "2", companion: "Companion Ch I" },
  "pause-and-return": { chapter: "3", companion: "Companion Ch II" },
  "60-second-reset": { chapter: "4", companion: "Companion Ch II" },
  "micro-repair": { chapter: "14", companion: "Companion Ch I" },
  "weekly-reset": { chapter: "13", companion: "Companion Ch V" },
  "system-overlay": { chapter: "2", companion: "Companion: The Third Voice" },
  "proof-protocol": { chapter: "18", companion: "Companion Ch VI" },
  "trust-recovery": { chapter: "19", companion: "Companion Ch VI" },
  "full-recovery": { chapter: "16", companion: "Companion Ch IV" },
  "uninvestment-check": { chapter: "21", companion: "Companion Ch V" },
  "unity-anchor": { chapter: "9" },
  "morning-evening-rhythm": { chapter: "12", companion: "Companion Ch V" },
  "intimacy-pact": { chapter: "22" },
  "consistency-pact": { chapter: "20" },
};

/** "Chapter 14, Micro-Repairs" */
export function chapterLabel(key: ChapterKey): string {
  const c = manualChapters[key];
  return `Chapter ${c.num}, ${c.title}`;
}
