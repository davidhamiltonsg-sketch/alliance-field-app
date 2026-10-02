import { questions, scoreKeys } from "@/data/calibration/questions";
import type {
  CalibrationState,
  ChoiceKey,
  CoupleReport,
  LayerKey,
  PersonAnswers,
  PersonInput,
  PersonKey,
  Profile,
  RecommendedTool,
  ScoreKey,
  Scores,
} from "@/data/calibration/types";
import { getProtocol } from "@/data/protocols";
import { readJson, writeJson } from "./storage";

export const CALIBRATION_KEY = "alliance.field.calibration";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));
const average = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const diff = (a: number, b: number) => Math.abs(a - b);
const high = (score: number, threshold = 68) => score >= threshold;

export function emptyPersonInput(name: string): PersonInput {
  return { name, answers: {} };
}

export function emptyCalibration(): CalibrationState {
  return { personA: emptyPersonInput("Partner A"), personB: emptyPersonInput("Partner B"), aPrivate: false };
}

export function readCalibration(): CalibrationState {
  const state = readJson<CalibrationState>(CALIBRATION_KEY);
  if (!state) return emptyCalibration();
  return {
    personA: { name: state.personA?.name || "Partner A", answers: state.personA?.answers || {} },
    personB: { name: state.personB?.name || "Partner B", answers: state.personB?.answers || {} },
    aPrivate: state.aPrivate === true,
  };
}

export function writeCalibration(state: CalibrationState) {
  writeJson(CALIBRATION_KEY, state);
}

export function answeredCount(answers: PersonAnswers): number {
  return questions.filter((q) => answers[q.id]).length;
}

export function isComplete(answers: PersonAnswers): boolean {
  return answeredCount(answers) === questions.length;
}

export function firstUnansweredIndex(answers: PersonAnswers): number {
  const i = questions.findIndex((q) => !answers[q.id]);
  return i === -1 ? questions.length - 1 : i;
}

function createEmptyScores(): Scores {
  return scoreKeys.reduce((acc, key) => ({ ...acc, [key]: 50 }), {} as Scores);
}

function scorePerson(answers: PersonAnswers): Scores {
  const raw = createEmptyScores();
  questions.forEach((q) => {
    const choice = answers[q.id] as ChoiceKey | undefined;
    if (!choice) return;
    const effects = q.effects[choice] || {};
    Object.entries(effects).forEach(([key, delta]) => {
      const scoreKey = key as ScoreKey;
      raw[scoreKey] = raw[scoreKey] + (delta || 0);
    });
  });
  scoreKeys.forEach((key) => {
    raw[key] = clamp(raw[key]);
  });
  return raw;
}

function detectPatterns(scores: Scores): string[] {
  const patterns: string[] = [];
  if (high(scores.closenessNeed) && high(scores.withdrawalUnderStress)) patterns.push("Reaches out, then pulls back, under stress");
  if (high(scores.structureNeed) && high(scores.warmthNeed)) patterns.push("Needs both warmth and structure to feel safe");
  if (high(scores.accountabilityOrientation) && scores.repairSpeed <= 42) patterns.push("Wants to see change over time, not a quick fix");
  if (high(scores.privacyNeed) && high(scores.careVisibility)) patterns.push("Private care style — shows care quietly");
  if (high(scores.signalSensitivity) && scores.transparency <= 42) patterns.push("Reads small signals but doesn’t always name them");
  if (high(scores.deflectionRisk)) patterns.push("Deflects when exposed — with humour, logic or a change of subject");
  if (high(scores.proofOrientation)) patterns.push("Trusts evidence over words");
  if (high(scores.privacyNeed) && high(scores.autonomyProtection)) patterns.push("Guards their independence — space is a need, not distance");
  if (high(scores.reassuranceNeed) && high(scores.signalSensitivity)) patterns.push("Needs visible reassurance to feel stable");
  if (!patterns.length) patterns.push("Balanced profile — no single pattern stands out");
  return Array.from(new Set(patterns)).slice(0, 5);
}

