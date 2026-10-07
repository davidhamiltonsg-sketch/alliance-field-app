export type PersonKey = "A" | "B";
export type ChoiceKey = "a" | "b";

export type ScoreKey =
  | "warmthNeed"
  | "structureNeed"
  | "privacyNeed"
  | "closenessNeed"
  | "reassuranceNeed"
  | "autonomyProtection"
  | "careVisibility"
  | "accountabilityOrientation"
  | "repairSpeed"
  | "signalSensitivity"
  | "heatTolerance"
  | "transparency"
  | "supportReceptivity"
  | "conflictActivation"
  | "withdrawalUnderStress"
  | "proofOrientation"
  | "rhythmNeed"
  | "trustSensitivity"
  | "deflectionRisk"
  | "governanceNeed";

export type Scores = Record<ScoreKey, number>;

export type Question = {
  id: string;
  domain: string;
  prompt: string;
  a: string;
  b: string;
  effects: Record<ChoiceKey, Partial<Record<ScoreKey, number>>>;
};

/** A chosen option, or "skip": either of you may skip any question. */
export type AnswerValue = ChoiceKey | "skip";

/** One partner's answers, keyed by question id. Undefined = not reached yet. */
export type PersonAnswers = Record<string, AnswerValue | undefined>;

export type PersonInput = {
  name: string;
  answers: PersonAnswers;
};

export type CalibrationState = {
  personA: PersonInput;
  personB: PersonInput;
  /**
   * Shared-device privacy: when true, Partner B sees only the couple report,
   * never Partner A's individual profile. Defaults to true once A finishes;
   * A can choose to share before handing the device over.
   */
  aPrivate: boolean;
  /**
   * The same choice for Partner B, made when B finishes (private by default).
   * When false, A can open B's individual profile from the couple report.
   */
  bPrivate: boolean;
};

export type Profile = {
  person: PersonKey;
  name: string;
  scores: Scores;
  patterns: string[];
  primaryPattern: string;
  safetyLogic: string;
  careStyle: string;
  conflictResponse: string;
  privacyAutonomy: string;
  likelyMisreads: string[];
};

export type LayerKey = "Atmosphere" | "Structure" | "Repair" | "Protection" | "Insight";

export type RecommendedTool = {
  slug: string;
  title: string;
  reason: string;
};

export type CoupleReport = {
  executiveSummary: string;
  strengths: string[];
  coreMismatch: string[];
  /** The clash story; empty when nothing differs, so the report writes none. */
  conflictPattern: string;
  /** True when no area differs: every layer close and no diverging row. */
  noDifference: boolean;
  /** How many questions were skipped in all (both of you together). */
  skippedCount: number;
  misreadRisks: string[];
  layerHealth: Record<LayerKey, number>;
  recommendedTools: RecommendedTool[];
  recommendedSequence: string[];
  scriptPack: string[];
  evidenceLimitations: string[];
};
