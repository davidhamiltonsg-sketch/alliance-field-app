import Link from "next/link";
import { Marker } from "./Marker";
import { ArrowRight } from "./icons";

/** "Only one of you using this?" — how one partner can start alone, safely. */
export function SoloStart() {
  return (
    <section
      aria-labelledby="solo-start-heading"
      className="rounded-2xl border border-repair/20 bg-surface-tool px-4 py-3.5"
    >
      <Marker kind="NOTE" label="Starting alone" />
      <h2 id="solo-start-heading" className="display mt-2 text-lg leading-snug">
        Only one of you using this?
      </h2>
      <p className="mt-1.5 text-base leading-normal text-ink">
        You can start on your own. When one of you changes your half of a
        pattern, the whole pattern can shift.
      </p>
      <ul className="mt-2 space-y-1.5 pl-4 text-base leading-normal text-ink-muted">
        <li className="list-disc">
          <strong className="font-medium text-ink">Follow the Situation Map</strong>{" "}
          — safety row first, then the first match.
        </li>
        <li className="list-disc">
          <strong className="font-medium text-ink">Do your half of Pause + Return</strong>{" "}
          — say you need a pause, give an exact return time, and come back on
          time.
        </li>
        <li className="list-disc">
          <strong className="font-medium text-ink">Soften your tone a little first</strong>{" "}
          — and own your small piece, without waiting for theirs.
        </li>
        <li className="list-disc">
          <strong className="font-medium text-ink">Invite, don’t assign</strong>{" "}
          — “I found something I’d like us to try.” Ask; don’t hand it over like homework.
        </li>
      </ul>
      <p className="mt-2.5 text-base font-medium leading-normal text-ink">
        Never use this app as evidence against your partner — no scorekeeping,
        no quoting cards back at them.
      </p>
      <Link
        href="/protocols/micro-repair"
        className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-repair"
      >
        See the small first move in Micro-Repair
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