export function generateProfile(person: PersonKey, input: PersonInput): Profile {
  const scores = scorePerson(input.answers);
  const patterns = detectPatterns(scores);
  const name = input.name?.trim() || (person === "A" ? "Partner A" : "Partner B");

  const safetyLogic =
    high(scores.structureNeed) && high(scores.warmthNeed)
      ? `${name} needs both felt warmth and clear structure before a hard conversation can land.`
      : high(scores.structureNeed)
        ? `${name} builds safety through clarity, reliability, and visible follow-through.`
        : high(scores.warmthNeed)
          ? `${name} builds safety through tone, warmth, and emotional presence.`
          : `${name} feels safe through a mix: some warmth, some structure, and the full picture before anyone draws conclusions.`;

  const careStyle =
    high(scores.proofOrientation) || high(scores.structureNeed)
      ? `Care lands for ${name} through reliability, action, and follow-through more than words.`
      : `Care lands for ${name} through warmth, presence, and being told, not just shown.`;

  const conflictResponse =
    high(scores.withdrawalUnderStress) && high(scores.conflictActivation)
      ? `Under stress, ${name} may swing between pushing for resolution and going quiet. Pacing matters.`
      : high(scores.withdrawalUnderStress)
        ? `Under stress, ${name} is likely to go quiet or ask for space to settle.`
        : high(scores.conflictActivation)
          ? `Under stress, ${name} is likely to go straight to the issue and want an answer.`
          : `Under stress, ${name} can usually keep talking as long as warmth is still in the room.`;

  const privacyAutonomy = high(scores.privacyNeed)
    ? `Needs plenty of privacy: space works best with a return time, so it doesn’t read as distance.`
    : `Some need for privacy: you can usually agree how close to be, as long as the warmth stays.`;

  const likelyMisreads = [
    high(scores.signalSensitivity)
      ? `${name} may read silence, delay, or a cooler tone as disconnection.`
      : `${name} may miss small cues until they’re named directly.`,
    high(scores.structureNeed)
      ? `${name} may hear vagueness as unreliability.`
      : `${name} may hear too much structure as pressure.`,
    high(scores.privacyNeed)
      ? `${name} may find questions intrusive when things are already heated.`
      : `${name} may feel space as rejection if it doesn’t come with reassurance.`,
  ];

  return {
    person,
    name,
    scores,
    patterns,
    primaryPattern: patterns[0],
    safetyLogic,
    careStyle,
    conflictResponse,
    privacyAutonomy,
    likelyMisreads,
  };
}

const LAYER_KEYS: Record<LayerKey, ScoreKey[]> = {
  Atmosphere: ["warmthNeed", "careVisibility", "rhythmNeed"],
  Structure: ["structureNeed", "governanceNeed", "proofOrientation"],
  Repair: ["repairSpeed", "accountabilityOrientation", "conflictActivation"],
  Protection: ["privacyNeed", "autonomyProtection", "withdrawalUnderStress"],
  Insight: ["transparency", "signalSensitivity", "trustSensitivity"],
};

function layerHealth(a: Scores, b: Scores): Record<LayerKey, number> {
  const result = {} as Record<LayerKey, number>;
  (Object.keys(LAYER_KEYS) as LayerKey[]).forEach((layer) => {
    const keys = LAYER_KEYS[layer];
    const avgGap = average(keys.map((k) => diff(a[k], b[k])));
    result[layer] = clamp(100 - avgGap * 1.1);
  });
  return result;
}

function buildConflictPattern(a: Profile, b: Profile): string {
  const aPursues = a.scores.conflictActivation > a.scores.withdrawalUnderStress;
  const bPursues = b.scores.conflictActivation > b.scores.withdrawalUnderStress;
  if (aPursues && !bPursues)
    return `${a.name} tends to push for an answer while ${b.name} backs off. Left alone, that can become a Reach–Recoil loop (one reaches, the other pulls back). Pause + Return, with an exact return time, is designed to break it.`;
  if (!aPursues && bPursues)
    return `${b.name} tends to push for an answer while ${a.name} backs off. Left alone, that can become a Reach–Recoil loop (one reaches, the other pulls back). Pause + Return, with an exact return time, is designed to break it.`;
  if (aPursues && bPursues)
    return "Both of you tend to push harder to get a response. The first move is to slow down, before the push for reassurance becomes the fight.";
  return "Both of you tend to back off. Fewer fights can still mean less contact: keep up the Morning + Evening Rhythm and the Weekly Reset so distance doesn’t build quietly.";
}

