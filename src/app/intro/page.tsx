import type { Metadata } from "next";
import { IntroFlow } from "@/components/intro/IntroFlow";

export const metadata: Metadata = {
  title: "Intro",
  description:
    "How the Alliance Protocols Field App works: the Situation Map, Pause + Return, breaking the circuit, and the Weekly Reset.",
};

export default function IntroPage() {
  return <IntroFlow />;
}
