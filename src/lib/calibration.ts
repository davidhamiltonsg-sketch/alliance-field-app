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

function detectPatterns(scores: Scores, name: string): string[] {
  const patterns: string[] = [];
  if (high(scores.closenessNeed) && high(scores.withdrawalUnderStress)) patterns.push(`When things get hard, ${name} may reach out, then pull back.`);
  if (high(scores.structureNeed) && high(scores.warmthNeed)) patterns.push(`${name} does best when the warmth and the plan arrive together.`);
  if (high(scores.accountabilityOrientation) && scores.repairSpeed <= 42) patterns.push(`${name} would rather see things change over a few weeks than get a quick fix.`);
  if (high(scores.privacyNeed) && high(scores.careVisibility)) patterns.push(`${name} tends to show care quietly, in small private ways.`);
  if (high(scores.signalSensitivity) && scores.transparency <= 42) patterns.push(`${name} notices small signals, and doesn’t always say so.`);
  if (high(scores.deflectionRisk)) patterns.push(`When ${name} feels exposed, a joke, a fact or a change of subject may come out first.`);
  if (high(scores.proofOrientation)) patterns.push(`${name} trusts what someone does more than what they say.`);
  if (high(scores.privacyNeed) && high(scores.autonomyProtection)) patterns.push(`${name} needs time alone, and it isn’t a sign of distance.`);
  if (high(scores.reassuranceNeed) && high(scores.signalSensitivity)) patterns.push(`${name} feels steadier when reassurance is said out loud, or shown.`);
  if (!patterns.length) patterns.push("No one pattern stands out yet.");
  return Array.from(new Set(patterns)).slice(0, 5);
}

