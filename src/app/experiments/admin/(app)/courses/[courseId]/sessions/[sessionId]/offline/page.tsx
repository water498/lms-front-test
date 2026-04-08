"use client";

import SessionOfflineTab from "@/features/(admin)/session-detail/tabs/offline-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <SessionOfflineTab sessionId={sessionId} />;
}
