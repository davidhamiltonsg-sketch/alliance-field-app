import { SectionLabel } from "./SectionLabel";
import { QuoteIcon } from "./icons";
import {
  coupleTestimonials,
  individualTestimonials,
  type Testimonial,
} from "@/data/testimonials";

const chipTone = ["bg-accent/10 text-accent", "bg-repair/10 text-repair", "bg-pause/12 text-pause-text"];

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <li className="card w-[78%] shrink-0 snap-start space-y-2.5 px-4 py-3.5">
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${chipTone[i % chipTone.length]}`}>
        <QuoteIcon size={14} />
      </span>
      <p className="text-sm leading-normal text-ink">{t.quote}</p>
      <p className="text-xs font-medium text-ink-muted">— {t.names}</p>
    </li>
  );
}

/** Real testimonials, shown as a swipeable strip instead of a long stacked list. */
function TestimonialRow({ items }: { items: Testimonial[] }) {
  return (
    <ul
      tabIndex={0}
      aria-label="Testimonials — scroll sideways for more"
      className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((t, i) => (
        <TestimonialCard key={t.names} t={t} i={i} />
      ))}
    </ul>
  );
}

export function Testimonials() {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <SectionLabel>What couples are saying</SectionLabel>
        <TestimonialRow items={coupleTestimonials} />
      </div>
      <div className="space-y-3">
        <SectionLabel>Individual reviews</SectionLabel>
        <TestimonialRow items={individualTestimonials} />
      </div>
    </section>
  );
}
