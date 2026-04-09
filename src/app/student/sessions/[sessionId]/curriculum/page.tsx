"use client";

import { CurriculumTab } from "@/features/(student)/course-curriculum/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/course-session-layout/context";

export default function CurriculumPage() {
  const { subjects } = useSessionWorkspaceContext();
  return <CurriculumTab subjects={subjects} />;
}
