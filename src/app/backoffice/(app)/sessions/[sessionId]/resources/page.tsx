"use client";

import ResourcesTab from "@/features/(backoffice)/session-resources/feature";
import { useSessionDetail } from "@/features/(backoffice)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <ResourcesTab sessionId={sessionId} />;
}
