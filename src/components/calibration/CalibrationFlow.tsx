"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/calibration/questions";
import type { AnswerValue, ChoiceKey, PersonKey } from "@/data/calibration/types";
import { answeredCount, firstUnansweredIndex, isComplete, readCalibration, skippedCount, writeCalibration } from "@/lib/calibration";
import { CALIBRATION_KEY } from "@/lib/calibration";
import { clearKey } from "@/lib/storage";
import { generateProfile } from "@/lib/calibration";
import { PrimaryButton } from "../PrimaryButton";
import { SoloProfile } from "./CalibrationReport";
import { ArrowLeft } from "../icons";

const noopSubscribe = () => () => {};

/** Renders the flow only on the client, where saved answers are readable. */
export function CalibrationFlow() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) {
    return <p className="py-6 text-center text-base text-ink-muted">Loading…</p>;
  }
  return <CalibrationFlowClient />;
}

type Phase = "names" | "quiz" | "handoff" | "bdone";

function CalibrationFlowClient() {
  const router = useRouter();
  const [state, setState] = useState(readCalibration);
  const started = answeredCount(state.personA.answers) > 0 || answeredCount(state.personB.answers) > 0;

  const initialPerson: PersonKey = isComplete(state.personA.answers) ? "B" : "A";
  const [phase, setPhase] = useState<Phase>(started ? "quiz" : "names");
  const [person, setPerson] = useState<PersonKey>(initialPerson);
  const [index, setIndex] = useState(() => firstUnansweredIndex(state[initialPerson === "A" ? "personA" : "personB"].answers));
  const [previewA, setPreviewA] = useState(false);

  // Move focus to the question heading when the question changes (not on load).
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    questionHeading.current?.focus();
  }, [index, person, phase]);

  const personInput = person === "A" ? state.personA : state.personB;
  const question = questions[index];
  const skippedHere = skippedCount(personInput.answers);
  const answeredHere = answeredCount(personInput.answers) - skippedHere;

  const commit = (next: typeof state) => {
    setState(next);
    writeCalibration(next);
  };

  const choose = (choice: AnswerValue) => {
    const key = person === "A" ? "personA" : "personB";
    const next = { ...state, [key]: { ...personInput, answers: { ...personInput.answers, [question.id]: choice } } };
    commit(next);

    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    // Finished this person's 44 questions.
    if (person === "A") {
      // Shared device: A's individual profile is private by default.
      commit({ ...next, aPrivate: true });
      setPhase("handoff");
    } else {
      // B gets the same privacy choice, private by default.
      commit({ ...next, bPrivate: true });
      setPhase("bdone");
    }
  };

  const back = () => {
    if (index > 0) setIndex(index - 1);
  };

  const startOver = () => {
    clearKey(CALIBRATION_KEY);
    const fresh = readCalibration();
    setState(fresh);
    setPerson("A");
    setIndex(0);
    setPhase("names");
  };

  if (phase === "names") {
    return (
      <div className="space-y-4">
        <div className="card space-y-4 px-4 py-4">
          <div className="space-y-1.5">
            <label htmlFor="partner-a-name" className="block text-sm font-medium text-ink">
              Partner A
            </label>
            <input
              id="partner-a-name"
              autoComplete="off"
              className="field-input text-base"
              value={state.personA.name === "Partner A" ? "" : state.personA.name}
              placeholder="Partner A"
              onChange={(e) => commit({ ...state, personA: { ...state.personA, name: e.target.value || "Partner A" } })}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="partner-b-name" className="block text-sm font-medium text-ink">
              Partner B
            </label>
            <input
              id="partner-b-name"
              autoComplete="off"
              className="field-input text-base"
              value={state.personB.name === "Partner B" ? "" : state.personB.name}
              placeholder="Partner B"
              onChange={(e) => commit({ ...state, personB: { ...state.personB, name: e.target.value || "Partner B" } })}
            />
          </div>
        </div>
        <p className="text-sm leading-normal text-ink-muted">
          This is one shared phone, and you take turns: {state.personA.name} answers all 44 questions
          first, then hands the phone to {state.personB.name}. One question at a time; answer for
          yourself, and skip any question you’d rather not answer. Answers stay on this phone.
        </p>
        <PrimaryButton onClick={() => setPhase("quiz")}>Begin — {state.personA.name}’s turn</PrimaryButton>
      </div>
    );
  }

  if (phase === "handoff") {
    return (
      <div className="space-y-4 text-center">
        <div className="card space-y-2 px-4 py-6">
          <p className="display text-lg leading-tight">{state.personA.name}’s answers are in.</p>
          <p className="text-base leading-normal text-ink-muted">
            Next, pass this phone to {state.personB.name}: it’s their turn on the same 44 questions.
            First, while you’re still holding it, choose what {state.personB.name} can see.
          </p>
        </div>
        <fieldset className="card space-y-2.5 px-4 py-4 text-left">
          <legend className="sr-only">Before you hand over</legend>
          <p className="text-base font-medium leading-normal text-ink" aria-hidden>
            Before you hand over
          </p>
          <p className="text-sm leading-normal text-ink-muted">
            Your answers are saved on this one shared phone. Choose what {state.personB.name} can see.
          </p>
          {([
            [true, `Keep my individual profile private — ${state.personB.name} sees only the couple report`],
            [false, `Share my individual profile with ${state.personB.name}`],
          ] as const).map(([value, text]) => (
            <label
              key={String(value)}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-base leading-snug ${
                state.aPrivate === value ? "border-accent bg-accent/[0.06] text-ink" : "border-rule/60 bg-surface-raised text-ink"
              }`}
            >
              <input
                type="radio"
                name="a-privacy"
                className="mt-1 accent-[var(--color-accent)]"
                checked={state.aPrivate === value}
                onChange={() => commit({ ...state, aPrivate: value })}
              />
              {text}
            </label>
          ))}
        </fieldset>
        <PrimaryButton
          onClick={() => {
            setPreviewA(false);
            setPerson("B");
            setIndex(firstUnansweredIndex(state.personB.answers));
            setPhase("quiz");
          }}
        >
          Begin — {state.personB.name}’s turn
        </PrimaryButton>
        {/* Only offered when A chose to share: once private, the phone is about to change hands. */}
        {!state.aPrivate && (
          <button
            type="button"
            onClick={() => setPreviewA((v) => !v)}
            aria-expanded={previewA}
            className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-accent hover:underline"
          >
            {previewA ? "Hide my profile" : `View ${state.personA.name}’s profile first`}
          </button>
        )}
        {previewA && !state.aPrivate && (
          <div className="text-left">
            <SoloProfile profile={generateProfile("A", state.personA)} otherName={state.personB.name} preview />
          </div>
        )}
      </div>
    );
  }

  if (phase === "bdone") {
    return (
      <div className="space-y-4 text-center">
        <div className="card space-y-2 px-4 py-6">
          <p className="display text-lg leading-tight">{state.personB.name}’s answers are in.</p>
          <p className="text-base leading-normal text-ink-muted">
            You’ve both had your turn on this phone. Before you look at the report together,{" "}
            {state.personB.name}, choose what {state.personA.name} can see.
          </p>
        </div>
        <fieldset className="card space-y-2.5 px-4 py-4 text-left">
          <legend className="sr-only">Before you show the report</legend>
          <p className="text-base font-medium leading-normal text-ink" aria-hidden>
            Before you show the report
          </p>
          <p className="text-sm leading-normal text-ink-muted">
            Your answers are saved on this one shared phone. Choose what {state.personA.name} can see.
          </p>
          {([
            [true, `Keep my individual profile private — ${state.personA.name} sees only the couple report`],
            [false, `Share my individual profile with ${state.personA.name}`],
          ] as const).map(([value, text]) => (
            <label
              key={String(value)}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-base leading-snug ${
                state.bPrivate === value ? "border-accent bg-accent/[0.06] text-ink" : "border-rule/60 bg-surface-raised text-ink"
              }`}
            >
              <input
                type="radio"
                name="b-privacy"
                className="mt-1 accent-[var(--color-accent)]"
                checked={state.bPrivate === value}
                onChange={() => commit({ ...state, bPrivate: value })}
              />
              {text}
            </label>
          ))}
        </fieldset>
        <PrimaryButton onClick={() => router.push("/calibrate/report")}>See the couple report</PrimaryButton>
      </div>
    );
  }

  const pct = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-accent">
            {personInput.name} · Question {index + 1} of {questions.length}
          </p>
          <p className="tabular text-sm font-medium text-ink-muted">{pct}%</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent/12" role="progressbar" aria-label="Calibration progress" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1}>
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <section className="card space-y-4 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">{question.domain}</p>
        <h2 ref={questionHeading} tabIndex={-1} className="focus-target display text-lg leading-tight">
          <span className="sr-only">
            {personInput.name}, question {index + 1} of {questions.length}:{" "}
          </span>
          {question.prompt}
        </h2>
        <div className="space-y-2.5">
          {(["a", "b"] as ChoiceKey[]).map((key) => {
            const text = key === "a" ? question.a : question.b;
            const selected = personInput.answers[question.id] === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => choose(key)}
                aria-pressed={selected}
                className={`w-full rounded-xl border px-4 py-3.5 text-left text-base leading-snug transition-colors ${
                  selected ? "border-accent bg-accent/10 font-medium text-accent" : "border-rule/60 bg-surface-raised text-ink hover:border-accent/30"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={index === 0}
          className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          type="button"
          onClick={() => choose("skip")}
          aria-pressed={personInput.answers[question.id] === "skip"}
          className="inline-flex min-h-11 items-center px-2 text-base font-medium text-accent"
        >
          Skip this question
        </button>
      </div>
      <p className="tabular text-center text-sm text-ink-muted">
        {answeredHere}/{questions.length} answered{skippedHere > 0 ? ` · ${skippedHere} skipped` : ""}
      </p>

      <button type="button" onClick={startOver} className="w-full min-h-11 rounded-xl text-sm font-medium text-ink-muted hover:bg-ink/[0.04]">
        Start over
      </button>
    </div>
  );
}
