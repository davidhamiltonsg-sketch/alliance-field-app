import Link from "next/link";
import { AllianceMark } from "./AllianceMark";
import { TimerIcon } from "./icons";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/[0.08] bg-paper/80 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      <div className="flex h-14 items-center justify-between gap-3 pl-4 pr-2">
        <Link
          href="/"
          className="flex min-h-12 items-center gap-2.5"
          aria-label="THE ALLIANCE Field App, home"
        >
          <AllianceMark size={28} className="text-accent" waveColor="#A8895A" />
          <span className="text-[13px] font-medium tracking-[0.14em] text-ink">
            THE ALLIANCE
          </span>
          <span className="rounded-full border border-accent/20 bg-surface-tool px-2 py-[3px] text-[11px] font-medium tracking-[0.08em] text-accent">
            FIELD
          </span>
        </Link>
        <Link
          href="/pause"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-pause transition-colors hover:bg-pause/10"
          aria-label="Open Pause + Return timer"
        >
          <TimerIcon size={22} />
        </Link>
      </div>
    </header>
  );
}
