// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { questions } from "@/data/calibration/questions";
import type { PersonAnswers } from "@/data/calibration/types";
import { emptyCalibration, readCalibration, writeCalibration } from "@/lib/calibration";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let container: HTMLDivElement;
const text = () => container.textContent ?? "";
const buttons = () => [...container.querySelectorAll("button")];
const button = (re: RegExp) => buttons().find((b) => re.test(b.textContent ?? ""));
/** All answered but the last question. */
const allButLast = (): PersonAnswers => Object.fromEntries(questions.slice(0, -1).map((q) => [q.id, "a"]));
const all = (): PersonAnswers => Object.fromEntries(questions.map((q) => [q.id, "a"]));

beforeEach(() => {
  localStorage.clear();
  push.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

/** Answers the current (last) question with the first option. */
function answerLast() {
  const q = questions.at(-1)!;
  act(() => buttons().find((b) => b.textContent === q.a)!.click());
}

describe("Profile Calibration on one shared phone", () => {
  it("says plainly that you take turns on one phone", () => {
    act(() => root.render(<CalibrationFlow />));
    expect(text()).toMatch(/one shared phone, and you take turns/);
  });

  it("hides A's profile preview once A keeps it private (the default), and shows it only if A shares", () => {
    writeCalibration({ ...emptyCalibration(), personA: { name: "Sam", answers: allButLast() }, personB: { name: "Alex", answers: {} } });
    act(() => root.render(<CalibrationFlow />));
    answerLast();
    expect(text()).toContain("Sam’s answers are in.");
    expect(readCalibration().aPrivate).toBe(true);
    expect(button(/View Sam’s profile first/)).toBeUndefined();

    const share = container.querySelectorAll<HTMLInputElement>('input[name="a-privacy"]')[1];
    act(() => share.click());
    expect(readCalibration().aPrivate).toBe(false);
    expect(button(/View Sam’s profile first/)).toBeDefined();

    const keep = container.querySelectorAll<HTMLInputElement>('input[name="a-privacy"]')[0];
    act(() => keep.click());
    expect(button(/View Sam’s profile first/)).toBeUndefined();
    expect(text()).not.toContain("Solo profile");
  });

  it("gives B the same privacy choice before the report opens", () => {
    writeCalibration({ ...emptyCalibration(), aPrivate: true, personA: { name: "Sam", answers: all() }, personB: { name: "Alex", answers: allButLast() } });
    act(() => root.render(<CalibrationFlow />));
    answerLast();
    expect(push).not.toHaveBeenCalled();
    expect(text()).toContain("Alex’s answers are in.");
    const radios = container.querySelectorAll<HTMLInputElement>('input[name="b-privacy"]');
    expect(radios).toHaveLength(2);
    expect(readCalibration().bPrivate).toBe(true);
    expect(radios[0].checked).toBe(true);
    act(() => radios[1].click());
    expect(readCalibration().bPrivate).toBe(false);
    act(() => button(/See the couple report/)!.click());
    expect(push).toHaveBeenCalledWith("/calibrate/report");
  });
});
