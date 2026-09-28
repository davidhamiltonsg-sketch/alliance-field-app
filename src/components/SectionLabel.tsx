export function SectionLabel({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: React.ReactNode;
  as?: "h2" | "h3" | "p";
  className?: string;
}) {
  return (
    <Tag
      className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.08em] text-accent ${className}`}
    >
      <span className="shrink-0">{children}</span>
      <span className="h-px flex-1 bg-rule/10" aria-hidden />
    </Tag>
  );
}
