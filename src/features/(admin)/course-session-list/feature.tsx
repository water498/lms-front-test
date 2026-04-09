"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllSessions, type SessionType, type SessionStatus } from "../course-layout/mockData";
import { courses } from "../course-list/mockData";

const TYPE_CONFIG: Record<SessionType, { label: string; className: string }> = {
  COHORT:     { label: "정규",   className: "bg-violet-100 text-violet-700" },
  SELF_PACED: { label: "상시",   className: "bg-blue-100   text-blue-700"   },
};

const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string }> = {
  DRAFT:   { label: "초안",   className: "bg-slate-100 text-slate-500"   },
  OPEN:    { label: "모집중", className: "bg-emerald-100 text-emerald-700" },
  ONGOING: { label: "진행중", className: "bg-amber-100  text-amber-700"   },
  CLOSED:    { label: "종료",   className: "bg-slate-100  text-slate-400"   },
  CANCELLED: { label: "폐강",   className: "bg-red-100    text-red-500"     },
};

const ALL_SESSIONS = getAllSessions();

export default function SessionsFeature() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState<SessionStatus | "all">("all");

  const filtered = ALL_SESSIONS.filter((s) => {
    if (filterCourse !== "all" && s.courseId !== filterCourse) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        >
          <option value="all">전체 과정</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as SessionStatus | "all")}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        >
          <option value="all">전체 상태</option>
          {(Object.keys(STATUS_CONFIG) as SessionStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-slate-400">{filtered.length}개 차수</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">과정명</th>
              <th className="text-left px-4 py-3 font-medium">차수명</th>
              <th className="text-left px-4 py-3 font-medium">유형</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">수강생</th>
              <th className="text-left px-4 py-3 font-medium">기간</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                  조건에 맞는 차수가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const typeCfg   = TYPE_CONFIG[s.type];
                const statusCfg = STATUS_CONFIG[s.status];
                return (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-600 text-xs">{s.courseTitle}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/sessions/${s.id}`}
                        className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeCfg.className}`}>
                        {typeCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {s.enrolled}
                      {s.capacity > 0 && (
                        <span className="text-slate-400 text-xs"> / {s.capacity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {s.startDate && s.endDate
                        ? `${s.startDate} ~ ${s.endDate}`
                        : s.startDate ?? "상시"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
