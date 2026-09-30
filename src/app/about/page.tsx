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

const products = [
  {
    name: "Operating Manual",
    tag: "Manual",
    body: "Depth, theory, Full Recovery, decks.",
  },
  {
    name: "Field Kit",
    tag: "Kit",
    body: "Cards, worksheets, Situation Map — the source for this app.",
  },
  {
    name: "Complete Bundle",
    tag: "Bundle",
    body: "Manual and Kit together, with this Field App as the pocket companion.",
  },
];

/** Miniature of the store covers: accent field, mark, tracked label. */
function CoverThumb({ tag }: { tag: string }) {
  return (
    <span
      className="relative flex h-[79px] w-14 shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md bg-accent text-paper shadow-[0_2px_6px_rgb(26_26_26/0.18)]"
      aria-hidden
    >
      <span className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(255_255_255/0.16),transparent_70%)]" />
      <AllianceMark size={24} className="relative" />
      <span className="relative h-px w-7 bg-paper/35" />
      <span className="relative text-[6.5px] font-medium uppercase tracking-[0.08em] pl-[0.08em]">
        {tag}
      </span>
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
          <AllianceMark size={76} className="text-paper" title="THE ALLIANCE" />
          <h1 className="mt-4 text-[20px] font-medium tracking-[0.14em] pl-[0.14em]">
            THE ALLIANCE
          </h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] pl-[0.08em] text-paper/75">
            Field App
          </p>
          <div className="my-4 h-px w-40 bg-paper/25" aria-hidden />
          <p className="phrase text-[17px] leading-snug">
            Built for precision. Designed for connection.
          </p>
          <p className="mt-3 text-[13px] text-paper/80">
            by David Hamilton and Dr Zhongming Shi
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-[15px] leading-normal text-ink">
          A relationship operating system with named tools — clear protocols,
          not pep talks.
        </p>
        <a
          href="#product-line"
          className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-accent"
        >
          Explore the product line
          <ArrowRight size={16} />
        </a>
      </section>

      <section className="space-y-3">
        <SectionLabel>Why this exists</SectionLabel>
        <div className="rounded-2xl border border-accent/20 bg-surface-tool px-4 py-3.5">
          <p className="phrase text-[16px] leading-snug text-accent">
            &ldquo;The Alliance&rdquo; was our own working agreement long
            before it was a product name.
          </p>
        </div>
        <p className="text-[15px] leading-normal text-ink">
          Dami and I built it from our own relationship — how we come back to
          each other, what we say when things go sideways, what we promise
          not to do. This app, the Manual, and the Field Kit are that same
          system, written down so other couples can use it.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="lineage-heading">
        <SectionLabel>
          <span id="lineage-heading">Where these tools come from</span>
        </SectionLabel>
        <p className="text-[15px] leading-normal text-ink">
          The Alliance is our own synthesis, written by the authors. It is
          informed by research and clinical frameworks, adapted into named
          tools:
        </p>
        <ul className="space-y-1.5 pl-4 text-[15px] leading-normal text-ink-muted">
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
        <p className="text-[13px] leading-normal text-ink-muted">
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
          <h3 className="display text-[17px] leading-snug">{authorNames.join(" & ")}</h3>
          <p className="mt-2 text-[15px] leading-normal text-ink">{aboutAuthors}</p>
        </div>
      </section>

      <Testimonials />

      <section id="product-line" className="scroll-mt-20 space-y-3">
        <SectionLabel>The product line</SectionLabel>
        <ul className="space-y-2.5">
          {products.map((p) => (
            <li key={p.name} className="card flex items-center gap-3.5 p-2.5 pr-4">
              <CoverThumb tag={p.tag} />
              <div className="min-w-0">
                <p className="display text-[17px] leading-snug">{p.name}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{p.body}</p>
              </div>
            </li>
          ))}
          <li className="card flex items-center gap-3.5 border-accent/20 bg-surface-tool p-2.5 pr-4">
            <CoverThumb tag="App" />
            <div className="min-w-0">
              <p className="display text-[17px] leading-snug">Field App</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
                This pocket companion: route under stress, exact phrases, Pause
                timer, Weekly Reset, Profile Calibration.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section
        id="detachment"
        className="relative scroll-mt-20 overflow-hidden rounded-2xl border border-pause/25 bg-surface-warn px-4 py-3.5"
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-pause" aria-hidden />
        <Marker kind="NOTE" label="Feeling checked out?" />
        <p className="mt-2 text-[15px] leading-normal">
          <strong>Not sure if it&apos;s space or withdrawal?</strong> Run the
          Uninvestment Check. 0–2 signs: likely needs space. 3 or more: may
          be pulling away — book a Full Recovery within a week. Hope
          isn&apos;t a plan.
        </p>
        <Link
          href="/protocols/uninvestment-check"
          className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-repair"
        >
          Open Uninvestment Check
          <ArrowRight size={16} />
        </Link>
      </section>

      <section id="safety" className="scroll-mt-20 space-y-2">
        <SectionLabel>When not to use this</SectionLabel>
        <WarnBanner pauseLink={false} safetyLink>
          This app is a communication and repair tool. It is not a substitute
          for professional help, and it is not built for situations involving
          contempt, fear, coercion, or any form of abuse. Afraid of your
          partner, being threatened, or not free to say no? Stop — these tools
          are not for this. Get outside help.
        </WarnBanner>
      </section>

      <GetFullSystem />

      <section className="space-y-3">
        <SectionLabel>More</SectionLabel>
        <ul className="card divide-y divide-rule/[0.07] overflow-hidden">
          <li>
            <Link
              href="/help"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Help &amp; safety
                <span className="text-[13px] font-normal text-ink-muted">
                  Help lines and when not to use this app
                </span>
              </span>
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/intro"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Intro
                <span className="text-[13px] font-normal text-ink-muted">
                  How the app works, in six short panels
                </span>
              </span>
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/start"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                7-day start
                <span className="text-[13px] font-normal text-ink-muted">
                  The Core 5, about 10 minutes a day
                </span>
              </span>
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/install"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              7-Day Install plan
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/calibrate"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Profile Calibration
                <span className="text-[13px] font-normal text-ink-muted">
                  44 questions each — a Layer Scan and a couple report
                </span>
              </span>
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/connect"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              <span className="flex flex-col py-2.5">
                Connection Cards
                <span className="text-[13px] font-normal text-ink-muted">
                  A flip-card game for reconnecting on purpose
                </span>
              </span>
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              Situation Map
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
        </ul>
        <p className="px-1 text-[13px] leading-normal text-ink-muted">
          Private by default: pause return times, Weekly Reset answers, and
          calibration answers all stay on this device. The only time data
          leaves it is if you choose to submit your email for updates.{" "}
          <Link href="/help#your-data" className="font-medium text-accent underline underline-offset-4">
            Delete all my data
          </Link>
        </p>
      </section>
    </div>
  );
}
