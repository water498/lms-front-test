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
      <div className="text-center py-12 text-zinc-500">
        <p className="text-sm">제출된 과제 및 주관식 답안이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Section toggle + 헤더 요약 */}
      <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-3">
        <button onClick={() => setSection("assignments")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${section === "assignments" ? "bg-violet-500/20 text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}>
          <FileText size={12} />
          과제 {ungradedSubs > 0 && <span className="px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded-full text-[10px]">{ungradedSubs}</span>}
        </button>
        <button onClick={() => setSection("essays")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${section === "essays" ? "bg-violet-500/20 text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}>
          <MessageSquareText size={12} />
          주관식 {ungradedEssays > 0 && <span className="px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded-full text-[10px]">{ungradedEssays}</span>}
        </button>
        <div className="ml-auto">
          {totalUngraded > 0 ? (
            <span className="text-xs text-red-400 font-medium">미채점 {totalUngraded}건</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium"><Check size={10} /> 전체 채점 완료</span>
          )}
        </div>
      </div>

      {/* Essay section */}
      {section === "essays" && (
        essayAnswers.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">주관식 답안이 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-3 p-5">
            {essayAnswers.map((item) => {
              const isEditing = !!editing[item.id];
              const e = editing[item.id];
              return (
                <div key={item.id} className="border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold">{item.learnerName[0]}</div>
                      <span className="text-sm text-zinc-200">{item.learnerName}</span>
                      <span className="text-xs text-zinc-500">· {item.examTitle}</span>
                    </div>
                    {item.gradedScore !== null ? (
                      <span className="text-xs font-semibold text-emerald-400">{item.gradedScore}점</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-red-500/15 text-red-400 rounded-full font-medium">미채점</span>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-zinc-500 mb-1">{item.questionTitle}</p>
                    <div className="bg-zinc-800/50 rounded-lg px-3 py-2.5 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{item.textAnswer}</div>
                  </div>
                  <div className="px-4 py-3 border-t border-zinc-800">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <label className="text-xs text-zinc-500 w-12">점수</label>
                          <input type="number" min={0} max={10} value={e.grade}
                            onChange={(ev) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], grade: ev.target.value } }))}
                            className="w-16 bg-zinc-800 border border-zinc-600 text-sm text-white rounded px-2 py-1 text-center focus:outline-none focus:border-violet-500" />
                          <span className="text-xs text-zinc-500">/ 10</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <label className="text-xs text-zinc-500 w-12 mt-1.5">피드백</label>
                          <textarea value={e.feedback}
                            onChange={(ev) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], feedback: ev.target.value } }))}
                            placeholder="채점 피드백..." rows={2}
                            className="flex-1 bg-zinc-800 border border-zinc-600 text-sm text-white rounded px-2 py-1.5 resize-none focus:outline-none focus:border-violet-500 placeholder-zinc-600" />
                        </div>
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => saveEssayGrade(item.id)} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded transition-colors">저장</button>
                          <button onClick={() => cancelEdit(item.id)} className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium rounded transition-colors">취소</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-400">{item.gradeFeedback ?? "피드백 없음"}</p>
                        <button onClick={() => setEditing((prev) => ({ ...prev, [item.id]: { grade: item.gradedScore !== null ? String(item.gradedScore) : "", feedback: item.gradeFeedback ?? "" } }))}
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors">
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
        <div className="py-12 text-center text-zinc-500 text-sm">제출된 과제가 없습니다.</div>
      ) : section === "assignments" && (
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
      )}
    </div>
  );
}
