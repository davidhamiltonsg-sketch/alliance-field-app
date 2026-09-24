import type { CareAuditRow, PauseState, WorksheetDraft } from "@/data/types";

export const PAUSE_KEY = "alliance.field.pause";
export const WEEKLY_KEY = "alliance.field.weeklyReset";

export const CARE_DOMAINS = [
  "Emotional attunement & check-ins",
  "Logistics & household",
  "Social coordination",
  "Financial planning",
  "Conflict initiation & repair",
] as const;

export function emptyCareAudit(): CareAuditRow[] {
  return CARE_DOMAINS.map((domain) => ({
    domain,
    balance: "",
    rebalance: "",
  }));
}

export function emptyWeeklyDraft(): WorksheetDraft {
  return {
    appreciationA: "",
    appreciationB: "",
    careAudit: emptyCareAudit(),
    supportedWhen: "",
    aloneWhen: "",
    frictionA: "",
    askA: "",
    frictionB: "",
    askB: "",
    nextStep: "",
    reviewWhen: "",
    updatedAt: new Date().toISOString(),
  };
}

export function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readPause(): PauseState {
  return readJson<PauseState>(PAUSE_KEY) ?? { returnAt: null, startedAt: null };
}

export function writePause(state: PauseState) {
  writeJson(PAUSE_KEY, state);
}

export function readWeekly(): WorksheetDraft {
  const d = readJson<WorksheetDraft>(WEEKLY_KEY);
  if (!d) return emptyWeeklyDraft();
  if (!d.careAudit || d.careAudit.length !== CARE_DOMAINS.length) {
    d.careAudit = emptyCareAudit();
  }
  return d;
}

export function writeWeekly(draft: WorksheetDraft) {
  writeJson(WEEKLY_KEY, {
    ...draft,
    updatedAt: new Date().toISOString(),
  });
}
