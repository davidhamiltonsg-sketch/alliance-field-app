import Link from "next/link";
import { AllianceMark } from "@/components/AllianceMark";
import { Marker } from "@/components/Marker";
import { SectionLabel } from "@/components/SectionLabel";
import { GetFullSystem } from "@/components/GetFullSystem";
import { Testimonials } from "@/components/Testimonials";
import { WarnBanner } from "@/components/WarnBanner";
import { ArrowRight, ChevronRight } from "@/components/icons";
import { aboutAuthors, authorNames } from "@/data/authors";

export const metadata = { title: "About" };

type Cover = "manual" | "kit" | "companion" | "app";

const products: { name: string; body: string; cover: Cover }[] = [
  {
    name: "Operating Manual",
    body: "The reference: every protocol in full, with the reasoning and the harder cases.",
    cover: "manual",
  },
  {
    name: "Field Kit",
    body: "To keep on the fridge: 15 protocol cards (plus Read This First), 7 worksheets and the two-sided Situation Map.",
    cover: "kit",
  },
  {
    name: "Companion Book",
    body: "The why: the stories and thinking behind the tools, with “The Third Voice” narrated by David.",
    cover: "companion",
  },
  {
    name: "Complete Bundle",
    body: "Manual + Field Kit + Companion Book together. The Field App stays free.",
    cover: "manual",
  },
];

/** Product cover colours (CANON round 5: covers only). */
const coverBg: Record<Cover, string> = {
  manual: "bg-cover-manual",
  kit: "bg-cover-kit",
  companion: "bg-cover-companion",
  app: "bg-accent",
};

