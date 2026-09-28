"use client";

import { useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { SectionLabel } from "./SectionLabel";
import { FULL_SYSTEM_URL, SIGNUP_CAPTURE_EMAIL } from "@/lib/links";

/**
 * Free-app CTA (decision #3): the app stays free as the way in. This card
 * offers the full Manual + Field Kit purchase, plus a lightweight,
 * no-backend email signup (opens the visitor's mail client addressed to
 * SIGNUP_CAPTURE_EMAIL) for anyone not ready to buy yet.
 */
export function GetFullSystem() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const subject = encodeURIComponent("Send me the Alliance system link");
    const body = encodeURIComponent(
      `Please add me to the list: ${email.trim()}`
    );
    window.location.href = `mailto:${SIGNUP_CAPTURE_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="space-y-3">
      <SectionLabel>Get the full system</SectionLabel>
      <div className="card space-y-3 px-4 py-4">
        <p className="text-[15px] leading-normal text-ink">
          This app is free, always. The Operating Manual and Field Kit — the
          deep protocols, the printable cards, the worksheets — are a
          one-time purchase.
        </p>
        <PrimaryButton
          onClick={() => window.open(FULL_SYSTEM_URL, "_blank", "noopener,noreferrer")}
        >
          Get the full system
        </PrimaryButton>

        <div className="border-t border-rule/[0.08] pt-3">
          <p className="text-[13px] font-medium text-ink">Not ready yet?</p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
            Leave your email and we&apos;ll send you the link.
          </p>
          <form onSubmit={submit} className="mt-2 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input"
              aria-label="Email address"
            />
            <PrimaryButton
              type="submit"
              fullWidth={false}
              variant="secondary"
              className="shrink-0 px-5"
            >
              {sent ? "Sent ✓" : "Notify me"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </section>
  );
}
