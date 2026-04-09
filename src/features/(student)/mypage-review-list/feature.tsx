"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, PenLine, Trash2, X, Check, ExternalLink } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface MyReviewItem {
  id: string;
  type: "course" | "instructor";
  targetName: string;
  targetUrl: string;
  rating: number;
  body: string;
  createdAt: string;
}

// ── Mock data ────────────────────────────────────────────────────────────────

// courseDetails의 실제 과정/강사와 매칭된 목업 데이터
// hero-1: 안전보건관리체계 (김현수 강사)
// ip-2: 핵심안전수칙 실전 (이정민 강사)
// ip-3: 위험관리·재해통계 분석 (박성훈 강사)
const MOCK_REVIEWS: MyReviewItem[] = [
  {
    id: "rv-1-1",
    type: "course",
    targetName: "안전보건관리체계 구축",
    targetUrl: "/student/courses/hero-1?tab=reviews",
    rating: 5,
    body: "법규 내용을 현장 사례와 연결해 설명해주셔서 이해하기 쉬웠습니다. 안전보건관리체계 구축에 실질적인 도움이 됐어요.",
    createdAt: "2026-03-01",
  },
  {
    id: "ir-1-1",
    type: "instructor",
    targetName: "김현수 강사",
    targetUrl: "/student/courses/hero-1?tab=instructor",
    rating: 5,
    body: "법규 해석을 현장 사례와 연결해 설명해주셔서 이해가 빨랐습니다. 20년 경력이 느껴지는 깊이 있는 강의였어요.",
    createdAt: "2026-03-01",
  },
  {
    id: "rv-2-1",
    type: "course",
    targetName: "핵심안전수칙 실전",
    targetUrl: "/student/courses/ip-2?tab=reviews",
    rating: 5,
    body: "현장에서 바로 쓸 수 있는 안전수칙을 체계적으로 정리해준 최고의 강의입니다. 강사님 현장 경험이 느껴져요.",
    createdAt: "2026-02-25",
  },
  {
    id: "ir-2-1",
    type: "instructor",
    targetName: "이정민 강사",
    targetUrl: "/student/courses/ip-2?tab=instructor",
    rating: 5,
    body: "현장 경험이 풍부해서 교과서에 없는 실전 노하우를 많이 알려주셨습니다.",
    createdAt: "2026-02-25",
  },
  {
    id: "rv-3-1",
    type: "course",
    targetName: "위험관리·재해통계 분석",
    targetUrl: "/student/courses/ip-3?tab=reviews",
    rating: 4,
    body: "위험성 평가 방법을 단계적으로 설명해줘서 도움이 됐습니다. 실습 과제가 현장 상황과 유사해서 실질적으로 유용했어요.",
    createdAt: "2026-02-20",
  },
  {
    id: "ir-3-1",
    type: "instructor",
    targetName: "박성훈 강사",
    targetUrl: "/student/courses/ip-3?tab=instructor",
    rating: 5,
    body: "데이터 기반 접근 방식이 인상적이었습니다. 체계적인 분석 방법론을 명쾌하게 전달해주셨어요.",
    createdAt: "2026-02-20",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const STAR_LABELS = ["", "별로예요", "그저 그래요", "괜찮아요", "좋아요", "최고예요!"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
        />
      ))}
    </div>
  );
}

function InteractiveStar({
  value,
  hovered,
  filled,
  onHover,
  onClick,
}: {
  value: number;
  hovered: number;
  filled: number;
  onHover: (v: number) => void;
  onClick: (v: number) => void;
}) {
  const active = hovered >= value || (!hovered && filled >= value);
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(0)}
      onClick={() => onClick(value)}
      className="p-0.5"
    >
      <Star
        className={`w-6 h-6 transition-colors ${active ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
      />
    </button>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function ReviewsTab() {
  const [reviews, setReviews] = useState<MyReviewItem[]>(MOCK_REVIEWS);
  const [filter, setFilter] = useState<"all" | "course" | "instructor">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editBody, setEditBody] = useState("");
  const [editHovered, setEditHovered] = useState(0);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.type === filter);

  const startEdit = (review: MyReviewItem) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditBody(review.body);
    setEditHovered(0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditBody("");
    setEditHovered(0);
  };

  const saveEdit = () => {
    if (editRating === 0 || !editBody.trim()) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingId ? { ...r, rating: editRating, body: editBody.trim() } : r,
      ),
    );
    cancelEdit();
  };

  const deleteReview = (id: string) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "course", label: "과정 리뷰" },
    { key: "instructor", label: "강사 리뷰" },
  ];

  // ── Empty state ──────────────────────────────────────────────────────────
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Star className="w-14 h-14 text-zinc-700" />
        <p className="text-zinc-400 text-base font-medium">작성한 리뷰가 없습니다</p>
        <p className="text-zinc-600 text-sm">
          수강 완료 후 과정과 강사에 대한 리뷰를 남겨보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter pills */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-zinc-600">{filtered.length}개</span>
      </div>

      {/* Review cards */}
      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-12">
          해당 유형의 리뷰가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((review) => {
            const isEditing = editingId === review.id;

            return (
              <div
                key={review.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        review.type === "course"
                          ? "bg-violet-500/15 text-violet-400"
                          : "bg-sky-500/15 text-sky-400"
                      }`}
                    >
                      {review.type === "course" ? "과정" : "강사"}
                    </span>
                    <Link
                      href={review.targetUrl}
                      className="text-sm font-semibold text-white truncate hover:text-violet-400 transition-colors"
                    >
                      {review.targetName}
                    </Link>
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">{review.createdAt}</span>
                </div>

                {isEditing ? (
                  /* ── Edit mode ─────────────────────────────────── */
                  <div className="flex flex-col gap-3">
                    {/* Star picker */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <InteractiveStar
                            key={v}
                            value={v}
                            hovered={editHovered}
                            filled={editRating}
                            onHover={setEditHovered}
                            onClick={setEditRating}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-medium ${editRating ? "text-amber-400" : "text-zinc-600"}`}
                      >
                        {STAR_LABELS[editHovered || editRating] || "별점을 선택해주세요"}
                      </p>
                    </div>

                    {/* Body */}
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
                    />

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        취소
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={editRating === 0 || !editBody.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── View mode ──────────────────────────────────── */
                  <>
                    <Stars rating={review.rating} />
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {review.body}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 justify-end mt-auto pt-1">
                      <Link
                        href={review.targetUrl}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400 transition-colors mr-auto"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {review.type === "course" ? "과정 보기" : "과정 보기"}
                      </Link>
                      <button
                        onClick={() => startEdit(review)}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                        수정
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
