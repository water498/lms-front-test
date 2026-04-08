"use client";

import { IntroTab } from "@/features/(student)/courses/sections/intro-tab";
import { useCourseContext } from "@/features/(student)/courses/context";

export default function IntroPage() {
  const { detail } = useCourseContext();
  return <IntroTab detail={detail} />;
}
