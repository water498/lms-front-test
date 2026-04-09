"use client";

import { QnaTab } from "@/features/(student)/course-session-qna/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/course-session-layout/context";

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
