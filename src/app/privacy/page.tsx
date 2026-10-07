import Link from "next/link";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowLeft } from "@/components/icons";
import { ContactLine } from "@/components/ContactLine";
import { CONTACT_EMAIL, EMAIL_PROVIDER_NAME, SIGNUP_ACTIVE } from "@/lib/links";

export const metadata = { title: "Privacy notice" };

const PRIVACY_LAST_UPDATED = "1 October 2026";

const onDevice = [
  "Pause + Return: your return time while a pause is running",
  "Weekly Reset: your current draft and past resets",
  "Profile Calibration: your answers and couple report",
  "Recently opened tools",
  "first-week plan: which days you have ticked as done",
  "Whether you have already seen the intro",
  "The offline copy of the app itself",
];


export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={<Marker kind="NOTE" label="Plain English" />} title="Privacy notice">
        Short version: everything you type stays on your device. The only thing
        that can ever leave it is an email address, and only if you choose to
        send one.
      </PageHeader>

      <section aria-labelledby="who-heading" className="space-y-3">
        <SectionLabel>
          <span id="who-heading">Who &ldquo;we&rdquo; are</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            Alliance Protocols and this Field App are made by David Hamilton
            and Zhongming Shi, in Singapore. We handle personal data in line
            with Singapore’s Personal Data Protection Act (PDPA).
          </p>
          <p>
            Questions, or a request to see, correct or delete data we hold
            about you: <ContactLine />.
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
            saved in your browser’s own storage on this device, and is
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
            We can’t see any of it, so we can’t recover it either. You
            can delete all of it at any time from{" "}
            <Link href="/help#your-data" className="font-medium text-accent underline underline-offset-4">
              Help &rarr; Your data
            </Link>
            , or by clearing this site’s data in your browser.
          </p>
          <p className="text-ink-muted">
            Calendar reminders (.ics files) are made on your device, too. Once
            you add one to your calendar, your calendar provider’s own
            privacy terms apply.
          </p>
        </div>
      </section>

      <section aria-labelledby="email-heading" className="space-y-3">
        <SectionLabel>
          <span id="email-heading">The email list</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          {SIGNUP_ACTIVE ? (
            <>
              <p>
                <strong className="font-medium">Your email address</strong>, if you
                choose to submit it in the &ldquo;Get updates by email&rdquo; form,
                is the only thing the app ever sends. Nothing else is sent with it.
              </p>
              <ul className="space-y-1.5 pl-4 text-ink-muted">
                <li className="list-disc">
                  <strong className="font-medium text-ink">Why:</strong> Alliance
                  Protocols product updates and the occasional note from us. We
                  don’t sell it or share it for anyone else’s marketing.
                </li>
                <li className="list-disc">
                  <strong className="font-medium text-ink">Who holds it:</strong>{" "}
                  {EMAIL_PROVIDER_NAME}, the service that runs our mailing list,
                  stores it on our behalf. Its own privacy policy also applies.
                </li>
                <li className="list-disc">
                  <strong className="font-medium text-ink">Leaving:</strong> every
                  email has an unsubscribe link.
                </li>
              </ul>
            </>
          ) : (
            <p>
              The email sign-up isn’t active yet, so the app doesn’t collect
              email addresses. Before it goes live, this notice will name the
              service that runs the list.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="purchases-heading" className="space-y-3">
        <SectionLabel>
          <span id="purchases-heading">Buying the Manual or Field Kit</span>
        </SectionLabel>
        <div className="card space-y-3 px-4 py-4 text-base leading-normal text-ink">
          <p>
            Purchases are made on Gumroad, not in this app. Gumroad takes your
            payment and the details you give at checkout, under{" "}
            <a
              href="https://gumroad.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline underline-offset-4"
            >
              Gumroad’s own privacy policy
            </a>
            . We receive what we need to deliver and support your order (your
            name, email address and what you bought), never your card details.
          </p>
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
            you don’t have to type the code again. It holds a signed token and
            the time it was issued, not the code and nothing about you; page scripts can’t read it
            (httpOnly); it expires after 30 days; and it isn’t used for
            tracking. “Delete all my data” (Help &rarr; Your data) doesn’t
            remove it, because page scripts can’t reach it; it expires on its
            own. Once early access ends, it is no longer set. Otherwise
            the app sets no cookies.
          </p>
          <p>
            <strong className="font-medium">Hosting.</strong> The app is hosted
            by Vercel. As part of normal hosting, Vercel’s servers keep
            request logs, which may include your IP address, browser type and
            the page requested. We don’t use these logs to identify or
            profile anyone.
          </p>
        </div>
      </section>

      <section aria-labelledby="transfers-heading" className="space-y-3">
        <SectionLabel>
          <span id="transfers-heading">Data outside Singapore</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          The services above (Vercel for hosting, Gumroad for purchases, and
          the mailing-list service once sign-up is live) may store or process
          data outside Singapore, including in the United States. Where
          personal data leaves Singapore, we use providers bound to protect
          it to a standard comparable to the PDPA.
        </p>
      </section>

      <section aria-labelledby="retention-heading" className="space-y-3">
        <SectionLabel>
          <span id="retention-heading">How long data is kept</span>
        </SectionLabel>
        <ul className="space-y-1.5 pl-5 text-base leading-normal text-ink">
          <li className="list-disc">On your device: until you delete it, or clear this site’s data.</li>
          <li className="list-disc">Your email address: until you unsubscribe or ask us to delete it.</li>
          <li className="list-disc">Purchase records: as long as tax and accounting law requires.</li>
          <li className="list-disc">Hosting request logs: for the short period Vercel keeps them.</li>
          <li className="list-disc">The early-access cookie: 30 days at most.</li>
        </ul>
      </section>

      <section aria-labelledby="delete-heading" className="space-y-3">
        <SectionLabel>
          <span id="delete-heading">Asking us to delete your data</span>
        </SectionLabel>
        <div className="space-y-2 px-1 text-base leading-normal text-ink">
          <p>
            To see, correct or delete what we hold about you (your email
            address or purchase details), contact us{CONTACT_EMAIL ? " at " : " "}
            <ContactLine />, and tell us the email address concerned. We’ll
            reply within 30 days.
          </p>
          <p className="text-ink-muted">
            What’s on your device we never see: delete it yourself from{" "}
            <Link href="/help#your-data" className="font-medium text-accent underline underline-offset-4">
              Help &rarr; Your data
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="children-heading" className="space-y-3">
        <SectionLabel>
          <span id="children-heading">Children</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          Alliance Protocols is for adult couples. It is not directed at anyone
          under 18, and we don’t knowingly collect email addresses from
          under-18s. If you think we have one, tell us and we’ll delete it.
        </p>
      </section>

      <section aria-labelledby="changes-heading" className="space-y-3">
        <SectionLabel>
          <span id="changes-heading">Changes to this notice</span>
        </SectionLabel>
        <p className="px-1 text-base leading-normal text-ink">
          If what the app stores or sends ever changes, we’ll update this
          page first and change the date below. If you’re on the mailing
          list and the change affects your email address, we’ll tell you.
        </p>
        <p className="px-1 text-sm leading-normal text-ink-muted">
          Last updated {PRIVACY_LAST_UPDATED}
        </p>
      </section>

      <p className="px-1 text-base leading-normal text-ink">
        See also the{" "}
        <Link href="/terms" className="font-medium text-accent underline underline-offset-4">
          website terms
        </Link>
        .
      </p>

      <Link href="/about" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        About
      </Link>
    </div>
  );
}
