/**
 * Plain-English subtitles for the system's coined terms (CANON round 4),
 * shown beside the term the first time it appears on a screen. Must match
 * registry.json `plainEnglishSubtitles` (checked by tests/registry.test.ts).
 */
export const plainEnglish: Record<string, string> = {
  "System Overlay": "a five-step order for hard conversations",
  "Reach–Recoil": "one reaches, the other pulls back",
  "Proof item": "a specific change, evidence you can both see, and a set time window",
};

/** Tool titles that are, or carry, a coined term. */
const protocolTerm: Record<string, string> = {
  "system-overlay": "System Overlay",
};

/** The plain-English subtitle for a tool whose name is a coined term, if any. */
export function protocolSubtitle(slug: string): string | undefined {
  const term = protocolTerm[slug];
  return term ? plainEnglish[term] : undefined;
}

/** "Term (plain-English subtitle)", for first mentions in running text. */
export function withSubtitle(term: string): string {
  const s = plainEnglish[term];
  return s ? `${term} (${s})` : term;
}

export interface GlossaryEntry {
  term: string;
  /** Plain definition, one or two sentences. */
  meaning: string;
  /** Manual chapter that explains it in full (key of manualChapters), if any. */
  chapter?: string;
}

/**
 * The Manual's glossary, about 25 entries (SPEC section 3). Names are the 15
 * tool names; chapter numbers are the Manual's 16 chapters.
 */
export const glossary: GlossaryEntry[] = [
  { term: "2% habit", meaning: "The smallest useful repair: make things 2% better right now with a softer tone, one acknowledgement or a pause, or own the small part of your partner’s complaint that is true.", chapter: "9" },
  { term: "60-Second Reset", meaning: "A one-minute stop for when an argument has become a fight to win: one sentence, “I want to connect, not fight. Can we talk at ___?”, then three slow breaths and a time to keep talking.", chapter: "3" },
  { term: "Bids", meaning: "The small reaches each of you makes for attention, closeness or space. How a bid is met, or missed, is often where a recurring fight starts.", chapter: "5" },
  { term: "Check-Up", meaning: "One sheet with three lenses: drifting apart, pulling away, and gaps between what you say and do. It describes behaviour; it is not a verdict.", chapter: "12" },
  { term: "Consistency Pact", meaning: "A private weekly check on whether what you do matches what you say you want, with one change where it doesn’t.", chapter: "13" },
  { term: "Daily Rhythm", meaning: "A morning hello (5 minutes or less) and an evening catch-up (about 10 minutes). On a busy day, keep the minimum.", chapter: "7" },
  { term: "Drift", meaning: "The slow, unchosen sliding apart that happens when nobody is paying attention. It is nobody’s fault, but you can each name your part.", chapter: "6" },
  { term: "Flooding", meaning: "When your body takes over in an argument: your heart races, your attention narrows and you can’t think clearly. It passes with time. Pause + Return is the tool for it.", chapter: "3" },
  { term: "Full Repair", meaning: "A booked 60 to 90 minute conversation for a fight you keep having or a dent in trust. Either of you may say no to booking it.", chapter: "10" },
  { term: "Green Rule", meaning: "Both of you must feel safe to speak honestly. If it isn’t safe, pause the topic. A stated lack of safety is believed first. Fear of your partner goes to the Help Lines.", chapter: "2" },
  { term: "Help Lines", meaning: "The numbers to call if you are afraid, threatened or not free to say no, or if someone is in danger. They are not on the Situation Map; keep them somewhere private.", chapter: "2" },
  { term: "Impact before explanation", meaning: "Saying what your words or actions did to your partner before you explain why you did them.", chapter: "10" },
  { term: "Intimacy Pact", meaning: "An agreement about how asking and saying no work between you. A no needs no reason. The review is about how asking and saying no feel, never about how often.", chapter: "14" },
  { term: "Micro-Repair", meaning: "The smallest way to make up after a sting: soften your tone, do one small thing, sit side by side, say you noticed the impact. Start within minutes if you can; finish within 24 hours.", chapter: "9" },
  { term: "Pause + Return", meaning: "For flooding, never for fear: say you need a pause, step away for 20 minutes to 24 hours and come back at the exact time you said.", chapter: "3" },
  { term: "Plan first / mood first", meaning: "Two ways of caring. Plan first cares by sorting things out; mood first cares through presence and warmth. A shared language, not a diagnosis.", chapter: "5" },
  { term: "Proof item", meaning: "One specific change, with evidence you can both see and a set time window.", chapter: "11" },
  { term: "Profile Calibration", meaning: "Each of you answers 44 questions on your own phone. Nobody has to complete it, and you can stop at any time.", chapter: "5" },
  { term: "Profile Calibration report", meaning: "The Field App’s report once you have both answered the Profile Calibration questions. It shows where your answers are furthest apart across five layers.", chapter: "5" },
  { term: "Reach–Recoil", meaning: "A pattern where one of you reaches and the other pulls back, so the more one reaches, the more the other backs away.", chapter: "6" },
  { term: "Situation Map", meaning: "A one-page list of situations, with the first move for each. Take the first row that fits, from the top.", chapter: "4" },
  { term: "Sun Memory", meaning: "A break from system-talk, called by either of you: Quick (a few minutes) or Full (2 to 24 hours). Safety, childcare and booked repairs carry on.", chapter: "15" },
  { term: "System-talk", meaning: "Talk about the tools, the reviews or how you could do this better. Sun Memory pauses it.", chapter: "15" },
  { term: "System Overlay", meaning: "A five-step order for hard conversations, at three speeds: quick (about 90 seconds), standard and already a fight.", chapter: "2" },
  { term: "Team Agreement", meaning: "Five steps for pressure from outside, starting with “Believe first”, plus a restart line. Whether to be out is each person’s own decision.", chapter: "16" },
  { term: "Trust Recovery", meaning: "A way to rebuild after a breach both of you agree happened: one specific change, a time window and a check back. Leaving is a valid outcome.", chapter: "11" },
  { term: "Weekly Reset", meaning: "About 40 minutes once a week (15 is fine to start): appreciation, the load, one friction point, requests and next steps. The monthly part adds 10 minutes; the yearly part is 1 to 2 hours.", chapter: "8" },
];
