import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-ink-muted">That route isn’t in the Field App map.</p>
      <div className="flex justify-center gap-4 text-sm font-semibold text-accent">
        <Link href="/">Situation Map</Link>
        <Link href="/protocols">Protocols</Link>
      </div>
    </div>
  );
}
