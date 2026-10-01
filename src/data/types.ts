export type Marker =
  | "TOOL"
  | "RULE"
  | "WARN"
  | "DO"
  | "NOTE"
  | "PHRASE"
  | "OK"
  | "FAIL";

export interface Phrase {
  text: string;
}

export type Tier = "core" | "situational" | "build";

export interface Protocol {
  slug: string;
  title: string;
  /** CANON round 4: Core (learn first), Situational (pulled by the Situation Map), Build (ongoing). */
  tier: Tier;
  concept: string;
  whenToUse: string;
  steps: string[];
  phrases: Phrase[];
  working: string;
  notWorking: string;
  activity: string;
  crossLinks: { label: string; href?: string }[];
  warn?: string;
  /** A closing note shown after the steps (e.g. "Leaving is valid"). */
  note?: string;
  /** Show the "Afraid, not just flooded? Get help" link under the warning. */
  safetyLink?: boolean;
  accentHint?: "safety" | "pause" | "repair" | "accent";
}

export interface Situation {
  id: string;
  label: string;
  description: string;
  firstMove: string;
  primaryHref: string;
  secondaryHrefs?: { label: string; href: string }[];
  /** Glyph for the row when its primary link isn't a protocol page. */
  icon?: string;
  /** Safety row: always first, routes to Help & safety, never to Pause. */
  danger?: boolean;
}

export interface CareAuditRow {
  domain: string;
  balance: "" | "balanced" | "skewed";
  rebalance: "" | "yes" | "no";
}

export interface WorksheetDraft {
  appreciationA: string;
  appreciationB: string;
  careAudit: CareAuditRow[];
  supportedWhen: string;
  aloneWhen: string;
  frictionA: string;
  askA: string;
  frictionB: string;
  askB: string;
  nextStep: string;
  reviewWhen: string;
  updatedAt: string;
}

export interface PauseState {
  returnAt: string | null;
  startedAt: string | null;
}

export interface NavItem {
  href: string;
  label: string;
}
