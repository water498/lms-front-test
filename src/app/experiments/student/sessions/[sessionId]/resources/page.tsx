"use client";

import { ResourcesTab } from "@/features/(student)/session-workspace/sections/resources-tab";
import { useSessionWorkspaceContext } from "@/features/(student)/session-workspace/context";

export default function ResourcesPage() {
  const { resources } = useSessionWorkspaceContext();
  return <ResourcesTab resources={resources} />;
}
