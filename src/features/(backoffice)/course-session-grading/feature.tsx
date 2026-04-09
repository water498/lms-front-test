"use client";

import { useState } from "react";
import { Check, FileText, MessageSquareText } from "lucide-react";
import { submissionsBySession, type SubmissionMock } from "../shared/mockData";

// ── 시험 주관식 Mock ──
interface EssayAnswerItem {
  id: string;
  learnerName: string;
  examTitle: string;
  questionTitle: string;
  textAnswer: string;
  gradedScore: number | null;
  gradeFeedback: string | null;
}

const mockEssayAnswers: Record<string, EssayAnswerItem[]> = {
  se2: [
    { id: "iea1", learnerName: "김지수", examTitle: "개념 확인 퀴즈", questionTitle: "안전수칙의 핵심 원칙 3가지를 서술하시오", textAnswer: "1. 위험요소 사전 식별 및 제거\n2. 개인보호장구 의무 착용\n3. 비상대응 절차 숙지 및 훈련 참여", gradedScore: null, gradeFeedback: null },
    { id: "iea2", learnerName: "박현우", examTitle: "개념 확인 퀴즈", questionTitle: "안전수칙의 핵심 원칙 3가지를 서술하시오", textAnswer: "위험요소를 미리 파악하고 제거하는 것, 보호 장비를 착용하는 것, 비상 상황 시 대피 절차를 알고 실행하는 것이 핵심 원칙입니다.", gradedScore: 8, gradeFeedback: "정확합니다." },
  ],
};

type GradingSection = "assignments" | "essays";

export default function GradingTab({ sessionId }: { sessionId: string }) {
  const initial = submissionsBySession[sessionId] ?? [];
  const [submissions, setSubmissions] = useState<SubmissionMock[]>(initial);
  const [essayAnswers, setEssayAnswers] = useState<EssayAnswerItem[]>(mockEssayAnswers[sessionId] ?? []);
  const [section, setSection] = useState<GradingSection>("assignments");
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

  const ungradedSubs = submissions.filter((s) => s.grade === null).length;
  const ungradedEssays = essayAnswers.filter((e) => e.gradedScore === null).length;
  const totalUngraded = ungradedSubs + ungradedEssays;

  function saveEssayGrade(id: string) {
    const e = editing[id];
    if (!e) return;
    const gradeNum = e.grade === "" ? null : Number(e.grade);
    if (e.grade !== "" && (isNaN(gradeNum!) || gradeNum! < 0 || gradeNum! > 10)) return;
    setEssayAnswers((prev) =>
      prev.map((a) => a.id === id ? { ...a, gradedScore: gradeNum, gradeFeedback: e.feedback || null } : a)
    );
    cancelEdit(id);
  }

  if (submissions.length === 0 && essayAnswers.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">제출된 과제 및 주관식 답안이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Section toggle + 헤더 요약 */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-3">
        <button onClick={() => setSection("assignments")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${section === "assignments" ? "bg-violet-500/20 text-violet-600" : "text-slate-400 hover:text-slate-700"}`}>
          <FileText size={12} />
          과제 {ungradedSubs > 0 && <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px]">{ungradedSubs}</span>}
        </button>
        <button onClick={() => setSection("essays")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${section === "essays" ? "bg-violet-500/20 text-violet-600" : "text-slate-400 hover:text-slate-700"}`}>
          <MessageSquareText size={12} />
          주관식 {ungradedEssays > 0 && <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px]">{ungradedEssays}</span>}
        </button>
        <div className="ml-auto">
          {totalUngraded > 0 ? (
            <span className="text-xs text-red-600 font-medium">미채점 {totalUngraded}건</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><Check size={10} /> 전체 채점 완료</span>
          )}
        </div>
      </div>

      {/* Essay section */}
      {section === "essays" && (
        essayAnswers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">주관식 답안이 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-3 p-5">
            {essayAnswers.map((item) => {
              const isEditing = !!editing[item.id];
              const e = editing[item.id];
              return (
                <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 text-xs font-semibold">{item.learnerName[0]}</div>
                      <span className="text-sm text-slate-700">{item.learnerName}</span>
                      <span className="text-xs text-slate-400">· {item.examTitle}</span>
                    </div>
                    {item.gradedScore !== null ? (
                      <span className="text-xs font-semibold text-emerald-600">{item.gradedScore}점</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">미채점</span>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-400 mb-1">{item.questionTitle}</p>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.textAnswer}</div>
                  </div>
                  <div className="px-4 py-3 border-t border-slate-200">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <label className="text-xs text-slate-400 w-12">점수</label>
                          <input type="number" min={0} max={10} value={e.grade}
                            onChange={(ev) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], grade: ev.target.value } }))}
                            className="w-16 bg-slate-50 border border-slate-300 text-sm text-slate-900 rounded px-2 py-1 text-center focus:outline-none focus:border-violet-500" />
                          <span className="text-xs text-slate-400">/ 10</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <label className="text-xs text-slate-400 w-12 mt-1.5">피드백</label>
                          <textarea value={e.feedback}
                            onChange={(ev) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], feedback: ev.target.value } }))}
                            placeholder="채점 피드백..." rows={2}
                            className="flex-1 bg-slate-50 border border-slate-300 text-sm text-slate-900 rounded px-2 py-1.5 resize-none focus:outline-none focus:border-violet-500 placeholder-slate-400" />
                        </div>
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => saveEssayGrade(item.id)} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-slate-900 text-xs font-medium rounded transition-colors">저장</button>
                          <button onClick={() => cancelEdit(item.id)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded transition-colors">취소</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">{item.gradeFeedback ?? "피드백 없음"}</p>
                        <button onClick={() => setEditing((prev) => ({ ...prev, [item.id]: { grade: item.gradedScore !== null ? String(item.gradedScore) : "", feedback: item.gradeFeedback ?? "" } }))}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded transition-colors">
                          {item.gradedScore !== null ? "수정" : "채점"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Assignment section */}
      {section === "assignments" && submissions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">제출된 과제가 없습니다.</div>
      ) : section === "assignments" && (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">수강생</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">과제</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">제출 시각</th>
            <th className="text-center px-5 py-3 text-xs font-medium text-slate-400">점수</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">피드백</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => {
            const isEditing = !!editing[sub.id];
            const e = editing[sub.id];
            return (
              <tr key={sub.id} className="border-b border-slate-200/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 text-xs font-semibold shrink-0">
                      {sub.name[0]}
                    </div>
                    <span className="text-slate-700">{sub.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <FileText size={12} />
                    <span>{sub.assignmentTitle}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">
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
                      className="w-16 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-2 py-1 text-center focus:outline-none focus:border-violet-500"
                    />
                  ) : sub.grade !== null ? (
                    <span className={`font-semibold ${sub.grade >= 90 ? "text-emerald-600" : sub.grade >= 70 ? "text-slate-900" : "text-amber-600"}`}>
                      {sub.grade}
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
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
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-2 py-1 focus:outline-none focus:border-violet-500 placeholder-slate-400"
                    />
                  ) : (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {sub.feedback ?? "—"}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => saveGrade(sub.id)}
                        className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-slate-900 text-xs font-medium rounded transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => cancelEdit(sub.id)}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(sub)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded transition-colors"
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
      )}
    </div>
  );
}
