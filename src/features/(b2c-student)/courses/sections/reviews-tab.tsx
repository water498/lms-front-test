"use client";

import { Star } from "lucide-react";
import { type CourseReview } from "@/lib/models";

interface Props {
  reviews: CourseReview[];
  averageRating: number;
}

function StarBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400 w-4 shrink-0">{rating}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400/70 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-zinc-500 w-5 text-right shrink-0">{count}</span>
    </div>
  );
}

export function ReviewsTab({ reviews, averageRating }: Props) {
  const counts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rv) => Math.round(rv.rating) === r).length,
  }));

  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-5">수강생 리뷰</h2>

      {/* Rating summary */}
      <div className="flex items-center gap-8 mb-7 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="flex flex-col items-center shrink-0">
          <span className="text-4xl font-bold text-amber-400">{averageRating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500 mt-1">{reviews.length}개 리뷰</span>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {counts.map(({ rating, count }) => (
            <StarBar key={rating} rating={rating} count={count} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* Review cards */}
      {reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{review.userName}</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-zinc-600">{review.createdAt}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">아직 리뷰가 없습니다.</p>
      )}
    </div>
  );
}
