import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "warn" | "ghost";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-accent text-paper shadow-[0_6px_16px_-8px_rgb(44_62_45/0.7)] hover:brightness-110",
  secondary:
    "border border-rule/60 bg-surface-raised text-ink shadow-[0_1px_2px_rgb(26_26_26/0.04)] hover:border-rule",
  warn: "bg-pause text-ink shadow-[var(--shadow-amber)] hover:brightness-105",
  ghost: "text-accent hover:bg-accent/[0.06]",
};

export function PrimaryButton({
  variant = "primary",
  className = "",
  fullWidth = true,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 ${fullWidth ? "w-full" : ""} items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
