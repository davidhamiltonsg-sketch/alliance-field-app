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
import { CalibrationReport } from "@/components/calibration/CalibrationReport";

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

describe("Skip on every question", () => {
  it("offers Skip, records it and moves on", () => {
    writeCalibration({ ...emptyCalibration(), personA: { name: "Sam", answers: { [questions[0].id]: "a" } }, personB: { name: "Alex", answers: {} } });
    act(() => root.render(<CalibrationFlow />));
    expect(text()).toContain(`Question 2 of ${questions.length}`);
    act(() => button(/Skip this question/)!.click());
    expect(readCalibration().personA.answers[questions[1].id]).toBe("skip");
    expect(text()).toContain(`Question 3 of ${questions.length}`);
    expect(text()).toContain("1 skipped");
  });

  it("finishes a turn when the last question is skipped", () => {
    writeCalibration({ ...emptyCalibration(), personA: { name: "Sam", answers: allButLast() }, personB: { name: "Alex", answers: {} } });
    act(() => root.render(<CalibrationFlow />));
    act(() => button(/Skip this question/)!.click());
    expect(text()).toContain("Sam’s answers are in.");
  });
});

describe("couple report on the page", () => {
  const opposite = (): PersonAnswers => Object.fromEntries(questions.map((q) => [q.id, "b"]));

  it("names nobody in the clash or misread lines when both profiles are private", () => {
    writeCalibration({ personA: { name: "Alex", answers: all() }, personB: { name: "Sam", answers: opposite() }, aPrivate: true, bPrivate: true });
    act(() => root.render(<CalibrationReport />));
    expect(text()).toContain("One of you tends to push for an answer while the other backs off.");
    expect(text()).not.toMatch(/Alex tends|Sam tends|Sam backs off|Alex backs off/);
    const misreads = [...container.querySelectorAll("section")].find((s) => /Easy to misread/.test(s.textContent ?? ""))!;
    expect(misreads.textContent).not.toMatch(/Alex|Sam/);
  });

  it("says plainly when nothing differs, with no clash story and one misread line each", () => {
    writeCalibration({ personA: { name: "Alex", answers: all() }, personB: { name: "Sam", answers: all() }, aPrivate: true, bPrivate: true });
    act(() => root.render(<CalibrationReport />));
    expect(text()).toContain("your answers are close in all five areas");
    expect(text()).not.toContain("Where you two see things most differently");
    expect(text()).not.toContain("When you clash");
    expect(text()).not.toMatch(/tends to push/);
    const items = [...container.querySelectorAll("section")].find((s) => /Easy to misread/.test(s.textContent ?? ""))!.querySelectorAll("li");
    expect(items).toHaveLength(3);
  });

  it("notes skipped questions", () => {
    const someSkipped = { ...all(), [questions[0].id]: "skip", [questions[1].id]: "skip" } as PersonAnswers;
    writeCalibration({ personA: { name: "Alex", answers: someSkipped }, personB: { name: "Sam", answers: all() }, aPrivate: true, bPrivate: true });
    act(() => root.render(<CalibrationReport />));
    expect(text()).toContain("2 questions were skipped");
  });
});
