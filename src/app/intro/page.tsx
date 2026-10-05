import type { Metadata } from "next";
import { IntroFlow } from "@/components/intro/IntroFlow";

export const metadata: Metadata = {
  title: "Intro",
  description:
    "How the Alliance Protocols Field App works: the 60-Second Reset, the Situation Map, the six tools to learn first, Pause + Return and Connection Cards.",
};

export default function IntroPage() {
  return <IntroFlow />;
}
