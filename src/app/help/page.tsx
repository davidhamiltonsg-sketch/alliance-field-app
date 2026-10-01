import Link from "next/link";
import { DeleteAllData } from "@/components/DeleteAllData";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight } from "@/components/icons";
import { ELSEWHERE_LINE, emergencyNumbers, helpRegions } from "@/data/help";

export const metadata = { title: "Help & safety" };

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="HELP" label="Safety first" />} title="Help & safety">
        Afraid of your partner, being threatened, or not free to say no? Stop.
        These tools are not for this. Get outside help.
      </PageHeader>

      <section
        aria-labelledby="danger-heading"
        className="v2-card v2-card--failure space-y-3 bg-surface-warn px-4 py-4 shadow-none"
      >
        <h2 id="danger-heading" className="text-base font-semibold leading-snug text-failure">
          Immediate danger
        </h2>
        <p className="text-base leading-normal text-ink">
          Call your local emergency number.
        </p>
        <ul className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4">
          {emergencyNumbers.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="flex min-h-12 flex-col items-center justify-center rounded-xl bg-failure px-2 py-1.5 text-center text-white"
              >
                <span className="tabular text-lg font-semibold leading-tight">{n.display}</span>
                <span className="text-xs font-medium leading-tight text-white/90">{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lines-heading" className="space-y-3">
        <SectionLabel>
          <span id="lines-heading">Help lines</span>
        </SectionLabel>
        <ul className="space-y-3">
          {helpRegions.map((r) => (
            <li key={r.region} className="card overflow-hidden">
              <h3 className="px-4 pb-1 pt-3 text-sm font-semibold uppercase tracking-[0.08em] text-accent">
                {r.region}
              </h3>
              <ul className="divide-y divide-rule/[0.07]">
                {r.lines.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="flex min-h-12 items-center justify-between gap-3 px-4 py-2.5 hover:bg-surface-tool"
                    >
                      <span className="min-w-0 text-base leading-snug text-ink">{l.label}</span>
                      <span className="tabular shrink-0 text-base font-semibold text-accent underline underline-offset-4">
                        {l.display}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="px-1 text-base leading-normal text-ink-muted">{ELSEWHERE_LINE}</p>
      </section>

      <section id="not-for" className="scroll-mt-20 space-y-3">
        <SectionLabel>When not to use this app</SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            This app is a communication and repair tool. It is not a substitute
            for professional help, and it is not built for situations involving
            contempt, fear, coercion, threats, or violence.
          </p>
          <p>
            <strong>Pause + Return is for flooding, never for fear.</strong> If
            threats, fear, coercion or violence appear, do not return at the set
            time. Leave safely and use the help lines above.
          </p>
          <p>
            A &ldquo;no&rdquo; needs no script, reason, or substitute offer. No
            pact or agreement creates an obligation to sex, touch, or
            disclosure. No tool here is ever used to limit a partner’s
            contact with friends, family, money, phone or movement.
          </p>
          <p className="text-ink-muted">
            These protocols assume two people acting in good faith towards each
            other. They are not designed for, and should not be used to manage,
            an unsafe relationship.
          </p>
        </div>
      </section>

      <section id="your-data" className="scroll-mt-20 space-y-3">
        <SectionLabel>Your data</SectionLabel>
        <DeleteAllData />
      </section>

      <section className="space-y-3">
        <SectionLabel>Flooded, but safe?</SectionLabel>
        <Link
          href="/pause"
          className="flex min-h-12 items-center justify-between rounded-xl border border-rule/[0.1] bg-white px-4 text-base font-medium text-accent"
        >
          Pause + Return timer
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/protocols/60-second-reset"
          className="flex min-h-12 items-center justify-between rounded-xl border border-rule/[0.1] bg-white px-4 text-base font-medium text-accent"
        >
          60-Second Alliance Reset
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
