import { SITUATION_MAP_PDF } from "@/lib/links";
import { ArrowRight } from "./icons";

/** Free lead magnet: the printable Situation Map (PDF in public/downloads/). */
export function SituationMapDownload() {
  return (
    <div>
      <p className="text-sm font-medium text-ink">Free: printable Situation Map</p>
      <p className="mt-0.5 text-sm leading-snug text-ink-muted">
        The one-page map, safety row first. Stick it on the fridge.
      </p>
      <a
        href={SITUATION_MAP_PDF}
        download
        className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
      >
        Download the Situation Map (PDF)
        <ArrowRight size={16} />
      </a>
    </div>
  );
}
