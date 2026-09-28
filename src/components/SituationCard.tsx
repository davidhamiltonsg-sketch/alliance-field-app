import Link from "next/link";
import type { Situation } from "@/data/types";
import { getProtocol } from "@/data/protocols";
import { MarkedText } from "./MarkedText";
import { ChevronRight } from "./icons";

type Tone = "pause" | "repair" | "accent";

function toneFor(situation: Situation): Tone {
  if (situation.warn) return "pause";
  const slug = situation.primaryHref.startsWith("/protocols/")
    ? situation.primaryHref.replace("/protocols/", "")
    : "";
  const hint = slug ? getProtocol(slug)?.accentHint : undefined;
  if (hint === "pause") return "pause";
  if (hint === "repair") return "repair";
  return "accent";
}

const bar: Record<Tone, string> = {
  pause: "bg-pause",
  repair: "bg-repair",
  accent: "bg-accent",
};

const moveText: Record<Tone, string> = {
  pause: "text-[#9A5E10]",
  repair: "text-repair",
  accent: "text-accent",
};

export function SituationCard({
  situation,
  index,
}: {
  situation: Situation;
  index?: number;
}) {
  const tone = toneFor(situation);
  return (
    <li>
      <div className="card card-interactive relative overflow-hidden">
        <span className={`absolute inset-y-0 left-0 w-1 ${bar[tone]}`} aria-hidden />
        <Link
          href={situation.primaryHref}
          className="flex min-h-14 items-center gap-3 py-3 pl-5 pr-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              {typeof index === "number" && (
                <span className="tabular text-[11px] font-medium text-ink-muted/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span className="text-[17px] font-medium leading-snug text-ink">
                {situation.label}
              </span>
            </div>
            <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
              {situation.description}
            </span>
            <span
              className={`mt-2 block text-[13px] font-medium leading-snug ${moveText[tone]}`}
            >
              <MarkedText text={situation.firstMove} />
            </span>
          </div>
          <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
        </Link>
        {situation.secondaryHrefs && situation.secondaryHrefs.length > 0 && (
          <div className="flex flex-wrap gap-x-1.5 border-t border-rule/[0.07] pl-4 pr-3">
            {situation.secondaryHrefs.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group inline-flex min-h-12 items-center"
              >
                <span className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-tool px-3 text-[13px] font-medium text-repair transition-colors group-hover:bg-repair/10">
                  {s.label}
                  <ChevronRight size={14} strokeWidth={2.25} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
