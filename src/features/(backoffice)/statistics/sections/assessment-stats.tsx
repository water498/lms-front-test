"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { examTemplates } from "../../assessments/mockData";

// Mock exam result data (응시 결과 시뮬레이션)
interface ExamResult {
  examId: string;
  examTitle: string;
  passingScore: number;
  attempts: number;
  avgScore: number;
  maxScore: number;
  minScore: number;
  passCount: number;
}

const mockResults: ExamResult[] = examTemplates.map((exam, i) => {
  const data = [
    { attempts: 42, avgScore: 74, maxScore: 98, minScore: 32, passCount: 31 },
    { attempts: 28, avgScore: 81, maxScore: 100, minScore: 55, passCount: 22 },
    { attempts: 19, avgScore: 68, maxScore: 95, minScore: 40, passCount: 12 },
  ][i] ?? { attempts: 10, avgScore: 70, maxScore: 90, minScore: 50, passCount: 7 };
  return {
    examId: exam.id,
    examTitle: exam.title,
    passingScore: exam.passingScore,
    ...data,
  };
});

export default function AssessmentStats() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? mockResults
      : mockResults.filter((r) => r.examId === filter);

  const totals = {
    attempts: filtered.reduce((s, r) => s + r.attempts, 0),
    passCount: filtered.reduce((s, r) => s + r.passCount, 0),
    avgScore:
      filtered.length > 0
        ? Math.round(filtered.reduce((s, r) => s + r.avgScore, 0) / filtered.length)
        : 0,
  };
  const overallPassRate =
    totals.attempts > 0 ? Math.round((totals.passCount / totals.attempts) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">평가 점수 통계</h1>
        <button
          onClick={() => alert("CSV 내보내기 (시뮬레이션)")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={14} />
          내보내기
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "총 응시 수", value: totals.attempts, color: "text-slate-800" },
          { label: "합격 수", value: totals.passCount, color: "text-green-600" },
          { label: "전체 합격률", value: `${overallPassRate}%`, color: "text-violet-600" },
          { label: "평균 점수", value: `${totals.avgScore}점`, color: "text-blue-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">전체 시험</option>
          {examTemplates.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium">시험명</th>
              <th className="text-right px-4 py-3 font-medium">합격 기준</th>
              <th className="text-right px-4 py-3 font-medium">응시 수</th>
              <th className="text-right px-4 py-3 font-medium">평균</th>
              <th className="text-right px-4 py-3 font-medium">최고</th>
              <th className="text-right px-4 py-3 font-medium">최저</th>
              <th className="text-left px-4 py-3 font-medium w-48">합격률</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const passRate = Math.round((r.passCount / r.attempts) * 100);
              return (
                <tr
                  key={r.examId}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{r.examTitle}</td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {r.passingScore}점
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.attempts}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">
                    {r.avgScore}점
                  </td>
                  <td className="px-4 py-3 text-right text-green-600">{r.maxScore}점</td>
                  <td className="px-4 py-3 text-right text-red-500">{r.minScore}점</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            passRate >= 70 ? "bg-green-500" : "bg-orange-400"
                          }`}
                          style={{ width: `${passRate}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium w-9 text-right ${
                          passRate >= 70 ? "text-green-600" : "text-orange-500"
                        }`}
                      >
                        {passRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          총 {filtered.length}개 시험
        </div>
      </div>
    </div>
  );
}
