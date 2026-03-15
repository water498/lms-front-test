"use client";

import Link from "next/link";
import { assignmentTemplates, type SubmissionType } from "../mockData";

const SUBMISSION_LABELS: Record<SubmissionType, string> = {
  FILE: "파일 업로드",
  TEXT: "텍스트 입력",
  BOTH: "파일 + 텍스트",
};

export default function AssignmentTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">{assignmentTemplates.length}개 과제</p>
        <Link
          href="/experiments/admin/assessments/assignment/new"
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
          </tr>
        </thead>
        <tbody>
          {assignmentTemplates.map((a) => {
            const totalPoints = a.rubric.reduce((sum, r) => sum + r.points, 0);
            return (
              <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <Link
                    href={`/experiments/admin/assessments/assignment/${a.id}`}
                    className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                  >
                    {a.title}
                  </Link>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
