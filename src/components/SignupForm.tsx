"use client";

import { useId, useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { SIGNUP_CAPTURE_EMAIL, SIGNUP_ENDPOINT } from "@/lib/links";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Email signup. With NEXT_PUBLIC_SIGNUP_ENDPOINT set, POSTs a form-encoded
 * `email` to it (Buttondown / ConvertKit / Formspree style) and shows inline
 * success or error. Without it, opens a mailto: to SIGNUP_CAPTURE_EMAIL.
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
    return `mailto:${SIGNUP_CAPTURE_EMAIL}?subject=${subject}&body=${body}`;
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
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({ email: address }).toString(),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("done");
    } catch (err) {
      // A form-encoded POST is a CORS "simple request": it reaches services
      // that don't send CORS headers (e.g. some embed endpoints) even though
      // the browser then hides the response. So a network-level TypeError
      // while online is treated as sent; offline or an HTTP error is not.
      if (err instanceof TypeError && navigator.onLine) {
        setStatus("done");
        return;
      }
      setError(
        navigator.onLine
          ? "That didn't go through. Check the address and try again."
          : "You're offline. Try again when you have a connection."
      );
      setStatus("error");
    }
  };

  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        Not ready yet? Get updates by email
      </label>
      <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
        Occasional updates and the link to the full system. Unsubscribe any
        time. This is the only time the app sends anything off your device.
      </p>
      {status === "done" ? (
        <p role="status" className="mt-2 text-[15px] font-medium text-safety-text">
          {SIGNUP_ENDPOINT
            ? "Thanks — you're on the list. Check your inbox to confirm."
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
            {status === "sending" ? "Sending…" : "Notify me"}
          </PrimaryButton>
        </form>
      )}
      {status === "error" && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] font-medium text-failure">
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
