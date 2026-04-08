"use client";

import { QnaTab } from "@/features/(student)/course-qna/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/session-layout/context";

export default function QnaPage() {
  const { session, sessionId, qnaPosts } = useSessionWorkspaceContext();
  return (
    <QnaTab
      courseId={session.courseId}
      canPost
      sessionId={sessionId}
      posts={qnaPosts}
    />
  );
}
