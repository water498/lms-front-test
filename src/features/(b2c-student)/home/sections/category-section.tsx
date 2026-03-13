"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { ScrollSection } from "./scroll-section";
import { type CardActions } from "../components/course-card";
import { categories, coursesByCategory, type CourseType } from "../mockData";

type TypeFilter = "all" | CourseType;

export const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: "all",     label: "전체" },
  { id: "online",  label: "온라인" },
  { id: "offline", label: "오프라인" },
  { id: "blended", label: "혼합" },
];

export function CategorySection({ actions }: { actions?: CardActions }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState<TypeFilter>("all");

  const base = coursesByCategory[activeCategory] ?? [];
  const courses = activeType === "all" ? base : base.filter((c) => c.type === activeType);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-bold text-white">카테고리별 추천</h3>
      </div>

      {/* Type filter row */}
      <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveType(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              activeType === f.id
                ? f.id === "online"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/50"
                  : f.id === "offline"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : f.id === "blended"
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/50"
                  : "bg-zinc-700 text-white border-zinc-600"
                : "bg-transparent text-zinc-500 border-zinc-700 hover:text-zinc-300 hover:border-zinc-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {courses.length > 0 ? (
        <ScrollSection title="" courses={courses} actions={actions} />
      ) : (
        <p className="text-zinc-600 text-sm py-8 text-center">해당 조건의 강의가 없습니다.</p>
      )}
    </div>
  );
}
