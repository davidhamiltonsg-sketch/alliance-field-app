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
  return { personA: emptyPersonInput("Partner A"), personB: emptyPersonInput("Partner B"), aPrivate: false, bPrivate: false };
}

export function readCalibration(): CalibrationState {
  const state = readJson<CalibrationState>(CALIBRATION_KEY);
  if (!state) return emptyCalibration();
  return {
    personA: { name: state.personA?.name || "Partner A", answers: state.personA?.answers || {} },
    personB: { name: state.personB?.name || "Partner B", answers: state.personB?.answers || {} },
    aPrivate: state.aPrivate === true,
    bPrivate: state.bPrivate === true,
  };
}

export function writeCalibration(state: CalibrationState) {
  writeJson(CALIBRATION_KEY, state);
}

/** Questions this partner has dealt with: answered or skipped. */
export function answeredCount(answers: PersonAnswers): number {
  return questions.filter((q) => answers[q.id]).length;
}

/** Questions this partner chose to skip. */
export function skippedCount(answers: PersonAnswers): number {
  return questions.filter((q) => answers[q.id] === "skip").length;
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
    const answer = answers[q.id];
    // A skipped question adds nothing: the score stays where the other answers put it.
    if (answer !== "a" && answer !== "b") return;
    const choice: ChoiceKey = answer;
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
  if (high(scores.closenessNeed) && high(scores.withdrawalUnderStress)) patterns.push(`When things get hard, ${name} tends to reach out, then pull back.`);
  if (high(scores.structureNeed) && high(scores.warmthNeed)) patterns.push(`${name} does best when the warmth and the plan arrive together.`);
  if (high(scores.accountabilityOrientation) && scores.repairSpeed <= 42) patterns.push(`${name} would rather see things change over a few weeks than get a quick fix.`);
  if (high(scores.privacyNeed) && high(scores.careVisibility)) patterns.push(`${name} tends to show care quietly, in small private ways.`);
  if (high(scores.signalSensitivity) && scores.transparency <= 42) patterns.push(`${name} notices small signals, and doesn’t always say so.`);
  if (high(scores.deflectionRisk)) patterns.push(`When ${name} feels exposed, a joke, a fact or a change of subject often comes out first.`);
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
      ? `A hard conversation lands better with ${name} when it starts warm and comes with a plan. Agree both before you begin.`
      : high(scores.structureNeed)
        ? `Clear plans, kept, help ${name} feel safe. Say what you’ll each do and when, then do it.`
        : high(scores.warmthNeed)
          ? `A warm tone helps ${name} feel safe. Get warm first, then raise the hard thing.`
          : `A bit of both helps ${name} feel safe: some warmth, a rough plan, and the full story heard before either of you decides what it meant.`;

  const careStyle =
    high(scores.proofOrientation) || high(scores.structureNeed)
      ? `Promises kept and jobs done feel like care to ${name}. When one gets done, say so out loud.`
      : `Warmth, time together and hearing it said feel like care to ${name}. Make room for one of those each day.`;

  const conflictResponse =
    high(scores.withdrawalUnderStress) && high(scores.conflictActivation)
      ? `When it gets heated, ${name} can swing between pushing for an answer and going quiet. Slow down together, and agree a pause signal before you need it.`
      : high(scores.withdrawalUnderStress)
        ? `When it gets heated, ${name} is likely to go quiet or ask for time to settle. Agree when you’ll pick it up again.`
        : high(scores.conflictActivation)
          ? `When it gets heated, ${name} is likely to go straight to the problem and want an answer. Agree when the answer will come, even if it isn’t tonight.`
          : `When it gets heated, ${name} can usually keep talking, as long as it still feels warm between you. Keep your tone soft, then take the topic.`;

  const privacyAutonomy = high(scores.privacyNeed)
    ? `Time alone matters a lot to ${name}. Agree a return time, so the time apart has an end you both know.`
    : `Some time alone suits ${name}. While things are warm, agree together how much.`;

  const likelyMisreads = [
    high(scores.signalSensitivity)
      ? `A slow reply can feel like distance to ${name}. Say when you’re just busy.`
      : `Small cues can slip past ${name}. Say the ones that matter out loud.`,
    high(scores.structureNeed)
      ? `To ${name}, a vague plan can sound like a promise that won’t be kept. Put a day or a time on it.`
      : `To ${name}, a lot of planning can feel like pressure. Keep the plan short and leave some room.`,
    high(scores.privacyNeed)
      ? `When things are already heated, questions can feel like prying to ${name}. Ask one, then leave some space.`
      : `Time apart can feel like rejection to ${name}. Whoever steps away, say when you’ll be back.`,
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

/** Layer health at or above this reads as “answers close”. */
export const CLOSE_HEALTH = 85;

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

const REACH_RECOIL_TAIL =
  "Left alone, that can become a Reach–Recoil loop (one reaches, the other pulls back). Pause + Return, with an exact return time, is designed to break it.";

/**
 * The clash story. `anonymous` (either profile private) never names or
 * attributes a side to one person: it says “one of you… the other…”.
 */
function buildConflictPattern(a: Profile, b: Profile, anonymous: boolean): string {
  const aPursues = a.scores.conflictActivation > a.scores.withdrawalUnderStress;
  const bPursues = b.scores.conflictActivation > b.scores.withdrawalUnderStress;
  if (aPursues !== bPursues) {
    if (anonymous) return `One of you tends to push for an answer while the other backs off. ${REACH_RECOIL_TAIL}`;
    const [pusher, backer] = aPursues ? [a, b] : [b, a];
    return `${pusher.name} tends to push for an answer while ${backer.name} backs off. ${REACH_RECOIL_TAIL}`;
  }
  if (aPursues && bPursues)
    return "You both push when you’re worried. Slow down before the asking turns into the fight.";
  return "You both tend to back off. That can mean fewer fights, and less contact. The Daily Rhythm and the Weekly Reset are designed to catch the distance early.";
}

// Maps a recommendation's concept to a real Field Kit protocol slug.
// Concepts with no standalone card route to the closest existing one.
const TOOL_SLUG: Record<string, string> = {
  "60-Second Reset": "60-second-reset",
  "Pause + Return": "pause-and-return",
  "Weekly Reset": "weekly-reset",
  "The monthly part of the Weekly Reset": "weekly-reset",
  "Micro-Repair": "micro-repair",
  "Impact first, then explain": "full-repair",
  "Consistency Pact": "consistency-pact",
  "Check-Up": "check-up",
  "Full Repair": "full-repair",
  "Trust Recovery": "trust-recovery",
  "Intimacy Pact": "intimacy-pact",
  "System Overlay": "system-overlay",
  "Daily Rhythm": "daily-rhythm",
  "Green Rule": "green-rule",
};

function routeTools(a: Profile, b: Profile, health: Record<LayerKey, number>) {
  const routes: { tool: string; reason: string }[] = [];
  const add = (tool: string, reason: string) => {
    if (!routes.some((r) => r.tool === tool)) routes.push({ tool, reason });
  };

  if (health.Atmosphere < 62) add("Daily Rhythm", "Your answers are far apart on warmth. Start there, with a little each day, before either of you asks for a change.");
  if (health.Structure < 62) add("Weekly Reset", "You see the everyday arrangements differently: who does what, and when. Begin with a Weekly Reset you can both count on.");
  if (health.Repair < 62) add("Micro-Repair", "Whoever’s ready first makes one small move today, like a kind word or a cup of tea, and the bigger talk waits for a time you both agree.");
  if (health.Protection < 62) add("Pause + Return", "You don’t agree on what keeps a heated moment safe. Agree now what you’ll each do when it gets there.");

  if (diff(a.scores.privacyNeed, b.scores.closenessNeed) > 18 || diff(b.scores.privacyNeed, a.scores.closenessNeed) > 18) {
    add("Pause + Return", "You need different amounts of space and closeness. To one of you, ‘I need a minute’ can sound like being left. Whoever asks for the pause says when they’ll be back.");
  }
  if (diff(a.scores.careVisibility, b.scores.careVisibility) > 14 || diff(a.scores.warmthNeed, b.scores.structureNeed) > 18 || diff(b.scores.warmthNeed, a.scores.structureNeed) > 18) {
    add("The monthly part of the Weekly Reset", "You show care differently, so some of what you give may be going unnoticed. Tell each other about one recent moment you felt looked after, and what did it.");
  }
  if (average([a.scores.proofOrientation, b.scores.proofOrientation]) > 64) {
    add("Consistency Pact", "Pick one small thing each and do it where the other can see. Look at it together at your next Weekly Reset.");
  }
  if (average([a.scores.deflectionRisk, b.scores.deflectionRisk]) > 62) {
    add("Impact first, then explain", "When a moment gets hard, a joke or an explanation tends to arrive first. So keep one order: say how it landed first, explain after.");
  }
  if (
    average([a.scores.withdrawalUnderStress, b.scores.withdrawalUnderStress]) > 60 &&
    average([a.scores.reassuranceNeed, b.scores.reassuranceNeed, a.scores.signalSensitivity, b.scores.signalSensitivity]) > 55
  ) {
    add("Check-Up", "You both tend to pull back when things are hard, and to notice when the other does. Do the Check-Up together to tell needing space from pulling away, instead of guessing.");
  }
  if (!routes.length) {
    add("Daily Rhythm", "Keep a little daily contact you can both count on.");
    add("Weekly Reset", "Keep a Weekly Reset going, so small things get said while they’re small.");
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
  const sequence = ["One warm, true sentence", ...tools.slice(0, 4).map((t) => t.title), "Check how last week’s Reset went"];
  return Array.from(new Set(sequence));
}

type MisreadPair = { test: (s: Scores) => boolean; yes: [string, string]; no: [string, string] };

/** Each misread: [what may happen to whoever it fits, what to do about it]. */
const MISREADS: MisreadPair[] = [
  {
    test: (s) => high(s.signalSensitivity),
    yes: ["a slow reply can feel like distance", "Say when you’re just busy."],
    no: ["small cues can slip past", "Say the ones that matter out loud."],
  },
  {
    test: (s) => high(s.structureNeed),
    yes: ["a vague plan can sound like a promise that won’t be kept", "Put a day or a time on it."],
    no: ["a lot of planning can feel like pressure", "Keep the plan short and leave some room."],
  },
  {
    test: (s) => high(s.privacyNeed),
    yes: ["when things are already heated, questions can feel like prying", "Ask one, then leave some space."],
    no: ["time apart can feel like rejection", "Whoever steps away, say when you’ll be back."],
  },
];

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * One line per misread about both of you, never one line per partner.
 * When either profile is private, nobody is named.
 */
function buildCoupleMisreads(a: Profile, b: Profile, anonymous: boolean): string[] {
  return MISREADS.map(({ test, yes, no }) => {
    const aYes = test(a.scores);
    const bYes = test(b.scores);
    if (aYes === bYes) {
      const [what, todo] = aYes ? yes : no;
      return `For both of you, ${what}. ${todo}`;
    }
    if (anonymous) return `For one of you, ${yes[0]}; for the other, ${no[0]}. ${yes[1]} ${no[1]}`;
    const [yesName, noName] = aYes ? [a.name, b.name] : [b.name, a.name];
    return `For ${yesName}, ${yes[0]}; for ${noName}, ${no[0]}. ${yes[1]} ${no[1]}`;
  }).map(cap);
}

/** Shown when no difference stands out, so there’s nothing for a “next step” to refer to. */
export const NO_DIFFERENCE_SUMMARY = "You see things much the same way. Pick whatever you’d most like to talk about and start there.";

export type CoupleReportOptions = {
  /**
   * True when either partner kept their individual profile private (the default).
   * The report then names nobody and attributes nothing to one person.
   */
  anonymous?: boolean;
  /** Questions skipped by both of you together. */
  skippedCount?: number;
};

export function generateCoupleReport(profileA: Profile, profileB: Profile, options: CoupleReportOptions = {}): CoupleReport {
  const anonymous = options.anonymous ?? true;
  const a = profileA.scores;
  const b = profileB.scores;
  const health = layerHealth(a, b);

  type Row = { domain: string; diverges: boolean; risk: string; summary: string; shared: string };
  const rows: Row[] = [
    {
      domain: "Space and closeness",
      diverges: diff(a.closenessNeed - a.privacyNeed, b.closenessNeed - b.privacyNeed) > 24,
      risk: "Space can read as rejection, and closeness as pressure.",
      summary: "You want different amounts of time together and time alone. Each of you, say how much of each feels like enough.",
      shared: "You want about the same balance of space and closeness.",
    },
    {
      domain: "What feels like care",
      diverges: (a.structureNeed > a.warmthNeed) !== (b.structureNeed > b.warmthNeed),
      risk: "One of you may be showing care in a way the other doesn’t count as care.",
      summary: "For one of you, care looks like things getting sorted; for the other, it looks like warmth. Each of you name one thing that feels like care to you.",
      shared: "You both count the same kinds of things as care.",
    },
    {
      domain: "Repair speed",
      diverges: diff(a.repairSpeed, b.repairSpeed) > 24,
      risk: "Making up fast can feel like pressure; making up slowly can feel like being left.",
      summary: "You make up at different speeds: tonight would suit one of you, morning the other. Agree how long is long enough, and one kind thing to say in the meantime.",
      shared: "You both want to make up at about the same pace.",
    },
    {
      domain: "What makes trust feel real",
      diverges: diff(a.proofOrientation, b.proofOrientation) > 24,
      risk: "One of you trusts what’s said; the other waits to see it done.",
      summary: "Warm words are enough for one of you, while the other waits to see what happens next. Pick one small promise and keep it where you can both see it.",
      shared: "Trust feels real to both of you in much the same way.",
    },
    {
      domain: "How heated is too heated",
      diverges: diff(a.heatTolerance, b.heatTolerance) > 24,
      risk: "When one of you can stay in a heated talk longer, that one tends to push, and the other to pull back.",
      summary: "Your limits for a heated conversation aren’t the same. Agree the signal that means ‘stop here’, before you need it.",
      shared: "You agree, more or less, on how heated a conversation can get.",
    },
    {
      domain: "Saying what’s going on",
      diverges: diff(a.transparency, b.transparency) > 24,
      risk: "What one of you leaves unsaid, the other tends to fill in with a guess.",
      summary: "Thinking out loud comes easily to one of you and less to the other. Tell each other which you are, so silence isn’t read as a verdict.",
      shared: "You both say about the same amount out loud.",
    },
  ];

  const diverging = rows.filter((r) => r.diverges);
  const noDifference = diverging.length === 0 && Object.values(health).every((h) => h >= CLOSE_HEALTH);
  const mismatch = diverging.map((r) => `${r.domain}: ${r.risk}`);

  const routes = routeTools(profileA, profileB, health);
  const recommendedTools = toRecommendedTools(routes);

  // Name something the couple’s own answers already agree on, rather than a generic line.
  // One trust line per report: when the Consistency Pact is recommended, its reason carries the move.
  const firstShared = rows.find((r) => !r.diverges);
  const pactRecommended = recommendedTools.some((t) => t.slug === "consistency-pact");
  const strengths = [
    ...(firstShared ? [firstShared.shared] : []),
    average([a.proofOrientation, b.proofOrientation]) > 60
      ? pactRecommended
        ? "You both trust what you can see. The Consistency Pact below builds on that."
        : "You both trust what you can see. So agree one small change each and look at it together at your next Weekly Reset."
      : "You two lean on warmth and daily habits more than on keeping a record. Keep your morning and evening check-ins going, and add one small habit at your next Weekly Reset.",
  ];

  return {
    executiveSummary: diverging.length
      ? `${diverging[0].summary} Try it for a week, then look at how it went at your next check-in, rather than arguing again about what anyone meant.`
      : NO_DIFFERENCE_SUMMARY,
    strengths,
    coreMismatch: mismatch.length ? mismatch.slice(0, 4) : ["No one difference stands out yet. Keep using the tools and come back to this in a few weeks."],
    // Nothing differs: no clash story, so the page never contradicts “answers close”.
    conflictPattern: noDifference ? "" : buildConflictPattern(profileA, profileB, anonymous),
    noDifference,
    skippedCount: options.skippedCount ?? 0,
    misreadRisks: buildCoupleMisreads(profileA, profileB, anonymous),
    layerHealth: health,
    recommendedTools,
    recommendedSequence: buildSequence(recommendedTools),
    // The System Overlay card’s Say This lines, word for word.
    scriptPack: (getProtocol("system-overlay")?.phrases ?? []).map((p) => p.text),
    evidenceLimitations: [
      "This is a starting map, built from how you each answered 44 questions. It can’t see what either of you does day to day, and it isn’t a diagnosis.",
      "These questions lean on research done mostly with straight, Western couples. The Manual folds in research on same-sex, interracial and intercultural couples, but treat any one suggestion here as a place to start, not a verdict.",
    ],
  };
}
