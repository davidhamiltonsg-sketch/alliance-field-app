import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowLeft } from "@/components/icons";
import { CONTACT_EMAIL } from "@/lib/links";

export const metadata = { title: "Privacy notice" };

const PRIVACY_LAST_UPDATED = "1 October 2026";

const onDevice = [
  "Pause + Return: your return time while a pause is running",
  "Weekly Reset: your current draft and past resets",
  "Profile Calibration: your answers and couple report",
  "Favourites and recently opened protocols",
  "7-day plan: which days you have ticked as done",
  "Whether you have already seen the intro",
  "The offline copy of the app itself",
];

const mailto = `mailto:${CONTACT_EMAIL}`;

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="NOTE" label="Plain English" />} title="Privacy notice">
        Short version: everything you type stays on your device. The only thing
        that ever leaves it is an email address, and only if you choose to send
        one.
      </PageHeader>

      <section aria-labelledby="who-heading" className="space-y-3">
        <SectionLabel>
          <span id="who-heading">Who &ldquo;we&rdquo; are</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            Alliance Protocols and this Field App are made by David Hamilton
            and Dr Zhongming Shi, in Singapore. We handle personal data in line
            with Singapore&apos;s Personal Data Protection Act (PDPA).
          </p>
          <p>
            Questions, or a request to see, correct or delete data we hold
            about you:{" "}
            <a href={mailto} className="font-medium text-accent underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="device-heading" className="space-y-3">
        <SectionLabel>
          <span id="device-heading">What stays on your device</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            The app has no account and no server database. What you enter is
            saved in your browser&apos;s own storage on this device, and is
            never sent to us or anyone else:
          </p>
          <ul className="space-y-1.5 pl-4 text-ink-muted">
            {onDevice.map((item) => (
              <li key={item} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
          <p>
            We can&apos;t see any of it, so we can&apos;t recover it either. You
            can delete all of it at any time from{" "}
            <Link href="/help#your-data" className="font-medium text-accent underline underline-offset-4">
              Help &rarr; Your data
            </Link>
            , or by clearing this site&apos;s data in your browser.
          </p>
          <p className="text-ink-muted">
            Calendar reminders (.ics files) are made on your device, too. Once
            you add one to your calendar, your calendar provider&apos;s own
            privacy terms apply.
          </p>
        </div>
      </section>

      <section aria-labelledby="email-heading" className="space-y-3">
        <SectionLabel>
          <span id="email-heading">The only data that leaves your device</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            <strong className="font-medium">Your email address</strong>, if you
            choose to submit it in the &ldquo;Get updates by email&rdquo; form.
            Nothing else is sent with it.
          </p>
          <ul className="space-y-1.5 pl-4 text-ink-muted">
            <li className="list-disc">
              <strong className="font-medium text-ink">Why:</strong> Alliance
              Protocols product updates and the occasional note from us. We
              don&apos;t sell it or share it for anyone else&apos;s marketing.
            </li>
            <li className="list-disc">
              <strong className="font-medium text-ink">Who handles it:</strong>{" "}
              the email service the site uses to run the mailing list, which
              stores it on our behalf. If that form isn&apos;t set up, your own
              email app opens instead and the message comes straight to{" "}
              {CONTACT_EMAIL}.
            </li>
            <li className="list-disc">
              <strong className="font-medium text-ink">Leaving:</strong> every
              email has an unsubscribe link. To have your address deleted
              altogether, email{" "}
              <a href={mailto} className="font-medium text-accent underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="tracking-heading" className="space-y-3">
        <SectionLabel>
          <span id="tracking-heading">No analytics or trackers</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            The app has no analytics, no advertising and no tracking pixels. It
            loads no third-party scripts; fonts are served from the app itself.
          </p>
          <p>
            <strong className="font-medium">One cookie, only before launch.</strong>{" "}
            While the app is in early access, entering the access code sets a
            single cookie (<code className="text-sm">ap_access</code>) so
            you don&apos;t have to type the code again. It holds a signed token,
            not the code and nothing about you; page scripts can&apos;t read it
            (httpOnly); it expires after 30 days; and it isn&apos;t used for
            tracking. Once early access ends, it is no longer set. Otherwise
            the app sets no cookies.
          </p>
          <p>
            <strong className="font-medium">Hosting.</strong> The app is hosted
            by Vercel. As part of normal hosting, Vercel&apos;s servers keep
            request logs, which may include your IP address, browser type and
            the page requested. We don&apos;t use these logs to identify or
            profile anyone.
          </p>
        </div>
      </section>

      <section aria-labelledby="children-heading" className="space-y-3">
        <SectionLabel>
          <span id="children-heading">Children</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          Alliance Protocols is for adult couples. It is not directed at anyone
          under 18, and we don&apos;t knowingly collect email addresses from
          under-18s. If you think we have one, email us and we&apos;ll delete it.
        </p>
      </section>

      <section aria-labelledby="changes-heading" className="space-y-3">
        <SectionLabel>
          <span id="changes-heading">Changes to this notice</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          If what the app stores or sends ever changes, we&apos;ll update this
          page first and change the date below. If you&apos;re on the mailing
          list and the change affects your email address, we&apos;ll tell you.
        </p>
        <p className="px-1 text-sm leading-normal text-ink-muted">
          Last updated {PRIVACY_LAST_UPDATED}
        </p>
      </section>

      <Link href="/about" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        About
      </Link>
    </div>
  );
}
