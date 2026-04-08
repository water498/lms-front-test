"use client";

import { Star, Users, Clock, BarChart2 } from "lucide-react";
import { type Course } from "../../student-dashboard/mockData";

interface Props {
  course: Course;
  variant: "b2c" | "b2b";
  onInstructorClick?: () => void;
}

export function CourseHero({ course, variant, onInstructorClick }: Props) {
  const categoryLabel = course.categoryLabel ?? course.category;

  return (
    <div
      className="w-full py-12 px-6"
      style={{
        background: `linear-gradient(to bottom, ${course.accentColor ?? "#6d28d9"}18 0%, transparent 100%), linear-gradient(135deg, #09090b 0%, #18181b 100%)`,
      }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs text-zinc-500 mb-4">
          {categoryLabel} &rsaquo; {course.title}
        </p>

        {/* Title row */}
        <div className="flex items-start gap-3 mb-3">
          <h1 className="text-2xl font-bold text-white leading-tight">{course.title}</h1>
          {variant === "b2b" && course.isRequired && (
            <span className="shrink-0 mt-1 text-xs font-semibold px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              필수
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400 mb-4">
          {course.rating !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-amber-400 font-semibold">{course.rating}</span>
              {course.reviewCount !== undefined && (
                <span className="text-zinc-500">({course.reviewCount.toLocaleString()}개)</span>
              )}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>수강생 12,400명</span>
          </span>
          {onInstructorClick ? (
            <button
              onClick={onInstructorClick}
              className="hover:text-violet-400 transition-colors"
            >
              강사: {course.instructor}
            </button>
          ) : (
            <span>강사: {course.instructor}</span>
          )}
        </div>

        {/* Level / Duration / Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {course.level && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <BarChart2 className="w-3.5 h-3.5" />
              레벨: {course.level}
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              총 {course.duration}
            </span>
          )}
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
