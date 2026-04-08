"use client";

import { ResourcesTab } from "@/features/(student)/session-resources/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/session-layout/context";

export default function ResourcesPage() {
  const { resources } = useSessionWorkspaceContext();
  return <ResourcesTab resources={resources} />;
}
