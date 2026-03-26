"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, SendHorizonal } from "lucide-react";
import type { QnaPost } from "@/lib/models";

const CURRENT_INSTRUCTOR_NAME = "박민준";
const CURRENT_INSTRUCTOR_ID = "u-inst-1";

export default function QnaTab({ posts: initialPosts }: { posts: QnaPost[] }) {
  const [posts, setPosts] = useState<QnaPost[]>(initialPosts);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draftBody, setDraftBody] = useState<Record<string, string>>({});

  const unansweredCount = posts.filter((p) => !p.isHidden && p.replies.length === 0).length;

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleReplySubmit(postId: string) {
    const body = draftBody[postId]?.trim();
    if (!body) return;

    const newReply = {
      id: `r-${Date.now()}`,
      postId,
      instructorId: CURRENT_INSTRUCTOR_ID,
      instructorName: CURRENT_INSTRUCTOR_NAME,
      body,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
      )
    );
    setDraftBody((prev) => ({ ...prev, [postId]: "" }));
  }

  const visiblePosts = posts.filter((p) => !p.isHidden);

  if (visiblePosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <MessageCircle size={36} className="mb-3 text-zinc-600" />
        <p className="text-sm">아직 질문이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-1 pb-3">
        <span className="text-sm text-zinc-400">총 {visiblePosts.length}개</span>
        {unansweredCount > 0 && (
          <span className="text-xs px-2 py-0.5 bg-rose-500/15 text-rose-400 rounded-full font-medium">
            미답변 {unansweredCount}개
          </span>
        )}
        {unansweredCount === 0 && (
          <span className="text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-medium">
            전체 답변 완료
          </span>
        )}
      </div>

      {/* 질문 목록 */}
      {visiblePosts.map((post) => {
        const answered = post.replies.length > 0;
        const expanded = expandedId === post.id;

        return (
          <div
            key={post.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            {/* 질문 헤더 (클릭으로 토글) */}
            <button
              onClick={() => toggle(post.id)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      answered
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {answered ? "답변완료" : "미답변"}
                  </span>
                  <span className="text-xs text-zinc-500 flex-shrink-0">{post.learnerName}</span>
                  <span className="text-xs text-zinc-600 flex-shrink-0">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
              </div>
              <div className="text-zinc-500 flex-shrink-0 mt-0.5">
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* 펼쳐진 내용 */}
            {expanded && (
              <div className="border-t border-zinc-800 px-5 py-4 flex flex-col gap-4">
                {/* 질문 본문 */}
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>

                {/* 기존 답변 */}
                {post.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-semibold flex-shrink-0">
                      강
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-violet-400">{reply.instructorName}</span>
                        <span className="text-xs text-zinc-600">
                          {new Date(reply.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {reply.body}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 답변 입력 폼 */}
                {post.replies.length === 0 && (
                  <div className="flex gap-2 pt-1">
                    <textarea
                      value={draftBody[post.id] ?? ""}
                      onChange={(e) =>
                        setDraftBody((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="답변을 입력하세요..."
                      rows={3}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <button
                      onClick={() => handleReplySubmit(post.id)}
                      disabled={!draftBody[post.id]?.trim()}
                      className="self-end px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <SendHorizonal size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
