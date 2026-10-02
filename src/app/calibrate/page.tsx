import { PageHeader } from "@/components/PageHeader";
import { Marker } from "@/components/Marker";
import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";

export const metadata = { title: "Profile Calibration" };

export default function CalibratePage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Profile Calibration" icon="profile-calibration" />} title="How each of you leans">
        Each of you answers 44 questions. Your answers stay on this phone, and from them you get the Layer Scan and a short report for the two of you.
      </PageHeader>
      <CalibrationFlow />
    </div>
  );
}
