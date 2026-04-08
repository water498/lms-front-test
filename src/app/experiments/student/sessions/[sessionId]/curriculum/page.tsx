"use client";

import { CurriculumTab } from "@/features/(student)/course-curriculum/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/session-layout/context";

export default function CurriculumPage() {
  const { subjects } = useSessionWorkspaceContext();
  return <CurriculumTab subjects={subjects} />;
}
