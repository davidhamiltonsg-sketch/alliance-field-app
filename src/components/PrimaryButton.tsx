import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "warn" | "ghost";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-accent text-paper shadow-[0_6px_16px_-8px_rgb(61_90_76/0.7)] hover:bg-[#35503f]",
  secondary:
    "border border-rule/15 bg-white text-ink shadow-[0_1px_2px_rgb(26_26_26/0.04)] hover:border-rule/25",
  warn: "bg-gradient-to-b from-[#CF8527] to-[#B86F15] text-white shadow-[var(--shadow-amber)] hover:brightness-105",
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
      className={`inline-flex min-h-12 ${fullWidth ? "w-full" : ""} items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
