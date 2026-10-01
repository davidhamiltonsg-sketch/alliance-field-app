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
      <h1 className="display text-xl leading-[1.1]">{title}</h1>
      {children ? (
        <p className="text-base leading-normal text-ink-muted">{children}</p>
      ) : null}
    </header>
  );
}
