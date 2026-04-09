"use client";

import SessionOfflineTab from "@/features/(admin)/session-offline/feature";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <SessionOfflineTab sessionId={sessionId} />;
}
