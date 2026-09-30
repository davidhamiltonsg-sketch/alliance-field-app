import type { CareAuditRow, PauseState, WorksheetDraft } from "@/data/types";

/** Every key this app writes starts with this prefix (see wipeAll). */
export const STORAGE_PREFIX = "alliance.";

export const PAUSE_KEY = "alliance.field.pause";
export const WEEKLY_KEY = "alliance.field.weeklyReset";
export const WEEKLY_HISTORY_KEY = "alliance.field.weeklyResetHistory";
export const MAX_WEEKLY_HISTORY = 26;
export const FAVORITES_KEY = "alliance.field.favorites";
export const RECENT_KEY = "alliance.field.recentProtocols";
export const MAX_RECENT = 6;

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

/** Lists every localStorage key this app owns (prefix "alliance."). */
export function allianceKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const ls = window.localStorage;
    const keys: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    return keys;
  } catch {
    return [];
  }
}

/**
 * Deletes everything this app has stored on this device: every "alliance.*"
 * localStorage key and all Cache Storage entries (the offline copy of the
 * app). Nothing is stored anywhere else, so afterwards nothing is left.
 * Returns the number of localStorage keys removed.
 */
export async function wipeAll(): Promise<number> {
  if (typeof window === "undefined") return 0;
  const keys = allianceKeys();
  keys.forEach(clearKey);
  try {
    if ("caches" in window) {
      const names = await window.caches.keys();
      await Promise.all(names.map((name) => window.caches.delete(name)));
    }
  } catch {
    /* Cache Storage unavailable (private mode, old browser) — nothing cached */
  }
  return keys.length;
}

export function clearWeeklyHistory() {
  clearKey(WEEKLY_HISTORY_KEY);
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

export function readWeeklyHistory(): WorksheetDraft[] {
  return readJson<WorksheetDraft[]>(WEEKLY_HISTORY_KEY) ?? [];
}

/** Appends a completed Weekly Reset to history, newest first, capped at MAX_WEEKLY_HISTORY. */
export function appendWeeklyHistory(draft: WorksheetDraft) {
  const history = readWeeklyHistory();
  const entry = { ...draft, updatedAt: new Date().toISOString() };
  const next = [entry, ...history].slice(0, MAX_WEEKLY_HISTORY);
  writeJson(WEEKLY_HISTORY_KEY, next);
  return next;
}

export function readFavorites(): string[] {
  return readJson<string[]>(FAVORITES_KEY) ?? [];
}

export function isFavorite(slug: string): boolean {
  return readFavorites().includes(slug);
}

/** Toggles a protocol slug in favorites and returns the updated list. */
export function toggleFavorite(slug: string): string[] {
  const current = readFavorites();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  writeJson(FAVORITES_KEY, next);
  return next;
}

export function readRecent(): string[] {
  return readJson<string[]>(RECENT_KEY) ?? [];
}

/** Records a protocol as visited: moves it to the front, dedupes, caps at MAX_RECENT. */
export function recordRecent(slug: string): string[] {
  const current = readRecent().filter((s) => s !== slug);
  const next = [slug, ...current].slice(0, MAX_RECENT);
  writeJson(RECENT_KEY, next);
  return next;
}
