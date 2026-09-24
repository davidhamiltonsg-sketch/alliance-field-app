export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold tracking-widest text-accent uppercase">
      {children}
    </h2>
  );
}
