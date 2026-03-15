"use client";

import { useState } from "react";
import { assessments, type Assessment, type AssessmentType } from "../mockData";

const TYPE_CONFIG: Record<AssessmentType, { label: string; className: string }> = {
  QUIZ: { label: "퀴즈", className: "bg-blue-100 text-blue-700" },
  EXAM: { label: "시험", className: "bg-violet-100 text-violet-700" },
};

export default function QuizTable() {
  const [typeFilter, setTypeFilter] = useState<AssessmentType | "ALL">("ALL");

  const filtered = assessments.filter(
    (a) => typeFilter === "ALL" || a.type === typeFilter
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex gap-1">
          {(["ALL", "QUIZ", "EXAM"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                typeFilter === t ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t === "ALL" ? "전체" : t === "QUIZ" ? "퀴즈" : "시험"}
            </button>
          ))}
        </div>
        <button className="ml-auto px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          + 새 퀴즈
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">이름</th>
            <th className="text-left px-4 py-3 font-medium">유형</th>
            <th className="text-left px-4 py-3 font-medium">연결 과정</th>
            <th className="text-left px-4 py-3 font-medium">문항 수</th>
            <th className="text-left px-4 py-3 font-medium">통과 기준</th>
            <th className="text-left px-4 py-3 font-medium">시간제한</th>
            <th className="text-left px-4 py-3 font-medium">응시 수</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => {
            const badge = TYPE_CONFIG[a.type];
            return (
              <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{a.title}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{a.course}</td>
                <td className="px-4 py-3 text-slate-600">{a.questionCount}문항</td>
                <td className="px-4 py-3 text-slate-600">{a.passingScore}점</td>
                <td className="px-4 py-3 text-slate-500">{a.timeLimit ? `${a.timeLimit}분` : "무제한"}</td>
                <td className="px-4 py-3 text-slate-600">{a.attempts.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
