"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, MapPin, Calendar, Users } from "lucide-react";
import { courseById } from "../../home/mockData";
import store from "../../home/store";

export function WishlistTab() {
  const [wishlist, setWishlistState] = useState<Set<string>>(store.wishlist);

  const removeFromWishlist = (id: string) => {
    const next = new Set(store.wishlist);
    next.delete(id);
    store.wishlist = next;
    setWishlistState(new Set(store.wishlist));
  };

  const wishlistItems = [...wishlist]
    .map((id) => courseById[id])
    .filter(Boolean);

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Heart className="w-14 h-14 text-zinc-700" />
        <p className="text-zinc-400 text-base font-medium">관심 강의가 없습니다</p>
        <p className="text-zinc-600 text-sm">강의 페이지에서 관심 있는 강의를 저장하세요.</p>
        <Link
          href="/experiments/b2b-student"
          className="mt-2 px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-xl transition-colors text-sm"
        >
          강의 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {wishlistItems.map((course) => (
        <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3">
          {/* Thumbnail */}
          <div
            className="w-20 h-14 rounded-xl shrink-0 relative"
            style={{ background: course.thumbnail }}
          >
            <div className={`absolute bottom-1 left-1 text-[9px] font-semibold px-1 py-0.5 rounded-full border ${
              course.type === "online" ? "bg-sky-500/25 text-sky-300 border-sky-500/40"
              : course.type === "offline" ? "bg-amber-500/25 text-amber-300 border-amber-500/40"
              : "bg-violet-500/25 text-violet-300 border-violet-500/40"
            }`}>
              {course.type === "online" ? "온라인" : course.type === "offline" ? "오프라인" : "혼합"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">{course.title}</p>
            <p className="text-xs text-zinc-500">{course.instructor}</p>

            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-amber-400 font-medium">{course.rating}</span>
            </div>

            {course.type !== "online" && course.location && (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-xs text-zinc-600">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{course.location}</span>
                </div>
                {course.nextSessionDate && (
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <Calendar className="w-3 h-3" />
                    <span>{course.nextSessionDate}</span>
                  </div>
                )}
                {course.capacity !== undefined && course.enrolledCount !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <Users className="w-3 h-3" />
                    <span>{course.enrolledCount}/{course.capacity}명</span>
                  </div>
                )}
              </div>
            )}

            {/* Remove button only (no cart in B2B) */}
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => removeFromWishlist(course.id)}
                className="px-2 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 border border-zinc-700 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                수강하기
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
