"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CourseActivity } from "@/lib/models";

const TYPE_LABEL: Record<string, string> = {
  VIDEO: "영상",
  SCORM: "SCORM",
  QUIZ: "시험",
  ASSIGNMENT: "과제",
  SURVEY: "설문",
  OFFLINE: "오프라인",
};

interface Props {
  activity: CourseActivity;
  onSave: (updated: Partial<CourseActivity> & { id: string }) => void;
  onClose: () => void;
}

export default function EditActivityModal({ activity, onSave, onClose }: Props) {
  const [title, setTitle] = useState(activity.title);
  const [passRequired, setPassRequired] = useState(activity.passRequired ?? false);

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      id: activity.id,
      title: title.trim(),
      passRequired: activity.type === "QUIZ" ? passRequired : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">활동 편집</h2>
            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">
              {TYPE_LABEL[activity.type] ?? activity.type}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">활동명</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>

          {/* Pass required — QUIZ only */}
          {activity.type === "QUIZ" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={passRequired}
                onChange={(e) => setPassRequired(e.target.checked)}
                className="accent-violet-600"
              />
              <span className="text-sm text-slate-700">합격 필수 (수료 조건)</span>
            </label>
          )}

          {/* Type-specific info (read-only) */}
          {activity.type === "VIDEO" && activity.videoDurationMin && (
            <div className="text-xs text-slate-400">영상 길이: {activity.videoDurationMin}분</div>
          )}
          {activity.type === "OFFLINE" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-600">
              오프라인 강의/실습. 해당 회차 출석 시 자동으로 수강 완료 처리됩니다.
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
