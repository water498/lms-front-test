"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import type { TenantAuditAction, TenantAuditLog } from "@/lib/models";

const ACTION_LABEL: Record<TenantAuditAction, string> = {
  ENROLLMENT_CANCEL:   "수강 취소",
  ENROLLMENT_CREATE:   "수강 등록",
  COURSE_CREATE:       "과정 생성",
  COURSE_UPDATE:       "과정 수정",
  USER_ROLE_CHANGE:    "역할 변경",
  ORG_STRUCTURE_UPDATE:"조직 구조 변경",
  SETTINGS_UPDATE:     "설정 변경",
  CERT_ISSUE:          "수료증 발급",
};

const ACTION_COLOR: Record<TenantAuditAction, string> = {
  ENROLLMENT_CANCEL:    "bg-red-100 text-red-600",
  ENROLLMENT_CREATE:    "bg-blue-100 text-blue-600",
  COURSE_CREATE:        "bg-violet-100 text-violet-600",
  COURSE_UPDATE:        "bg-amber-100 text-amber-600",
  USER_ROLE_CHANGE:     "bg-orange-100 text-orange-600",
  ORG_STRUCTURE_UPDATE: "bg-teal-100 text-teal-600",
  SETTINGS_UPDATE:      "bg-slate-100 text-slate-600",
  CERT_ISSUE:           "bg-green-100 text-green-600",
};

const auditLogs: TenantAuditLog[] = [
  { id: "al1",  timestamp: "2025-03-17 14:32:11", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CANCEL",    target: "정하은 / React 기초",             detail: "ACTIVE → CANCELLED" },
  { id: "al2",  timestamp: "2025-03-17 11:05:44", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CREATE",    target: "홍민재 / React 기초",             detail: "수동 수강 등록" },
  { id: "al3",  timestamp: "2025-03-16 17:22:03", actor: "홍길동 (관리자)",   action: "CERT_ISSUE",           target: "박지호 / Next.js 마스터",         detail: "수료증 수동 발급" },
  { id: "al4",  timestamp: "2025-03-16 15:48:30", actor: "홍길동 (관리자)",   action: "COURSE_UPDATE",        target: "React 기초",                      detail: "수료 기준 80% → 70%" },
  { id: "al5",  timestamp: "2025-03-15 10:13:55", actor: "홍길동 (관리자)",   action: "USER_ROLE_CHANGE",     target: "이준혁",                          detail: "LEARNER → INSTRUCTOR" },
  { id: "al6",  timestamp: "2025-03-14 09:50:22", actor: "홍길동 (관리자)",   action: "ORG_STRUCTURE_UPDATE", target: "개발본부 / 백엔드팀",             detail: "부서 추가" },
  { id: "al7",  timestamp: "2025-03-13 16:05:10", actor: "홍길동 (관리자)",   action: "COURSE_CREATE",        target: "Docker & Kubernetes",             detail: "신규 과정 생성 (DRAFT)" },
  { id: "al8",  timestamp: "2025-03-12 14:30:00", actor: "홍길동 (관리자)",   action: "SETTINGS_UPDATE",      target: "브랜딩 설정",                     detail: "로고 이미지 업데이트" },
  { id: "al9",  timestamp: "2025-03-11 11:22:18", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CREATE",    target: "신입 온보딩 그룹 (3명) / React 기초", detail: "그룹 일괄 배정" },
  { id: "al10", timestamp: "2025-03-10 09:11:05", actor: "홍길동 (관리자)",   action: "ORG_STRUCTURE_UPDATE", target: "직급",                            detail: "부장 직급 추가" },
];

const ALL_ACTIONS = Object.keys(ACTION_LABEL) as TenantAuditAction[];

export default function AuditLogTab() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | TenantAuditAction>("all");

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      !search ||
      log.actor.includes(search) ||
      log.target.includes(search) ||
      log.detail.includes(search);
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          관리자 작업에 의한 데이터 변경 이력입니다.
        </p>
        <button
          onClick={() => alert("CSV 내보내기 (시뮬레이션)")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={13} />
          내보내기
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="작업자·대상·내용 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value as "all" | TenantAuditAction)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">전체 작업</option>
          {ALL_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {ACTION_LABEL[a]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 font-medium">일시</th>
              <th className="text-left px-4 py-2.5 font-medium">작업자</th>
              <th className="text-left px-4 py-2.5 font-medium">작업 유형</th>
              <th className="text-left px-4 py-2.5 font-medium">대상</th>
              <th className="text-left px-4 py-2.5 font-medium">내용</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-2.5 text-slate-400 text-xs whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{log.actor}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${ACTION_COLOR[log.action]}`}
                    >
                      {ACTION_LABEL[log.action]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{log.target}</td>
                  <td className="px-4 py-2.5 text-slate-500">{log.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-400">
            총 {filtered.length}건
          </div>
        )}
      </div>
    </div>
  );
}
