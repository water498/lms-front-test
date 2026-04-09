"use client";

import LearningHistoryTab from "@/features/(backoffice)/session-history/feature";
import { useSessionDetail } from "@/features/(backoffice)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <LearningHistoryTab sessionId={sessionId} />;
}
