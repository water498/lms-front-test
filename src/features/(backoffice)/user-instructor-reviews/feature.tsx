"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import type { InstructorReview } from "@/lib/models";

interface Props {
  reviews: InstructorReview[];
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  );
}

export default function InstructorReviewsTab({ reviews }: Props) {
  const [localReviews, setLocalReviews] = useState(reviews);

  const visible = localReviews.filter((r) => r.visible);
  const avgRating = visible.length > 0
    ? visible.reduce((acc, r) => acc + r.rating, 0) / visible.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: visible.filter((r) => r.rating === star).length,
  }));

  function toggleVisible(id: string) {
    setLocalReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r))
    );
  }

  if (localReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <MessageSquare size={36} className="text-slate-200" />
        <p className="text-sm">작성된 강사 평가가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 요약 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-8 items-center">
        <div className="flex flex-col items-center gap-1">
          <p className="text-4xl font-bold text-slate-800">{avgRating.toFixed(1)}</p>
          <StarRating rating={Math.round(avgRating)} size={16} />
          <p className="text-xs text-slate-400">{visible.length}개 후기</p>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-4 text-right">{star}</span>
              <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-amber-400 h-1.5 rounded-full"
                  style={{ width: visible.length ? `${(count / visible.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="w-4 text-left">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">전체 평가</p>
          <span className="text-xs text-slate-400">{localReviews.length}건</span>
        </div>
        <div className="divide-y divide-slate-100">
          {localReviews.map((review) => (
            <div
              key={review.id}
              className={`px-5 py-4 flex items-start justify-between gap-4 ${
                !review.visible ? "opacity-50" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} />
                  <span className="text-xs font-medium text-slate-700">{review.learnerName}</span>
                  {review.courseId && (
                    <span className="text-xs text-slate-400">· 과정 #{review.courseId}</span>
                  )}
                  <span className="text-xs text-slate-400 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{review.body}</p>
              </div>
              <button
                onClick={() => toggleVisible(review.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border flex-shrink-0 transition-colors ${
                  review.visible
                    ? "border-slate-200 text-slate-500 hover:bg-slate-50"
                    : "border-red-200 text-red-500 hover:bg-red-50"
                }`}
              >
                {review.visible ? "숨기기" : "노출"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
