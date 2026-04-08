"use client";

import { QnaTab } from "@/features/(student)/courses/sections/qna-tab";
import { useSessionWorkspaceContext } from "@/features/(student)/session-workspace/context";

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
