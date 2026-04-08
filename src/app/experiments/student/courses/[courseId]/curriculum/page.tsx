"use client";

import { CurriculumTab } from "@/features/(student)/courses/sections/curriculum-tab";
import { useCourseContext } from "@/features/(student)/courses/context";

export default function CurriculumPage() {
  const { detail } = useCourseContext();
  return <CurriculumTab subjects={detail.subjects} />;
}
