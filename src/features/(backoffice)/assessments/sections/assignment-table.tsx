"use client";

import { useState } from "react";
import Link from "next/link";
import { assignmentTemplates, type SubmissionType } from "../mockData";
import type { AssignmentTemplate } from "@/lib/models";

type FilterTab = "all" | "active" | "archived";

const SUBMISSION_LABELS: Record<SubmissionType, string> = {
  FILE: "파일 업로드",
  TEXT: "텍스트 입력",
  BOTH: "파일 + 텍스트",
};

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "active",   label: "활성" },
  { value: "archived", label: "보관됨" },
  { value: "all",      label: "전체" },
];

export default function AssignmentTable() {
  const [filter, setFilter] = useState<FilterTab>("active");
  const [templates, setTemplates] = useState<AssignmentTemplate[]>(assignmentTemplates);

  const filtered = templates.filter((a) => {
    if (filter === "active")   return !a.isArchived;
    if (filter === "archived") return !!a.isArchived;
    return true;
  });

  function handleDelete(id: string) {
    setTemplates((prev) => prev.filter((a) => a.id !== id));
  }
  function handleArchive(id: string) {
    setTemplates((prev) => prev.map((a) => a.id === id ? { ...a, isArchived: true } : a));
  }
  function handleRestore(id: string) {
    setTemplates((prev) => prev.map((a) => a.id === id ? { ...a, isArchived: false } : a));
  }

  const activeCount   = templates.filter((a) => !a.isArchived).length;
  const archivedCount = templates.filter((a) => !!a.isArchived).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">{activeCount}개 과제</p>
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
        <Link
          href="/backoffice/resources/assessments/assignment/new"
          className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          + 새 과제
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">이름</th>
            <th className="text-left px-4 py-3 font-medium">제출 방식</th>
            <th className="text-left px-4 py-3 font-medium">루브릭 항목</th>
            <th className="text-left px-4 py-3 font-medium">총점</th>
            <th className="text-left px-4 py-3 font-medium">사용 횟수</th>
            <th className="text-left px-4 py-3 font-medium">생성일</th>
            <th className="text-left px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => {
            const totalPoints = a.rubric.reduce((sum, r) => sum + r.points, 0);
            return (
              <tr
                key={a.id}
                className={`border-b border-slate-50 last:border-0 transition-colors ${
                  a.isArchived ? "opacity-50" : "hover:bg-slate-50/50"
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/backoffice/resources/assessments/assignment/${a.id}`}
                      className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                    >
                      {a.title}
                    </Link>
                    {a.isArchived && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                        보관됨
                      </span>
                    )}
                    {!a.isArchived && a.usageCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">
                        사용중
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                    {SUBMISSION_LABELS[a.submissionType]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{a.rubric.length}항목</td>
                <td className="px-4 py-3 text-slate-600">{totalPoints}점</td>
                <td className="px-4 py-3 text-slate-600">{a.usageCount}회</td>
                <td className="px-4 py-3 text-slate-400">{a.createdAt}</td>
                <td className="px-4 py-3">
                  {a.isArchived ? (
                    <button
                      onClick={() => handleRestore(a.id)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      복원
                    </button>
                  ) : a.usageCount > 0 ? (
                    <button
                      onClick={() => handleArchive(a.id)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      보관
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(a.id)}
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
