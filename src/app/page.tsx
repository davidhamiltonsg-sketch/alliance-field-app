import Link from "next/link";
import { AllianceMark } from "@/components/AllianceMark";
import { SectionLabel } from "@/components/SectionLabel";
import { SituationCard } from "@/components/SituationCard";
import { ArrowRight, PauseIcon } from "@/components/icons";
import { situations } from "@/data/situations";

export default function HomePage() {
  return (
    <div className="space-y-5">
      <section className="accent-wash relative overflow-hidden rounded-3xl border border-accent/10 px-5 pb-5 pt-5">
        {/* Geometric motif: oversized mark and fine concentric rules */}
        <AllianceMark
          size={220}
          className="pointer-events-none absolute -right-14 -top-10 text-accent opacity-[0.06]"
        />
        <svg
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 text-accent/15"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden
        >
          <circle cx="100" cy="100" r="60" stroke="currentColor" />
          <circle cx="100" cy="100" r="78" stroke="currentColor" />
          <circle cx="100" cy="100" r="96" stroke="currentColor" />
        </svg>
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-[0_1px_2px_rgb(26_26_26/0.05)] ring-1 ring-accent/10">
              <AllianceMark size={30} className="text-accent" title="THE ALLIANCE" />
            </span>
            <span className="eyebrow text-accent">Field App</span>
          </div>
          <h1 className="display mt-4 text-[28px] leading-[1.05]">
            Situation Map
          </h1>
          <p className="phrase mt-1.5 text-[17px] leading-snug text-ink-muted">
            Built for precision. Designed for connection.
          </p>
          <p className="mt-3 text-[15px] leading-normal text-ink-muted">
            Start here when you don’t know which card to pull. Follow the first
            matching row.
          </p>
          <Link
            href="/intro"
            className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-full text-[13px] font-medium text-accent hover:underline"
          >
            New here? See how it works
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Link
        href="/pause"
        className="group flex min-h-16 items-center gap-3.5 rounded-2xl bg-gradient-to-b from-[#CF8527] to-[#B86F15] px-4 py-3 text-white shadow-[var(--shadow-amber)] transition hover:brightness-105 active:scale-[0.99]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/25">
          <PauseIcon size={20} strokeWidth={2.25} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold leading-tight">
            Start Pause + Return
          </span>
          <span className="mt-0.5 block text-[13px] leading-tight text-white/85">
            Flooded? Set a return time first.
          </span>
        </span>
        <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <section className="space-y-3">
        <SectionLabel>Pick the first match</SectionLabel>
        <ul className="space-y-3">
          {situations.map((s, i) => (
            <SituationCard key={s.id} situation={s} index={i} />
          ))}
        </ul>
      </section>

      <footer className="flex flex-col items-center gap-2 pt-3 text-center">
        <AllianceMark size={22} className="text-accent/70" />
        <p className="text-[13px] leading-normal text-ink-muted">
          THE ALLIANCE · Built for precision. Designed for connection.
          <br />
          by David Hamilton
        </p>
      </footer>
    </div>
  );
}
