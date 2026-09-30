"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { WorksheetDraft } from "@/data/types";
import {
  appendWeeklyHistory,
  clearKey,
  emptyWeeklyDraft,
  readWeekly,
  readWeeklyHistory,
  WEEKLY_KEY,
  writeWeekly,
} from "@/lib/storage";
import { buildWeeklyResetIcs } from "@/lib/ics";
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
    return <p className="py-6 text-center text-[15px] text-ink-muted">Loading…</p>;
  }
  return <WeeklyResetWizardClient />;
}

function WeeklyResetWizardClient() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WorksheetDraft>(readWeekly);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState<WorksheetDraft[]>(readWeeklyHistory);
  const [calendarAdded, setCalendarAdded] = useState(false);

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
    setStep(1);
    setDone(false);
    setCalendarAdded(false);
  };

  const addToCalendar = () => {
    const { url, filename } = buildWeeklyResetIcs();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCalendarAdded(true);
  };

  if (done) {
    const recent = history.slice(0, 5);
    return (
      <div className="space-y-4">
        <Marker kind="OK" label="Complete" />
        <h2 className="display text-[28px] leading-tight">Reset locked</h2>
        <p className="text-[14px] leading-normal text-ink-muted">
          Forty minutes, five parts, zero group text required.
        </p>
        <div className="card space-y-2 px-4 py-3.5 text-[15px] leading-normal">
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
          <div className="card space-y-2 px-4 py-3.5 text-[13px] leading-normal">
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
          className="w-full min-h-12 rounded-xl border border-rule/15 text-[15px] font-medium text-ink"
        >
          Start a new reset
        </button>
        <Link
          href="/"
          className="flex min-h-12 items-center justify-center gap-1.5 text-[15px] font-medium text-accent"
        >
          <ArrowLeft size={16} />
          Situation Map
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WarnBanner>
        If either partner is flooded — Pause + Return; reschedule. This is
        maintenance, not a fight forum.
      </WarnBanner>

      {step === 1 && (
        <WizardStep
          step={1}
          total={5}
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
          title="Check the load (15 min)"
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        >
          <p className="text-[13px] leading-normal text-ink-muted">
            Once a month, run the Care Check-in here: go through each area
            below.
          </p>
          <ul className="space-y-3">
            {draft.careAudit.map((row, i) => (
              <li
                key={row.domain}
                className="rounded-xl border border-rule/[0.08] bg-surface-activity px-3 py-3"
              >
                <p className="text-[15px] font-medium">{row.domain}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["balanced", "skewed"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateCare(i, { balance: b })}
                      aria-pressed={row.balance === b}
                      className={`min-h-11 rounded-full px-3.5 text-[13px] font-medium capitalize transition-colors ${
                        row.balance === b
                          ? "bg-accent text-paper"
                          : "border border-rule/15 bg-white text-ink"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                  {(["yes", "no"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateCare(i, { rebalance: r })}
                      aria-pressed={row.rebalance === r}
                      className={`min-h-11 rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                        row.rebalance === r
                          ? "bg-repair text-paper"
                          : "border border-rule/15 bg-white text-ink"
                      }`}
                    >
                      Rebalance? {r}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <Field
            label="Supported when"
            value={draft.supportedWhen}
            onChange={(v) => update({ supportedWhen: v })}
          />
          <Field
            label="Alone when"
            value={draft.aloneWhen}
            onChange={(v) => update({ aloneWhen: v })}
          />
        </WizardStep>
      )}

      {step === 3 && (
        <WizardStep
          step={3}
          total={5}
          title="One friction point (15 min)"
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        >
          <Field
            label="A friction"
            value={draft.frictionA}
            onChange={(v) => update({ frictionA: v })}
          />
          <Field
            label="A ask"
            value={draft.askA}
            onChange={(v) => update({ askA: v })}
            placeholder="One specific ask…"
          />
          <Field
            label="B friction"
            value={draft.frictionB}
            onChange={(v) => update({ frictionB: v })}
          />
          <Field
            label="B ask"
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
          title="Requests (5 min, with next steps)"
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        >
          <p className="text-[15px] leading-normal text-ink-muted">
            Confirm one specific ask each for next week (from friction). Edit
            below if needed.
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
          title="Next steps"
          onBack={() => setStep(4)}
          onNext={() => {
            writeWeekly(draft);
            const next = appendWeeklyHistory(draft);
            setHistory(next);
            setDone(true);
          }}
          nextLabel="Complete reset"
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

      <button
        type="button"
        onClick={clear}
        className="w-full min-h-12 rounded-xl text-[13px] font-medium text-ink-muted hover:bg-ink/[0.04]"
      >
        Clear entries
      </button>
    </div>
  );
}
