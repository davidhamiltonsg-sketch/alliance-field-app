import { PageHeader } from "@/components/PageHeader";
import { Marker } from "@/components/Marker";
import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";

export const metadata = { title: "Profile Calibration" };

export default function CalibratePage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="TOOL" label="Profile Calibration" icon="profile-calibration" />} title="How each of you leans">
        On one shared phone, you take turns answering 44 questions each. Answers stay on that phone, and from them you get the Profile Calibration report: where you two differ most, area by area.
        <span className="mt-2 block font-medium text-ink">
          Nobody has to complete this, and you can stop at any time. Do not ask your partner to show their answers.
        </span>
      </PageHeader>
      <CalibrationFlow />
    </div>
  );
}
