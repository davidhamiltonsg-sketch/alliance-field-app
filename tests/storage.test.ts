// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CARE_DOMAINS,
  FAVORITES_KEY,
  MAX_RECENT,
  MAX_WEEKLY_HISTORY,
  START_PROGRESS_KEY,
  WEEKLY_HISTORY_KEY,
  WEEKLY_KEY,
  allianceKeys,
  appendWeeklyHistory,
  clearWeeklyHistory,
  emptyWeeklyDraft,
  readFavorites,
  readJson,
  readPause,
  readRecent,
  readStartProgress,
  readWeekly,
  readWeeklyHistory,
  recordRecent,
  toggleFavorite,
  toggleStartDay,
  wipeAll,
  writeJson,
  writePause,
} from "@/lib/storage";
import { CALIBRATION_KEY } from "@/lib/calibration";
import { INTRO_SEEN_KEY } from "@/components/splash/boot";

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("readJson / writeJson", () => {
  it("round-trips JSON values", () => {
    expect(writeJson("alliance.test", { a: 1 })).toBe(true);
    expect(readJson("alliance.test")).toEqual({ a: 1 });
  });

  it("returns null for missing or corrupt values", () => {
    expect(readJson("alliance.missing")).toBeNull();
    window.localStorage.setItem("alliance.bad", "{not json");
    expect(readJson("alliance.bad")).toBeNull();
  });
});

describe("pause", () => {
  it("defaults to no pause and round-trips", () => {
    expect(readPause()).toEqual({ returnAt: null, startedAt: null });
    writePause({ returnAt: "2026-01-01T10:20:00Z", startedAt: "2026-01-01T10:00:00Z" });
    expect(readPause().returnAt).toBe("2026-01-01T10:20:00Z");
  });
});

describe("weekly reset", () => {
  it("repairs a draft whose care rows don't match the current domains", () => {
    writeJson(WEEKLY_KEY, { ...emptyWeeklyDraft(), careAudit: [] });
    expect(readWeekly().careAudit.map((r) => r.domain)).toEqual([...CARE_DOMAINS]);
  });

  it("keeps history newest first and capped", () => {
    for (let i = 0; i < MAX_WEEKLY_HISTORY + 3; i++) {
      appendWeeklyHistory({ ...emptyWeeklyDraft(), nextStep: `step ${i}` });
    }
    const history = readWeeklyHistory();
    expect(history).toHaveLength(MAX_WEEKLY_HISTORY);
    expect(history[0].nextStep).toBe(`step ${MAX_WEEKLY_HISTORY + 2}`);
  });

  it("clears history on request", () => {
    appendWeeklyHistory(emptyWeeklyDraft());
    clearWeeklyHistory();
    expect(readWeeklyHistory()).toEqual([]);
    expect(window.localStorage.getItem(WEEKLY_HISTORY_KEY)).toBeNull();
  });
});

describe("favorites and recent", () => {
  it("toggles favorites on and off", () => {
    expect(toggleFavorite("green-rule")).toEqual(["green-rule"]);
    expect(toggleFavorite("pause-and-return")).toEqual(["green-rule", "pause-and-return"]);
    expect(toggleFavorite("green-rule")).toEqual(["pause-and-return"]);
    expect(readFavorites()).toEqual(["pause-and-return"]);
  });

  it("moves revisits to the front, dedupes and caps", () => {
    for (let i = 0; i < MAX_RECENT + 2; i++) recordRecent(`p${i}`);
    recordRecent("p3");
    const recent = readRecent();
    expect(recent[0]).toBe("p3");
    expect(recent).toHaveLength(MAX_RECENT);
    expect(new Set(recent).size).toBe(recent.length);
  });
});

describe("7-day plan progress", () => {
  it("ticks and unticks days, sorted and deduped", () => {
    expect(readStartProgress()).toEqual([]);
    expect(toggleStartDay(3)).toEqual([3]);
    expect(toggleStartDay(1)).toEqual([1, 3]);
    expect(toggleStartDay(3)).toEqual([1]);
    expect(readStartProgress()).toEqual([1]);
  });

  it("ignores corrupt or out-of-range values", () => {
    writeJson(START_PROGRESS_KEY, [0, 2, 2, 8, "4", 7.5, 7]);
    expect(readStartProgress()).toEqual([2, 7]);
    writeJson(START_PROGRESS_KEY, { day: 1 });
    expect(readStartProgress()).toEqual([]);
  });

  it("lives under the alliance.* prefix, so Delete all data removes it", async () => {
    toggleStartDay(2);
    expect(allianceKeys()).toContain(START_PROGRESS_KEY);
    vi.stubGlobal("caches", { keys: async () => [], delete: async () => true });
    await wipeAll();
    expect(readStartProgress()).toEqual([]);
  });
});

describe("wipeAll", () => {
  it("removes every alliance.* key, leaves other sites' keys, and clears Cache Storage", async () => {
    writeJson(FAVORITES_KEY, ["green-rule"]);
    writeJson(CALIBRATION_KEY, { personA: {}, personB: {} });
    appendWeeklyHistory(emptyWeeklyDraft());
    window.localStorage.setItem(INTRO_SEEN_KEY, "1");
    window.localStorage.setItem("someone-else", "keep");

    const deleted: string[] = [];
    vi.stubGlobal("caches", {
      keys: async () => ["alliance-field-abc", "alliance-field-old"],
      delete: async (name: string) => {
        deleted.push(name);
        return true;
      },
    });

    expect(allianceKeys().length).toBe(4);
    const removed = await wipeAll();
    expect(removed).toBe(4);
    expect(allianceKeys()).toEqual([]);
    expect(window.localStorage.getItem("someone-else")).toBe("keep");
    expect(deleted.sort()).toEqual(["alliance-field-abc", "alliance-field-old"]);
  });

  it("still clears localStorage when Cache Storage is unavailable", async () => {
    writeJson(FAVORITES_KEY, ["x"]);
    vi.stubGlobal("caches", {
      keys: async () => {
        throw new Error("SecurityError");
      },
    });
    await expect(wipeAll()).resolves.toBe(1);
    expect(readFavorites()).toEqual([]);
  });

  it("unregisters every service worker registration", async () => {
    const unregistered: string[] = [];
    const reg = (scope: string) => ({ scope, unregister: async () => (unregistered.push(scope), true) });
    vi.stubGlobal("caches", { keys: async () => [], delete: async () => true });
    const sw = { getRegistrations: async () => [reg("/"), reg("/old/")] };
    Object.defineProperty(window.navigator, "serviceWorker", { value: sw, configurable: true });
    try {
      await wipeAll();
      expect(unregistered.sort()).toEqual(["/", "/old/"]);
    } finally {
      delete (window.navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    }
  });

  it("still clears storage when service worker lookup fails", async () => {
    writeJson(FAVORITES_KEY, ["x"]);
    vi.stubGlobal("caches", { keys: async () => [], delete: async () => true });
    const sw = { getRegistrations: async () => { throw new Error("SecurityError"); } };
    Object.defineProperty(window.navigator, "serviceWorker", { value: sw, configurable: true });
    try {
      await expect(wipeAll()).resolves.toBe(1);
    } finally {
      delete (window.navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    }
  });
});
