import Link from "next/link";
import { AllianceMark } from "./AllianceMark";

export function AppHeader() {
  return (
    <header data-chrome className="sticky top-0 z-40 border-b border-rule/35 bg-paper/95 backdrop-blur-md supports-[backdrop-filter]:bg-paper/90">
      <div className="flex h-14 items-center justify-between gap-2 pl-4 pr-2">
        <Link
          href="/"
          className="flex min-h-12 min-w-12 items-center gap-2.5"
          aria-label="Alliance Protocols Field App, home"
        >
          <AllianceMark size={28} className="text-accent" waveColor="#A8895A" />
          <span className="hidden whitespace-nowrap text-sm font-medium tracking-[0.1em] text-ink min-[360px]:inline">
            ALLIANCE PROTOCOLS
          </span>
          <span className="hidden rounded-full border border-accent/20 bg-surface-tool px-2 py-[3px] text-xs font-medium tracking-[0.08em] text-accent min-[480px]:inline">
            FIELD
          </span>
        </Link>
        <div className="flex items-center">
          <Link
            href="/help"
            className="inline-flex h-12 items-center rounded-full px-3 text-sm font-semibold text-failure transition-colors hover:bg-failure/10"
            aria-label="Help and safety: Help Lines"
          >
            Help
          </Link>
        </div>
      </div>
    </header>
  );
}
