import { PageHeader } from "@/components/PageHeader";
import { Marker } from "@/components/Marker";
import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";

export const metadata = { title: "Profile Calibration" };

export default function CalibratePage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Profile Calibration" icon="profile-calibration" />} title="Calibrate your profiles">
        44 questions each. Answers stay on this device and build the Layer Scan (where you two differ most, layer by layer) and a couple report.
      </PageHeader>
      <CalibrationFlow />
    </div>
  );
}
