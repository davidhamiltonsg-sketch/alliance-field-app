/**
 * Plain-English subtitles for the system's coined terms (CANON round 4),
 * shown beside the term the first time it appears on a screen. Must match
 * registry.json `plainEnglishSubtitles` (checked by tests/registry.test.ts).
 */
export const plainEnglish: Record<string, string> = {
  "System Overlay": "a five-step order for hard conversations",
  Loop: "a pattern that repeats between you",
  "Layer Scan": "where you two differ most, layer by layer",
  "Reach–Recoil": "one reaches, the other pulls back",
  "Carrying It Alone": "one partner carrying the relationship work",
  Proof: "a specific change, evidence you can both see, and a set time window",
};

/** Protocol titles that are, or carry, a coined term. */
const protocolTerm: Record<string, string> = {
  "system-overlay": "System Overlay",
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
