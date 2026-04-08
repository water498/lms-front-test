"use client";

import LearningHistoryTab from "@/features/(admin)/session-history/feature";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <LearningHistoryTab sessionId={sessionId} />;
}
