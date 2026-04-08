"use client";

import AdminQnaTab from "@/features/(admin)/session-detail/tabs/qna-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <AdminQnaTab sessionId={sessionId} />;
}
