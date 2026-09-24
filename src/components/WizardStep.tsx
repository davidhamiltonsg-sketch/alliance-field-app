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
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold tracking-widest text-accent">
          STEP {step} / {total}
        </p>
        <h2 className="mt-1 text-xl font-semibold">{title}</h2>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < step ? "bg-accent" : "bg-rule/15"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
      <div className="flex gap-2">
        {onBack && (
          <PrimaryButton variant="secondary" onClick={onBack} className="w-1/3">
            {backLabel}
          </PrimaryButton>
        )}
        {onNext && (
          <PrimaryButton onClick={onNext} className={onBack ? "flex-1" : ""}>
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
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-rule/25 bg-paper px-3 py-2 text-ink leading-relaxed"
      />
    </label>
  );
}
