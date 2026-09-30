import Link from "next/link";
import type { Situation } from "@/data/types";
import { getProtocol } from "@/data/protocols";
import { MarkedText } from "./MarkedText";
import { ChevronRight } from "./icons";
import { protocolIconSlugs } from "./visuals/ProtocolIcon";
import { IconTablet } from "./visuals/IconTablet";
import { V, lancetD, lensD } from "./visuals/v2";

function iconSlugFor(href: string): string | null {
  const slug = href.replace(/^\/protocols\//, "").replace(/^\//, "");
  return protocolIconSlugs.includes(slug) ? slug : null;
}

type Tone = "failure" | "pause" | "repair" | "accent";

function toneFor(situation: Situation): Tone {
  if (situation.danger) return "failure";
  if (situation.warn) return "pause";
  const slug = situation.primaryHref.startsWith("/protocols/")
    ? situation.primaryHref.replace("/protocols/", "")
    : "";
  const hint = slug ? getProtocol(slug)?.accentHint : undefined;
  if (hint === "pause") return "pause";
  if (hint === "repair") return "repair";
  return "accent";
}

const card: Record<Tone, string> = {
  failure: "v2-card--failure",
  pause: "v2-card--pause",
  repair: "v2-card--repair",
  accent: "",
};

const moveText: Record<Tone, string> = {
  failure: "text-failure",
  pause: "text-pause-text",
  repair: "text-repair",
  accent: "text-accent",
};

const threadColor: Record<Tone, string> = {
  failure: V.failure,
  pause: V.pause,
  repair: V.repair,
  accent: V.thread,
};

/** Row number seated in a decision lens (the mark's leaf on its side). */
function LensNumber({ n }: { n: string }) {
  return (
    <svg viewBox="0 0 38 22" width="38" height="22" className="shrink-0" aria-hidden focusable="false">
      <path d={lensD(19, 11, 36, 20)} fill={V.white} stroke={V.accent} strokeWidth={0.9} />
      <path d={lensD(19, 11, 28, 14)} fill="none" stroke={V.brass} strokeWidth={0.6} />
      <text x={19} y={15.4} textAnchor="middle" className="font-display" fontStyle="italic" fontSize={12.5} fill={V.accent}>
        {n}
      </text>
    </svg>
  );
}

/** Route thread: bead start, lancet (leaf-tip) end. */
function RouteThread({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 10" width="20" height="10" className="shrink-0" aria-hidden focusable="false">
      <circle cx={2} cy={5} r={1.7} fill={color} />
      <path d="M2 5H14.4" stroke={color} strokeWidth={1} strokeLinecap="round" />
      <path d={lancetD(19, 5, 0, 7)} fill={color} />
    </svg>
  );
}

export function SituationCard({
  situation,
  index,
}: {
  situation: Situation;
  index?: number;
}) {
  const tone = toneFor(situation);
  const iconSlug = situation.warn || situation.danger ? null : iconSlugFor(situation.primaryHref);
  return (
    <li>
      <div className={`v2-card ${card[tone]} overflow-hidden`}>
        <Link
          href={situation.primaryHref}
          className="relative z-[1] flex min-h-14 items-center gap-3 pb-3 pl-3.5 pr-3 pt-3.5"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              {typeof index === "number" && <LensNumber n={String(index + 1).padStart(2, "0")} />}
              <span className="text-[17px] font-medium leading-snug text-ink">
                {situation.label}
              </span>
            </div>
            <span className="mt-1 block text-[13px] leading-snug text-ink-muted">
              {situation.description}
            </span>
            <span
              className={`mt-2.5 flex items-center gap-2 text-[13px] font-medium leading-snug ${moveText[tone]}`}
            >
              <RouteThread color={threadColor[tone]} />
              {iconSlug && (
                <IconTablet
                  slug={iconSlug}
                  size="xs"
                  tone={tone === "pause" ? "pause" : tone === "repair" ? "repair" : "accent"}
                />
              )}
              <span className="min-w-0">
                <MarkedText text={situation.firstMove} />
              </span>
            </span>
          </div>
          <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
        </Link>
        {situation.secondaryHrefs && situation.secondaryHrefs.length > 0 && (
          <div className="relative z-[1] mx-3 flex flex-wrap gap-x-2 border-t border-[#A8895A]/35 pl-1">
            {situation.secondaryHrefs.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group inline-flex min-h-12 items-center"
              >
                <span className="v2-tab inline-flex h-8 items-center gap-1 px-3 text-[13px] font-medium text-repair transition-colors group-hover:bg-repair/[0.06]">
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
