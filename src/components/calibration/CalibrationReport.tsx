"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isComplete, generateProfile, generateCoupleReport, readCalibration } from "@/lib/calibration";
import type { LayerKey, PersonInput, PersonKey, Profile } from "@/data/calibration/types";
import { PageHeader } from "../PageHeader";
import { PrimaryButton } from "../PrimaryButton";
import { SectionLabel } from "../SectionLabel";
import { Marker } from "../Marker";
import { StepList } from "../StepList";
import { PhraseBlock } from "../PhraseBlock";
import { ArrowRight } from "../icons";

const noopSubscribe = () => () => {};

export function CalibrationReport() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) {
    return <p className="py-6 text-center text-base text-ink-muted">Loading…</p>;
  }
  return <CalibrationReportClient />;
}

const LAYER_ORDER: LayerKey[] = ["Atmosphere", "Structure", "Repair", "Protection", "Insight"];

function CalibrationReportClient() {
  const router = useRouter();
  const state = readCalibration();
  const aDone = isComplete(state.personA.answers);
  const bDone = isComplete(state.personB.answers);

  if (!aDone && !bDone) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow={<Marker kind="NOTE" label="Not ready yet" />} title="Finish calibration first">
          Answer at least one partner’s 44 questions to see a profile.
        </PageHeader>
        <PrimaryButton onClick={() => router.push("/calibrate")}>Start calibration</PrimaryButton>
      </div>
    );
  }

  if (aDone !== bDone) {
    const [donePerson, doneInput]: [PersonKey, PersonInput] = aDone ? ["A", state.personA] : ["B", state.personB];
    const otherName = aDone ? state.personB.name : state.personA.name;
    if (donePerson === "A" && state.aPrivate) {
      return (
        <div className="space-y-4">
          <PageHeader eyebrow={<Marker kind="NOTE" label="Private" />} title={`${state.personA.name}’s profile is private`}>
            {state.personA.name} chose to keep their individual answers and profile private on this shared device.
            The couple report unlocks once {otherName} finishes their 44 questions.
          </PageHeader>
          <PrimaryButton onClick={() => router.push("/calibrate")}>Continue calibration</PrimaryButton>
        </div>
      );
    }
    const profile = generateProfile(donePerson, doneInput);
    return <SoloProfile profile={profile} otherName={otherName} />;
  }

  const profileA = generateProfile("A", state.personA);
  const profileB = generateProfile("B", state.personB);
  const report = generateCoupleReport(profileA, profileB);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Layer Scan" icon="profile-calibration" />} title="Your operating profile">
        Both of you finished — no trophy, just the report. {report.executiveSummary}
      </PageHeader>

      {state.aPrivate && (
        <p className="rounded-2xl border border-accent/20 bg-surface-tool px-4 py-3 text-sm leading-normal text-ink-muted">
          {state.personA.name} kept their individual profile private, so this shows only the couple report.
        </p>
      )}

      <section className="space-y-3">
        <SectionLabel>Layer Scan</SectionLabel>
        <p className="px-1 text-sm text-ink-muted">Where each of you sits on the profile.</p>
        <div className="card space-y-3.5 px-4 py-4">
          {LAYER_ORDER.map((layer) => (
            <div key={layer} className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-ink">{layer}</span>
                <span className="tabular text-sm text-ink-muted">{report.layerHealth[layer]}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-accent/10">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${report.layerHealth[layer]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="px-1 text-sm leading-normal text-ink-muted">
          Lower means the two of you diverge more in that layer — worth stabilising first, not a verdict on the relationship.
        </p>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>Conflict pattern</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{report.conflictPattern}</p>
      </section>

      {report.coreMismatch.length > 0 && (
        <section className="space-y-2.5">
          <SectionLabel>Where you diverge</SectionLabel>
          <ul className="card divide-y divide-rule/[0.07] px-4">
            {report.coreMismatch.map((line) => (
              <li key={line} className="py-3 text-base leading-normal text-ink">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2.5">
        <SectionLabel>Likely misreads</SectionLabel>
        <ul className="card divide-y divide-rule/[0.07] px-4">
          {report.misreadRisks.map((line) => (
            <li key={line} className="py-3 text-base leading-normal text-ink">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>Strengths</SectionLabel>
        <ul className="card divide-y divide-rule/[0.07] px-4">
          {report.strengths.map((line) => (
            <li key={line} className="py-3 text-base leading-normal text-ink">
              {line}
            </li>
          ))}
        </ul>
      </section>

      {report.recommendedTools.length > 0 && (
        <section className="space-y-2.5">
          <SectionLabel>Recommended tools</SectionLabel>
          <ul className="space-y-2.5">
            {report.recommendedTools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/protocols/${t.slug}`}
                  className="v2-card card-interactive flex items-start justify-between gap-3 px-4 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="display block text-base leading-snug">{t.title}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{t.reason}</span>
                  </span>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-ink-muted/50" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {report.recommendedSequence.length > 0 && <StepList steps={report.recommendedSequence} />}

      <PhraseBlock phrases={report.scriptPack.map((text) => ({ text }))} />

      <section className="space-y-2">
        <SectionLabel>Evidence limitations</SectionLabel>
        {report.evidenceLimitations.map((line) => (
          <p key={line} className="text-sm leading-normal text-ink-muted">
            {line}
          </p>
        ))}
      </section>

      <button
        type="button"
        onClick={() => router.push("/calibrate")}
        className="w-full min-h-12 rounded-xl border border-rule/15 text-base font-medium text-ink"
      >
        Recalibrate
      </button>
    </div>
  );
}

/**
 * Shown once a single partner has finished — their own profile, with a note
 * that the couple report unlocks once the other partner finishes. `preview`
 * renders just the profile (used on the hand-over screen).
 */
export function SoloProfile({ profile, otherName, preview = false }: { profile: Profile; otherName: string; preview?: boolean }) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Solo profile" icon="profile-calibration" />} title={`${profile.name}'s operating profile`}>
        {profile.primaryPattern}
      </PageHeader>

      <section className="space-y-2.5">
        <SectionLabel>How safety builds</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{profile.safetyLogic}</p>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>How care lands</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{profile.careStyle}</p>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>Under stress</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{profile.conflictResponse}</p>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>Privacy &amp; autonomy</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{profile.privacyAutonomy}</p>
      </section>

      {profile.patterns.length > 0 && (
        <section className="space-y-2.5">
          <SectionLabel>Patterns</SectionLabel>
          <ul className="card divide-y divide-rule/[0.07] px-4">
            {profile.patterns.map((line) => (
              <li key={line} className="py-3 text-base leading-normal text-ink">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2.5">
        <SectionLabel>Likely misreads</SectionLabel>
        <ul className="card divide-y divide-rule/[0.07] px-4">
          {profile.likelyMisreads.map((line) => (
            <li key={line} className="py-3 text-base leading-normal text-ink">
              {line}
            </li>
          ))}
        </ul>
      </section>

      {!preview && (
        <>
          <div className="rounded-2xl border border-accent/20 bg-surface-tool px-4 py-3.5 text-sm leading-normal text-ink-muted">
            The couple report — Layer Scan, conflict pattern, and recommended tools — unlocks once {otherName} finishes their 44 questions.
          </div>

          <PrimaryButton onClick={() => router.push("/calibrate")}>Continue calibration</PrimaryButton>
        </>
      )}
    </div>
  );
}
