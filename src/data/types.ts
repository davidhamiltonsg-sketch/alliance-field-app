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

export interface Protocol {
  slug: string;
  title: string;
  concept: string;
  whenToUse: string;
  steps: string[];
  phrases: Phrase[];
  working: string;
  notWorking: string;
  activity: string;
  crossLinks: { label: string; href?: string }[];
  warn?: string;
  accentHint?: "safety" | "pause" | "repair" | "accent";
}

export interface Situation {
  id: string;
  label: string;
  description: string;
  firstMove: string;
  primaryHref: string;
  secondaryHrefs?: { label: string; href: string }[];
  warn?: boolean;
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

export interface InstallDay {
  day: number;
  title: string;
  bullets: string[];
  proof: string;
  cardSlugs?: string[];
}

export interface NavItem {
  href: string;
  label: string;
}
