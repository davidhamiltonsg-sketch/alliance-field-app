import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ChevronRight } from "@/components/icons";
import { IconTablet } from "@/components/visuals/IconTablet";
import { protocols } from "@/data/protocols";

export const metadata = { title: "Protocols" };

export default function ProtocolsIndexPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Field Kit" />} title="Protocols">
        All Field Kit tools. Browse or return via Situation Map.
      </PageHeader>
      <ul className="space-y-2.5">
        {protocols.map((p) => {
          const tone = p.accentHint ?? "accent";
          return (
            <li key={p.slug}>
              <Link
                href={`/protocols/${p.slug}`}
                className="v2-card relative flex min-h-14 items-center gap-3.5 py-3.5 pl-6 pr-3"
              >
                <span className={`v2-edge v2-edge--${tone}`} aria-hidden />
                <IconTablet slug={p.slug} tone={tone} size="md" />
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
          );
        })}
      </ul>
    </div>
  );
}
