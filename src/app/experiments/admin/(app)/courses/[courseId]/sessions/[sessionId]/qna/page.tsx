"use client";

import AdminQnaTab from "@/features/(admin)/session-layout/tabs/qna-tab";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <AdminQnaTab sessionId={sessionId} />;
}
