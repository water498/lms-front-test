"use client";

import { useState } from "react";
import { Check, FileText, MessageSquareText } from "lucide-react";

// ── 과제 채점 Mock ──
interface SubmissionItem {
  id: string;
  userId: string;
  name: string;
  assignmentTitle: string;
  submittedAt: string;
  grade: number | null;
  feedback: string | null;
  gradedAt?: string;
}

// ── 시험 주관식 채점 Mock ──
interface EssayAnswerItem {
  id: string;
  attemptId: string;
  learnerId: string;
  learnerName: string;
  examTitle: string;
  questionTitle: string;
  textAnswer: string;
  gradedScore: number | null;
  gradeFeedback: string | null;
  gradedAt?: string;
}

const mockSubmissions: Record<string, SubmissionItem[]> = {
  se2: [
    { id: "sub1", userId: "u7", name: "박지호", assignmentTitle: "현장 적용 실습 과제", submittedAt: "2025-02-10T14:00", grade: 95, feedback: "위험 요소를 체계적으로 식별했습니다.", gradedAt: "2025-02-12" },
    { id: "sub2", userId: "u8", name: "최유진", assignmentTitle: "현장 적용 실습 과제", submittedAt: "2025-02-11T16:30", grade: null, feedback: null },
    { id: "sub3", userId: "u7", name: "박지호", assignmentTitle: "비상대응 시뮬레이션 과제", submittedAt: "2025-02-14T15:30", grade: 88, feedback: "비상 시나리오 대응이 정확합니다.", gradedAt: "2025-02-16" },
    { id: "sub4", userId: "u8", name: "최유진", assignmentTitle: "비상대응 시뮬레이션 과제", submittedAt: "2025-02-15T11:00", grade: null, feedback: null },
  ],
};

const mockEssayAnswers: Record<string, EssayAnswerItem[]> = {
  se1: [
    { id: "ea-e1", attemptId: "ea1", learnerId: "u19", learnerName: "신재호", examTitle: "종합 평가 시험", questionTitle: "안전보건관리체계 구축 시 경영책임자의 역할을 서술하시오", textAnswer: "경영책임자는 안전보건 경영방침을 수립하고, 안전보건관리체계의 구축 및 이행에 필요한 인력과 예산을 확보해야 합니다. 또한 안전보건 전담 조직을 설치하고 유해·위험요인 확인 및 개선 절차를 마련해야 합니다.", gradedScore: 9, gradeFeedback: "핵심 내용을 정확히 기술했습니다.", gradedAt: "2025-02-26" },
    { id: "ea-e2", attemptId: "ea2", learnerId: "u18", learnerName: "권나연", examTitle: "종합 평가 시험", questionTitle: "안전보건관리체계 구축 시 경영책임자의 역할을 서술하시오", textAnswer: "경영책임자는 안전에 대한 관심을 가지고 직원들의 안전을 위해 노력해야 합니다.", gradedScore: null, gradeFeedback: null },
    { id: "ea-e3", attemptId: "ea3", learnerId: "u17", learnerName: "장도윤", examTitle: "종합 평가 시험", questionTitle: "안전보건관리체계 구축 시 경영책임자의 역할을 서술하시오", textAnswer: "중대재해처벌법에 따라 경영책임자는 안전보건 확보 의무를 지며, 안전보건관리체계 구축, 재해 예방에 필요한 인력·예산 확보, 안전보건관리 전담 조직 설치 등의 의무를 이행해야 합니다. 위반 시 1년 이상의 징역 또는 10억원 이하의 벌금에 처해집니다.", gradedScore: null, gradeFeedback: null },
  ],
};

type GradingSection = "assignments" | "essays";

interface Props {
  sessionId: string;
}

