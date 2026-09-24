import Link from "next/link";
import type { Situation } from "@/data/types";
import { Marker } from "./Marker";

export function SituationCard({ situation }: { situation: Situation }) {
  return (
    <li>
      <div
        className={`rounded-lg border ${
          situation.warn
            ? "border-pause/40 bg-surface-warn"
            : "border-rule/20 bg-surface-tool"
        }`}
      >
        <Link
          href={situation.primaryHref}
          className="block min-h-14 px-4 py-3 active:opacity-80"
        >
          <div className="flex items-start gap-2">
            {situation.warn && <Marker kind="WARN" />}
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-ink">{situation.label}</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                {situation.description}
              </span>
              <span className="mt-1 block text-sm font-medium text-accent">
                {situation.firstMove}
              </span>
            </div>
          </div>
        </Link>
        {situation.secondaryHrefs && situation.secondaryHrefs.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-rule/10 px-4 py-2">
            {situation.secondaryHrefs.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="min-h-10 rounded-md px-2 py-2 text-xs font-semibold text-repair"
              >
                {s.label} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
