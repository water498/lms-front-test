"use client";

import { useState } from "react";
import { BookOpen, ClipboardList } from "lucide-react";
import { getActivityCompletions, getExamAttempts } from "../session-layout/mockData";

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}초`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}분 ${s}초` : `${m}분`;
}

interface Props {
  sessionId: string;
}

export default function LearningHistoryTab({ sessionId }: Props) {
  const completions = getActivityCompletions(sessionId);
  const attempts = getExamAttempts(sessionId);

  const learnerNames = Array.from(new Set(completions.map((c) => c.learnerName)));
  const [completionFilter, setCompletionFilter] = useState<"all" | string>("all");

  const filteredCompletions =
    completionFilter === "all"
      ? completions
      : completions.filter((c) => c.learnerName === completionFilter);

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* ── 레슨 완료 이력 ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-violet-500" />
            <h3 className="text-sm font-semibold text-slate-700">레슨 완료 이력</h3>
            <span className="text-xs text-slate-400">({completions.length}건)</span>
          </div>
          {learnerNames.length > 1 && (
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="all">전체 학습자</option>
              {learnerNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}
        </div>

        {completions.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-400">
            레슨 완료 기록이 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-2.5 font-medium">학습자</th>
                  <th className="text-left px-4 py-2.5 font-medium">레슨명</th>
                  <th className="text-left px-4 py-2.5 font-medium">완료일시</th>
                  <th className="text-right px-4 py-2.5 font-medium">학습시간</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompletions.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-slate-700">{c.learnerName}</td>
                    <td className="px-4 py-2.5 text-slate-600">{c.activityTitle}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs tabular-nums whitespace-nowrap">{c.completedAt}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500 text-xs tabular-nums">{formatDuration(c.durationSec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCompletions.length > 0 && (
              <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-400">
                총 {filteredCompletions.length}건
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 시험 응시 기록 ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-700">시험 응시 기록</h3>
          <span className="text-xs text-slate-400">({attempts.length}건)</span>
        </div>

        {attempts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-400">
            시험 응시 기록이 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-2.5 font-medium">학습자</th>
                  <th className="text-left px-4 py-2.5 font-medium">시험명</th>
                  <th className="text-right px-4 py-2.5 font-medium">점수</th>
                  <th className="text-left px-4 py-2.5 font-medium">결과</th>
                  <th className="text-left px-4 py-2.5 font-medium">제출일시</th>
                  <th className="text-right px-4 py-2.5 font-medium">소요시간</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-slate-700">{a.learnerName}</td>
                    <td className="px-4 py-2.5 text-slate-600">{a.examTitle}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`font-semibold tabular-nums ${a.passed ? "text-emerald-600" : "text-red-500"}`}>
                        {a.score}점
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        a.passed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {a.passed ? "합격" : "불합격"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs tabular-nums whitespace-nowrap">{a.submittedAt}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500 text-xs tabular-nums">
                      {a.durationSec ? formatDuration(a.durationSec) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attempts.length > 0 && (
              <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-400">
                총 {attempts.length}건
                {attempts.filter((a) => a.passed).length > 0 && (
                  <span className="ml-3 text-emerald-600">
                    합격 {attempts.filter((a) => a.passed).length}건
                  </span>
                )}
                {attempts.filter((a) => !a.passed).length > 0 && (
                  <span className="ml-2 text-red-500">
                    불합격 {attempts.filter((a) => !a.passed).length}건
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
