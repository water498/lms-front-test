"use client";

import SessionEnrolleesTab from "@/features/(backoffice)/session-enrollees/feature";
import { useSessionDetail } from "@/features/(backoffice)/session-layout/context";

export default function Page() {
  const { enrollees, sessionId } = useSessionDetail();
  return <SessionEnrolleesTab enrollees={enrollees} sessionId={sessionId} />;
}
