"use client";

import { useState } from "react";
import { enrollments, type Enrollment, type EnrollmentStatus } from "../mockData";

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

export default function EnrollmentTable() {
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "ALL">("ALL");
  const [period, setPeriod] = useState("all");

  const filtered = enrollments.filter((e) => {
    return statusFilter === "ALL" || e.status === statusFilter;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex gap-1">
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
        </div>
        <select
          className="ml-auto border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {PERIOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">학습자</th>
            <th className="text-left px-4 py-3 font-medium">과정</th>
            <th className="text-left px-4 py-3 font-medium">차수</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
            <th className="text-left px-4 py-3 font-medium">진행률</th>
            <th className="text-left px-4 py-3 font-medium">수강 신청일</th>
            <th className="text-left px-4 py-3 font-medium">액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <EnrollmentRow key={e.id} enrollment={e} />
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                해당하는 수강 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function EnrollmentRow({ enrollment: e }: { enrollment: Enrollment }) {
  const badge = STATUS_CONFIG[e.status];
  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="px-5 py-3 font-medium text-slate-800">{e.learner}</td>
      <td className="px-4 py-3 text-slate-600">{e.course}</td>
      <td className="px-4 py-3 text-slate-500">{e.session}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-violet-500 h-1.5 rounded-full"
              style={{ width: `${e.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{e.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-400">{e.enrolledAt}</td>
      <td className="px-4 py-3">
        {e.status === "ACTIVE" && (
          <button className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors">
            수강 취소
          </button>
        )}
      </td>
    </tr>
  );
}
