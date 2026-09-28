import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ChevronRight } from "@/components/icons";
import { protocols } from "@/data/protocols";

export const metadata = { title: "Protocols" };

const bar = {
  accent: "bg-accent",
  safety: "bg-safety",
  pause: "bg-pause",
  repair: "bg-repair",
} as const;

export default function ProtocolsIndexPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Field Kit" />} title="Protocols">
        All Field Kit tools. Browse or return via Situation Map.
      </PageHeader>
      <ul className="space-y-2.5">
        {protocols.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/protocols/${p.slug}`}
              className="card card-interactive relative flex min-h-14 items-center gap-3 overflow-hidden py-3 pl-5 pr-3"
            >
              <span
                className={`absolute inset-y-0 left-0 w-1 ${bar[p.accentHint ?? "accent"]}`}
                aria-hidden
              />
              <span className="tabular w-5 shrink-0 text-[11px] font-medium text-ink-muted/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block text-[17px] leading-snug">
                  {p.title}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-ink-muted">
                  {p.concept}
                </span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
