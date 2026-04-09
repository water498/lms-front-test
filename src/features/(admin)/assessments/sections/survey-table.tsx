"use client";

import Link from "next/link";
import { surveyTemplates, type SurveyTriggerType } from "../mockData";

const TRIGGER_CONFIG: Record<SurveyTriggerType, { label: string; className: string }> = {
  MANUAL:          { label: "수동",      className: "bg-slate-100 text-slate-600" },
  COURSE_COMPLETE: { label: "과정완료", className: "bg-amber-100 text-amber-700" },
};

export default function SurveyTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">{surveyTemplates.length}개 설문</p>
        <div className="flex items-center gap-2">
          <Link
            href="/backoffice/assessments/question-bank"
            className="px-3 py-1.5 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
          >
            문항 뱅크
          </Link>
          <Link
            href="/backoffice/assessments/survey/new"
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 새 설문
          </Link>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">이름</th>
            <th className="text-left px-4 py-3 font-medium">트리거</th>
            <th className="text-left px-4 py-3 font-medium">문항 구성</th>
            <th className="text-left px-4 py-3 font-medium">응답 수</th>
            <th className="text-left px-4 py-3 font-medium">익명</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {surveyTemplates.map((s) => {
            const trigger = TRIGGER_CONFIG[s.triggerType];
            const totalQ = s.rules.reduce((sum, r) => sum + r.count, 0);
            return (
              <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/assessments/survey/${s.id}`}
                    className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                  >
                    {s.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${trigger.className}`}>
                    {trigger.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {totalQ}문항{s.rules.length > 0 && <span className="text-slate-400 text-xs ml-1">(규칙 {s.rules.length}개)</span>}
                </td>
                <td className="px-4 py-3 text-slate-600">{s.responseCount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.anonymous ? "bg-slate-100 text-slate-600" : "bg-white border border-slate-200 text-slate-500"}`}>
                    {s.anonymous ? "익명" : "기명"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {s.status === "ACTIVE" ? "활성" : "종료"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
