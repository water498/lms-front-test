"use client";

import LearningHistoryTab from "@/features/(admin)/session-detail/tabs/learning-history-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <LearningHistoryTab sessionId={sessionId} />;
}
