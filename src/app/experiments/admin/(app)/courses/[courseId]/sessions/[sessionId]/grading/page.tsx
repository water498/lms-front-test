"use client";

import AdminGradingTab from "@/features/(admin)/session-layout/tabs/grading-tab";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <AdminGradingTab sessionId={sessionId} />;
}
