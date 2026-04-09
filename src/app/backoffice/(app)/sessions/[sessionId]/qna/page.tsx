"use client";

import AdminQnaTab from "@/features/(backoffice)/session-qna/feature";
import { useSessionDetail } from "@/features/(backoffice)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <AdminQnaTab sessionId={sessionId} />;
}
