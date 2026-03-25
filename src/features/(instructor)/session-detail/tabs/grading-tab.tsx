"use client";

import { useState } from "react";
import { Check, FileText } from "lucide-react";
import { submissionsBySession, type SubmissionMock } from "../../shared/mockData";

export default function GradingTab({ sessionId }: { sessionId: string }) {
  const initial = submissionsBySession[sessionId] ?? [];
  const [submissions, setSubmissions] = useState<SubmissionMock[]>(initial);
  const [editing, setEditing] = useState<Record<string, { grade: string; feedback: string }>>({});

  const startEdit = (sub: SubmissionMock) => {
    setEditing((prev) => ({
      ...prev,
      [sub.id]: {
        grade: sub.grade !== null ? String(sub.grade) : "",
        feedback: sub.feedback ?? "",
      },
    }));
  };

  const cancelEdit = (id: string) => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveGrade = (id: string) => {
    const e = editing[id];
    if (!e) return;
    const gradeNum = e.grade === "" ? null : Number(e.grade);
    if (e.grade !== "" && (isNaN(gradeNum!) || gradeNum! < 0 || gradeNum! > 100)) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, grade: gradeNum, feedback: e.feedback || null, gradedAt: new Date().toISOString() }
          : s
      )
    );
    cancelEdit(id);
  };

  const ungraded = submissions.filter((s) => s.grade === null).length;

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <p className="text-sm">제출된 과제가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* 헤더 요약 */}
      <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-4">
        <span className="text-xs text-zinc-400">전체 {submissions.length}건</span>
        {ungraded > 0 && (
          <span className="inline-flex px-2 py-0.5 bg-red-500/15 text-red-400 text-xs font-medium rounded-full">
            미채점 {ungraded}건
          </span>
        )}
        {ungraded === 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs font-medium rounded-full">
            <Check size={10} />
            전체 채점 완료
          </span>
        )}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">수강생</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">과제</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">제출 시각</th>
            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500">점수</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">피드백</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => {
            const isEditing = !!editing[sub.id];
            const e = editing[sub.id];
            return (
              <tr key={sub.id} className="border-b border-zinc-800/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {sub.name[0]}
                    </div>
                    <span className="text-zinc-200">{sub.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                    <FileText size={12} />
                    <span>{sub.assignmentTitle}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-zinc-500 text-xs">
                  {sub.submittedAt.replace("T", " ")}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={e.grade}
                      onChange={(ev) =>
                        setEditing((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], grade: ev.target.value } }))
                      }
                      className="w-16 bg-zinc-800 border border-zinc-600 text-white text-xs rounded px-2 py-1 text-center focus:outline-none focus:border-violet-500"
                    />
                  ) : sub.grade !== null ? (
                    <span className={`font-semibold ${sub.grade >= 90 ? "text-emerald-400" : sub.grade >= 70 ? "text-white" : "text-amber-400"}`}>
                      {sub.grade}
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 bg-red-500/15 text-red-400 text-xs font-medium rounded-full">
                      미채점
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 max-w-[240px]">
                  {isEditing ? (
                    <input
                      type="text"
                      value={e.feedback}
                      onChange={(ev) =>
                        setEditing((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], feedback: ev.target.value } }))
                      }
                      placeholder="피드백 입력..."
                      className="w-full bg-zinc-800 border border-zinc-600 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-violet-500 placeholder-zinc-600"
                    />
                  ) : (
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {sub.feedback ?? "—"}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => saveGrade(sub.id)}
                        className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => cancelEdit(sub.id)}
                        className="px-2.5 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium rounded transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(sub)}
                      className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
                    >
                      {sub.grade !== null ? "수정" : "채점"}
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
