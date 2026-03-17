"use client";

import { useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { enrollments, type Enrollment, type EnrollmentStatus } from "../mockData";

type ProgressFilter = "all" | "zero" | "partial" | "complete";

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  ACTIVE: "수강 중",
  COMPLETED: "완료",
  CANCELLED: "취소됨",
  EXPIRED: "만료됨",
};

const STATUS_COLOR: Record<EnrollmentStatus, string> = {
  ACTIVE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-slate-100 text-slate-500",
  EXPIRED: "bg-orange-100 text-orange-700",
};

const uniqueCourses = [...new Set(enrollments.map((e) => e.course))];
const uniqueSessions = [...new Set(enrollments.map((e) => e.session))];

export default function ProgressTable() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [zeroOnly, setZeroOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      if (courseFilter !== "all" && e.course !== courseFilter) return false;
      if (sessionFilter !== "all" && e.session !== sessionFilter) return false;
      if (zeroOnly && e.progress > 0) return false;
      if (progressFilter === "zero" && e.progress > 0) return false;
      if (progressFilter === "partial" && (e.progress === 0 || e.progress === 100))
        return false;
      if (progressFilter === "complete" && e.progress < 100) return false;
      return true;
    });
  }, [courseFilter, sessionFilter, progressFilter, zeroOnly]);

  const allIds = filtered.map((e) => e.id);
  const allChecked = allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    if (allChecked) {
      setSelected((prev) => {
        const next = new Set(prev);
        allIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => new Set([...prev, ...allIds]));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedCount = filtered.filter((e) => selected.has(e.id)).length;

  const PROGRESS_FILTERS: { key: ProgressFilter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "zero", label: "미시작 (0%)" },
    { key: "partial", label: "진행 중 (1~99%)" },
    { key: "complete", label: "완료 (100%)" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">학습 진도</h1>
        {selectedCount > 0 && (
          <button
            onClick={() => alert(`${selectedCount}명에게 독려 메시지 발송 (시뮬레이션)`)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-700 bg-violet-100 rounded-lg hover:bg-violet-200 transition-colors"
          >
            <Bell size={14} />
            독려 메시지 발송 ({selectedCount}명)
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="all">전체 과정</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Session filter */}
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="all">전체 차수</option>
            {uniqueSessions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Progress range */}
          <div className="flex gap-1">
            {PROGRESS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setProgressFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  progressFilter === f.key
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Zero only quick toggle */}
          <button
            onClick={() => {
              setZeroOnly((v) => !v);
              setProgressFilter("all");
            }}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              zeroOnly
                ? "border-orange-400 bg-orange-50 text-orange-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${zeroOnly ? "bg-orange-500" : "bg-slate-300"}`}
            />
            진도 0% 미학습자
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="accent-violet-600 w-4 h-4"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium">학습자</th>
              <th className="text-left px-4 py-3 font-medium">과정</th>
              <th className="text-left px-4 py-3 font-medium">차수</th>
              <th className="text-left px-4 py-3 font-medium w-40">진도율</th>
              <th className="text-left px-4 py-3 font-medium">최근 학습일</th>
              <th className="text-left px-4 py-3 font-medium">수강 신청일</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                  해당하는 수강 기록이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => toggleOne(e.id)}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(e.id)}
                      readOnly
                      className="accent-violet-600 w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{e.learner}</td>
                  <td className="px-4 py-3 text-slate-600">{e.course}</td>
                  <td className="px-4 py-3 text-slate-500">{e.session}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            e.progress === 100
                              ? "bg-green-500"
                              : e.progress > 0
                              ? "bg-violet-500"
                              : "bg-slate-200"
                          }`}
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium w-9 text-right ${
                          e.progress === 100
                            ? "text-green-600"
                            : e.progress > 0
                            ? "text-violet-600"
                            : "text-slate-400"
                        }`}
                      >
                        {e.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {e.lastStudiedAt ?? (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{e.enrolledAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLOR[e.status]}`}
                    >
                      {STATUS_LABEL[e.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            총 {filtered.length}건
          </div>
        )}
      </div>
    </div>
  );
}
