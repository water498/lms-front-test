"use client";

import { CurriculumTab } from "@/features/(student)/course-layout/sections/curriculum-tab";
import { useCourseContext } from "@/features/(student)/course-layout/context";

export default function CurriculumPage() {
  const { detail } = useCourseContext();
  return <CurriculumTab subjects={detail.subjects} />;
}
