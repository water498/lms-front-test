"use client";

import Link from "next/link";
import { examTemplates, type ExamSubType } from "../mockData";

const SUBTYPE_CONFIG: Record<ExamSubType, { label: string; className: string }> = {
  SHORT: { label: "단답 시험", className: "bg-blue-100 text-blue-700" },
  FINAL: { label: "최종 시험", className: "bg-violet-100 text-violet-700" },
};

export default function ExamTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">{examTemplates.length}개 시험</p>
        <div className="flex items-center gap-2">
          <Link
            href="/experiments/admin/assessments/question-bank"
            className="px-3 py-1.5 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
          >
            문항 뱅크
          </Link>
          <Link
            href="/experiments/admin/assessments/exam/new"
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
          </tr>
        </thead>
        <tbody>
          {examTemplates.map((e) => {
            const badge = SUBTYPE_CONFIG[e.subType];
            const totalQ = e.rules.reduce((s, r) => s + r.count, 0);
            return (
              <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <Link
                    href={`/experiments/admin/assessments/exam/${e.id}`}
                    className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                  >
                    {e.title}
                  </Link>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
