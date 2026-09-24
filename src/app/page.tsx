import Link from "next/link";
import { SituationCard } from "@/components/SituationCard";
import { situations } from "@/data/situations";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Situation Map</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          Start here when you don’t know which card to pull. Follow the first
          matching row.
        </p>
      </div>

      <Link
        href="/pause"
        className="flex min-h-12 items-center justify-center rounded-lg bg-pause px-4 text-sm font-semibold text-paper"
      >
        [WARN] Start Pause + Return
      </Link>

      <ul className="space-y-3">
        {situations.map((s) => (
          <SituationCard key={s.id} situation={s} />
        ))}
      </ul>

      <p className="text-center text-xs text-ink-muted">
        THE ALLIANCE · Field App · Built for precision. Designed for connection.
      </p>
    </div>
  );
}
