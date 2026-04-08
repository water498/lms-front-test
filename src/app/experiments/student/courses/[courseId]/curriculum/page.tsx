"use client";

import { CurriculumTab } from "@/features/(student)/course-curriculum/feature";
import { useCourseContext } from "@/features/(student)/course-layout/context";

export default function CurriculumPage() {
  const { detail } = useCourseContext();
  return <CurriculumTab subjects={detail.subjects} />;
}
