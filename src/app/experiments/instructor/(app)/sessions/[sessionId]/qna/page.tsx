"use client";

import { use } from "react";
import QnaTab from "@/features/(instructor)/session-detail/tabs/qna-tab";
import { qnaPostsBySession } from "@/features/(instructor)/shared/mockData";

export default function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const posts = qnaPostsBySession[sessionId] ?? [];
  return (
    <div className="p-5">
      <QnaTab posts={posts} />
    </div>
  );
}
