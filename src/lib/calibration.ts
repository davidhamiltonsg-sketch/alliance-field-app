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
  if (high(scores.closenessNeed) && high(scores.withdrawalUnderStress)) patterns.push("Approach–retreat under stress");
  if (high(scores.structureNeed) && high(scores.warmthNeed)) patterns.push("Needs both warmth and structure to feel safe");
  if (high(scores.accountabilityOrientation) && scores.repairSpeed <= 42) patterns.push("Wants a proof window, not a quick fix");
  if (high(scores.privacyNeed) && high(scores.careVisibility)) patterns.push("Private care style — shows care quietly");
  if (high(scores.signalSensitivity) && scores.transparency <= 42) patterns.push("Reads small signals but doesn't always name them");
  if (high(scores.deflectionRisk)) patterns.push("Deflects under exposure — humour, logic, or a topic change");
  if (high(scores.proofOrientation)) patterns.push("Trusts evidence over words");
  if (high(scores.privacyNeed) && high(scores.autonomyProtection)) patterns.push("Protects autonomy — space reads as necessary, not distant");
  if (high(scores.reassuranceNeed) && high(scores.signalSensitivity)) patterns.push("Needs visible reassurance to feel stable");
  if (!patterns.length) patterns.push("Balanced operating profile — no single pattern dominates");
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
          : `${name} uses a mixed safety strategy — some warmth, some structure, and context before conclusions.`;

  const careStyle =
    high(scores.proofOrientation) || high(scores.structureNeed)
      ? `Care lands for ${name} through reliability, action, and follow-through more than words.`
      : `Care lands for ${name} through warmth, presence, and being told, not just shown.`;

  const conflictResponse =
    high(scores.withdrawalUnderStress) && high(scores.conflictActivation)
      ? `Under stress, ${name} may swing between pushing for resolution and going quiet. Pacing matters.`
      : high(scores.withdrawalUnderStress)
        ? `Under stress, ${name} is likely to go quiet or ask for space to regulate.`
        : high(scores.conflictActivation)
          ? `Under stress, ${name} is likely to move towards the issue quickly and want clarity.`
          : `Under stress, ${name} tends to stay workable as long as warmth is still in the room.`;

  const privacyAutonomy = high(scores.privacyNeed)
    ? `High privacy need — space has to come with a return time to stay connected instead of reading as distance.`
    : `Moderate privacy need — closeness can usually be negotiated directly if warmth stays intact.`;

  const likelyMisreads = [
    high(scores.signalSensitivity)
      ? `${name} may read silence, delay, or a cooler tone as disconnection.`
      : `${name} may miss small cues until they're named directly.`,
    high(scores.structureNeed)
      ? `${name} may hear vagueness as unreliability.`
      : `${name} may hear too much structure as pressure.`,
    high(scores.privacyNeed)
      ? `${name} may experience questions as intrusive when intensity is already high.`
      : `${name} may experience space as rejection if it isn't paired with reassurance.`,
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
    return `${a.name} tends to pursue clarity while ${b.name} de-intensifies. Left alone that's a demand–withdraw loop — Pause + Return with an explicit return time breaks it.`;
  if (!aPursues && bPursues)
    return `${b.name} tends to pursue clarity while ${a.name} de-intensifies. Left alone that's a demand–withdraw loop — Pause + Return with an explicit return time breaks it.`;
  if (aPursues && bPursues)
    return "Both of you tend to escalate to get a reaction. The first move is slowing the urgency down before reassurance itself becomes the fight.";
  return "Both of you tend to de-intensify. Low conflict can hide low contact — keep Morning + Evening Rhythm and Weekly Reset running so distance doesn't build quietly.";
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
  "Accountability Sequence": "conflict-protocol",
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

  if (health.Atmosphere < 62) add("Morning + Evening Rhythm", "Atmosphere is running low — restore warmth before asking for change.");
  if (health.Structure < 62) add("Weekly Reset", "Structure is running low — install a predictable maintenance rhythm.");
  if (health.Repair < 62) add("Micro-Repair", "Repair capacity is running low — use smaller repair units, more often.");
  if (health.Protection < 62) add("Pause + Return", "Protection is running low — you need clearer guardrails under stress.");

  if (diff(a.scores.privacyNeed, b.scores.closenessNeed) > 18 || diff(b.scores.privacyNeed, a.scores.closenessNeed) > 18) {
    add("Pause + Return", "Privacy and closeness needs are far enough apart to be misread as rejection or pressure.");
  }
  if (diff(a.scores.careVisibility, b.scores.careVisibility) > 14 || diff(a.scores.warmthNeed, b.scores.structureNeed) > 18 || diff(b.scores.warmthNeed, a.scores.structureNeed) > 18) {
    add("Care Check-in", "Care grammar mismatch — one of you may be caring in a language the other can't feel.");
  }
  if (average([a.scores.proofOrientation, b.scores.proofOrientation]) > 64) {
    add("Consistency Pact", "Trust needs behaviour, evidence, and a review window here, not just words.");
  }
  if (average([a.scores.deflectionRisk, b.scores.deflectionRisk]) > 62) {
    add("Accountability Sequence", "Deflection risk is elevated — use impact-before-intent to keep repair from sliding off.");
  }
  if (
    average([a.scores.withdrawalUnderStress, b.scores.withdrawalUnderStress]) > 60 &&
    average([a.scores.reassuranceNeed, b.scores.reassuranceNeed, a.scores.signalSensitivity, b.scores.signalSensitivity]) > 55
  ) {
    add("Uninvestment Check", "Withdrawal is elevated and being closely watched. Confirm whether this is needing space or quietly pulling away before assuming either.");
  }
  if (!routes.length) {
    add("Morning + Evening Rhythm", "Keep daily contact predictable.");
    add("Weekly Reset", "Maintain the operating rhythm before drift appears.");
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
  const sequence = ["Warmth signal", ...tools.slice(0, 4).map((t) => t.title), "Review at Weekly Reset"];
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
      domain: "Care grammar",
      diverges: (a.structureNeed > a.warmthNeed) !== (b.structureNeed > b.warmthNeed),
      risk: "One of you may be caring in a language the other doesn't feel as care.",
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
      domain: "Heat tolerance",
      diverges: diff(a.heatTolerance, b.heatTolerance) > 24,
      risk: "Different intensity thresholds can build a pursue–withdraw loop.",
    },
    {
      domain: "Transparency",
      diverges: diff(a.transparency, b.transparency) > 24,
      risk: "What goes unsaid on one side can become the other side's projection.",
    },
  ];

  const mismatch = rows.filter((r) => r.diverges).map((r) => `${r.domain}: ${r.risk}`);

  const strengths = [
    "Both profiles can be turned into shared operating language instead of verdicts about who's right.",
    average([a.proofOrientation, b.proofOrientation]) > 60
      ? "There's real potential for proof-based trust repair here — you both respond to evidence."
      : "Warmth-first repair and a daily rhythm will do more work here than proof windows will.",
  ];

  const routes = routeTools(profileA, profileB, health);
  const recommendedTools = toRecommendedTools(routes);

  return {
    executiveSummary: `This relationship is operating around ${mismatch[0]?.split(":")[0].toLowerCase() || "a workable, still-calibrating pattern"}. The strongest next step is turning the pattern into a low-threat agreement, then reviewing Proof at the agreed check-in instead of relitigating intent.`,
    strengths,
    coreMismatch: mismatch.length ? mismatch.slice(0, 4) : ["No single mismatch dominates yet — keep using the tools and revisit this in a few weeks."],
    conflictPattern: buildConflictPattern(profileA, profileB),
    misreadRisks: Array.from(new Set([...profileA.likelyMisreads, ...profileB.likelyMisreads])).slice(0, 5),
    layerHealth: health,
    recommendedTools,
    recommendedSequence: buildSequence(recommendedTools),
    scriptPack: [
      "Warmth: “I'm on your team, even though this is hard.”",
      "Safety: “The relationship isn't on trial in this conversation.”",
      "Expression: “When this happens, I read it as distance. I know that might not be what you mean.”",
      "Request: “Can we use a clear signal and a return time when space is needed?”",
      "Alignment: “Let's try this for one week and check in on Sunday.”",
    ],
    evidenceLimitations: [
      "This calibration is a starting map, not a diagnosis — it's built from how you each answered 44 questions, not from observed behaviour over time.",
      "The scoring model draws on research that skews heterosexual and Western; same-sex, interracial, and intercultural couple research is folded into the Manual, but treat any single recommendation here as a starting point, not a verdict.",
    ],
  };
}
