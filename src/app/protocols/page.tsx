import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ProtocolSearch } from "@/components/ProtocolSearch";
import { protocols } from "@/data/protocols";

export const metadata = { title: "Protocols" };

export default function ProtocolsIndexPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Field Kit" />} title="Protocols">
        All {protocols.length} Field Kit tools. New? Start with the Core 5; the rest are Advanced. Search, or return via Situation Map.
      </PageHeader>
      <ProtocolSearch protocols={protocols} />
    </div>
  );
}
