import Link from "next/link";
import { AllianceMark } from "@/components/AllianceMark";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center space-y-4 py-14 text-center">
      <AllianceMark size={56} className="text-accent/80" />
      <h1 className="display text-xl">We can’t find that page</h1>
      <p className="text-base text-ink-muted">It may have moved. Start again from the Situation Map.</p>
      <div className="flex justify-center gap-2 text-base font-medium">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-paper">
          Situation Map
        </Link>
        <Link href="/protocols" className="inline-flex min-h-11 items-center rounded-full border border-rule/60 bg-surface-raised px-4 text-accent">
          Protocols
        </Link>
      </div>
    </div>
  );
}
