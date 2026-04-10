"use client";

import AdminGradingTab from "@/features/(backoffice)/session-grading/feature";
import { useSessionDetail } from "@/features/(backoffice)/v2-session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <AdminGradingTab sessionId={sessionId} />;
}
