"use client";

import SessionOfflineTab from "@/features/(admin)/session-layout/tabs/offline-tab";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <SessionOfflineTab sessionId={sessionId} />;
}
