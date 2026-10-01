"use client";

import { useEffect, useRef } from "react";
import { PrimaryButton } from "./PrimaryButton";

export function WizardStep({
  step,
  total,
  title,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  focusHeading = false,
}: {
  step: number;
  total: number;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  /** Move focus to the step heading on mount (set after the user changes step). */
  focusHeading?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!focusHeading) return;
    // Bring the top of the step (progress bar first) into view below the
    // sticky header, then focus the heading without a second scroll that
    // would tuck the controls above it under the header.
    headingRef.current?.closest("[data-wizard-root]")?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [focusHeading]);
  const pct = Math.round((step / total) * 100);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="tabular text-xs font-medium uppercase tracking-[0.08em] text-accent">
            Step {step} of {total}
          </p>
          <p className="tabular text-sm font-medium text-ink-muted">{pct}%</p>
        </div>
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label="Weekly Reset progress"
        >
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? "bg-accent" : "bg-accent/12"
              }`}
            />
          ))}
        </div>
      </div>
      <section className="card space-y-4 px-4 pb-4 pt-4">
        <h2 ref={headingRef} tabIndex={-1} className="focus-target display text-lg leading-tight">
          <span className="sr-only">Step {step} of {total}: </span>
          {title}
        </h2>
        <div className="space-y-3.5">{children}</div>
      </section>
      <div className="flex gap-2">
        {onBack && (
          <PrimaryButton
            variant="secondary"
            onClick={onBack}
            fullWidth={false}
            className="w-1/3"
          >
            {backLabel}
          </PrimaryButton>
        )}
        {onNext && (
          <PrimaryButton
            onClick={onNext}
            fullWidth={!onBack}
            className={onBack ? "flex-1" : ""}
          >
            {nextLabel}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="field-input resize-none text-base"
      />
    </label>
  );
}