// Maps a recommendation's concept to a real Field Kit protocol slug.
// Concepts with no standalone card route to the closest existing one.
const TOOL_SLUG: Record<string, string> = {
  "60-Second Reset": "60-second-reset",
  "Pause + Return": "pause-and-return",
  "Weekly Reset": "weekly-reset",
  "Care Check-in": "weekly-reset",
  "Micro-Repair": "micro-repair",
  "Conflict Protocol": "conflict-protocol",
  "Impact before explanation (Full Recovery)": "full-recovery",
  "Consistency Pact": "consistency-pact",
  "Uninvestment Check": "uninvestment-check",
  "Full Recovery": "full-recovery",
  "Trust Recovery": "trust-recovery",
  "Intimacy Pact": "intimacy-pact",
  "Proof Protocol": "proof-protocol",
  "System Overlay": "system-overlay",
  "Morning + Evening Rhythm": "morning-evening-rhythm",
  "Green Rule": "green-rule",
};

function routeTools(a: Profile, b: Profile, health: Record<LayerKey, number>) {
  const routes: { tool: string; reason: string }[] = [];
  const add = (tool: string, reason: string) => {
    if (!routes.some((r) => r.tool === tool)) routes.push({ tool, reason });
  };

  if (health.Atmosphere < 62) add("Morning + Evening Rhythm", "Atmosphere is running low — bring the warmth back before asking for change.");
  if (health.Structure < 62) add("Weekly Reset", "Structure is running low — set a weekly check-in you can count on.");
  if (health.Repair < 62) add("Micro-Repair", "Repair is running low — make smaller repairs, more often.");
  if (health.Protection < 62) add("Pause + Return", "Protection is running low — agree what you’ll each do when things get heated.");

  if (diff(a.scores.privacyNeed, b.scores.closenessNeed) > 18 || diff(b.scores.privacyNeed, a.scores.closenessNeed) > 18) {
    add("Pause + Return", "You need different amounts of space and closeness, enough to be misread as rejection or pressure.");
  }
  if (diff(a.scores.careVisibility, b.scores.careVisibility) > 14 || diff(a.scores.warmthNeed, b.scores.structureNeed) > 18 || diff(b.scores.warmthNeed, a.scores.structureNeed) > 18) {
    add("Care Check-in", "You show care differently — one of you may be caring in a way the other doesn’t feel.");
  }
  if (average([a.scores.proofOrientation, b.scores.proofOrientation]) > 64) {
    add("Consistency Pact", "Trust here needs actions you can both see, over a set time, not just words.");
  }
  if (average([a.scores.deflectionRisk, b.scores.deflectionRisk]) > 62) {
    add("Impact before explanation (Full Recovery)", "One of you tends to deflect — name the impact before explaining what you meant, so the repair doesn’t slide off.");
  }
  if (
    average([a.scores.withdrawalUnderStress, b.scores.withdrawalUnderStress]) > 60 &&
    average([a.scores.reassuranceNeed, b.scores.reassuranceNeed, a.scores.signalSensitivity, b.scores.signalSensitivity]) > 55
  ) {
    add("Uninvestment Check", "Pulling back under stress is common here, and so is noticing it. Do the check together to tell needing space from pulling away, rather than assuming either.");
  }
  if (!routes.length) {
    add("Morning + Evening Rhythm", "Keep daily contact predictable.");
    add("Weekly Reset", "Keep the weekly check-in going before drift sets in.");
  }

  return routes.slice(0, 6);
}

function toRecommendedTools(routes: { tool: string; reason: string }[]): RecommendedTool[] {
  return routes
    .map((r) => {
      const slug = TOOL_SLUG[r.tool];
      const card = slug ? getProtocol(slug) : undefined;
      if (!card) return null;
      return { slug: card.slug, title: card.title, reason: r.reason };
    })
    .filter((r): r is RecommendedTool => r !== null);
}

