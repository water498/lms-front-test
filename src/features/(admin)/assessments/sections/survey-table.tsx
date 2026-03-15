"use client";

import { surveys } from "../mockData";

export default function SurveyTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">{surveys.length}개 설문</p>
        <button className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          + 새 설문
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">이름</th>
            <th className="text-left px-4 py-3 font-medium">연결 과정</th>
            <th className="text-left px-4 py-3 font-medium">응답 수</th>
            <th className="text-left px-4 py-3 font-medium">익명</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((s) => (
            <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3 font-medium text-slate-800">{s.title}</td>
              <td className="px-4 py-3 text-slate-600">{s.course}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
