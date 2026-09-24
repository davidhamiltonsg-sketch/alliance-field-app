"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WorksheetDraft } from "@/data/types";
import {
  clearKey,
  emptyWeeklyDraft,
  readWeekly,
  WEEKLY_KEY,
  writeWeekly,
} from "@/lib/storage";
import { PrimaryButton } from "./PrimaryButton";
import { Field, WizardStep } from "./WizardStep";
import { WarnBanner } from "./WarnBanner";

export function WeeklyResetWizard() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WorksheetDraft>(emptyWeeklyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDraft(readWeekly());
    setHydrated(true);
  }, []);

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
  };

  if (!hydrated) {
    return <p className="text-ink-muted">Loading draft…</p>;
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-xs font-bold tracking-widest text-safety">[✓] COMPLETE</p>
        <h2 className="text-xl font-semibold">Reset locked</h2>
        <div className="space-y-2 rounded-lg border border-rule/20 bg-surface-tool px-4 py-3 text-sm leading-relaxed">
          <p><strong>Next step:</strong> {draft.nextStep || "—"}</p>
          <p><strong>Review when:</strong> {draft.reviewWhen || "—"}</p>
        </div>
        <PrimaryButton onClick={clear}>Start new draft</PrimaryButton>
        <Link href="/" className="block text-center text-sm font-semibold text-accent">← Situation Map</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WarnBanner>
        If either partner is flooded — Pause + Return; reschedule. This is maintenance, not a fight forum.
      </WarnBanner>

      {step === 1 && (
        <WizardStep step={1} total={5} title="Appreciation (5 min)" onNext={() => setStep(2)}>
          <Field label="Partner A" value={draft.appreciationA} onChange={(v) => update({ appreciationA: v })} placeholder="One specific appreciation…" />
          <Field label="Partner B" value={draft.appreciationB} onChange={(v) => update({ appreciationB: v })} placeholder="One specific appreciation…" />
        </WizardStep>
      )}

      {step === 2 && (
        <WizardStep step={2} total={5} title="Care Audit (10–15)" onBack={() => setStep(1)} onNext={() => setStep(3)}>
          <ul className="space-y-3">
            {draft.careAudit.map((row, i) => (
              <li key={row.domain} className="rounded-lg border border-rule/15 bg-surface-activity px-3 py-3">
                <p className="text-sm font-semibold">{row.domain}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["balanced", "skewed"] as const).map((b) => (
                    <button key={b} type="button" onClick={() => updateCare(i, { balance: b })} className={`min-h-10 rounded-md px-3 text-xs font-semibold capitalize ${row.balance === b ? "bg-accent text-paper" : "bg-paper border border-rule/20"}`}>{b}</button>
                  ))}
                  {(["yes", "no"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => updateCare(i, { rebalance: r })} className={`min-h-10 rounded-md px-3 text-xs font-semibold ${row.rebalance === r ? "bg-repair text-paper" : "bg-paper border border-rule/20"}`}>Rebalance? {r}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <Field label="Supported when" value={draft.supportedWhen} onChange={(v) => update({ supportedWhen: v })} />
          <Field label="Alone when" value={draft.aloneWhen} onChange={(v) => update({ aloneWhen: v })} />
        </WizardStep>
      )}

      {step === 3 && (
        <WizardStep step={3} total={5} title="Friction Review" onBack={() => setStep(2)} onNext={() => setStep(4)}>
          <Field label="A friction" value={draft.frictionA} onChange={(v) => update({ frictionA: v })} />
          <Field label="A ask" value={draft.askA} onChange={(v) => update({ askA: v })} placeholder="One specific ask…" />
          <Field label="B friction" value={draft.frictionB} onChange={(v) => update({ frictionB: v })} />
          <Field label="B ask" value={draft.askB} onChange={(v) => update({ askB: v })} placeholder="One specific ask…" />
        </WizardStep>
      )}

      {step === 4 && (
        <WizardStep step={4} total={5} title="Request" onBack={() => setStep(3)} onNext={() => setStep(5)}>
          <p className="text-sm text-ink-muted leading-relaxed">Confirm one specific ask each for next week (from friction). Edit below if needed.</p>
          <Field label="Partner A request" value={draft.askA} onChange={(v) => update({ askA: v })} />
          <Field label="Partner B request" value={draft.askB} onChange={(v) => update({ askB: v })} />
        </WizardStep>
      )}

      {step === 5 && (
        <WizardStep step={5} total={5} title="Alignment" onBack={() => setStep(4)} onNext={() => { writeWeekly(draft); setDone(true); }} nextLabel="Complete reset">
          <Field label="Next step" value={draft.nextStep} onChange={(v) => update({ nextStep: v })} placeholder="Let’s try ___ …" />
          <Field label="Review when" value={draft.reviewWhen} onChange={(v) => update({ reviewWhen: v })} placeholder="Check in on ___…" rows={1} />
        </WizardStep>
      )}

      <button type="button" onClick={clear} className="w-full min-h-10 text-xs font-semibold text-ink-muted">Clear draft</button>
    </div>
  );
}
