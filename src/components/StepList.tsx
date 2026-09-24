import { SectionLabel } from "./SectionLabel";

export function StepList({ steps }: { steps: string[] }) {
  return (
    <section>
      <SectionLabel>Steps</SectionLabel>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-paper"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="pt-1 leading-relaxed text-ink">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
