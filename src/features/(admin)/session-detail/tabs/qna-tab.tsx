"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, SendHorizonal, EyeOff, Eye } from "lucide-react";
import type { QnaPost } from "@/lib/models";

const ADMIN_NAME = "관리자";

// ── Mock 데이터 ──
const mockQnaPosts: Record<string, QnaPost[]> = {
  se2: [
    {
      id: "aq1", courseSessionId: "se2", learnerId: "u7", learnerName: "박지호",
      title: "비상대응 절차 시뮬레이션 범위 문의",
      body: "비상대응 시뮬레이션 과제에서 화재 시나리오만 다루면 되나요, 아니면 지진·폭발 시나리오도 포함해야 하나요?",
      isHidden: false, createdAt: "2025-02-12T14:20",
      replies: [
        { id: "ar1", postId: "aq1", instructorId: "u2", instructorName: "이정민 강사", body: "화재 시나리오를 중심으로 작성하시되, 여력이 되면 다른 시나리오도 추가해 보세요. 평가에는 화재 대응만 반영합니다.", createdAt: "2025-02-12T16:00" },
      ],
    },
    {
      id: "aq2", courseSessionId: "se2", learnerId: "u8", learnerName: "최유진",
      title: "SCORM 콘텐츠 로딩이 안 됩니다",
      body: "개인보호장구 착용 방법 SCORM 콘텐츠가 로딩 중 멈춥니다. Chrome 최신 버전 사용 중입니다.",
      isHidden: false, createdAt: "2025-02-13T09:40",
      replies: [],
    },
    {
      id: "aq3", courseSessionId: "se2", learnerId: "u7", learnerName: "박지호",
      title: "부적절한 게시글 테스트",
      body: "이 게시글은 관리자에 의해 숨김 처리된 예시입니다.",
      isHidden: true, createdAt: "2025-02-14T10:00",
      replies: [],
    },
  ],
};

interface Props {
  sessionId: string;
}

export default function AdminQnaTab({ sessionId }: Props) {
  const [posts, setPosts] = useState<QnaPost[]>(mockQnaPosts[sessionId] ?? []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draftBody, setDraftBody] = useState<Record<string, string>>({});
  const [showHidden, setShowHidden] = useState(false);

  const visiblePosts = showHidden ? posts : posts.filter((p) => !p.isHidden);
  const unansweredCount = posts.filter((p) => !p.isHidden && p.replies.length === 0).length;
  const hiddenCount = posts.filter((p) => p.isHidden).length;

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleReplySubmit(postId: string) {
    const body = draftBody[postId]?.trim();
    if (!body) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, replies: [...p.replies, { id: `ar-${Date.now()}`, postId, instructorName: ADMIN_NAME, body, createdAt: new Date().toISOString() }] }
          : p
      )
    );
    setDraftBody((prev) => ({ ...prev, [postId]: "" }));
  }

  function toggleHidden(postId: string) {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, isHidden: !p.isHidden } : p));
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400">
        <MessageCircle size={32} className="mx-auto text-slate-300 mb-3" />
        <p className="text-sm">아직 질문이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">총 {posts.length}개</span>
        {unansweredCount > 0 && (
          <span className="text-xs px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-medium">미답변 {unansweredCount}개</span>
        )}
        {unansweredCount === 0 && (
          <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-medium">전체 답변 완료</span>
        )}
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowHidden((v) => !v)}
            className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showHidden ? <Eye size={12} /> : <EyeOff size={12} />}
            숨김 {hiddenCount}건 {showHidden ? "감추기" : "보기"}
          </button>
        )}
      </div>

      {/* Posts */}
      {visiblePosts.map((post) => {
        const answered = post.replies.length > 0;
        const expanded = expandedId === post.id;

        return (
          <div
            key={post.id}
            className={`border rounded-xl overflow-hidden ${
              post.isHidden
                ? "border-red-200 bg-red-50/30"
                : "border-slate-200"
            }`}
          >
            {/* Post header */}
            <button
              onClick={() => toggle(post.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {post.isHidden && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-500 rounded-full font-medium">숨김</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    answered ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}>
                    {answered ? "답변완료" : "미답변"}
                  </span>
                  <span className="text-xs text-slate-400">{post.learnerName}</span>
                  <span className="text-xs text-slate-300">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
                <p className="text-sm font-medium text-slate-700 truncate">{post.title}</p>
              </div>
              <div className="text-slate-400 shrink-0 mt-0.5">
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {expanded && (
              <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-3">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{post.body}</p>

                {/* Replies */}
                {post.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-semibold shrink-0">A</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-violet-600">{reply.instructorName}</span>
                        <span className="text-xs text-slate-300">{new Date(reply.createdAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                    </div>
                  </div>
                ))}

                {/* Reply form + moderation */}
                <div className="flex items-center gap-2 pt-1">
                  {post.replies.length === 0 && (
                    <div className="flex gap-2 flex-1">
                      <textarea
                        value={draftBody[post.id] ?? ""}
                        onChange={(e) => setDraftBody((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="답변을 입력하세요..."
                        rows={2}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:border-violet-500"
                      />
                      <button
                        onClick={() => handleReplySubmit(post.id)}
                        disabled={!draftBody[post.id]?.trim()}
                        className="self-end px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <SendHorizonal size={14} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => toggleHidden(post.id)}
                    className={`ml-auto flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                      post.isHidden
                        ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        : "text-red-500 border-red-200 hover:bg-red-50"
                    }`}
                  >
                    {post.isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                    {post.isHidden ? "공개" : "숨김"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
