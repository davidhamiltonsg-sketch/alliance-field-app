/**
 * "Go deeper" pointers (CANON round 4 format roles): the Operating Manual
 * chapter and the Field Kit card for each protocol. Chapter numbers and
 * titles are the Manual's own (checked by tests/registry.test.ts); Kit card
 * names are the names printed on the cards.
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

export const goDeeper: Record<string, { chapter: ChapterKey; kitCard: string }> = {
  "green-rule": { chapter: "I", kitCard: "Green Rule" },
  "pause-and-return": { chapter: "IV", kitCard: "Pause + Return" },
  "60-second-reset": { chapter: "II", kitCard: "60-Second Reset" },
  "micro-repair": { chapter: "XIII-A", kitCard: "Micro-Repair" },
  "weekly-reset": { chapter: "XII", kitCard: "Weekly Reset" },
  "system-overlay": { chapter: "I", kitCard: "System Overlay" },
  "conflict-protocol": { chapter: "XIII", kitCard: "Conflict Protocol" },
  "proof-protocol": { chapter: "XV", kitCard: "Proof Protocol" },
  "trust-recovery": { chapter: "XVI", kitCard: "Trust Recovery" },
  "full-recovery": { chapter: "XIII-B", kitCard: "Full Recovery" },
  "uninvestment-check": { chapter: "XIII-D", kitCard: "Uninvestment Check" },
  "unity-anchor": { chapter: "IX", kitCard: "Unity Anchor" },
  "morning-evening-rhythm": { chapter: "XI", kitCard: "Morning + Evening Rhythm" },
  "intimacy-pact": { chapter: "XIV", kitCard: "Intimacy Pact" },
  "consistency-pact": { chapter: "XVII", kitCard: "Consistency Pact" },
};

/** "Chapter XIII-A, Micro-Repairs" */
export function chapterLabel(key: ChapterKey): string {
  const c = manualChapters[key];
  return `Chapter ${c.num}, ${c.title}`;
}
