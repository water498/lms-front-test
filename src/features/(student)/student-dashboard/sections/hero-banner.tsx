"use client";

import { Play, Star } from "lucide-react";
import { heroCourse } from "../mockData";

export function HeroBanner() {
  const course = heroCourse;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: course.thumbnail, minHeight: 400 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-4 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {course.categoryLabel}
          </span>
          {course.isBestseller && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              베스트셀러
            </span>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {course.title}
        </h2>

        <p className="text-zinc-400 text-sm">
          {course.instructor} 강사 · {course.level} · {course.duration}
        </p>

        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-amber-400 font-semibold">{course.rating}</span>
          <span className="text-zinc-500">({(course.reviewCount ?? 0).toLocaleString()}개 리뷰)</span>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>진행률</span>
            <span className="font-semibold text-white">{course.progress}%</span>
          </div>
          <div className="h-1.5 bg-zinc-700 rounded-full w-64 overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">다음 강의: {course.nextLessonTitle}</p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            <Play className="w-4 h-4 fill-white" />
            이어서 학습하기
          </button>
          <button className="px-4 py-3 border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white rounded-xl transition-colors text-sm">
            강의 정보
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {course.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
