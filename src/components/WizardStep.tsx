"use client";

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
}: {
  step: number;
  total: number;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
}) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="tabular text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
            Step {step} of {total}
          </p>
          <p className="tabular text-[13px] font-medium text-ink-muted">{pct}%</p>
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
        <h2 className="display text-[20px] leading-tight">{title}</h2>
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
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="field-input resize-none text-[15px]"
      />
    </label>
  );
}
