import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { PhraseBlock } from "@/components/PhraseBlock";
import { SectionLabel } from "@/components/SectionLabel";
import { WarnBanner } from "@/components/WarnBanner";
import { ArrowLeft, ArrowRight, ChevronRight } from "@/components/icons";
import { authorsCoupleLine } from "@/data/authors";
import { HELP_LINES_POINTER } from "@/data/help";
import {
  TOGETHER_CITATION,
  commonMoves,
  notFor,
  outsideExamples,
  teamAgreement,
  togetherFaq,
  togetherTools,
  whoFor,
} from "@/data/together";

export const metadata = {
  title: "Together against outside pressure",
  description:
    "For interracial, intercultural and other couples facing outside pressure: face it together, with a team agreement.",
};

export default function TogetherPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Outside pressure" icon="unity-anchor" />} title="When the pressure comes from outside, face it from the same side.">
        For couples who deal with disapproval, stares, comments and &ldquo;just
        asking&rdquo; questions from outside the relationship, and who
        don’t want that pressure to turn into fights between the two of
        you.
      </PageHeader>

      <Link
        href="#anchor-heading"
        className="flex min-h-12 items-center justify-between rounded-xl bg-accent px-4 text-base font-semibold text-paper"
      >
        The four steps
        <ArrowRight size={16} />
      </Link>

      <section aria-labelledby="about-heading" className="space-y-3">
        <SectionLabel>
          <span id="about-heading">What this is about</span>
        </SectionLabel>
        <div className="space-y-3 text-base leading-normal text-ink">
          <p>
            Some pressure on a relationship starts inside it: chores, money,
            sex, sleep. Some starts outside — {outsideExamples.slice(0, -1).join("; ")}; or{" "}
            {outsideExamples.at(-1)}.
          </p>
          <p>
            There’s a name for this: <strong className="font-medium">minority stress</strong>,
            the strain that comes from how other people treat your
            relationship. The tools draw on that research. They can’t make the
            comments stop; they’re designed to keep them from turning into a fight
            between you.
          </p>
          <p className="text-sm leading-normal text-ink-muted">
            {TOGETHER_CITATION.text}{" "}
            <a
              href={TOGETHER_CITATION.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline underline-offset-4"
            >
              PubMed
            </a>
          </p>
          <div className="rounded-2xl border border-accent/20 bg-surface-tool px-4 py-3.5">
            <p className="text-base leading-normal text-ink">
              The hard part is rarely the comment itself. It’s what comes
              after: one of you wants to confront it, the other wants to keep
              the peace. One of you felt it, the other didn’t see it.
              Before long you’re arguing about whose family is worse, or
              whether someone is &ldquo;overreacting&rdquo; — and the outside
              pressure has become an inside fight.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="anchor-heading" className="space-y-3">
        <SectionLabel>
          <span id="anchor-heading">The team agreement, in short</span>
        </SectionLabel>
        <ol className="card space-y-2.5 px-4 py-4">
          {teamAgreement.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-base leading-normal text-ink">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper">
                {i + 1}
              </span>
              <span className="min-w-0">{step}</span>
            </li>
          ))}
        </ol>
        <PhraseBlock phrases={teamAgreement.phrases.slice(0, 2)} />
        <div className="card px-4 py-3.5 text-base leading-normal text-ink">
          <p>
            <strong className="font-medium">If the pressure is coming from your
            partner, this isn’t the right tool.</strong> If they check, restrict or
            punish your contact with others, go to Help; otherwise use the Green Rule. The team agreement is there to help you two decide how to respond to
            outside pressure — never how much access a relative gets to your partner.
            No tool is ever used to limit a partner’s contact with
            friends, family, money, phone or movement.
          </p>
        </div>
      </section>

      <section aria-labelledby="moves-heading" className="space-y-3">
        <SectionLabel>
          <span id="moves-heading">What usually happens, and what to try instead</span>
        </SectionLabel>
        <ul className="space-y-2.5">
          {commonMoves.map((m) => (
            <li key={m.move} className="card px-4 py-3.5">
              <h3 className="display text-lg leading-snug">{m.move}</h3>
              <p className="mt-1 text-sm leading-snug text-ink-muted">{m.result}</p>
              <p className="mt-2 text-base leading-normal text-ink">
                <span className="font-medium text-accent">Try instead: </span>
                {m.alliance}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-heading" className="space-y-3">
        <SectionLabel>
          <span id="tools-heading">In this app</span>
        </SectionLabel>
        <ul className="card divide-y divide-rule/30 overflow-hidden">
          {togetherTools.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
              >
                <span className="flex flex-col py-2.5">
                  {t.label}
                  <span className="text-sm font-normal text-ink-muted">{t.note}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="who-heading" className="space-y-3">
        <SectionLabel>
          <span id="who-heading">Who it’s for</span>
        </SectionLabel>
        <ul className="space-y-1.5 pl-5 text-base leading-normal text-ink">
          {whoFor.map((w) => (
            <li key={w} className="list-disc">
              {w}
            </li>
          ))}
        </ul>
      </section>

      <section id="not-for" aria-labelledby="notfor-heading" className="scroll-mt-20 space-y-3">
        <SectionLabel>
          <span id="notfor-heading">Who it’s not for</span>
        </SectionLabel>
        <ul className="space-y-1.5 pl-5 text-base leading-normal text-ink">
          {notFor.map((w) => (
            <li key={w} className="list-disc">
              {w}
            </li>
          ))}
        </ul>
        <section aria-labelledby="more-heading" className="space-y-3">
        <SectionLabel>
          <span id="more-heading">More from Together</span>
        </SectionLabel>
        <ul className="card divide-y divide-rule/30 overflow-hidden">
          {[
            { href: "/about", label: "About", sub: "Who made this, the books, and what the app is for" },
            { href: "/connect", label: "Connection Cards", sub: "Questions to flip through together" },
            { href: "/calibrate", label: "Profile Calibration", sub: "Where you two differ most" },
            { href: "/intro", label: "Take the 60-second tour", sub: "How the app works" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
              >
                <span className="flex flex-col py-2.5">
                  {l.label}
                  <span className="text-sm font-normal text-ink-muted">{l.sub}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WarnBanner pauseLink={false} safetyLink>
          Afraid of your partner, being threatened, or not free to say no?
          Stop. These tools are not for this. Get outside help.{" "}
          {HELP_LINES_POINTER}
        </WarnBanner>
      </section>

      <section aria-labelledby="limits-heading" className="space-y-3">
        <SectionLabel>
          <span id="limits-heading">Where this comes from, and its limits</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>{authorsCoupleLine}</p>
          <p>
            This page is for the pressure that comes from outside. It draws on
            published studies, including the minority-stress research cited
            above. It isn’t therapy and
            hasn’t been tested in a controlled study.
          </p>
          <p className="text-ink-muted">
            If you’d like professional support, look for a couples
            therapist with experience of intercultural or interracial couples,
            and ask them about that experience when you first get in touch.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="space-y-3">
        <SectionLabel>
          <span id="faq-heading">Questions</span>
        </SectionLabel>
        <ul className="space-y-2.5">
          {togetherFaq.map((f) => (
            <li key={f.q} className="card px-4 py-3.5">
              <h3 className="text-base font-semibold leading-snug text-ink">{f.q}</h3>
              <p className="mt-1.5 text-base leading-normal text-ink-muted">{f.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
