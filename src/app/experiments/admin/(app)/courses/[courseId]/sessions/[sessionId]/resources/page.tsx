"use client";

import ResourcesTab from "@/features/(admin)/session-detail/tabs/resources-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <ResourcesTab sessionId={sessionId} />;
}
