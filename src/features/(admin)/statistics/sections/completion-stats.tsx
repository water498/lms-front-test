"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { enrollments } from "../../enrollment-list/mockData";
import { courses } from "../../course-list/mockData";

const PERIOD_OPTIONS = [
  { value: "all", label: "전체 기간" },
  { value: "2025-03", label: "2025년 3월" },
  { value: "2025-02", label: "2025년 2월" },
  { value: "2025-01", label: "2025년 1월" },
];

export default function CompletionStats() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const publishedCourses = courses.filter((c) => c.status === "PUBLISHED");

  const courseStats = useMemo(() => {
    return publishedCourses.map((course) => {
      let courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
      if (periodFilter !== "all") {
        courseEnrollments = courseEnrollments.filter((e) =>
          e.enrolledAt.startsWith(periodFilter)
        );
      }
      const total = courseEnrollments.length;
      const completed = courseEnrollments.filter((e) => e.status === "COMPLETED").length;
      const active = courseEnrollments.filter((e) => e.status === "ACTIVE").length;
      const avgProgress =
        total > 0
          ? Math.round(
              courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / total
            )
          : 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { course, total, completed, active, completionRate, avgProgress };
    });
  }, [periodFilter, publishedCourses]);

  const filtered = useMemo(
    () =>
      courseFilter === "all"
        ? courseStats
        : courseStats.filter((s) => s.course.id === courseFilter),
    [courseFilter, courseStats]
  );

  const totals = useMemo(
    () => ({
      total: filtered.reduce((s, r) => s + r.total, 0),
      completed: filtered.reduce((s, r) => s + r.completed, 0),
      active: filtered.reduce((s, r) => s + r.active, 0),
    }),
    [filtered]
  );

  const overallRate =
    totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">수료율 현황</h1>
        <button
          onClick={() => alert("CSV 내보내기 (시뮬레이션)")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={14} />
          내보내기
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "전체 수강자", value: totals.total, color: "text-slate-800" },
          { label: "수료 완료", value: totals.completed, color: "text-green-600" },
          { label: "수강 중", value: totals.active, color: "text-blue-600" },
          { label: "전체 수료율", value: `${overallRate}%`, color: "text-violet-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">전체 과정</option>
          {publishedCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium">과정명</th>
              <th className="text-left px-4 py-3 font-medium">카테고리</th>
              <th className="text-right px-4 py-3 font-medium">수강자</th>
              <th className="text-right px-4 py-3 font-medium">수료 완료</th>
              <th className="text-left px-4 py-3 font-medium w-48">수료율</th>
              <th className="text-left px-4 py-3 font-medium w-40">평균 진도율</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map(({ course, total, completed, completionRate, avgProgress }) => (
                <tr
                  key={course.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{course.title}</td>
                  <td className="px-4 py-3 text-slate-500">{course.category}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{total}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{completed}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-green-600 w-9 text-right">
                        {completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${avgProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-violet-600 w-9 text-right">
                        {avgProgress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            총 {filtered.length}개 과정
          </div>
        )}
      </div>
    </div>
  );
}
