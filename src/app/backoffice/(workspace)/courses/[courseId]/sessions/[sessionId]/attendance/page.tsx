"use client";

import SessionOfflineTab from "@/features/(backoffice)/session-offline/feature";
import { useSessionDetail } from "@/features/(backoffice)/v2-session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <SessionOfflineTab sessionId={sessionId} />;
}
