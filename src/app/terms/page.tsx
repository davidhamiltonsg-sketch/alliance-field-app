import Link from "next/link";
import { ContactLine } from "@/components/ContactLine";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowLeft } from "@/components/icons";

export const metadata = { title: "Website terms" };

const TERMS_LAST_UPDATED = "1 October 2026";

/*
 * Plain-English website terms.
 *
 * TO BE COMPLETED BY THE OWNER before launch (deliberately not shown to
 * users until then): the governing law and courts (e.g. the laws of
 * Singapore), and the registered business name, number and postal address of
 * whoever runs the site. Add them as a "Legal details" section below.
 */

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="NOTE" label="Plain English" />} title="Website terms">
        The rules for using this site and the free Field App, in plain words.
        If you use the site, these are the rules you’re agreeing to.
      </PageHeader>

      <section aria-labelledby="who-runs-heading" className="space-y-3">
        <SectionLabel>
          <span id="who-runs-heading">Who runs this site</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            Alliance Protocols, by David Hamilton and Zhongming Shi,
            Singapore. &ldquo;We&rdquo; and &ldquo;us&rdquo; below means us.
          </p>
          <p>
            To get in touch: <ContactLine />.
          </p>
        </div>
      </section>

      <section aria-labelledby="not-therapy-heading" className="space-y-3">
        <SectionLabel>
          <span id="not-therapy-heading">Not therapy, and no promises</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            Alliance Protocols is a set of communication tools for couples. It
            is not therapy, counselling, or medical, psychological or legal
            advice, and it is not an emergency service. If you are afraid of
            your partner, being threatened, or not free to say no, these tools
            are not for this:{" "}
            <Link href="/help" className="inline-flex min-h-11 items-center font-medium text-failure underline underline-offset-4">
              use the Help Lines
            </Link>
            .
          </p>
          <p>
            We offer the site and app as they are. We work to keep them
            accurate and available, but we don’t promise that they will suit
            your situation, be free of errors, or always be online.
          </p>
        </div>
      </section>

      <section aria-labelledby="use-heading" className="space-y-3">
        <SectionLabel>
          <span id="use-heading">Using the site fairly</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>The app is free for personal use. Please don’t:</p>
          <ul className="space-y-1.5 pl-4 text-ink-muted">
            <li className="list-disc">use any tool here to pressure, control or monitor another person, or to limit their contact with friends, family, money, phone or movement;</li>
            <li className="list-disc">copy, republish or sell the content, or present it as your own (sharing a link is fine);</li>
            <li className="list-disc">try to get round the early-access lock, overload the site, or interfere with how it works;</li>
            <li className="list-disc">use the site for anything unlawful.</li>
          </ul>
          <p>
            The text, cards, diagrams and design are ours (© David Hamilton and
            Zhongming Shi). The Alliance Protocols name and mark are our
            trade marks.
          </p>
        </div>
      </section>

      <section aria-labelledby="buying-heading" className="space-y-3">
        <SectionLabel>
          <span id="buying-heading">Buying the Manual or Field Kit</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          The paid products are sold through Gumroad, and Gumroad’s terms
          cover the purchase itself (payment, receipts and refunds as Gumroad
          handles them). These terms cover this site.
        </p>
      </section>

      <section aria-labelledby="privacy-terms-heading" className="space-y-3">
        <SectionLabel>
          <span id="privacy-terms-heading">Your privacy</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          What you type stays on your device. The{" "}
          <Link href="/privacy" className="font-medium text-accent underline underline-offset-4">
            privacy notice
          </Link>{" "}
          explains the little that ever leaves it.
        </p>
      </section>

      <section aria-labelledby="rights-heading" className="space-y-3">
        <SectionLabel>
          <span id="rights-heading">Your rights</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          Nothing in these terms takes away rights you have by law that can’t
          be excluded, such as consumer rights where you live. Your statutory
          rights are not affected.
        </p>
      </section>

      <section aria-labelledby="terms-changes-heading" className="space-y-3">
        <SectionLabel>
          <span id="terms-changes-heading">Changes</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          If we change these terms, we’ll update this page and the date below.
        </p>
        <p className="px-1 text-sm leading-normal text-ink-muted">Last updated {TERMS_LAST_UPDATED}</p>
      </section>

      <Link href="/about" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        About
      </Link>
    </div>
  );
}
