"use client";

import SessionEnrolleesTab from "@/features/(admin)/session-detail/tabs/enrollees-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { enrollees, sessionId } = useSessionDetail();
  return <SessionEnrolleesTab enrollees={enrollees} sessionId={sessionId} />;
}
