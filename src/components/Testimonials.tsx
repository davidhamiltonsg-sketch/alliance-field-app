import { SectionLabel } from "./SectionLabel";
import { QuoteIcon } from "./icons";
import {
  coupleTestimonials,
  individualTestimonials,
  type Testimonial,
} from "@/data/testimonials";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <li className="card space-y-2.5 px-4 py-3.5">
      <QuoteIcon size={18} className="text-accent/50" />
      <p className="text-[15px] leading-normal text-ink">{t.quote}</p>
      <p className="text-[13px] font-medium text-ink-muted">— {t.names}</p>
    </li>
  );
}

/** Real testimonials from couples and individuals using the system — shown as a trust signal. */
export function Testimonials() {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <SectionLabel>What couples are saying</SectionLabel>
        <ul className="space-y-2.5">
          {coupleTestimonials.map((t) => (
            <TestimonialCard key={t.names} t={t} />
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <SectionLabel>Individual reviews</SectionLabel>
        <ul className="space-y-2.5">
          {individualTestimonials.map((t) => (
            <TestimonialCard key={t.names} t={t} />
          ))}
        </ul>
      </div>
    </section>
  );
}