function buildSequence(tools: RecommendedTool[]): string[] {
  const sequence = ["One warm, true sentence", ...tools.slice(0, 4).map((t) => t.title), "Look back at the Weekly Reset"];
  return Array.from(new Set(sequence));
}

export function generateCoupleReport(profileA: Profile, profileB: Profile): CoupleReport {
  const a = profileA.scores;
  const b = profileB.scores;
  const health = layerHealth(a, b);

  type Row = { domain: string; diverges: boolean; risk: string };
  const rows: Row[] = [
    {
      domain: "Privacy / closeness",
      diverges: diff(a.closenessNeed - a.privacyNeed, b.closenessNeed - b.privacyNeed) > 24,
      risk: "Space may be read as rejection; closeness may be read as pressure.",
    },
    {
      domain: "How care lands",
      diverges: (a.structureNeed > a.warmthNeed) !== (b.structureNeed > b.warmthNeed),
      risk: "One of you may be caring in a way the other doesn’t feel as care.",
    },
    {
      domain: "Repair speed",
      diverges: diff(a.repairSpeed, b.repairSpeed) > 24,
      risk: "Fast repair can feel like pressure; slow repair can feel like abandonment.",
    },
    {
      domain: "Proof / trust",
      diverges: diff(a.proofOrientation, b.proofOrientation) > 24,
      risk: "One of you may trust warmth while the other needs evidence they can see.",
    },
    {
      domain: "How heated is too heated",
      diverges: diff(a.heatTolerance, b.heatTolerance) > 24,
      risk: "If one of you can take more heat than the other, that can build a Reach–Recoil loop (one reaches, the other pulls back).",
    },
    {
      domain: "Saying what’s going on",
      diverges: diff(a.transparency, b.transparency) > 24,
      risk: "What one of you leaves unsaid, the other may fill in with a guess.",
    },
  ];

  const mismatch = rows.filter((r) => r.diverges).map((r) => `${r.domain}: ${r.risk}`);

  const strengths = [
    "Both profiles can become shared words for what you each need, not verdicts about who’s right.",
    average([a.proofOrientation, b.proofOrientation]) > 60
      ? "You both respond to evidence, so rebuilding trust through change you can both see (the Proof Protocol) suits you."
      : "Here, repairing warmly first and keeping a daily rhythm are likely to matter more than keeping a record.",
  ];

  const routes = routeTools(profileA, profileB, health);
  const recommendedTools = toRecommendedTools(routes);

  return {
    executiveSummary: `The main thing to work with here is ${mismatch[0]?.split(":")[0].toLowerCase() || "a pattern that’s still settling"}. A good next step is to turn the pattern into a small, low-stakes agreement, then look at how it went at the agreed check-in, instead of re-arguing what anyone meant.`,
    strengths,
    coreMismatch: mismatch.length ? mismatch.slice(0, 4) : ["No single mismatch dominates yet — keep using the tools and revisit this in a few weeks."],
    conflictPattern: buildConflictPattern(profileA, profileB),
    misreadRisks: Array.from(new Set([...profileA.likelyMisreads, ...profileB.likelyMisreads])).slice(0, 5),
    layerHealth: health,
    recommendedTools,
    recommendedSequence: buildSequence(recommendedTools),
    scriptPack: [
      "Warm up: “I’m on your team, even though this is hard.”",
      "Make it safe: “The relationship isn’t on trial in this conversation.”",
      "Say what happened: “When this happens, I read it as distance. I know that might not be what you mean.”",
      "Ask for one thing: “When one of us needs space, can we say so and give a return time?”",
      "Agree on next steps: “Let’s try this for one week and check in on Sunday.”",
    ],
    evidenceLimitations: [
      "This is a starting map, not a diagnosis — it’s built from how you each answered 44 questions, not from what either of you does over time.",
      "The scoring draws on research that skews heterosexual and Western. The Manual folds in research on same-sex, interracial and intercultural couples, but treat any single suggestion here as a starting point, not a verdict.",
    ],
  };
}
