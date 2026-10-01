import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ArrowLeft } from "@/components/icons";
import { installDays } from "@/data/install";

export const metadata = { title: "7-Day Install" };

export default function InstallPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="DO" label="Seven days" />} title="7-Day Install">
        Kit-only plan · ~15–40 min/day. If flooded: Pause + Return first.
      </PageHeader>
      <ol className="space-y-2.5">
        {installDays.map((d) => (
          <li key={d.day} className="card px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper">
                {d.day}
              </span>
              <p className="display text-lg leading-snug">{d.title}</p>
            </div>
            <ul className="mt-2.5 space-y-1 pl-11 text-base leading-normal text-ink-muted">
              {d.bullets.map((b) => (
                <li key={b} className="relative before:absolute before:-left-3 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-accent/40">
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-safety/[0.06] px-3 py-2 text-sm text-ink">
              <Marker kind="OK" label="Proof" icon="proof-protocol" />
              <span>{d.proof}</span>
            </div>
          </li>
        ))}
      </ol>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent"
      >
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
