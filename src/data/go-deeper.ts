/**
 * "Go deeper" pointers (format roles): the Operating Manual chapter and the
 * Companion Book chapter for each tool. Chapter numbers and titles are the
 * Manual's 16 chapters (SPEC section 3), checked by tests/registry.test.ts.
 * Names are the 15 tool names.
 */
export interface ManualChapter {
  /** Chapter number as printed, e.g. "10". */
  num: string;
  title: string;
}

/** All 16 Manual chapters, in order. */
export const manualChapters = {
  "1": { num: "1", title: "Why a Relationship Needs a Plan" },
  "2": { num: "2", title: "The Short Version" },
  "3": { num: "3", title: "When Your Body Takes Over" },
  "4": { num: "4", title: "Getting Started" },
  "5": { num: "5", title: "Hearing Each Other" },
  "6": { num: "6", title: "How Couples Drift" },
  "7": { num: "7", title: "Daily Rhythm" },
  "8": { num: "8", title: "Weekly Reset" },
  "9": { num: "9", title: "Micro-Repairs" },
  "10": { num: "10", title: "When It’s Already a Fight" },
  "11": { num: "11", title: "Trust Recovery" },
  "12": { num: "12", title: "The Check-Up" },
  "13": { num: "13", title: "The Consistency Pact" },
  "14": { num: "14", title: "The Intimacy Pact" },
  "15": { num: "15", title: "Making Room for Joy" },
  "16": { num: "16", title: "Team Agreement: When Pressure Comes From Outside" },
} as const satisfies Record<string, ManualChapter>;

type ChapterKey = keyof typeof manualChapters;

/**
 * Manual chapter and Companion Book chapter for each tool. Companion
 * chapters match the Companion's own headings; "The Third Voice" is the
 * authors' note, not a numbered chapter.
 */
export const goDeeper: Record<string, { chapter: ChapterKey; companion?: string }> = {
  "green-rule": { chapter: "2" },
  "pause-and-return": { chapter: "3", companion: "Companion Ch II" },
  "60-second-reset": { chapter: "4", companion: "Companion Ch II" },
  "micro-repair": { chapter: "9", companion: "Companion Ch I" },
  "weekly-reset": { chapter: "8", companion: "Companion Ch V" },
  "system-overlay": { chapter: "10", companion: "Companion: The Third Voice" },
  "full-repair": { chapter: "10", companion: "Companion Ch IV" },
  "trust-recovery": { chapter: "11", companion: "Companion Ch VI" },
  "check-up": { chapter: "12", companion: "Companion Ch V" },
  "team-agreement": { chapter: "16", companion: "Companion Ch IX" },
  "sun-memory": { chapter: "15", companion: "Companion Ch VII" },
  "daily-rhythm": { chapter: "7", companion: "Companion Ch V" },
  "intimacy-pact": { chapter: "14", companion: "Companion Ch X" },
  "consistency-pact": { chapter: "13", companion: "Companion Ch XI" },
  "profile-calibration": { chapter: "5", companion: "Companion Ch III" },
};

/** "Chapter 10, When It’s Already a Fight" */
export function chapterLabel(key: ChapterKey): string {
  const c = manualChapters[key];
  return `Chapter ${c.num}, ${c.title}`;
}
