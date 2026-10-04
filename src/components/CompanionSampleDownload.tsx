import { COMPANION_SAMPLE_PDF } from "@/lib/links";
import { ArrowRight } from "./icons";

/** Free sample: the Companion Book's opening (PDF in public/downloads/). */
export function CompanionSampleDownload() {
  return (
    <div>
      <p className="text-sm font-medium text-ink">Free: the first chapter of the Companion</p>
      <p className="mt-0.5 text-sm leading-snug text-ink-muted">
        The Prologue and Chapter I of The Architecture of Staying, the stories
        behind the tools. A good first read if one of you isn’t sold on “a system”.
      </p>
      <a
        href={COMPANION_SAMPLE_PDF}
        download
        className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
      >
        Download the sample (PDF)
        <ArrowRight size={16} />
      </a>
    </div>
  );
}
