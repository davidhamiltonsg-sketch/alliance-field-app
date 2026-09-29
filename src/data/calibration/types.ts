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

/** One partner's answers, keyed by question id. Undefined = unanswered. */
export type PersonAnswers = Record<string, ChoiceKey | undefined>;

export type PersonInput = {
  name: string;
  answers: PersonAnswers;
};

export type CalibrationState = {
  personA: PersonInput;
  personB: PersonInput;
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
  conflictPattern: string;
  misreadRisks: string[];
  layerHealth: Record<LayerKey, number>;
  recommendedTools: RecommendedTool[];
  recommendedSequence: string[];
  scriptPack: string[];
  evidenceLimitations: string[];
};
