/**
 * "Go deeper" pointers (CANON round 4 format roles): the Operating Manual
 * chapter, the Field Kit card and the Companion Book chapter for each protocol. Chapter numbers and
 * titles are the Manual's own (checked by tests/registry.test.ts). Names
 * are registry names (CANON round 5).
 */
export interface ManualChapter {
  /** Roman chapter number as printed, e.g. "XIII-A". */
  num: string;
  title: string;
}

export const manualChapters = {
  I: { num: "I", title: "Executive Summary" },
  II: { num: "II", title: "Fast Start Guide" },
  IV: { num: "IV", title: "Nervous System Orientation" },
  IX: { num: "IX", title: "Core Foundation: Team Over Self" },
  X: { num: "X", title: "Profiles: Strategic & Atmospheric" },
  XI: { num: "XI", title: "Daily Rhythm" },
  XII: { num: "XII", title: "Weekly Reset" },
  XIII: { num: "XIII", title: "Response & Conflict Protocol" },
  "XIII-A": { num: "XIII-A", title: "Micro-Repairs" },
  "XIII-B": { num: "XIII-B", title: "Full Recovery" },
  "XIII-D": { num: "XIII-D", title: "Detachment, Uninvestment, and Emotional Withdrawal" },
  XIV: { num: "XIV", title: "The Intimacy Pact" },
  XV: { num: "XV", title: "Proof Over Promises" },
  XVI: { num: "XVI", title: "Trust Recovery Protocol" },
  XVII: { num: "XVII", title: "Consistency Pact" },
  "XVIII-A": { num: "XVIII-A", title: "The Sun Memory Protocol" },
} as const satisfies Record<string, ManualChapter>;

type ChapterKey = keyof typeof manualChapters;

/**
 * Manual chapter and Companion Book chapter for each protocol. The Kit card
 * carries the registry name (the protocol title). Companion chapters match
 * the Manual's own "Go deeper" lines; "The Third Voice" is the founders'
 * note, not a numbered chapter.
 */
export const goDeeper: Record<string, { chapter: ChapterKey; companion?: string }> = {
  "green-rule": { chapter: "I", companion: "Companion Ch I" },
  "pause-and-return": { chapter: "IV", companion: "Companion Ch II" },
  "60-second-reset": { chapter: "II", companion: "Companion Ch II" },
  "micro-repair": { chapter: "XIII-A", companion: "Companion Ch I" },
  "weekly-reset": { chapter: "XII", companion: "Companion Ch V" },
  "system-overlay": { chapter: "I", companion: "Companion: The Third Voice" },
  "conflict-protocol": { chapter: "XIII", companion: "Companion Ch II" },
  "proof-protocol": { chapter: "XV", companion: "Companion Ch VI" },
  "trust-recovery": { chapter: "XVI", companion: "Companion Ch VI" },
  "full-recovery": { chapter: "XIII-B", companion: "Companion Ch IV" },
  "uninvestment-check": { chapter: "XIII-D", companion: "Companion Ch V" },
  "unity-anchor": { chapter: "IX" },
  "morning-evening-rhythm": { chapter: "XI", companion: "Companion Ch V" },
  "intimacy-pact": { chapter: "XIV" },
  "consistency-pact": { chapter: "XVII" },
};

/** "Chapter XIII-A, Micro-Repairs" */
export function chapterLabel(key: ChapterKey): string {
  const c = manualChapters[key];
  return `Chapter ${c.num}, ${c.title}`;
}
