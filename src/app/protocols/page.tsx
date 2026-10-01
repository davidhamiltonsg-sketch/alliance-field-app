import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ProtocolSearch } from "@/components/ProtocolSearch";
import { protocols } from "@/data/protocols";

export const metadata = { title: "Protocols" };

export default function ProtocolsIndexPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Field Kit" icon="field-kit" />} title="Protocols">
        All {protocols.length} Field Kit tools, in three tiers: Core (learn
        these first), Situational (when the Situation Map sends you) and Build
        (ongoing practices).
      </PageHeader>
      <ProtocolSearch protocols={protocols} />
    </div>
  );
}
