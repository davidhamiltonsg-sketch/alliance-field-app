import Link from "next/link";
import { protocols } from "@/data/protocols";

export const metadata = { title: "Protocols" };

export default function ProtocolsIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-accent">[TOOL]</p>
        <h1 className="text-2xl font-semibold">Protocols</h1>
        <p className="mt-1 text-sm text-ink-muted">
          All Field Kit tools. Browse or return via Situation Map.
        </p>
      </div>
      <ul className="space-y-2">
        {protocols.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/protocols/${p.slug}`}
              className="block min-h-12 rounded-lg border border-rule/20 bg-surface-tool px-4 py-3 font-medium"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
