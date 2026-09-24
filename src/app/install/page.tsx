import Link from "next/link";
import { installDays } from "@/data/install";

export const metadata = { title: "7-Day Install" };

export default function InstallPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">7-Day Install</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Kit-only plan · ~15–40 min/day. If flooded: Pause + Return first.
        </p>
      </div>
      <ol className="space-y-4">
        {installDays.map((d) => (
          <li
            key={d.day}
            className="rounded-lg border border-rule/20 bg-surface-activity px-4 py-3"
          >
            <p className="font-semibold">
              Day {d.day} — {d.title}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink-muted">
              {d.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-ink">
              <span className="font-bold">[✓] Proof:</span> {d.proof}
            </p>
          </li>
        ))}
      </ol>
      <Link href="/" className="text-sm font-semibold text-accent">
        ← Situation Map
      </Link>
    </div>
  );
}