export default function AdminGradingTab({ sessionId }: Props) {
  const [section, setSection] = useState<GradingSection>("assignments");
  const [submissions, setSubmissions] = useState(mockSubmissions[sessionId] ?? []);
  const [essayAnswers, setEssayAnswers] = useState(mockEssayAnswers[sessionId] ?? []);
  const [editing, setEditing] = useState<Record<string, { grade: string; feedback: string }>>({});

  const ungradedSubs = submissions.filter((s) => s.grade === null).length;
  const ungradedEssays = essayAnswers.filter((e) => e.gradedScore === null).length;

  // ── Assignment grading ──
  function startEdit(id: string, grade: number | null, feedback: string | null) {
    setEditing((prev) => ({
      ...prev,
      [id]: { grade: grade !== null ? String(grade) : "", feedback: feedback ?? "" },
    }));
  }

  function cancelEdit(id: string) {
    setEditing((prev) => { const next = { ...prev }; delete next[id]; return next; });
  }

  function saveAssignmentGrade(id: string) {
    const e = editing[id];
    if (!e) return;
    const gradeNum = e.grade === "" ? null : Number(e.grade);
    if (e.grade !== "" && (isNaN(gradeNum!) || gradeNum! < 0 || gradeNum! > 100)) return;
    setSubmissions((prev) =>
      prev.map((s) => s.id === id ? { ...s, grade: gradeNum, feedback: e.feedback || null, gradedAt: new Date().toISOString() } : s)
    );
    cancelEdit(id);
  }

  function saveEssayGrade(id: string) {
    const e = editing[id];
    if (!e) return;
    const gradeNum = e.grade === "" ? null : Number(e.grade);
    if (e.grade !== "" && (isNaN(gradeNum!) || gradeNum! < 0 || gradeNum! > 10)) return;
    setEssayAnswers((prev) =>
      prev.map((a) => a.id === id ? { ...a, gradedScore: gradeNum, gradeFeedback: e.feedback || null, gradedAt: new Date().toISOString() } : a)
    );
    cancelEdit(id);
  }

  const totalUngraded = ungradedSubs + ungradedEssays;

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      {/* Section toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSection("assignments")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            section === "assignments"
              ? "bg-violet-100 text-violet-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <FileText size={14} />
          과제 채점
          {ungradedSubs > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">{ungradedSubs}</span>
          )}
        </button>
        <button
          onClick={() => setSection("essays")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            section === "essays"
              ? "bg-violet-100 text-violet-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <MessageSquareText size={14} />
          시험 주관식 채점
          {ungradedEssays > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">{ungradedEssays}</span>
          )}
        </button>
        <div className="ml-auto">
          {totalUngraded > 0 ? (
            <span className="text-xs text-red-500 font-medium">미채점 총 {totalUngraded}건</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Check size={12} /> 전체 채점 완료
            </span>
          )}
        </div>
      </div>

      {/* Assignment section */}
      {section === "assignments" && (
        submissions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">제출된 과제가 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">수강생</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">과제</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">제출</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-slate-500">점수</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">피드백</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => {
                const isEditing = !!editing[sub.id];
                const e = editing[sub.id];
                return (
                  <tr key={sub.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold">{sub.name[0]}</div>
                        <span className="text-slate-700">{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{sub.assignmentTitle}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{sub.submittedAt.replace("T", " ")}</td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input type="number" min={0} max={100} value={e.grade}
                          onChange={(ev) => setEditing((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], grade: ev.target.value } }))}
                          className="w-16 border border-slate-300 text-slate-700 text-xs rounded px-2 py-1 text-center focus:outline-none focus:border-violet-500"
                        />
                      ) : sub.grade !== null ? (
                        <span className={`font-semibold ${sub.grade >= 90 ? "text-emerald-600" : sub.grade >= 70 ? "text-slate-700" : "text-amber-600"}`}>{sub.grade}</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-medium">미채점</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {isEditing ? (
                        <input type="text" value={e.feedback}
                          onChange={(ev) => setEditing((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], feedback: ev.target.value } }))}
                          placeholder="피드백 입력..." className="w-full border border-slate-300 text-slate-700 text-xs rounded px-2 py-1 focus:outline-none focus:border-violet-500 placeholder-slate-400"
                        />
                      ) : (
                        <p className="text-xs text-slate-400 line-clamp-2">{sub.feedback ?? "—"}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => saveAssignmentGrade(sub.id)} className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded transition-colors">저장</button>
                          <button onClick={() => cancelEdit(sub.id)} className="px-2.5 py-1 border border-slate-300 text-slate-500 text-xs rounded hover:bg-slate-50 transition-colors">취소</button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(sub.id, sub.grade, sub.feedback)} className="px-2.5 py-1 text-xs text-slate-500 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                          {sub.grade !== null ? "수정" : "채점"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}

      {/* Essay section */}
      {section === "essays" && (
        essayAnswers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">주관식 답안이 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {essayAnswers.map((item) => {
              const isEditing = !!editing[item.id];
              const e = editing[item.id];
              return (
                <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold">{item.learnerName[0]}</div>
                      <span className="text-sm font-medium text-slate-700">{item.learnerName}</span>
                      <span className="text-xs text-slate-400">· {item.examTitle}</span>
                    </div>
                    {item.gradedScore !== null ? (
                      <span className="text-xs font-semibold text-emerald-600">{item.gradedScore}점</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-medium">미채점</span>
                    )}
                  </div>
                  {/* Question + Answer */}
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium text-slate-500 mb-1">{item.questionTitle}</p>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {item.textAnswer}
                    </div>
                  </div>
                  {/* Grading */}
                  <div className="px-4 py-3 border-t border-slate-100">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <label className="text-xs text-slate-500 w-12">점수</label>
                          <input type="number" min={0} max={10} value={e.grade}
                            onChange={(ev) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], grade: ev.target.value } }))}
                            className="w-16 border border-slate-300 text-sm rounded px-2 py-1 text-center focus:outline-none focus:border-violet-500"
                          />
                          <span className="text-xs text-slate-400">/ 10</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <label className="text-xs text-slate-500 w-12 mt-1.5">피드백</label>
                          <textarea value={e.feedback}
                            onChange={(ev) => setEditing((prev) => ({ ...prev, [item.id]: { ...prev[item.id], feedback: ev.target.value } }))}
                            placeholder="채점 피드백..." rows={2}
                            className="flex-1 border border-slate-300 text-sm rounded px-2 py-1.5 resize-none focus:outline-none focus:border-violet-500 placeholder-slate-400"
                          />
                        </div>
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => saveEssayGrade(item.id)} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded transition-colors">저장</button>
                          <button onClick={() => cancelEdit(item.id)} className="px-3 py-1.5 border border-slate-300 text-slate-500 text-xs rounded hover:bg-slate-50 transition-colors">취소</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">{item.gradeFeedback ?? "피드백 없음"}</p>
                        <button onClick={() => startEdit(item.id, item.gradedScore, item.gradeFeedback)}
                          className="px-2.5 py-1 text-xs text-slate-500 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
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
    </div>
  );
}
