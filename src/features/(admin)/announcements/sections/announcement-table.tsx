"use client";

import React, { useState } from "react";
import { ANNOUNCEMENTS as PLATFORM_ANNOUNCEMENTS } from "@/features/(platform-admin)/announcements/mockData";
import { ChevronDown, ChevronUp } from "lucide-react";

const TENANT_ID = "t-001";

const PLATFORM_TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  URGENT:      { label: "긴급",     className: "bg-red-100 text-red-700" },
  MAINTENANCE: { label: "점검",     className: "bg-amber-100 text-amber-700" },
  UPDATE:      { label: "업데이트", className: "bg-blue-100 text-blue-700" },
  GENERAL:     { label: "일반",     className: "bg-slate-100 text-slate-600" },
};

export default function AnnouncementTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = PLATFORM_ANNOUNCEMENTS.filter(
    (a) =>
      a.status === "PUBLISHED" &&
      (a.targetType === "ALL_TENANTS" || (a.targetIds && a.targetIds.includes(TENANT_ID)))
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">{items.length}건 (읽기 전용)</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">유형</th>
            <th className="text-left px-4 py-3 font-medium">제목</th>
            <th className="text-left px-4 py-3 font-medium">발송 대상</th>
            <th className="text-left px-4 py-3 font-medium">게시일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const subtype = a.subtype ?? "GENERAL";
            const badge = PLATFORM_TYPE_CONFIG[subtype] ?? { label: subtype, className: "bg-slate-100 text-slate-600" };
            const isExpanded = expandedId === a.id;
            return (
              <React.Fragment key={a.id}>
                <tr
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : a.id)}
                >
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-1.5">
                    {a.title}
                    {isExpanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {a.targetType === "ALL_TENANTS" ? "전체 테넌트" : (a.targetIds ?? []).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {a.sentAt ? new Date(a.sentAt).toLocaleDateString("ko-KR") : "-"}
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <td colSpan={4} className="px-5 py-4 text-sm text-slate-600 whitespace-pre-wrap">
                      {a.content}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
