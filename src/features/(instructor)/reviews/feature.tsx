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
        <h1 className="text-2xl font-bold text-white">내 리뷰</h1>
        <p className="text-sm text-zinc-400 mt-1">수강생이 남긴 강사 리뷰입니다.</p>
      </div>

      {/* 평점 요약 */}
      {visible.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-8">
          <div className="text-center shrink-0">
            <p className="text-5xl font-bold text-white">{avgRating.toFixed(1)}</p>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-zinc-700"}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{visible.length}개 리뷰</p>
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-3 text-right">{star}</span>
                <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-sm">아직 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {reviews.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {r.learnerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-zinc-200">{r.learnerName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}
                        />
                      ))}
                    </div>
                    {!r.visible && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded">비공개</span>
                    )}
                    <span className="text-xs text-zinc-600 ml-auto">
                      {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
