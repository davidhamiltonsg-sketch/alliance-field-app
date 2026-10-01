"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { CONTACT_EMAIL, SIGNUP_ENDPOINT } from "@/lib/links";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Email signup. With NEXT_PUBLIC_SIGNUP_ENDPOINT set, POSTs a form-encoded
 * `email` to it (Buttondown / ConvertKit / Formspree style) and shows inline
 * success or error (with a retry). Without it, opens a mailto: to CONTACT_EMAIL.
 * No third-party scripts; the email is the only data this app ever sends.
 */
export function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const id = useId();

  const mailtoHref = (address: string) => {
    const subject = encodeURIComponent("Send me the Alliance system link");
    const body = encodeURIComponent(`Please add me to the list: ${address}`);
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!address) return;

    if (!SIGNUP_ENDPOINT) {
      window.location.href = mailtoHref(address);
      setStatus("done");
      return;
    }

    setStatus("sending");
    setError("");
    const body = new URLSearchParams({ email: address }).toString();
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    try {
      const endpoint = new URL(SIGNUP_ENDPOINT, window.location.href);
      if (endpoint.origin !== window.location.origin) {
        // Cross-origin list services rarely send CORS headers, so post as a
        // "no-cors" simple request: it is delivered, but the response is
        // opaque. Resolving means it was sent; only a network failure throws.
        await fetch(endpoint, { method: "POST", mode: "no-cors", headers, body });
      } else {
        const res = await fetch(endpoint, { method: "POST", headers: { ...headers, Accept: "application/json" }, body });
        if (!res.ok) throw new Error(`status ${res.status}`);
      }
      setStatus("done");
    } catch {
      setError(
        navigator.onLine
          ? "That didn’t go through. Check your connection and the address, then try again."
          : "You’re offline. Try again when you have a connection."
      );
      setStatus("error");
    }
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        Not ready yet? Get updates by email
      </label>
      <p className="mt-0.5 text-sm leading-snug text-ink-muted">
        Occasional updates and the link to the full system. This is the only
        time the app sends anything off your device.
      </p>
      {status === "done" ? (
        <p role="status" className="mt-2 text-base font-medium text-safety-text">
          {SIGNUP_ENDPOINT
            ? "Sent — check your inbox to confirm."
            : "Your email app should open with a message ready to send."}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-2 flex gap-2">
          <input
            id={id}
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field-input"
            aria-invalid={status === "error" || undefined}
            aria-describedby={status === "error" ? `${id}-error` : undefined}
          />
          <PrimaryButton
            type="submit"
            fullWidth={false}
            variant="secondary"
            className="shrink-0 px-5"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Notify me"}
          </PrimaryButton>
        </form>
      )}
      <p className="mt-2 text-sm leading-snug text-ink-muted">
        We’ll only use your email for Alliance Protocols updates.
        Unsubscribe any time.{" "}
        <Link href="/privacy" className="font-medium text-accent underline underline-offset-4">
          Privacy notice
        </Link>
        .
      </p>
      {status === "error" && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-failure">
          {error}{" "}
          <a href={mailtoHref(email.trim())} className="underline underline-offset-4">
            Or email us instead
          </a>
          .
        </p>
      )}
    </div>
  );
}
