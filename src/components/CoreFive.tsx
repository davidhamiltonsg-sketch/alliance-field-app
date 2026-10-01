import Link from "next/link";
import { coreFive } from "@/data/core5";
import { getProtocol } from "@/data/protocols";
import { SectionLabel } from "./SectionLabel";
import { IconTablet } from "./visuals/IconTablet";
import { ArrowRight, ChevronRight } from "./icons";

/** "Start with the Core 5": the five tools worth learning first, in order. */
export function CoreFive() {
  return (
    <section className="space-y-3" aria-labelledby="core-five-heading">
      <SectionLabel>
        <span id="core-five-heading">Start with the Core 5</span>
      </SectionLabel>
      <p className="px-1 text-base leading-normal text-ink-muted">
        Five tools cover most hard moments. Learn these first; everything else
        can wait.
      </p>
      <ol className="space-y-2.5">
        {coreFive.map((c, i) => {
          const p = getProtocol(c.slug);
          if (!p) return null;
          const tone = p.accentHint ?? "accent";
          return (
            <li key={c.slug}>
              <Link
                href={`/protocols/${c.slug}`}
                className="v2-card relative flex min-h-14 items-center gap-3 py-3 pl-6 pr-3"
              >
                <span className={`v2-edge v2-edge--${tone}`} aria-hidden />
                <IconTablet slug={c.slug} tone={tone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="display block text-base leading-snug">
                    <span className="tabular text-ink-muted">{i + 1}. </span>
                    {p.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-ink-muted">
                    {c.why}
                  </span>
                </span>
                <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
              </Link>
            </li>
          );
        })}
      </ol>
      <Link
        href="/start"
        className="inline-flex min-h-11 items-center gap-1.5 px-1 text-base font-medium text-accent"
      >
        Follow the 7-day start plan
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
