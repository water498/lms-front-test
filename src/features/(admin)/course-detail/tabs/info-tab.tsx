"use client";

import { useState } from "react";
import { type Course, type CourseStatus } from "../../courses/mockData";
import { instructors, categories } from "../../courses/mockData";

const STATUS_CONFIG: Record<CourseStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "게시됨",   className: "bg-emerald-100 text-emerald-700" },
  DRAFT:     { label: "임시저장", className: "bg-amber-100 text-amber-700" },
  ARCHIVED:  { label: "보관됨",   className: "bg-slate-100 text-slate-600" },
};

export default function InfoTab({ course }: { course: Course }) {
  const [title, setTitle] = useState(course.title);
  const [instructor, setInstructor] = useState(course.instructor);
  const [category, setCategory] = useState("프론트엔드");
  const badge = STATUS_CONFIG[course.status];

  return (
    <div className="max-w-lg flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.className}`}>
          {badge.label}
        </span>
        {course.status === "DRAFT" && (
          <button className="text-xs px-3 py-1 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
            게시하기
          </button>
        )}
        {course.status === "PUBLISHED" && (
          <button className="text-xs px-3 py-1 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            보관하기
          </button>
        )}
      </div>

      {/* Thumbnail placeholder */}
      <div className="w-full h-36 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200">
        썸네일 이미지 업로드
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">과정명</label>
        <input
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">카테고리</label>
        <select
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">강사</label>
        <select
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
        >
          {instructors.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-2 block">수업 유형</label>
        <div className="flex gap-4">
          {["온라인", "오프라인", "혼합"].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" defaultChecked={t === "온라인"} className="accent-violet-600" />
              <span className="text-sm text-slate-700">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-1">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
