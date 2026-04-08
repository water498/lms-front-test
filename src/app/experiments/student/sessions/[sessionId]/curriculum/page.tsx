"use client";

import { CurriculumTab } from "@/features/(student)/courses/sections/curriculum-tab";
import { useSessionWorkspaceContext } from "@/features/(student)/session-workspace/context";

export default function CurriculumPage() {
  const { subjects } = useSessionWorkspaceContext();
  return <CurriculumTab subjects={subjects} />;
}
