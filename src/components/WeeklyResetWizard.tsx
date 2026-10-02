"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { WorksheetDraft } from "@/data/types";
import {
  appendWeeklyHistory,
  CARE_BALANCE_LABELS,
  careDomainLabel,
  clearKey,
  clearWeeklyHistory,
  emptyWeeklyDraft,
  readWeekly,
  readWeeklyHistory,
  WEEKLY_KEY,
  writeWeekly,
} from "@/lib/storage";
import { buildWeeklyResetIcs } from "@/lib/ics";
import { downloadObjectUrl } from "@/lib/download";
import { PrimaryButton } from "./PrimaryButton";
import { Field, WizardStep } from "./WizardStep";
import { WarnBanner } from "./WarnBanner";
import { Marker } from "./Marker";
import { ArrowLeft } from "./icons";

const noopSubscribe = () => () => {};

/** Renders the wizard only on the client, where saved answers are readable. */
export function WeeklyResetWizard() {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  if (!mounted) {
    return <p className="py-6 text-center text-base text-ink-muted">Loading…</p>;
  }
  return <WeeklyResetWizardClient />;
}

function WeeklyResetWizardClient() {
  const [step, setStepState] = useState(1);
  // Only move focus once the user has moved between steps, not on page load.
  const [navigated, setNavigated] = useState(false);
  const setStep = (n: number) => {
    setNavigated(true);
    setStepState(n);
  };
  const [draft, setDraft] = useState<WorksheetDraft>(readWeekly);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState<WorksheetDraft[]>(readWeeklyHistory);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const doneHeading = useRef<HTMLHeadingElement>(null);

  // L10: after "Finish reset" the step that had focus is gone; move focus
  // to the result's heading so keyboard and screen-reader users land there.
  useEffect(() => {
    if (!done) return;
    doneHeading.current?.closest("[data-wizard-root]")?.scrollIntoView({ block: "start" });
    doneHeading.current?.focus({ preventScroll: true });
  }, [done]);

  const update = (patch: Partial<WorksheetDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      writeWeekly(next);
      return next;
    });
  };

  const updateCare = (
    index: number,
    patch: Partial<WorksheetDraft["careAudit"][0]>
  ) => {
    setDraft((prev) => {
      const careAudit = prev.careAudit.map((row, i) =>
        i === index ? { ...row, ...patch } : row
      );
      const next = { ...prev, careAudit };
      writeWeekly(next);
      return next;
    });
  };

  const clear = () => {
    clearKey(WEEKLY_KEY);
    setDraft(emptyWeeklyDraft());
    setStepState(1);
    setNavigated(false);
    setDone(false);
    setCalendarAdded(false);
    setConfirmClear(false);
  };

  const clearAll = () => {
    clearWeeklyHistory();
    setHistory([]);
    clear();
  };

  const addToCalendar = () => {
    const { url, filename } = buildWeeklyResetIcs();
    downloadObjectUrl(url, filename);
    setCalendarAdded(true);
  };

  if (done) {
    const recent = history.slice(0, 5);
    return (
      <div data-wizard-root className="scroll-mt-20 space-y-4">
        <Marker kind="OK" label="Complete" />
        <h2 ref={doneHeading} tabIndex={-1} className="focus-target display text-xl leading-tight">
          Reset done
        </h2>
        <p className="text-sm leading-normal text-ink-muted">
          Forty minutes, five parts, done. Same time next week.
        </p>
        <div className="card space-y-2 px-4 py-3.5 text-base leading-normal">
          <p>
            <strong>Next step:</strong> {draft.nextStep || "—"}
          </p>
          <p>
            <strong>Review when:</strong> {draft.reviewWhen || "—"}
          </p>
        </div>
        <PrimaryButton onClick={addToCalendar}>
          {calendarAdded ? "Reminder downloaded ✓" : "Add weekly reminder to calendar"}
        </PrimaryButton>
        {recent.length > 0 && (
          <div className="card space-y-2 px-4 py-3.5 text-sm leading-normal">
            <p className="font-medium text-ink-muted">Recent resets</p>
            <ul className="space-y-1.5">
              {recent.map((r, i) => (
                <li key={i} className="text-ink-muted">
                  {new Date(r.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {r.nextStep ? ` — ${r.nextStep}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={clear}
          className="w-full min-h-12 rounded-xl border border-rule/60 text-base font-medium text-ink"
        >
          Start a new reset
        </button>
        <Link
          href="/"
          className="flex min-h-12 items-center justify-center gap-1.5 text-base font-medium text-accent"
        >
          <ArrowLeft size={16} />
          Situation Map
        </Link>
      </div>
    );
  }

  return (
    <div data-wizard-root className="scroll-mt-20 space-y-4">
      <WarnBanner pauseLink>
        If either of you is flooded, take a Pause + Return and pick another time.
      </WarnBanner>

      {step === 1 && (
        <WizardStep
          step={1}
          total={5}
          focusHeading={navigated}
          title="Appreciation (5 min)"
          onNext={() => setStep(2)}
        >
          <Field
            label="Partner A"
            value={draft.appreciationA}
            onChange={(v) => update({ appreciationA: v })}
            placeholder="One specific appreciation…"
          />
          <Field
            label="Partner B"
            value={draft.appreciationB}
            onChange={(v) => update({ appreciationB: v })}
            placeholder="One specific appreciation…"
          />
        </WizardStep>
      )}

      {step === 2 && (
        <WizardStep
          step={2}
          total={5}
          focusHeading={navigated}
          title="Check the load (15 min)"
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        >
          <p className="text-sm leading-normal text-ink-muted">
            Each week, talk through who’s carrying what. In the first Reset of
            the month, this step is the monthly Care Check-in (inside the Weekly
            Reset): mark each area below.
          </p>
          <ul className="space-y-3">
            {draft.careAudit.map((row, i) => (
              <li
                key={row.domain}
                className="rounded-xl border border-rule/35 bg-surface-activity px-3 py-3"
              >
                <p className="text-base font-medium">{careDomainLabel(row.domain)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label={`${careDomainLabel(row.domain)}: load`}>
                  <span className="w-20 text-sm text-ink-muted" aria-hidden>Load</span>
                  {(["balanced", "skewed"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateCare(i, { balance: b })}
                      aria-pressed={row.balance === b}
                      className={`min-h-11 rounded-full px-3.5 text-sm font-medium capitalize transition-colors ${
                        row.balance === b
                          ? "bg-accent text-paper"
                          : "border border-rule/60 bg-white text-ink"
                      }`}
                    >
                      {CARE_BALANCE_LABELS[b]}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label={`${careDomainLabel(row.domain)}: rebalance?`}>
                  <span className="w-20 text-sm text-ink-muted" aria-hidden>Rebalance?</span>
                  {(["yes", "no"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateCare(i, { rebalance: r })}
                      aria-pressed={row.rebalance === r}
                      className={`min-h-11 rounded-full px-3.5 text-sm font-medium capitalize transition-colors ${
                        row.rebalance === r
                          ? "bg-repair text-paper"
                          : "border border-rule/60 bg-white text-ink"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <Field
            label="I felt supported when"
            value={draft.supportedWhen}
            onChange={(v) => update({ supportedWhen: v })}
          />
          <Field
            label="I felt alone when"
            value={draft.aloneWhen}
            onChange={(v) => update({ aloneWhen: v })}
          />
        </WizardStep>
      )}

      {step === 3 && (
        <WizardStep
          step={3}
          total={5}
          focusHeading={navigated}
          title="One friction point (15 min)"
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        >
          <Field
            label="Partner A: friction"
            value={draft.frictionA}
            onChange={(v) => update({ frictionA: v })}
          />
          <Field
            label="Partner A: ask"
            value={draft.askA}
            onChange={(v) => update({ askA: v })}
            placeholder="One specific ask…"
          />
          <Field
            label="Partner B: friction"
            value={draft.frictionB}
            onChange={(v) => update({ frictionB: v })}
          />
          <Field
            label="Partner B: ask"
            value={draft.askB}
            onChange={(v) => update({ askB: v })}
            placeholder="One specific ask…"
          />
        </WizardStep>
      )}

      {step === 4 && (
        <WizardStep
          step={4}
          total={5}
          focusHeading={navigated}
          title="Requests"
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        >
          <p className="text-base leading-normal text-ink-muted">
            One specific ask each for next week, from your friction points.
            Edit below if needed. Requests and next steps share the last 5
            minutes.
          </p>
          <Field
            label="Partner A request"
            value={draft.askA}
            onChange={(v) => update({ askA: v })}
          />
          <Field
            label="Partner B request"
            value={draft.askB}
            onChange={(v) => update({ askB: v })}
          />
        </WizardStep>
      )}

      {step === 5 && (
        <WizardStep
          step={5}
          total={5}
          focusHeading={navigated}
          title="Next steps"
          onBack={() => setStep(4)}
          onNext={() => {
            writeWeekly(draft);
            const next = appendWeeklyHistory(draft);
            setHistory(next);
            setDone(true);
          }}
          nextLabel="Finish reset"
        >
          <Field
            label="Next step"
            value={draft.nextStep}
            onChange={(v) => update({ nextStep: v })}
            placeholder="Let’s try ___ …"
          />
          <Field
            label="Review when"
            value={draft.reviewWhen}
            onChange={(v) => update({ reviewWhen: v })}
            placeholder="Check in on ___…"
            rows={1}
          />
        </WizardStep>
      )}

      {confirmClear ? (
        <div role="group" aria-label="Clear Weekly Reset data" className="space-y-2 rounded-xl border border-rule/60 bg-white px-3.5 py-3">
          <p className="text-sm leading-normal text-ink-muted">
            What should be cleared from this device?
          </p>
          <button
            type="button"
            onClick={clear}
            className="w-full min-h-11 rounded-xl border border-rule/60 text-sm font-medium text-ink"
          >
            This week’s answers only
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="w-full min-h-11 rounded-xl border border-failure/40 text-sm font-medium text-failure"
          >
            This week and all history
            {history.length > 0 ? ` (${history.length} past ${history.length === 1 ? "reset" : "resets"})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setConfirmClear(false)}
            className="w-full min-h-11 rounded-xl text-sm font-medium text-ink-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          className="w-full min-h-12 rounded-xl text-sm font-medium text-ink-muted hover:bg-ink/[0.04]"
        >
          Clear entries…
        </button>
      )}
    </div>
  );
}
