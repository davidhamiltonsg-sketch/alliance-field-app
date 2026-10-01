/**
 * Plain-English subtitles for the system's coined terms (CANON round 4),
 * shown beside the term the first time it appears on a screen. Must match
 * registry.json `plainEnglishSubtitles` (checked by tests/registry.test.ts).
 */
export const plainEnglish: Record<string, string> = {
  "System Overlay": "spotting the pattern you’re both stuck in",
  Circuit: "a repeating loop between you",
  "Layer Scan": "where each of you sits on the profile",
  "Reach–Recoil": "one reaches, the other pulls back",
  "One-Handed Alliance": "one partner carrying the relationship work",
  Proof: "a small action the other can see",
};

/** Protocol titles that are, or carry, a coined term. */
const protocolTerm: Record<string, string> = {
  "system-overlay": "System Overlay",
  "proof-protocol": "Proof",
};

/** The plain-English subtitle for a protocol whose name is a coined term, if any. */
export function protocolSubtitle(slug: string): string | undefined {
  const term = protocolTerm[slug];
  return term ? plainEnglish[term] : undefined;
}

/** "Term (plain-English subtitle)", for first mentions in running text. */
export function withSubtitle(term: string): string {
  const s = plainEnglish[term];
  return s ? `${term} (${s})` : term;
}
