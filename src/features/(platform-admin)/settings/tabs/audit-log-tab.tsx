"use client";

import { useState } from "react";
import { AUDIT_LOGS } from "../mockData";
import type { PlatformAuditAction } from "@/lib/models";

const ACTION_LABELS: Record<PlatformAuditAction, string> = {
  TENANT_CREATED:            "기업 생성",
  TENANT_SUSPENDED:          "기업 정지",
  TENANT_RESUMED:            "기업 재개",
  SUBDOMAIN_CHANGED:         "서브도메인 변경",
  PLAN_CHANGED:              "플랜 변경",
  USER_LIMIT_CHANGED:        "사용자 한도 변경",
  SSO_CONFIGURED:            "SSO 설정",
  SSO_ENABLED:               "SSO 활성화",
  SSO_DISABLED:              "SSO 비활성화",
  ADMIN_INVITED:             "어드민 초대",
  ADMIN_INVITE_RESENT:       "초대 재발송",
  PLATFORM_SETTINGS_UPDATED: "플랫폼 설정 변경",
  PLATFORM_PLAN_CHANGED:     "플랫폼 플랜 변경",
};

type Range = "today" | "7d" | "30d" | "all";

const NOW = new Date("2026-03-18T23:59:59Z");

export default function AuditLogTab() {
  const [range, setRange] = useState<Range>("7d");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const filtered = AUDIT_LOGS.filter((log) => {
    const diffDays =
      (NOW.getTime() - new Date(log.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (range === "today" && diffDays > 1) return false;
    if (range === "7d" && diffDays > 7) return false;
    if (range === "30d" && diffDays > 30) return false;
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    return true;
  });

  const uniqueActions = Array.from(new Set(AUDIT_LOGS.map((l) => l.action)));

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {(["today", "7d", "30d", "all"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r === "today" ? "오늘" : r === "7d" ? "7일" : r === "30d" ? "30일" : "전체"}
            </button>
          ))}
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">전체 액션</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>
              {ACTION_LABELS[a]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2.5 pr-4 text-xs font-medium text-slate-400 whitespace-nowrap">
                일시
              </th>
              <th className="text-left py-2.5 pr-4 text-xs font-medium text-slate-400">
                수행자
              </th>
              <th className="text-left py-2.5 pr-4 text-xs font-medium text-slate-400">
                액션
              </th>
              <th className="text-left py-2.5 pr-4 text-xs font-medium text-slate-400">
                대상
              </th>
              <th className="text-left py-2.5 pr-4 text-xs font-medium text-slate-400">
                상세
              </th>
              <th className="text-left py-2.5 text-xs font-medium text-slate-400">
                IP
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400 text-sm"
                >
                  해당 기간의 로그가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("ko-KR")}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-700">
                    {log.actor}
                  </td>
                  <td className="py-3 pr-4">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-700">
                    {log.targetName}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500">
                    {log.detail}
                  </td>
                  <td className="py-3 text-xs font-mono text-slate-400">
                    {log.ip}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">{filtered.length}개 항목</p>
    </div>
  );
}

function ActionBadge({ action }: { action: PlatformAuditAction }) {
  const label = ACTION_LABELS[action];
  const isDestructive = action === "TENANT_SUSPENDED";
  const isPositive =
    action === "TENANT_CREATED" ||
    action === "TENANT_RESUMED" ||
    action === "SSO_ENABLED";

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        isDestructive
          ? "bg-red-50 text-red-600"
          : isPositive
            ? "bg-green-50 text-green-700"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </span>
  );
}
