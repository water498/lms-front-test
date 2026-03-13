"use client";

import { MapPin, Calendar, Users, Play, Star } from "lucide-react";
import { type Course, type EnrolledCourse, type CourseType } from "../mockData";

export const TYPE_BADGE: Record<CourseType, { label: string; cls: string }> = {
  online:  { label: "온라인",  cls: "bg-sky-500/25 text-sky-300 border border-sky-500/40" },
  offline: { label: "오프라인", cls: "bg-amber-500/25 text-amber-300 border border-amber-500/40" },
  blended: { label: "온+오프", cls: "bg-violet-500/25 text-violet-300 border border-violet-500/40" },
};

export function CourseCard({
  course,
  showProgress = false,
}: {
  course: Course | EnrolledCourse;
  showProgress?: boolean;
}) {
  const enrolled = course as EnrolledCourse;
  const progress = showProgress && "progress" in enrolled ? enrolled.progress : null;
  const typeBadge = TYPE_BADGE[course.type];

  return (
    <div className="w-56 md:w-60 shrink-0 group cursor-pointer">
      {/* Thumbnail */}
      <div
        className="w-full h-36 rounded-xl overflow-hidden mb-3 relative"
        style={{ background: course.thumbnail }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Top left badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {course.isNew && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">NEW</span>
          )}
          {course.isBestseller && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">BEST</span>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge.cls}`}>
            {typeBadge.label}
          </span>
        </div>

        {/* Progress bar */}
        {progress !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-violet-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-violet-300 transition-colors">
          {course.title}
        </p>
        <p className="text-xs text-zinc-500">{course.instructor}</p>

        <div className="flex items-center gap-1 text-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-amber-400 font-medium">{course.rating}</span>
          <span className="text-zinc-600">({course.reviewCount >= 1000
            ? `${(course.reviewCount / 1000).toFixed(1)}k`
            : course.reviewCount})</span>
        </div>

        {/* Required / Optional badge */}
        <div className="flex items-center gap-1 mt-0.5">
          {course.isRequired ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              필수
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-zinc-700/60 text-zinc-400 border border-zinc-600/40">
              선택
            </span>
          )}
        </div>

        {progress !== null ? (
          <p className="text-xs text-zinc-500">{progress}% 수강 완료</p>
        ) : null}

        {/* Offline fields */}
        {course.type !== "online" && course.location && (
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{course.location}</span>
            </div>
            {course.nextSessionDate && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>{course.nextSessionDate} 개강</span>
              </div>
            )}
            {course.capacity !== undefined && course.enrolledCount !== undefined && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Users className="w-3 h-3 shrink-0" />
                <span>{course.enrolledCount}/{course.capacity}명</span>
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden ml-1">
                  <div
                    className="h-full bg-amber-500/60 rounded-full"
                    style={{ width: `${(course.enrolledCount / course.capacity) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA — always "수강하기" in B2B (no cart) */}
        {progress === null && (
          <button
            onClick={(e) => e.stopPropagation()}
            className="mt-1.5 w-full py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-violet-600 text-zinc-300 hover:text-white transition-colors"
          >
            수강하기
          </button>
        )}
      </div>
    </div>
  );
}
