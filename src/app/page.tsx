import Link from "next/link";
import { AllianceMark } from "@/components/AllianceMark";
import { ApIcon, IconChip, type IconId, type IconTone } from "@/components/ApIcon";
import { SectionLabel } from "@/components/SectionLabel";
import { SituationCard } from "@/components/SituationCard";
import { QuickAccess } from "@/components/QuickAccess";
import { ChevronRight } from "@/components/icons";
import { situations } from "@/data/situations";
import { WarnBanner } from "@/components/WarnBanner";
import { withSubtitle } from "@/data/glossary";

/** The three in-the-moment routes. Safety is always first, never routed to Pause. */
const routes: {
  href: string;
  label: string;
  sub: string;
  icon: IconId;
  className: string;
}[] = [
  {
    href: "/help",
    label: "I’m afraid or not safe",
    sub: "Stop. These tools are not for this. Get outside help.",
    icon: "help-safety",
    className: "bg-failure text-white",
  },
  {
    href: "/pause",
    label: "We’re flooded",
    sub: "Pause + Return: set an exact return time first.",
    icon: "pause-and-return",
    className: "bg-pause text-ink",
  },
  {
    href: "#situation-map",
    label: "Something else",
    sub: "Use the Situation Map below: take the first row that fits.",
    icon: "situation-map",
    className: "bg-accent text-paper",
  },
];

const practise: { href: string; label: string; sub: string; icon: IconId; tone: IconTone }[] = [
  { href: "/connect", label: "Connection Cards", sub: "Questions to flip through together", icon: "connection-cards", tone: "connection" },
  { href: "/weekly-reset", label: "Weekly Reset", sub: "Five parts, about 40 minutes", icon: "weekly-reset", tone: "accent" },
  { href: "/start", label: "7-day plan", sub: "About 10 minutes a day", icon: "section-steps", tone: "accent" },
  { href: "/calibrate", label: "Profile Calibration", sub: withSubtitle("Layer Scan"), icon: "profile-calibration", tone: "accent" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section aria-labelledby="now-heading" className="space-y-4 pt-1">
        <h1 id="now-heading" className="display text-xl">
          What’s happening right now?
        </h1>
        <ul className="space-y-3">
          {routes.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className={`flex min-h-20 items-center gap-4 rounded-2xl px-4 py-4 shadow-[var(--shadow-card)] transition active:scale-[0.99] ${r.className}`}
              >
                <ApIcon id={r.icon} size={32} mono />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold leading-tight">{r.label}</span>
                  <span className="mt-1 block text-sm leading-snug">{r.sub}</span>
                </span>
                <ChevronRight size={22} className="shrink-0 opacity-80" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practise-heading" className="space-y-3">
        <SectionLabel>
          <span id="practise-heading">Practise</span>
        </SectionLabel>
        <ul className="grid grid-cols-2 gap-2.5">
          {practise.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="card card-interactive flex h-full flex-col gap-2 px-3.5 py-3.5"
              >
                <IconChip id={p.icon} tone={p.tone} size="sm" />
                <span className="text-base font-semibold leading-snug text-ink">{p.label}</span>
                <span className="text-sm leading-snug text-ink-muted">{p.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
        <QuickAccess />
      </section>

      <section id="situation-map" aria-labelledby="map-heading" className="scroll-mt-20 space-y-3">
        <SectionLabel>
          <span id="map-heading">Situation Map</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink-muted">
          Read from the top and take the first row that fits. Safety always
          comes first.
        </p>
        <ul className="space-y-3">
          {situations.map((s, i) => (
            <SituationCard key={s.id} situation={s} index={i} />
          ))}
        </ul>
        <WarnBanner pauseLink={false} safetyLink>
          Pause + Return is for flooding, never for fear. If threats, fear,
          coercion or violence appear, don&apos;t return at the set time —
          leave safely and use the help lines.
        </WarnBanner>
      </section>

      <footer className="flex flex-col items-center gap-2 pt-2 text-center">
        <AllianceMark size={22} className="text-accent/70" waveColor="#A8895A" />
        <p className="text-sm leading-normal text-ink-muted">
          ALLIANCE PROTOCOLS · We are an alliance.
          <br />
          New here?{" "}
          <Link href="/intro" className="font-medium text-accent underline underline-offset-4">
            See how it works
          </Link>
          <br />
          by David Hamilton and Dr Zhongming Shi
        </p>
      </footer>
    </div>
  );
}
