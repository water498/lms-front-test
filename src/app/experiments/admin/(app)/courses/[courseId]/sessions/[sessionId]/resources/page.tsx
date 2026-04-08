"use client";

import ResourcesTab from "@/features/(admin)/session-layout/tabs/resources-tab";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <ResourcesTab sessionId={sessionId} />;
}
