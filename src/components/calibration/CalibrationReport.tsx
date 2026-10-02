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

/** Word band for how far apart you are in a layer (no numbers on screen). */
function apartWords(health: number): string {
  if (health >= 85) return "answers close";
  if (health >= 62) return "answers some distance apart";
  return "answers far apart";
}

function CalibrationReportClient() {
  const router = useRouter();
  const state = readCalibration();
  const aDone = isComplete(state.personA.answers);
  const bDone = isComplete(state.personB.answers);

  if (!aDone && !bDone) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow={<Marker kind="NOTE" label="Not ready yet" />} title="Not yet">
          Answer the 44 questions (one of you is enough to start).
        </PageHeader>
        <PrimaryButton onClick={() => router.push("/calibrate")}>Start the questions</PrimaryButton>
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
            {state.personA.name} has kept their own answers private, so you’ll see the couple report only.
            It appears once {otherName} has answered too.
          </PageHeader>
          <PrimaryButton onClick={() => router.push("/calibrate")}>Carry on</PrimaryButton>
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
      <PageHeader eyebrow={<Marker kind="TOOL" label="Layer Scan" icon="profile-calibration" />} title="Where you two stand">
        You’ve both finished. Here’s where your answers line up, and where they don’t. {report.executiveSummary}
      </PageHeader>

      {state.aPrivate && (
        <p className="rounded-2xl border border-accent/20 bg-surface-tool px-4 py-3 text-sm leading-normal text-ink-muted">
          {state.personA.name} kept their individual profile private, so this shows only the couple report.
        </p>
      )}

      <section className="space-y-3">
        <SectionLabel>Layer Scan</SectionLabel>
        <div className="card px-4 py-1">
          <h3 className="pt-3 text-sm font-semibold text-ink">Where you two see things most differently</h3>
          <ul className="divide-y divide-rule/30">
            {LAYER_ORDER.map((layer) => (
              <li key={layer} className="flex items-baseline justify-between gap-3 py-3">
                <span className="text-sm font-medium text-ink">{layer}</span>
                <span className="text-sm text-ink-muted">{apartWords(report.layerHealth[layer])}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="px-1 text-sm leading-normal text-ink-muted">
          Start with the layer where you’re furthest apart. It isn’t a score for the relationship.
        </p>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>When you clash</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{report.conflictPattern}</p>
      </section>

      {report.coreMismatch.length > 0 && (
        <section className="space-y-2.5">
          <SectionLabel>Where you differ</SectionLabel>
          <ul className="card divide-y divide-rule/30 px-4">
            {report.coreMismatch.map((line) => (
              <li key={line} className="py-3 text-base leading-normal text-ink">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2.5">
        <SectionLabel>Easy to misread</SectionLabel>
        <ul className="card divide-y divide-rule/30 px-4">
          {report.misreadRisks.map((line) => (
            <li key={line} className="py-3 text-base leading-normal text-ink">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2.5">
        <SectionLabel>What’s already working</SectionLabel>
        <ul className="card divide-y divide-rule/30 px-4">
          {report.strengths.map((line) => (
            <li key={line} className="py-3 text-base leading-normal text-ink">
              {line}
            </li>
          ))}
        </ul>
      </section>

      {report.recommendedTools.length > 0 && (
        <section className="space-y-2.5">
          <SectionLabel>Try these first</SectionLabel>
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
        <SectionLabel>What this can’t tell you</SectionLabel>
        {report.evidenceLimitations.map((line) => (
          <p key={line} className="text-sm leading-normal text-ink-muted">
            {line}
          </p>
        ))}
      </section>

      <button
        type="button"
        onClick={() => router.push("/calibrate")}
        className="w-full min-h-12 rounded-xl border border-rule/60 text-base font-medium text-ink"
      >
        Start again
      </button>
    </div>
  );
}

/**
 * Shown once a single partner has finished — their own profile, with a note
 * that the couple report appears once the other partner has answered too. `preview`
 * renders just the profile (used on the hand-over screen).
 */
export function SoloProfile({ profile, otherName, preview = false }: { profile: Profile; otherName: string; preview?: boolean }) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Solo profile" icon="profile-calibration" />} title={`${profile.name}’s profile`}>
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
        <SectionLabel>Time alone</SectionLabel>
        <p className="card px-4 py-3.5 text-base leading-normal text-ink">{profile.privacyAutonomy}</p>
      </section>

      {profile.patterns.length > 0 && (
        <section className="space-y-2.5">
          <SectionLabel>Patterns</SectionLabel>
          <ul className="card divide-y divide-rule/30 px-4">
            {profile.patterns.map((line) => (
              <li key={line} className="py-3 text-base leading-normal text-ink">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2.5">
        <SectionLabel>What you might misread</SectionLabel>
        <ul className="card divide-y divide-rule/30 px-4">
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
            You’ll see the couple report (Layer Scan, how you clash and the tools to try first) once {otherName} has answered too.
          </div>

          <PrimaryButton onClick={() => router.push("/calibrate")}>Carry on</PrimaryButton>
        </>
      )}
    </div>
  );
}
