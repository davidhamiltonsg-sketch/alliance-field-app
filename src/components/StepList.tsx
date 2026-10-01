import { MarkedText } from "./MarkedText";
import { SectionLabel } from "./SectionLabel";

export function StepList({ steps }: { steps: string[] }) {
  return (
    <section className="space-y-3">
      <SectionLabel>Steps</SectionLabel>
      <ol className="card divide-y divide-rule/30 px-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 py-3">
            <span
              className="tabular mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="pt-0.5 text-base leading-normal text-ink">
              <MarkedText text={step} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
