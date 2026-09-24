import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "warn" | "ghost";
};

const variants = {
  primary: "bg-accent text-paper hover:opacity-90",
  secondary: "border border-rule/30 bg-surface-tool text-ink",
  warn: "bg-pause text-paper hover:opacity-90",
  ghost: "text-accent underline-offset-2 hover:underline",
};

export function PrimaryButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold disabled:opacity-40 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
