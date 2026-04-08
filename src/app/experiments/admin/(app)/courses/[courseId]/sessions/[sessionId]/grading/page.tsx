"use client";

import AdminGradingTab from "@/features/(admin)/session-detail/tabs/grading-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <AdminGradingTab sessionId={sessionId} />;
}
