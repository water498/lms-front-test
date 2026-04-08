"use client";

import { useState } from "react";
import { Star, Eye, EyeOff } from "lucide-react";
import type { CourseReview } from "@/lib/models";

interface Props {
  reviews: CourseReview[];
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
  );
}

export default function ReviewsTab({ reviews: initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);

  const visibleReviews = reviews.filter((r) => r.visible);
  const avgRating =
    visibleReviews.length > 0
      ? visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length
      : 0;

  function toggleVisibility(reviewId: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, visible: !r.visible } : r))
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      {/* Summary */}
      <div className="flex items-center gap-6 px-5 py-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-slate-800">{avgRating.toFixed(1)}</span>
          <div className="flex flex-col">
            <StarDisplay rating={Math.round(avgRating)} />
            <span className="text-xs text-slate-400 mt-0.5">공개 리뷰 기준</span>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>전체 <strong className="text-slate-700">{reviews.length}</strong>건</span>
          <span>공개 <strong className="text-emerald-600">{visibleReviews.length}</strong>건</span>
          <span>숨김 <strong className="text-slate-400">{reviews.length - visibleReviews.length}</strong>건</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">수강생</th>
              <th className="text-left px-4 py-3 font-medium">평점</th>
              <th className="text-left px-4 py-3 font-medium">리뷰 내용</th>
              <th className="text-left px-4 py-3 font-medium">작성일</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className={`border-b border-slate-50 last:border-0 transition-colors ${
                  review.visible ? "hover:bg-slate-50/50" : "bg-slate-50/30"
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                      {review.userName.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-700">{review.userName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StarDisplay rating={review.rating} />
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className={`text-xs truncate ${review.visible ? "text-slate-600" : "text-slate-400"}`}>
                    {review.body}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{review.createdAt}</td>
                <td className="px-4 py-3">
                  {review.visible ? (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">공개</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">숨김</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVisibility(review.id)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${
                      review.visible
                        ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                        : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {review.visible ? (
                      <>
                        <EyeOff size={12} />
                        숨기기
                      </>
                    ) : (
                      <>
                        <Eye size={12} />
                        보이기
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                  아직 리뷰가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
