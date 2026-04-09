"use client";

import { ResourcesTab } from "@/features/(student)/course-session-resources/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/course-session-layout/context";

export default function ResourcesPage() {
  const { resources } = useSessionWorkspaceContext();
  return <ResourcesTab resources={resources} />;
}
