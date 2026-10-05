import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ProtocolSearch } from "@/components/ProtocolSearch";
import { protocols } from "@/data/protocols";

export const metadata = { title: "Tools" };

export default function ProtocolsIndexPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Field Kit" icon="field-kit" />} title="Tools">
        All {protocols.length} tools, in three groups: Learn first, When it comes
        up, and Build over time.
      </PageHeader>
      <ProtocolSearch protocols={protocols} />
    </div>
  );
}
