import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Marker } from "@/components/Marker";
import { ConnectionCards } from "@/components/ConnectionCards";
import { ArrowLeft } from "@/components/icons";

export const metadata = { title: "Connection Cards" };

export default function ConnectPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={<Marker kind="TOOL" label="Connection Cards" icon="connection-cards" />}
        title="Connection Cards"
      >
        Five stages, one flip at a time — Warmth, Curiosity, Care, Repair,
        Alliance. Pick a stage or draw from all of them.
      </PageHeader>
      <ConnectionCards />
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent"
      >
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
