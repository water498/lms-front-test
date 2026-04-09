"use client";

import { useState } from "react";
import Link from "next/link";
import { examTemplates, type ExamSubType } from "../mockData";
import type { ExamTemplate } from "@/lib/models";

type FilterTab = "all" | "active" | "archived";

const SUBTYPE_CONFIG: Record<ExamSubType, { label: string; className: string }> = {
  SHORT: { label: "단답 시험", className: "bg-blue-100 text-blue-700" },
  FINAL: { label: "최종 시험", className: "bg-violet-100 text-violet-700" },
};

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "active",   label: "활성" },
  { value: "archived", label: "보관됨" },
  { value: "all",      label: "전체" },
];

export default function ExamTable() {
  const [filter, setFilter] = useState<FilterTab>("active");
  const [templates, setTemplates] = useState<ExamTemplate[]>(examTemplates);

  const filtered = templates.filter((e) => {
    if (filter === "active")   return !e.isArchived;
    if (filter === "archived") return !!e.isArchived;
    return true;
  });

  function handleDelete(id: string) {
    setTemplates((prev) => prev.filter((e) => e.id !== id));
  }
  function handleArchive(id: string) {
    setTemplates((prev) => prev.map((e) => e.id === id ? { ...e, isArchived: true } : e));
  }
  function handleRestore(id: string) {
    setTemplates((prev) => prev.map((e) => e.id === id ? { ...e, isArchived: false } : e));
  }

  const activeCount   = templates.filter((e) => !e.isArchived).length;
  const archivedCount = templates.filter((e) => !!e.isArchived).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">{activeCount}개 시험</p>
          {/* Filter tabs */}
          <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                  filter === tab.value
                    ? "bg-violet-600 text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {tab.value === "archived" && archivedCount > 0 && (
                  <span className="ml-1 text-[10px]">({archivedCount})</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/backoffice/assessments/question-bank"
            className="px-3 py-1.5 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
          >
            문항 뱅크
          </Link>
          <Link
            href="/backoffice/assessments/exam/new"
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 새 시험
          </Link>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">이름</th>
            <th className="text-left px-4 py-3 font-medium">유형</th>
            <th className="text-left px-4 py-3 font-medium">문항 구성</th>
            <th className="text-left px-4 py-3 font-medium">통과 기준</th>
            <th className="text-left px-4 py-3 font-medium">시간제한</th>
            <th className="text-left px-4 py-3 font-medium">재응시</th>
            <th className="text-left px-4 py-3 font-medium">사용 횟수</th>
            <th className="text-left px-4 py-3 font-medium">생성일</th>
            <th className="text-left px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => {
            const badge = SUBTYPE_CONFIG[e.subType];
            const totalQ = e.rules.reduce((s, r) => s + r.count, 0);
            return (
              <tr
                key={e.id}
                className={`border-b border-slate-50 last:border-0 transition-colors ${
                  e.isArchived ? "opacity-50" : "hover:bg-slate-50/50"
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/assessments/exam/${e.id}`}
                      className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                    >
                      {e.title}
                    </Link>
                    {e.isArchived && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                        보관됨
                      </span>
                    )}
                    {!e.isArchived && e.usageCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">
                        사용중
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {totalQ}문항{e.rules.length > 0 && <span className="text-slate-400 text-xs ml-1">(규칙 {e.rules.length}개)</span>}
                </td>
                <td className="px-4 py-3 text-slate-600">{e.passingScore}%</td>
                <td className="px-4 py-3 text-slate-500">{e.timeLimit ? `${e.timeLimit}분` : "무제한"}</td>
                <td className="px-4 py-3 text-slate-500">{e.maxAttempts ? `${e.maxAttempts}회` : "무제한"}</td>
                <td className="px-4 py-3 text-slate-600">{e.usageCount}회</td>
                <td className="px-4 py-3 text-slate-400">{e.createdAt}</td>
                <td className="px-4 py-3">
                  {e.isArchived ? (
                    <button
                      onClick={() => handleRestore(e.id)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      복원
                    </button>
                  ) : e.usageCount > 0 ? (
                    <button
                      onClick={() => handleArchive(e.id)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      보관
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
