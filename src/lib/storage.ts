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
/** 7-day start plan: the day numbers ticked as done (no dates, no streaks). */
export const START_PROGRESS_KEY = "alliance.field.startPlanDone";

/** Load-check areas (CANON round 9). Also the `domain` stored on each row. */
export const CARE_DOMAINS = [
  "Noticing each other & check-ins",
  "Logistics & household",
  "Social plans",
  "Money planning",
  "Raising problems & repairing",
] as const;

/**
 * Earlier names for the same areas, in the same order. Drafts saved before the
 * rename still carry these, so they are mapped to the current label on read
 * (and for display) rather than thrown away.
 */
const LEGACY_CARE_DOMAINS: Record<string, (typeof CARE_DOMAINS)[number]> = {
  "Emotional attunement & check-ins": "Noticing each other & check-ins",
  "Social coordination": "Social plans",
  "Financial planning": "Money planning",
  "Conflict initiation & repair": "Raising problems & repairing",
};

/** The label to show for a stored load-check area (old names map to the current ones). */
export function careDomainLabel(domain: string): string {
  return LEGACY_CARE_DOMAINS[domain] ?? domain;
}

/** Display labels for the stored load values (stored values stay "balanced" / "skewed"). */
export const CARE_BALANCE_LABELS = { balanced: "Even", skewed: "Lopsided" } as const;

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
 * In-memory flag (not storage): set by wipeAll so the service worker isn't
 * registered again — re-downloading the offline copy — while this page stays
 * open. It disappears on the next full page load, when the app registers the
 * worker as usual.
 */
const SW_PAUSED = "__allianceSwPausedUntilReload";

export function swRegistrationPaused(): boolean {
  return typeof window !== "undefined" && (window as unknown as Record<string, unknown>)[SW_PAUSED] === true;
}

/**
 * Deletes everything this app has stored in this browser: every "alliance.*"
 * localStorage key, all Cache Storage entries (the offline copy of the app)
 * and the service worker registration that keeps it. Nothing is stored on a
 * server. The worker is not registered again until the next full page load
 * (see swRegistrationPaused); then the offline copy is downloaded afresh,
 * with none of the deleted answers.
 * Returns the number of localStorage keys removed.
 */
export async function wipeAll(): Promise<number> {
  if (typeof window === "undefined") return 0;
  (window as unknown as Record<string, unknown>)[SW_PAUSED] = true;
  const keys = allianceKeys();
  keys.forEach(clearKey);
  try {
    if ("serviceWorker" in navigator) {
      // The worker keeps serving this open page after it is unregistered:
      // tell it to stop caching first (see scripts/sw.template.js).
      navigator.serviceWorker.controller?.postMessage({ type: "alliance:wipe" });
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }
  } catch {
    /* no service worker support (or blocked) — nothing registered */
  }
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
  } else {
    d.careAudit = d.careAudit.map((row) => ({ ...row, domain: careDomainLabel(row.domain) }));
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

/** Days of the 7-day start plan ticked as done, ascending. Ignores anything that isn't a day 1–7. */
export function readStartProgress(): number[] {
  const raw = readJson<unknown>(START_PROGRESS_KEY);
  if (!Array.isArray(raw)) return [];
  const days = raw.filter((d): d is number => Number.isInteger(d) && d >= 1 && d <= 7);
  return Array.from(new Set(days)).sort((a, b) => a - b);
}

/** Ticks or unticks a day of the start plan and returns the updated list. */
export function toggleStartDay(day: number): number[] {
  const current = readStartProgress();
  const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b);
  writeJson(START_PROGRESS_KEY, next);
  return next;
}
