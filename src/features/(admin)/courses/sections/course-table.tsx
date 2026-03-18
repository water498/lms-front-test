"use client";

import { useState } from "react";
import Link from "next/link";
import { courses, type Course, type CourseMode, type CourseStatus } from "../mockData";

const STATUS_CONFIG: Record<CourseStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "게시됨",   className: "bg-emerald-100 text-emerald-700" },
  DRAFT:     { label: "임시저장", className: "bg-amber-100 text-amber-700" },
  ARCHIVED:  { label: "보관됨",   className: "bg-slate-100 text-slate-600" },
};

const MODE_CONFIG: Record<CourseMode, { label: string; className: string }> = {
  ONLINE:  { label: "온라인",  className: "bg-sky-100 text-sky-700" },
  OFFLINE: { label: "오프라인", className: "bg-orange-100 text-orange-700" },
  BLENDED: { label: "혼합",    className: "bg-purple-100 text-purple-700" },
};

const FILTERS: { value: CourseStatus | "ALL"; label: string }[] = [
  { value: "ALL",       label: "전체" },
  { value: "PUBLISHED", label: "게시됨" },
  { value: "DRAFT",     label: "임시저장" },
  { value: "ARCHIVED",  label: "보관됨" },
];

interface Props {
  onCreateClick: () => void;
}

export default function CourseTable({ onCreateClick }: Props) {
  const [filter, setFilter] = useState<CourseStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    const matchStatus = filter === "ALL" || c.status === filter;
    const matchSearch = c.title.includes(search) || c.instructor.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-3">
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f.value
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <input
            className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="과정명 또는 강사 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={onCreateClick}
          className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          + 새 과정
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">과정명</th>
            <th className="text-left px-4 py-3 font-medium">강사</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
            <th className="text-left px-4 py-3 font-medium">차수</th>
            <th className="text-left px-4 py-3 font-medium">수강생</th>
            <th className="text-left px-4 py-3 font-medium">생성일</th>
            <th className="text-left px-4 py-3 font-medium">액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CourseRow({ course }: { course: Course }) {
  const badge = STATUS_CONFIG[course.status as CourseStatus];
  const modeBadge = MODE_CONFIG[course.mode as CourseMode];
  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="px-5 py-3">
        <Link href={`/experiments/admin/courses/${course.id}`} className="font-medium text-slate-800 hover:text-violet-600 transition-colors">
          {course.title}
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${modeBadge.className}`}>
            {modeBadge.label}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            {course.category}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">{course.instructor}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">{course.sessions}</td>
      <td className="px-4 py-3 text-slate-600">{course.enrollees?.toLocaleString()}</td>
      <td className="px-4 py-3 text-slate-400">{course.createdAt}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {course.status === "DRAFT" && (
            <button className="text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
              게시
            </button>
          )}
          {course.status === "PUBLISHED" && (
            <button className="text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded transition-colors">
              게시 취소
            </button>
          )}
          <button className="text-xs px-2 py-1 text-violet-600 hover:bg-violet-50 rounded transition-colors">
            수정
          </button>
        </div>
      </td>
    </tr>
  );
}
