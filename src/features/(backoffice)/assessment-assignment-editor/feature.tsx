"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { type AssignmentTemplate, type SubmissionType, type AssignmentRubricItem, assignmentTemplates } from "../assessments/mockData";
import RichEditor from "../shared/rich-editor";

const SUBMISSION_LABELS: Record<SubmissionType, string> = {
  FILE: "파일 업로드",
  TEXT: "텍스트 입력",
  BOTH: "파일 + 텍스트",
};

type Section = "instructions" | "rubric";

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: "instructions", label: "과제 설명", icon: "📄" },
  { id: "rubric",       label: "채점 루브릭", icon: "📊" },
];

function makeId() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function defaultAssignment(): Omit<AssignmentTemplate, "id" | "usageCount" | "createdAt"> {
  return { title: "", instructions: "", submissionType: "FILE", passingScore: null, rubric: [] };
}

interface Props { assignmentId: string }

export default function AssignmentEditorFeature({ assignmentId }: Props) {
  const found = assignmentId === "new" ? null : assignmentTemplates.find((a) => a.id === assignmentId);
  const src = found ?? defaultAssignment();

  const [title, setTitle]                   = useState(src.title);
  const [submissionType, setSubmissionType] = useState<SubmissionType>(src.submissionType);
  const [instructions, setInstructions]     = useState(src.instructions);
  const [rubric, setRubric]                 = useState<AssignmentRubricItem[]>(src.rubric);
  const [section, setSection]               = useState<Section>("instructions");
  const [gradingEnabled, setGradingEnabled] = useState<boolean>(src.passingScore != null);
  const [passingScore, setPassingScore]     = useState<number>(src.passingScore ?? 60);

  const totalPoints = rubric.reduce((sum, r) => sum + r.points, 0);

  function toggleGrading(enabled: boolean) {
    setGradingEnabled(enabled);
    if (!enabled && section === "rubric") setSection("instructions");
  }

  const visibleSections = gradingEnabled ? SECTIONS : SECTIONS.filter((s) => s.id !== "rubric");

  function addAssignmentRubricItem() {
    setRubric((r) => [...r, { id: makeId(), criteria: "", points: 0, order: r.length + 1 }]);
  }

  function updateAssignmentRubricItem(id: string, patch: Partial<AssignmentRubricItem>) {
    setRubric((r) => r.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function deleteAssignmentRubricItem(id: string) {
    setRubric((r) => r.filter((item) => item.id !== id));
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      {/* ── Top bar ── */}
      <div className="h-14 border-b border-slate-200 flex items-center gap-4 px-5 flex-shrink-0">
        <Link
          href="/backoffice/resources/assessments/assignments"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={15} />
          평가 관리
        </Link>
        <div className="w-px h-4 bg-slate-200" />
        <input
          className="flex-1 max-w-sm text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent focus:border-violet-400 focus:outline-none px-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="과제 제목"
        />
        {gradingEnabled && <span className="ml-auto text-xs text-slate-400">총 {totalPoints}점</span>}
        <button className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left — section list */}
        <aside className="w-60 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">섹션</p>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {visibleSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  section === s.id ? "bg-violet-50" : "hover:bg-slate-50"
                }`}
              >
                <span className="text-base">{s.icon}</span>
                <span className={`text-sm font-medium ${section === s.id ? "text-violet-700" : "text-slate-600"}`}>
                  {s.label}
                </span>
                {s.id === "rubric" && rubric.length > 0 && (
                  <span className="ml-auto text-[11px] text-slate-400">{rubric.length}항목</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Center — editing canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-10">
          <div className="max-w-2xl mx-auto">

            {section === "instructions" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700">과제 설명</h3>
                  <p className="text-xs text-slate-400 mt-0.5">학습자에게 보여질 과제 안내문을 작성하세요</p>
                </div>
                <div className="p-6">
                  <RichEditor
                    value={instructions}
                    onChange={setInstructions}
                    placeholder="과제 설명을 입력하세요..."
                    minHeight="240px"
                  />
                </div>
              </div>
            )}

            {section === "rubric" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">채점 루브릭</h3>
                    <p className="text-xs text-slate-400 mt-0.5">각 항목의 배점을 설정하세요</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    총 <span className="text-violet-600">{totalPoints}</span>점
                  </span>
                </div>

                {rubric.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <p className="text-sm text-slate-400">루브릭 항목이 없습니다</p>
                    <button
                      onClick={addAssignmentRubricItem}
                      className="px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                    >
                      + 항목 추가
                    </button>
                  </div>
                ) : (
                  <>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-400 border-b border-slate-100">
                          <th className="text-left px-6 py-3 font-medium">평가 항목</th>
                          <th className="text-right px-4 py-3 font-medium w-28">배점 (점)</th>
                          <th className="w-12" />
                        </tr>
                      </thead>
                      <tbody>
                        {rubric.map((item) => (
                          <tr key={item.id} className="border-b border-slate-50 last:border-0">
                            <td className="px-6 py-2.5">
                              <input
                                className="w-full text-sm text-slate-700 bg-transparent focus:outline-none placeholder:text-slate-300 border-b border-transparent focus:border-violet-300 pb-0.5"
                                placeholder="평가 항목명"
                                value={item.criteria}
                                onChange={(e) => updateAssignmentRubricItem(item.id, { criteria: e.target.value })}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <input
                                type="number"
                                className="w-full text-right text-sm text-slate-700 bg-transparent focus:outline-none border-b border-transparent focus:border-violet-300 pb-0.5"
                                value={item.points}
                                min={0}
                                onChange={(e) => updateAssignmentRubricItem(item.id, { points: Number(e.target.value) })}
                              />
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                onClick={() => deleteAssignmentRubricItem(item.id)}
                                className="text-slate-300 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-6 py-3 border-t border-slate-100">
                      <button
                        onClick={addAssignmentRubricItem}
                        className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        <Plus size={13} /> 항목 추가
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right — settings */}
        <aside className="w-64 border-l border-slate-200 overflow-y-auto bg-white flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">과제 설정</p>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">제출 방식</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
              >
                {(Object.entries(SUBMISSION_LABELS) as [SubmissionType, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-500">채점 여부</label>
                <button
                  onClick={() => toggleGrading(!gradingEnabled)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${gradingEnabled ? "bg-violet-600" : "bg-slate-200"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${gradingEnabled ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                {gradingEnabled ? "점수 기준 합격 여부 결정" : "제출만으로 완료 처리"}
              </p>
            </div>

            {gradingEnabled && (
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">합격 기준</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={passingScore}
                    min={0} max={100}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">%</span>
                </div>
              </div>
            )}

            {gradingEnabled && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-1">루브릭 총점</p>
                <p className="text-3xl font-bold text-slate-800">
                  {totalPoints}
                  <span className="text-sm font-normal text-slate-400 ml-1">점</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">{rubric.length}개 항목</p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
