"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronLeft, Upload, ExternalLink } from "lucide-react";
import { type ActivityType } from "../mockData";
import { mediaAssets } from "../../media/mockData";
import { examTemplates, assignmentTemplates } from "../../assessments/mockData";

const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: string; desc: string }[] = [
  { value: "VIDEO",      label: "영상 강의",  icon: "📹", desc: "MP4 / HLS 스트리밍" },
  { value: "SCORM",      label: "SCORM",      icon: "📄", desc: "SCORM 1.2 / 2004 패키지" },
  { value: "QUIZ",       label: "시험",       icon: "📝", desc: "객관식·단답형 문항" },
  { value: "ASSIGNMENT", label: "과제",       icon: "📋", desc: "파일 제출 or 텍스트 입력" },
  { value: "LIVE",       label: "라이브",     icon: "🎙️", desc: "실시간 화상 강의" },
];

const MEDIA_TYPES: ActivityType[] = ["VIDEO", "SCORM"];
const EXAM_TYPES: ActivityType[]  = ["QUIZ"];
const ASSIGN_TYPES: ActivityType[] = ["ASSIGNMENT"];

const MEDIA_TYPE_MAP: Record<"VIDEO" | "SCORM", string> = {
  VIDEO: "VIDEO",
  SCORM: "SCORM",
};

const SUBTYPE_LABELS: Record<string, string> = {
  SHORT: "단답 시험",
  FINAL: "최종 시험",
};

const SUBMISSION_LABELS: Record<string, string> = {
  FILE: "파일 업로드",
  TEXT: "텍스트 입력",
  BOTH: "파일 + 텍스트",
};

interface Props {
  subjectTitle: string;
  onClose: () => void;
}

export default function AddActivityModal({ subjectTitle, onClose }: Props) {
  const [step, setStep]                   = useState<1 | 2>(1);
  const [selectedType, setSelectedType]   = useState<ActivityType>("VIDEO");
  const [title, setTitle]                 = useState("");
  const [selectedMediaId, setSelectedMediaId]   = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId]     = useState<string | null>(null);
  const [selectedAssignId, setSelectedAssignId] = useState<string | null>(null);

  const needsMedia  = MEDIA_TYPES.includes(selectedType);
  const needsExam   = EXAM_TYPES.includes(selectedType);
  const needsAssign = ASSIGN_TYPES.includes(selectedType);

  const filteredMedia = needsMedia
    ? mediaAssets.filter((a) => a.assetType === MEDIA_TYPE_MAP[selectedType as "VIDEO" | "SCORM"] && a.status === "ACTIVE")
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 -ml-1">
                <ChevronLeft size={18} />
              </button>
            )}
            <h2 className="text-base font-semibold text-slate-800">활동 추가</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">{subjectTitle}</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                step === s ? "bg-violet-600 text-white" : step > s ? "bg-violet-200 text-violet-700" : "bg-slate-100 text-slate-400"
              }`}>
                {s}
              </div>
              <span className={`text-xs ${step === s ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                {s === 1 ? "유형 선택" : "내용 설정"}
              </span>
              {s < 2 && <span className="text-slate-200 text-xs">›</span>}
            </div>
          ))}
        </div>

        {/* Step 1: 타입 선택 */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 gap-2 mb-5">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                    selectedType === t.value
                      ? "border-violet-400 bg-violet-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${selectedType === t.value ? "text-violet-700" : "text-slate-700"}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-slate-400">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                취소
              </button>
              <button onClick={() => setStep(2)} className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
                다음
              </button>
            </div>
          </>
        )}

        {/* Step 2: 제목 + picker */}
        {step === 2 && (
          <>
            <div className="flex flex-col gap-4 mb-5">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">제목</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="활동 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* VIDEO / SCORM → 미디어 파일 picker */}
              {needsMedia && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">
                    미디어 파일 연결
                    <span className="text-slate-400 font-normal ml-1">(미디어 라이브러리에서 선택)</span>
                  </label>
                  {filteredMedia.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">라이브러리에 해당 유형의 파일이 없습니다.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                      {filteredMedia.map((f) => (
                        <label
                          key={f.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                            selectedMediaId === f.id ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input type="radio" name="mediaFile" value={f.id} checked={selectedMediaId === f.id} onChange={() => setSelectedMediaId(f.id)} className="sr-only" />
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 border-2 ${selectedMediaId === f.id ? "border-violet-600 bg-violet-600" : "border-slate-300"}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${selectedMediaId === f.id ? "text-violet-700 font-medium" : "text-slate-700"}`}>{f.displayName}</p>
                            <p className="text-xs text-slate-400">{f.size}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <button className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors">
                    <Upload size={13} />
                    새 파일 업로드
                  </button>
                </div>
              )}

              {/* QUIZ → 시험 템플릿 picker */}
              {needsExam && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">
                    시험 템플릿 연결
                    <span className="text-slate-400 font-normal ml-1">(평가 관리에서 선택)</span>
                  </label>
                  {examTemplates.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">등록된 시험 템플릿이 없습니다.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                      {examTemplates.map((e) => (
                        <label
                          key={e.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                            selectedExamId === e.id ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input type="radio" name="examTemplate" value={e.id} checked={selectedExamId === e.id} onChange={() => setSelectedExamId(e.id)} className="sr-only" />
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 border-2 ${selectedExamId === e.id ? "border-violet-600 bg-violet-600" : "border-slate-300"}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${selectedExamId === e.id ? "text-violet-700 font-medium" : "text-slate-700"}`}>{e.title}</p>
                            <p className="text-xs text-slate-400">
                              {SUBTYPE_LABELS[e.subType]} · {e.rules.reduce((s, r) => s + r.count, 0)}문항 · 통과 {e.passingScore}%
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/experiments/admin/assessments/exam/new"
                    className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors"
                  >
                    <ExternalLink size={13} />
                    새 시험 만들기
                  </Link>
                </div>
              )}

              {/* ASSIGNMENT → 과제 템플릿 picker */}
              {needsAssign && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-2 block">
                    과제 템플릿 연결
                    <span className="text-slate-400 font-normal ml-1">(평가 관리에서 선택)</span>
                  </label>
                  {assignmentTemplates.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">등록된 과제 템플릿이 없습니다.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                      {assignmentTemplates.map((a) => (
                        <label
                          key={a.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                            selectedAssignId === a.id ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input type="radio" name="assignTemplate" value={a.id} checked={selectedAssignId === a.id} onChange={() => setSelectedAssignId(a.id)} className="sr-only" />
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 border-2 ${selectedAssignId === a.id ? "border-violet-600 bg-violet-600" : "border-slate-300"}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${selectedAssignId === a.id ? "text-violet-700 font-medium" : "text-slate-700"}`}>{a.title}</p>
                            <p className="text-xs text-slate-400">
                              {SUBMISSION_LABELS[a.submissionType]} · 루브릭 {a.rubric.length}항목
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/experiments/admin/assessments/assignment/new"
                    className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors"
                  >
                    <ExternalLink size={13} />
                    새 과제 만들기
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                취소
              </button>
              <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
                추가
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
