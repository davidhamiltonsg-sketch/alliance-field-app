import type { Metadata } from "next";
import { IntroFlow } from "@/components/intro/IntroFlow";

export const metadata: Metadata = {
  title: "Intro",
  description:
    "How the Alliance Protocols Field App works: the 60-Second Alliance Reset, the Situation Map, the Core 6, Pause + Return and Connection Cards.",
};

export default function IntroPage() {
  return <IntroFlow />;
}
