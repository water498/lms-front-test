"use client";

import { IntroTab } from "@/features/(student)/course-intro/feature";
import { useCourseContext } from "@/features/(student)/course-layout/context";

export default function IntroPage() {
  const { detail } = useCourseContext();
  return <IntroTab detail={detail} />;
}
