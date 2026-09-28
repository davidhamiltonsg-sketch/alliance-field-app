import type { Metadata } from "next";
import { IntroFlow } from "@/components/intro/IntroFlow";

export const metadata: Metadata = {
  title: "Intro",
  description:
    "How THE ALLIANCE Field App works: the Situation Map, Pause + Return, breaking the pattern loop, and the Weekly Reset.",
};

export default function IntroPage() {
  return <IntroFlow />;
}