/** Miniature of the store covers: cover colour and mark (the name sits beside it). */
function CoverThumb({ cover }: { cover: Cover }) {
  return (
    <span
      className={`relative flex h-[79px] w-14 shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md ${coverBg[cover]} text-paper shadow-[0_2px_6px_rgb(26_26_26/0.18)]`}
      aria-hidden
    >
      <span className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(255_255_255/0.16),transparent_70%)]" />
      <AllianceMark size={24} className="relative" />
      <span className="relative h-px w-7 bg-paper/35" />
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-accent px-5 pb-6 pt-7 text-center text-paper shadow-[var(--shadow-lift)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgb(255_255_255/0.14),transparent_60%)]"
          aria-hidden
        />
        <div className="relative flex flex-col items-center">
          <AllianceMark size={76} className="text-paper" title="ALLIANCE PROTOCOLS" />
          <h1 className="mt-4 text-lg font-medium tracking-[0.14em] pl-[0.14em]">
            ALLIANCE PROTOCOLS™
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] pl-[0.08em] text-paper/75">
            Field App
          </p>
          <div className="my-4 h-px w-40 bg-paper/25" aria-hidden />
          <p className="phrase text-base leading-snug">We are an alliance.</p>
          <p className="phrase mt-0.5 text-base leading-snug">
            Built for precision. Designed for connection.
          </p>
          <p className="mt-3 text-sm text-paper/80">
            by David Hamilton and Dr Zhongming Shi
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-base leading-normal text-ink">
          What we use when it goes wrong, written down so you can use it too.
        </p>
        <p className="text-base leading-normal text-ink-muted">
          The scripts are training wheels. Use your own words as soon as you can.
        </p>
        <a
          href="#product-line"
          className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
        >
          The books and the kit
          <ArrowRight size={16} />
        </a>
      </section>

      <section className="space-y-3">
        <SectionLabel>Why this exists</SectionLabel>
        <div className="rounded-2xl border border-accent/20 bg-surface-tool px-4 py-3.5">
          <p className="phrase text-base leading-snug text-accent">
            &ldquo;The Alliance&rdquo; was our own working agreement long
            before Alliance Protocols was a product.
          </p>
        </div>
        <p className="text-base leading-normal text-ink">
          The tools grew out of it over the years, in our own relationship:
          how we come back to each other, what we say when things go
          sideways, what we promise not to do. This app, the Manual, the Field Kit and the Companion
          Book are that same system, written down so other couples can use it.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="lineage-heading">
        <SectionLabel>
          <span id="lineage-heading">Where these tools come from</span>
        </SectionLabel>
        <p className="text-base leading-normal text-ink">
          We built this from our own relationship and from research we
          trust. We didn’t invent the science; we turned it into steps we
          could use at 11pm. The named tools draw on:
        </p>
        <ul className="space-y-1.5 pl-4 text-base leading-normal text-ink-muted">
          <li className="list-disc">
            <strong className="font-medium text-ink">Gottman research</strong> — flooding,
            repair attempts, gentle start-up, rituals of connection.
          </li>
          <li className="list-disc">
            <strong className="font-medium text-ink">Emotionally Focused Therapy</strong> —
            attachment, and the pursue–withdraw cycle.
          </li>
          <li className="list-disc">
            <strong className="font-medium text-ink">Structured time-out practice</strong> —
            stepping away with an agreed return.
          </li>
          <li className="list-disc">
            <strong className="font-medium text-ink">Minority-stress research</strong> —
            how outside pressure lands on a couple.
          </li>
        </ul>
        <p className="text-sm leading-normal text-ink-muted">
          The system as a whole has not been tested in a controlled study.
          It is a practical toolkit, not therapy, and not a substitute for
          professional help.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="authors-heading">
        <SectionLabel>
          <span id="authors-heading">About the authors</span>
        </SectionLabel>
        <div className="card px-4 py-3.5">
          <h3 className="display text-lg leading-snug">{authorNames.join(" and ")}</h3>
          <p className="mt-2 text-base leading-normal text-ink">{aboutAuthors}</p>
        </div>
      </section>

      <Testimonials />

      <section id="product-line" className="scroll-mt-20 space-y-3">
        <SectionLabel>What we make</SectionLabel>
        <ul className="space-y-2.5">
          {products.map((p) => (
            <li key={p.name} className="card flex items-center gap-3.5 p-2.5 pr-4">
              <CoverThumb cover={p.cover} />
              <div className="min-w-0">
                <p className="display text-lg leading-snug">{p.name}</p>
                <p className="mt-0.5 text-sm leading-snug text-ink-muted">{p.body}</p>
              </div>
            </li>
          ))}
          <li className="card flex items-center gap-3.5 border-accent/20 bg-surface-tool p-2.5 pr-4">
            <CoverThumb cover="app" />
            <div className="min-w-0">
              <p className="display text-lg leading-snug">Field App</p>
              <p className="mt-0.5 text-sm leading-snug text-ink-muted">
                Free, to act in the moment: the Situation Map, exact phrases,
                the Pause + Return timer, Weekly Reset and Profile Calibration.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section
        id="detachment"
        className="relative scroll-mt-20 overflow-hidden rounded-2xl border border-repair/25 bg-surface-tool px-4 py-3.5"
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-repair" aria-hidden />
        <Marker kind="NOTE" label="Feeling checked out?" />
        <p className="mt-2 text-base leading-normal">
          <strong>Not sure if it’s needing space or pulling away?</strong> Try the
          Uninvestment Check. None of these? You’re fine. Keep up the daily
          floor. 1–2: likely needs
          space and small repairs. 3 or more: may be pulling away — book a
          Full Recovery conversation within a week.
        </p>
        <Link
          href="/protocols/uninvestment-check"
          className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-repair"
        >
          Open Uninvestment Check
          <ArrowRight size={16} />
        </Link>
      </section>

      <section id="safety" className="scroll-mt-20 space-y-2">
        <SectionLabel>When not to use this</SectionLabel>
        <WarnBanner pauseLink={false} safetyLink>
          We built this for couples who are safe with each other. It isn’t
          professional help. It isn’t for situations involving fear, coercion,
          or any form of abuse. Contempt means stop and get outside support
          first. Afraid of your
          partner, being threatened, or not free to say no? Stop — these tools
          are not for this. Get outside help.
        </WarnBanner>
      </section>

      <GetFullSystem />

      <section className="space-y-3">
        <SectionLabel>More</SectionLabel>
        <ul className="card divide-y divide-rule/30 overflow-hidden">
          <li>
            <Link
              href="/help"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Help &amp; safety
                <span className="text-sm font-normal text-ink-muted">
                  Help Lines and when not to use this app
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/intro"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Intro
                <span className="text-sm font-normal text-ink-muted">
                  How the app works, in six short panels
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/start"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                7-day plan
                <span className="text-sm font-normal text-ink-muted">
                  The Core 5, about 10 minutes a day
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/together"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Together against outside pressure
                <span className="text-sm font-normal text-ink-muted">
                  For interracial, intercultural and other couples facing outside pressure
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/calibrate"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Profile Calibration
                <span className="text-sm font-normal text-ink-muted">
                  44 questions each — a Layer Scan (where you two differ most, layer by layer) and a couple report
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/connect"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Connection Cards
                <span className="text-sm font-normal text-ink-muted">
                  A deck of question cards for coming back to each other
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-tool"
            >
              Situation Map
              <ChevronRight size={18} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
        </ul>
        <p className="px-1 text-sm leading-normal text-ink-muted">
          Private by default: pause return times, Weekly Reset answers, and
          calibration answers all stay on this device. The only time data
          leaves it is if you choose to submit your email for updates.{" "}
          <Link href="/help#your-data" className="font-medium text-accent underline underline-offset-4">
            Delete all my data
          </Link>
          {" · "}
          <Link href="/privacy" className="font-medium text-accent underline underline-offset-4">
            Privacy notice
          </Link>
          {" · "}
          <Link href="/terms" className="font-medium text-accent underline underline-offset-4">
            Website terms
          </Link>
        </p>
      </section>
    </div>
  );
}
