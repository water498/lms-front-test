"use client";

import { useState, useMemo } from "react";
import { ACCESS_LOGS, UserAccessLog } from "./mockData";

const EVENT_TYPE_LABELS: Record<UserAccessLog["type"], string> = {
  LOGIN: "로그인",
  LOGIN_FAILED: "로그인실패",
  LOGOUT: "로그아웃",
  SESSION_EXPIRED: "세션만료",
  AUTO_LOGIN: "자동로그인",
  PASSWORD_RESET: "비밀번호재설정",
};

const EVENT_TYPE_COLORS: Record<UserAccessLog["type"], string> = {
  LOGIN: "bg-emerald-100 text-emerald-700",
  LOGIN_FAILED: "bg-red-100 text-red-700",
  LOGOUT: "bg-slate-100 text-slate-600",
  SESSION_EXPIRED: "bg-amber-100 text-amber-700",
  AUTO_LOGIN: "bg-blue-100 text-blue-700",
  PASSWORD_RESET: "bg-violet-100 text-violet-700",
};

const SCOPE_LABELS: Record<UserAccessLog["scope"], string> = {
  USER: "사용자단",
  ADMIN: "관리자단",
};

interface Props {
  /** 특정 유저의 이력만 표시할 때 사용. 미지정 시 전체 이력. */
  userId?: string;
}

export default function UserAccessLogsFeature({ userId }: Props = {}) {
  const [typeFilter, setTypeFilter] = useState<UserAccessLog["type"] | "ALL">("ALL");
  const [scopeFilter, setScopeFilter] = useState<UserAccessLog["scope"] | "ALL">("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const filtered = useMemo(() => {
    return ACCESS_LOGS.filter((log) => {
      if (userId && log.userId !== userId) return false;
      if (typeFilter !== "ALL" && log.type !== typeFilter) return false;
      if (scopeFilter !== "ALL" && log.scope !== scopeFilter) return false;
      if (dateFrom && log.occurredAt < dateFrom) return false;
      if (dateTo && log.occurredAt > dateTo + " 99:99") return false;
      if (!userId && nameSearch && !log.userName.includes(nameSearch)) return false;
      return true;
    }).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [userId, typeFilter, scopeFilter, dateFrom, dateTo, nameSearch]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        {/* Event type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">이벤트 유형</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as UserAccessLog["type"] | "ALL")}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <option value="ALL">전체</option>
            <option value="LOGIN">로그인</option>
            <option value="LOGOUT">로그아웃</option>
            <option value="SESSION_EXPIRED">세션만료</option>
            <option value="AUTO_LOGIN">자동로그인</option>
          </select>
        </div>

        {/* Scope */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">접속단</label>
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value as UserAccessLog["scope"] | "ALL")}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <option value="ALL">전체</option>
            <option value="USER">사용자단</option>
            <option value="ADMIN">관리자단</option>
          </select>
        </div>

        {/* Date range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">날짜 범위</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <span className="text-slate-400 text-sm">~</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        {/* Name search — 전체 이력 뷰에서만 표시 */}
        {!userId && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">회원명</label>
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="이름 검색"
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 w-36"
            />
          </div>
        )}

        {/* Reset */}
        {(typeFilter !== "ALL" || scopeFilter !== "ALL" || dateFrom || dateTo || nameSearch) && (
          <button
            onClick={() => {
              setTypeFilter("ALL");
              setScopeFilter("ALL");
              setDateFrom("");
              setDateTo("");
              setNameSearch("");
            }}
            className="text-xs text-slate-400 hover:text-slate-600 underline self-end pb-2"
          >
            초기화
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">접속 이력</p>
          <p className="text-xs text-slate-400">{filtered.length}건</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 whitespace-nowrap">날짜시간</th>
                {!userId && <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 whitespace-nowrap">회원명</th>}
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 whitespace-nowrap">이벤트 유형</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 whitespace-nowrap">접속단</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 whitespace-nowrap">IP</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 whitespace-nowrap">브라우저/OS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={userId ? 5 : 6} className="px-5 py-10 text-center text-sm text-slate-400">
                    조건에 맞는 접속 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">{log.occurredAt}</td>
                    {!userId && <td className="px-5 py-3 text-slate-800 font-medium whitespace-nowrap">{log.userName}</td>}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${EVENT_TYPE_COLORS[log.type]}`}>
                        {EVENT_TYPE_LABELS[log.type]}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`text-xs ${log.scope === "ADMIN" ? "text-violet-600 font-medium" : "text-slate-500"}`}>
                        {SCOPE_LABELS[log.scope]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{log.ip}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">{log.userAgent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
