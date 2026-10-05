import type { Protocol } from "@/data/types";
import { SAFETY_SEARCH_WORDS, SEARCH_HINTS, TOOL_ORDER } from "@/components/tierLabels";

/** Small words people type around the word that matters ("he yells", "controls my phone"). */
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "at", "be", "but", "do", "does", "for", "he", "her", "him", "his", "i", "i'm", "im",
  "in", "is", "it", "keeps", "me", "my", "of", "on", "or", "our", "she", "so", "the", "their", "them", "they",
  "to", "too", "us", "we", "we're", "with", "you", "your", "always", "never", "when", "about", "what", "how",
]);

function normalise(text: string): string {
  return text.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'%+\s-]/g, " ");
}

/** The query's meaningful words (stop words dropped, unless that leaves nothing). */
export function queryWords(query: string): string[] {
  const all = normalise(query).split(/\s+/).filter(Boolean);
  const kept = all.filter((w) => !STOP_WORDS.has(w));
  return kept.length > 0 ? kept : all;
}

/** A word and its plain stems: "yells" → yells, yell; "controlling" → controlling, controll, control. */
function variants(word: string): string[] {
  const out = new Set([word]);
  if (word.length > 4) {
    for (const suffix of ["ing", "ed", "es", "s"]) {
      if (word.endsWith(suffix)) {
        const stem = word.slice(0, -suffix.length);
        out.add(stem);
        if (/(.)\1$/.test(stem)) out.add(stem.slice(0, -1));
      }
    }
  }
  return [...out].filter((w) => w.length >= 2);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when any variant of the word starts a word in the text. */
function hits(text: string, word: string): boolean {
  return variants(word).some((v) => new RegExp(`(^|\\s)${escape(v)}`).test(text));
}

function synonymsOf(p: Protocol): string {
  const raw = (p as unknown as { synonyms?: unknown }).synonyms;
  const own = Array.isArray(raw) ? raw.join(" ") : typeof raw === "string" ? raw : "";
  return `${own} ${SEARCH_HINTS[p.slug] ?? ""}`;
}

function order(slug: string): number {
  const i = TOOL_ORDER.indexOf(slug);
  return i === -1 ? TOOL_ORDER.length : i;
}

/** Score one tool: title hits rank above synonym hits, which rank above body text. 0 = no match. */
function score(p: Protocol, words: string[], requireAll: boolean): number {
  const title = normalise(p.title);
  const syn = normalise(synonymsOf(p));
  const body = normalise([p.concept, p.whenToUse, ...p.steps, ...p.phrases.map((ph) => ph.text)].join(" "));
  let total = 0;
  let matched = 0;
  for (const w of words) {
    const s = hits(title, w) ? 100 : hits(syn, w) ? 40 : hits(body, w) ? 5 : 0;
    if (s > 0) matched += 1;
    total += s;
  }
  if (matched === 0 || (requireAll && matched < words.length)) return 0;
  return total;
}

/**
 * Tools that match a search, best first. Every meaningful word must match;
 * if no tool matches them all, tools matching any of them are returned.
 */
export function searchTools(protocols: Protocol[], query: string): Protocol[] {
  const words = queryWords(query);
  if (words.length === 0) return [...protocols].sort((a, b) => order(a.slug) - order(b.slug));
  const run = (requireAll: boolean) =>
    protocols
      .map((p) => ({ p, s: score(p, words, requireAll) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || order(a.p.slug) - order(b.p.slug))
      .map((x) => x.p);
  const strict = run(true);
  return strict.length > 0 ? strict : run(false);
}

/** True when the search could be about fear or control rather than an ordinary fight. */
export function isSafetyQuery(query: string): boolean {
  const text = ` ${normalise(query).replace(/\s+/g, " ").trim()} `;
  return SAFETY_SEARCH_WORDS.some((w) => text.includes(` ${w} `));
}
