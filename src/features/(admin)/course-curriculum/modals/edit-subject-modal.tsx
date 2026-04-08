"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CourseSubject, SubjectPhase } from "@/lib/models";

const PHASE_OPTIONS: { value: SubjectPhase; label: string }[] = [
  { value: "PRE", label: "사전 평가 (PRE)" },
  { value: "LEARNING", label: "학습 (LEARNING)" },
  { value: "POST", label: "사후 평가 (POST)" },
];

interface Props {
  subject: CourseSubject;
  courseMode: string; // ONLINE | OFFLINE | BLENDED
  onSave: (updated: Partial<CourseSubject> & { id: string }) => void;
  onClose: () => void;
}

export default function EditSubjectModal({ subject, courseMode, onSave, onClose }: Props) {
  const [title, setTitle] = useState(subject.title);
  const [phase, setPhase] = useState<SubjectPhase>(subject.phase);
  const [requiredDayNum, setRequiredDayNum] = useState(subject.requiredDayNum?.toString() ?? "");

  const isOfflineMode = courseMode === "OFFLINE" || courseMode === "BLENDED";

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      id: subject.id,
      title: title.trim(),
      phase,
      requiredDayNum: requiredDayNum ? Number(requiredDayNum) : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">과목 편집</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">과목명</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>

          {/* Phase */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">단계</label>
            <select
              value={phase} onChange={(e) => setPhase(e.target.value as SubjectPhase)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {PHASE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Required Day Num — only for OFFLINE/BLENDED */}
          {isOfflineMode && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                오프라인 회차 출석 요구
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} value={requiredDayNum}
                  onChange={(e) => setRequiredDayNum(e.target.value)}
                  placeholder="미설정"
                  className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <span className="text-xs text-slate-400">회차 출석 시 접근 가능</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                비워두면 출석 제한 없이 접근 가능합니다.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
            취소
          </button>
          <button onClick={handleSave} disabled={!title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
