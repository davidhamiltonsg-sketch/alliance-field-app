import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { PhraseBlock } from "@/components/PhraseBlock";
import { SectionLabel } from "@/components/SectionLabel";
import { WarnBanner } from "@/components/WarnBanner";
import { ArrowLeft, ChevronRight } from "@/components/icons";
import { IconChip, type IconId, type IconTone } from "@/components/ApIcon";
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
  title: "Together",
  description:
    "Things to do as a couple: facing outside pressure with a Team Agreement, Connection Cards, Profile Calibration, how the app works, and help and safety.",
};

type HubLink = { href: string; label: string; sub: string; icon: IconId; tone: IconTone };

const hub: HubLink[] = [
  {
    href: "/protocols/team-agreement",
    label: "Outside pressure",
    sub: "Team Agreement: face disapproval, stares and comments from the same side.",
    icon: "team-agreement",
    tone: "accent",
  },
  { href: "/connect", label: "Connection Cards", sub: "Questions to flip through together.", icon: "connection-cards", tone: "connection" },
  { href: "/calibrate", label: "Profile Calibration", sub: "Where you two differ most, and the tools to try first.", icon: "profile-calibration", tone: "accent" },
  { href: "/about", label: "How this works", sub: "About the app, who made it, and the books.", icon: "field-kit", tone: "accent" },
  { href: "/help", label: "Help & safety", sub: "Afraid, threatened or not free to say no? Help Lines.", icon: "help-safety", tone: "stop" },
];

export default function TogetherPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Together" icon="connection-cards" />} title="Together">
        Things to do as a couple, and where to turn when it isn’t safe.
      </PageHeader>

      <ul className="space-y-2.5">
        {hub.map((h) => (
          <li key={h.href}>
            <Link
              href={h.href}
              className={`v2-card relative flex min-h-16 items-center gap-3 py-3.5 pl-4 pr-3 ${h.tone === "stop" ? "v2-card--failure" : ""}`}
            >
              <IconChip id={h.icon} tone={h.tone} size="md" />
              <span className="min-w-0 flex-1">
                <span className={`block text-lg font-semibold leading-snug ${h.tone === "stop" ? "text-failure" : "text-ink"}`}>
                  {h.label}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{h.sub}</span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-ink-muted/60" />
            </Link>
          </li>
        ))}
      </ul>

      <details id="outside-pressure" className="group card scroll-mt-20 px-4 py-1">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2 text-base font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>
            Outside pressure: the longer read
            <span className="block text-sm font-normal text-ink-muted">
              When the pressure comes from outside, face it from the same side.
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 transition-transform group-open:rotate-90" />
        </summary>
        <div className="space-y-6 pb-4 pt-2">
        <p className="text-base leading-normal text-ink">
          For couples who deal with disapproval, stares, comments and &ldquo;just
          asking&rdquo; questions from outside the relationship, and who
          don’t want that pressure to turn into fights between the two of
          you.
        </p>

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

        </div>
      </details>

      <Link href="/" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
