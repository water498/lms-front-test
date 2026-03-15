"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { type ActivityType } from "../mockData";

const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: string; desc: string }[] = [
  { value: "VIDEO",      label: "영상 강의",  icon: "📹", desc: "MP4 / HLS 스트리밍" },
  { value: "SCORM",      label: "SCORM",      icon: "📄", desc: "SCORM 1.2 / 2004 패키지" },
  { value: "QUIZ",       label: "퀴즈",       icon: "📝", desc: "객관식·단답형 문항" },
  { value: "ASSIGNMENT", label: "과제",       icon: "📋", desc: "파일 제출 or 텍스트 입력" },
  { value: "LIVE",       label: "라이브",     icon: "🎥", desc: "실시간 화상 강의 링크" },
];

interface Props {
  subjectTitle: string;
  onClose: () => void;
}

export default function AddActivityModal({ subjectTitle, onClose }: Props) {
  const [selectedType, setSelectedType] = useState<ActivityType>("VIDEO");
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-slate-800">활동 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">{subjectTitle}</p>

        <div className="grid grid-cols-1 gap-2 mb-4">
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

        <div className="mb-5">
          <label className="text-xs font-medium text-slate-600 mb-1 block">제목</label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="활동 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
