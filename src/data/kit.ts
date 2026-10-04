/**
 * Counts that must match the printed Operating Manual and Field Kit
 * (see the canonical decisions). Checked by tests/data-consistency.test.ts.
 */
export const KIT = {
  /** Field Kit: 13 cards = Read This First + 12 protocol cards. */
  protocolCards: 12,
  /** Field Kit worksheets (see src/data/worksheets.ts). */
  worksheets: 7,
  manualChapters: 22,
  calibrationQuestions: 44,
  /** Pause + Return window, in minutes. */
  pauseMinMinutes: 20,
  pauseMaxMinutes: 24 * 60,
  /** Weekly Reset: five parts, about 40 minutes. */
  weeklyResetParts: 5,
  weeklyResetMinutes: 40,
} as const;