export function generateProfile(person: PersonKey, input: PersonInput): Profile {
  const scores = scorePerson(input.answers);
  const name = input.name?.trim() || (person === "A" ? "Partner A" : "Partner B");
  const patterns = detectPatterns(scores, name);

  const safetyLogic =
    high(scores.structureNeed) && high(scores.warmthNeed)
      ? `${name} needs warmth and a clear plan before a hard conversation can land.`
      : high(scores.structureNeed)
        ? `${name} feels safest when plans are clear and kept.`
        : high(scores.warmthNeed)
          ? `${name} feels safest when the tone between you is warm.`
          : `${name} feels safest with a bit of both: some warmth, a rough plan, and the whole story before anyone decides what it meant.`;

  const careStyle =
    high(scores.proofOrientation) || high(scores.structureNeed)
      ? `${name} feels most cared for when promises are kept and things get done.`
      : `${name} feels most cared for through warmth, time together, and hearing it said out loud.`;

  const conflictResponse =
    high(scores.withdrawalUnderStress) && high(scores.conflictActivation)
      ? `When it gets heated, ${name} may swing between pushing for an answer and going quiet. Slowing down helps.`
      : high(scores.withdrawalUnderStress)
        ? `When it gets heated, ${name} is likely to go quiet or ask for time to settle.`
        : high(scores.conflictActivation)
          ? `When it gets heated, ${name} is likely to go straight to the problem and want an answer.`
          : `When it gets heated, ${name} can usually keep talking, as long as it still feels warm between you.`;

  const privacyAutonomy = high(scores.privacyNeed)
    ? `${name} needs plenty of privacy. Time apart works best with a return time, so it doesn’t feel like distance.`
    : `${name} needs some privacy, and the two of you can usually agree how close to be while things stay warm.`;

  const likelyMisreads = [
    high(scores.signalSensitivity)
      ? `${name} may read silence, a slow reply or a cooler tone as pulling away.`
      : `${name} may miss small cues until someone says them out loud.`,
    high(scores.structureNeed)
      ? `${name} may hear a vague plan as a promise that won’t be kept.`
      : `${name} may hear a lot of planning as pressure.`,
    high(scores.privacyNeed)
      ? `${name} may feel questions as prying when things are already heated.`
      : `${name} may take time apart as rejection unless it comes with some reassurance.`,
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
    return "Both of you tend to push harder when you don’t get a response. Slow down first, before pushing for reassurance turns into the fight.";
  return "Both of you tend to back off. Fewer fights can also mean less contact, so keep up the Morning + Evening Rhythm and the Weekly Reset and the distance doesn’t build quietly.";
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

  if (health.Atmosphere < 62) add("Morning + Evening Rhythm", "Your answers are furthest apart on the warmth between you. Start by bringing it back before you ask for change.");
  if (health.Structure < 62) add("Weekly Reset", "You see the routines and agreements quite differently. A weekly check-in you can both count on is the place to begin.");
  if (health.Repair < 62) add("Micro-Repair", "You make up after a row in different ways. Try smaller repairs, more often.");
  if (health.Protection < 62) add("Pause + Return", "You differ most on what keeps you safe in a heated moment. Agree now what you’ll each do when it gets there.");

  if (diff(a.scores.privacyNeed, b.scores.closenessNeed) > 18 || diff(b.scores.privacyNeed, a.scores.closenessNeed) > 18) {
    add("Pause + Return", "You need different amounts of space and closeness: one of you may take space as rejection, and the other may feel closeness as pressure.");
  }
  if (diff(a.scores.careVisibility, b.scores.careVisibility) > 14 || diff(a.scores.warmthNeed, b.scores.structureNeed) > 18 || diff(b.scores.warmthNeed, a.scores.structureNeed) > 18) {
    add("Care Check-in", "You show care differently — one of you may be caring in a way the other doesn’t feel.");
  }
  if (average([a.scores.proofOrientation, b.scores.proofOrientation]) > 64) {
    add("Consistency Pact", "For you two, trust grows from things you can both see, kept up over a set time.");
  }
  if (average([a.scores.deflectionRisk, b.scores.deflectionRisk]) > 62) {
    add("Impact before explanation (Full Recovery)", "One of you tends to slide away from hard moments with a joke or an explanation. Name the impact first, then explain what you meant, so the repair lands.");
  }
  if (
    average([a.scores.withdrawalUnderStress, b.scores.withdrawalUnderStress]) > 60 &&
    average([a.scores.reassuranceNeed, b.scores.reassuranceNeed, a.scores.signalSensitivity, b.scores.signalSensitivity]) > 55
  ) {
    add("Uninvestment Check", "You both tend to pull back when things are hard, and to notice when the other does. Do the check together to tell needing space from pulling away, instead of guessing.");
  }
  if (!routes.length) {
    add("Morning + Evening Rhythm", "Keep a little daily contact you can both count on.");
    add("Weekly Reset", "Keep a weekly check-in going, so small things get said while they’re small.");
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

  type Row = { domain: string; diverges: boolean; risk: string; summary: string };
  const rows: Row[] = [
    {
      domain: "Privacy / closeness",
      diverges: diff(a.closenessNeed - a.privacyNeed, b.closenessNeed - b.privacyNeed) > 24,
      risk: "Space may be read as rejection; closeness may be read as pressure.",
      summary: "How much space and how much closeness do you each need? Talk about that first.",
    },
    {
      domain: "How care lands",
      diverges: (a.structureNeed > a.warmthNeed) !== (b.structureNeed > b.warmthNeed),
      risk: "One of you may be caring in a way the other doesn’t feel as care.",
      summary: "Notice how each of you shows care, and what each of you counts as care.",
    },
    {
      domain: "Repair speed",
      diverges: diff(a.repairSpeed, b.repairSpeed) > 24,
      risk: "Making up fast can feel like pressure; making up slowly can feel like being left.",
      summary: "It’s about timing: one of you wants to make up sooner than the other.",
    },
    {
      domain: "Proof / trust",
      diverges: diff(a.proofOrientation, b.proofOrientation) > 24,
      risk: "One of you may trust warm words while the other needs to see it.",
      summary: "Trust feels real in different ways: warm words for one of you, things you can see for the other.",
    },
    {
      domain: "How heated is too heated",
      diverges: diff(a.heatTolerance, b.heatTolerance) > 24,
      risk: "If one of you can take more heat than the other, that can build a Reach–Recoil loop (one reaches, the other pulls back).",
      summary: "Agree how heated a conversation can get before one of you needs to stop.",
    },
    {
      domain: "Saying what’s going on",
      diverges: diff(a.transparency, b.transparency) > 24,
      risk: "What one of you leaves unsaid, the other may fill in with a guess.",
      summary: "Work out how much each of you says out loud about what’s going on.",
    },
  ];

  const diverging = rows.filter((r) => r.diverges);
  const mismatch = diverging.map((r) => `${r.domain}: ${r.risk}`);

  const strengths = [
    "These profiles give you shared words for what you each need, so you can talk about it without anyone being in the wrong.",
    average([a.proofOrientation, b.proofOrientation]) > 60
      ? "You both trust what you can see, so rebuilding trust through change you can both point to (the Proof Protocol) suits you."
      : "For you two, warm repairs and a steady daily rhythm will probably matter more than keeping a record.",
  ];

  const routes = routeTools(profileA, profileB, health);
  const recommendedTools = toRecommendedTools(routes);

  return {
    executiveSummary: `${diverging[0]?.summary ?? "No one difference stands out yet, so there’s no single thing to work on first."} A good next step: turn it into one small agreement, try it, and look at how it went at your next check-in, rather than arguing again about what anyone meant.`,
    strengths,
    coreMismatch: mismatch.length ? mismatch.slice(0, 4) : ["No one difference stands out yet. Keep using the tools and come back to this in a few weeks."],
    conflictPattern: buildConflictPattern(profileA, profileB),
    misreadRisks: Array.from(new Set([...profileA.likelyMisreads, ...profileB.likelyMisreads])).slice(0, 5),
    layerHealth: health,
    recommendedTools,
    recommendedSequence: buildSequence(recommendedTools),
    // The System Overlay card’s Say This lines, word for word.
    scriptPack: (getProtocol("system-overlay")?.phrases ?? []).map((p) => p.text),
    evidenceLimitations: [
      "This is a starting map, built from how you each answered 44 questions. It can’t see what either of you does day to day, and it isn’t a diagnosis.",
      "The scoring draws on research that skews heterosexual and Western. The Manual folds in research on same-sex, interracial and intercultural couples, but treat any one suggestion here as a place to start, not a verdict.",
    ],
  };
}
