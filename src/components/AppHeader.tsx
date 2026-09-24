import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-rule/20 bg-paper px-4 py-3">
      <Link href="/" className="block">
        <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">
          THE ALLIANCE
        </p>
        <p className="text-sm text-ink-muted">
          Field App · Precision · Connection
        </p>
      </Link>
    </header>
  );
}
