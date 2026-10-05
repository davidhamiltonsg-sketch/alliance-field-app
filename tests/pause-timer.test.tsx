// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PAUSE_KEY } from "@/lib/storage";
import { STALE_AFTER_MS, checkSavedPause, clockReturnTarget, parseCustomMinutes } from "@/lib/timer";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { PauseTimer } from "@/components/PauseTimer";
import { StartReminder } from "@/components/StartReminder";
import { startDays } from "@/data/start";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const MIN = 60 * 1000;
let root: Root;
let container: HTMLDivElement;
const notifications: string[] = [];

beforeEach(() => {
  localStorage.clear();
  notifications.length = 0;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  vi.stubGlobal(
    "Notification",
    Object.assign(
      function (title: string) {
        notifications.push(title);
      },
      { permission: "granted", requestPermission: async () => "granted" },
    ),
  );
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

const render = (el: React.ReactElement) => act(() => root.render(el));
const text = () => container.textContent ?? "";
const button = (name: string) => [...container.querySelectorAll("button")].find((b) => b.textContent?.trim() === name)!;

/** Types into a React-controlled input. */
function type(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("custom minutes (L7)", () => {
  it("accepts whole minutes from 20 to 1440 only", () => {
    expect(parseCustomMinutes("20")).toEqual({ ok: true, minutes: 20 });
    expect(parseCustomMinutes(" 1440 ")).toEqual({ ok: true, minutes: 1440 });
    for (const bad of ["", "abc", "20.5", "1e3", "-30", "+45", "0x20"]) {
      expect(parseCustomMinutes(bad).ok, bad).toBe(false);
    }
    expect(parseCustomMinutes("19")).toMatchObject({ ok: false, error: expect.stringContaining("at least 20") });
    expect(parseCustomMinutes("1441")).toMatchObject({ ok: false, error: expect.stringContaining("maximum") });
  });

  it("in the timer: a decimal is refused with a message, a whole number starts the pause", () => {
    render(<PauseTimer />);
    const input = container.querySelector<HTMLInputElement>("#custom-minutes")!;
    type(input, "20.5");
    act(() => button("Start").click());
    expect(text()).toContain("Enter a whole number of minutes, 20 to 1440.");
    expect(localStorage.getItem(PAUSE_KEY)).toBeNull();
    type(input, "25");
    act(() => button("Start").click());
    const saved = JSON.parse(localStorage.getItem(PAUSE_KEY)!);
    expect(Date.parse(saved.returnAt) - Date.parse(saved.startedAt)).toBe(25 * MIN);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });
});

describe("clock-time return (midnight rollover)", () => {
  const at = (h: number, m: number) => new Date(2026, 9, 1, h, m, 0, 0);

  it("rolls a time that has passed today over to tomorrow", () => {
    const r = clockReturnTarget("00:15", at(23, 50));
    expect(r.ok && r.target).toEqual(new Date(2026, 9, 2, 0, 15));
    const r2 = clockReturnTarget("23:49", at(23, 50));
    expect(r2.ok && (r2.target.getTime() - at(23, 50).getTime()) / MIN).toBe(1439);
  });

  it("keeps the 20-minute minimum across midnight", () => {
    expect(clockReturnTarget("00:05", at(23, 50))).toMatchObject({ ok: false, error: expect.stringContaining("less than 20 minutes") });
    expect(clockReturnTarget("23:55", at(23, 50))).toMatchObject({ ok: false });
    expect(clockReturnTarget("00:10", at(23, 50)).ok).toBe(true);
  });

  it("refuses an empty or malformed time", () => {
    for (const bad of ["", "7pm", "25:00", "12:60"]) expect(clockReturnTarget(bad, at(12, 0)).ok, bad).toBe(false);
  });
});

describe("a pause read back from storage (L5, L6)", () => {
  const now = Date.UTC(2026, 9, 1, 12, 0);
  const iso = (ms: number) => new Date(ms).toISOString();

  it("classifies saved pauses", () => {
    expect(checkSavedPause(null, now)).toEqual({ state: "none" });
    expect(checkSavedPause({ returnAt: null, startedAt: null }, now)).toEqual({ state: "none" });
    expect(checkSavedPause({ returnAt: iso(now + 10 * MIN), startedAt: iso(now - 20 * MIN) }, now)).toMatchObject({ state: "active" });
    // Ended within the last 24 hours: still shown (the "time to reconnect" view).
    expect(checkSavedPause({ returnAt: iso(now - 23 * 60 * MIN), startedAt: iso(now - 24 * 60 * MIN) }, now)).toMatchObject({ state: "active" });
    expect(checkSavedPause({ returnAt: iso(now - STALE_AFTER_MS - MIN), startedAt: null }, now)).toEqual({ state: "stale" });
    for (const bad of [
      { returnAt: "garbage", startedAt: null },
      { returnAt: 12345, startedAt: null },
      { returnAt: iso(now + 3 * 24 * 60 * MIN), startedAt: null },
      { returnAt: iso(now + 10 * MIN), startedAt: iso(now + 20 * MIN) },
      { returnAt: iso(now + 10 * MIN), startedAt: "nope" },
    ]) {
      expect(checkSavedPause(bad, now), JSON.stringify(bad)).toEqual({ state: "invalid" });
    }
  });

  it("clears a pause that ended more than 24 hours ago, without an alarm", () => {
    const ended = Date.now() - STALE_AFTER_MS - 5 * MIN;
    localStorage.setItem(PAUSE_KEY, JSON.stringify({ returnAt: iso(ended), startedAt: iso(ended - 20 * MIN) }));
    render(<PauseTimer />);
    expect(text()).toContain("Choose a return time");
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(localStorage.getItem(PAUSE_KEY)).toBeNull();
    expect(notifications).toEqual([]);
  });

  it("clears an unreadable pause instead of showing “Invalid Date”", () => {
    localStorage.setItem(PAUSE_KEY, JSON.stringify({ returnAt: "not a date", startedAt: null }));
    render(<PauseTimer />);
    expect(text()).toContain("Choose a return time");
    expect(text()).not.toMatch(/Invalid Date|NaN/);
    expect(localStorage.getItem(PAUSE_KEY)).toBeNull();
  });

  it("resumes a running pause in the calm view", () => {
    localStorage.setItem(PAUSE_KEY, JSON.stringify({ returnAt: iso(Date.now() + 15 * MIN), startedAt: iso(Date.now() - 5 * MIN) }));
    render(<PauseTimer />);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(text()).toContain("Breathe in as it grows");
  });

  it("uses a still breathing cue under reduced motion (L8)", () => {
    window.matchMedia = ((q: string) => ({ matches: /reduce/.test(q), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    localStorage.setItem(PAUSE_KEY, JSON.stringify({ returnAt: iso(Date.now() + 15 * MIN), startedAt: iso(Date.now() - 5 * MIN) }));
    render(<PauseTimer />);
    expect(text()).toContain("Breathe slowly: in for a count of four, out for six.");
    expect(text()).not.toContain("as it grows");
  });
});

describe("restart cue uses plain step names (M7)", () => {
  it("after “I’m back”", () => {
    localStorage.setItem(PAUSE_KEY, JSON.stringify({ returnAt: new Date(Date.now() - MIN).toISOString(), startedAt: new Date(Date.now() - 21 * MIN).toISOString() }));
    render(<PauseTimer />);
    act(() => button("I’m back").click());
    const cue = container.querySelector("#restart-cue")!.textContent!;
    expect(cue).toContain("Warm up");
    expect(cue).toContain("Make it safe");
    expect(cue).toContain("Say what happened → Ask for one thing → Agree on next steps");
    expect(cue).not.toMatch(/Warmth|Expression|Alignment|Alliance not threatened/);
  });

  it("the 7-day plan's day 3 is plain, like the Kit's First Week", () => {
    const day3 = startDays.find((d) => d.day === 3)!;
    expect(day3.task).not.toMatch(/2%|softness/);
    expect(day3.task).toContain("Start within minutes if you can; finish within 24 hours.");
  });
});

describe("calendar reminders refuse an empty time (L9)", () => {
  it("StartReminder", () => {
    const created = vi.fn(() => "blob:x");
    URL.createObjectURL = created;
    render(<StartReminder />);
    const input = container.querySelector<HTMLInputElement>('input[type="time"]')!;
    type(input, "");
    act(() => button("Add reminder (.ics)").click());
    expect(text()).toContain("Choose a time first");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(created).not.toHaveBeenCalled();
  });
});
