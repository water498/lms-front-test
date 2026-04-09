"use client";

import { Star } from "lucide-react";
import { CURRENT_INSTRUCTOR_ID, instructorReviews } from "../shared/mockData";

export default function InstructorReviewsFeature() {
  const reviews = instructorReviews[CURRENT_INSTRUCTOR_ID] ?? [];
  const visible = reviews.filter((r) => r.visible);
  const avgRating =
    visible.length > 0
      ? visible.reduce((sum, r) => sum + r.rating, 0) / visible.length
      : 0;

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: visible.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">내 리뷰</h1>
        <p className="text-sm text-slate-500 mt-1">수강생이 남긴 강사 리뷰입니다.</p>
      </div>

      {/* 평점 요약 */}
      {visible.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-8">
          <div className="text-center shrink-0">
            <p className="text-5xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(avgRating) ? "text-amber-600 fill-amber-400" : "text-slate-400"}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">{visible.length}개 리뷰</p>
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 text-right">{star}</span>
                <Star size={10} className="text-amber-600 fill-amber-400 shrink-0" />
                <div className="flex-1 bg-slate-50 rounded-full h-1.5">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all"
                    style={{ width: visible.length > 0 ? `${(count / visible.length) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">아직 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/50">
            {reviews.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 text-sm font-semibold shrink-0">
                  {r.learnerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{r.learnerName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < r.rating ? "text-amber-600 fill-amber-400" : "text-slate-400"}
                        />
                      ))}
                    </div>
                    {!r.visible && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded">비공개</span>
                    )}
                    <span className="text-xs text-slate-500 ml-auto">
                      {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
