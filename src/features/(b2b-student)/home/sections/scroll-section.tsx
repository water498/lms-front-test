"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseCard } from "../components/course-card";
import { type Course } from "../mockData";

export function ScrollSection({
  title,
  icon,
  courses,
  showProgress = false,
}: {
  title: string;
  icon?: React.ReactNode;
  courses: Course[];
  showProgress?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_AMOUNT = 280;

  const updateScrollState = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    rowRef.current?.scrollBy({
      left: dir === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && <span className="text-violet-400">{icon}</span>}
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
            전체 보기 →
          </button>
        </div>
      )}

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-12 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
          style={{ marginLeft: -20 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-12 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
          style={{ marginRight: -20 }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div
        ref={rowRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {courses.map((course) => (
          <div key={course.id} className="snap-start">
            <CourseCard course={course} showProgress={showProgress} />
          </div>
        ))}
      </div>
    </div>
  );
}
