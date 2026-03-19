"use client";

import { useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { enrollments, type Enrollment, type EnrollmentStatus } from "../mockData";

type ProgressFilter = "all" | "zero" | "partial" | "complete";

const STATUS_CONFIG: Record<EnrollmentStatus, { label: string; className: string }> = {
  ACTIVE:    { label: "활성",   className: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "완료",   className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "취소됨", className: "bg-red-100 text-red-600" },
  EXPIRED:   { label: "만료됨", className: "bg-slate-100 text-slate-500" },
};

const STATUS_FILTERS: { value: EnrollmentStatus | "ALL"; label: string }[] = [
  { value: "ALL",       label: "전체" },
  { value: "ACTIVE",    label: "활성" },
  { value: "COMPLETED", label: "완료" },
  { value: "CANCELLED", label: "취소됨" },
  { value: "EXPIRED",   label: "만료됨" },
];

const PERIOD_OPTIONS = [
  { value: "all",   label: "전체 기간" },
  { value: "week",  label: "이번 주" },
  { value: "month", label: "이번 달" },
  { value: "3m",    label: "최근 3개월" },
];

const PROGRESS_FILTERS: { key: ProgressFilter; label: string }[] = [
  { key: "all",      label: "전체" },
  { key: "zero",     label: "미시작" },
  { key: "partial",  label: "진행 중" },
  { key: "complete", label: "완료" },
];

export default function EnrollmentTable() {
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "ALL">("ALL");
  const [period, setPeriod] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [zeroOnly, setZeroOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const uniqueCourses = useMemo(
    () => [...new Set(enrollments.map((e) => e.course))],
    []
  );
  const uniqueSessions = useMemo(
    () => [...new Set(enrollments.map((e) => e.session))],
    []
  );

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
      if (courseFilter !== "all" && e.course !== courseFilter) return false;
      if (sessionFilter !== "all" && e.session !== sessionFilter) return false;
      if (zeroOnly && e.progress > 0) return false;
      if (progressFilter === "zero" && e.progress > 0) return false;
      if (progressFilter === "partial" && (e.progress === 0 || e.progress === 100)) return false;
      if (progressFilter === "complete" && e.progress < 100) return false;
      return true;
    });
  }, [statusFilter, courseFilter, sessionFilter, progressFilter, zeroOnly]);

  const allIds = filtered.map((e) => e.id);
  const allChecked = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const selectedCount = filtered.filter((e) => selected.has(e.id)).length;

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">수강현황</h1>
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-col gap-3">
        {/* Row 1: status buttons + zeroOnly toggle */}
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === f.value
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
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
            <span className={`w-2 h-2 rounded-full ${zeroOnly ? "bg-orange-500" : "bg-slate-300"}`} />
            진도 0% 미학습자
          </button>
        </div>

        {/* Row 2: course + session + period dropdowns + progress buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="all">전체 과정</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="all">전체 차수</option>
            {uniqueSessions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="flex gap-1">
            {PROGRESS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setProgressFilter(f.key);
                  setZeroOnly(false);
                }}
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
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium w-40">진도율</th>
              <th className="text-left px-4 py-3 font-medium">최근 학습일</th>
              <th className="text-left px-4 py-3 font-medium">수강 신청일</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">
                  해당하는 수강 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <EnrollmentRow
                  key={e.id}
                  enrollment={e}
                  selected={selected.has(e.id)}
                  onToggle={() => toggleOne(e.id)}
                />
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

function EnrollmentRow({
  enrollment: e,
  selected,
  onToggle,
}: {
  enrollment: Enrollment;
  selected: boolean;
  onToggle: () => void;
}) {
  const badge = STATUS_CONFIG[e.status];
  return (
    <tr
      onClick={onToggle}
      className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          readOnly
          className="accent-violet-600 w-4 h-4"
        />
      </td>
      <td className="px-4 py-3 font-medium text-slate-800">{e.learner}</td>
      <td className="px-4 py-3 text-slate-600">{e.course}</td>
      <td className="px-4 py-3 text-slate-500">{e.session}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </td>
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
        {e.lastStudiedAt ?? <span className="text-slate-300">—</span>}
      </td>
      <td className="px-4 py-3 text-slate-500">{e.enrolledAt}</td>
      <td className="px-4 py-3" onClick={(ev) => ev.stopPropagation()}>
        {e.status === "ACTIVE" && (
          <button className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors">
            수강 취소
          </button>
        )}
      </td>
    </tr>
  );
}
