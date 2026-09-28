import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="space-y-2 pt-1">
      {eyebrow ? <div>{eyebrow}</div> : null}
      <h1 className="display text-[28px] leading-[1.1]">{title}</h1>
      {children ? (
        <p className="text-[15px] leading-normal text-ink-muted">{children}</p>
      ) : null}
    </header>
  );
}
