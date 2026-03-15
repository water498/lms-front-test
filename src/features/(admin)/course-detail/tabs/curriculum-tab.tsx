"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, GripVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { type Subject, type Activity, type ActivityType } from "../mockData";
import AddActivityModal from "../modals/add-activity-modal";

const ACTIVITY_ICON: Record<ActivityType, string> = {
  VIDEO:      "📹",
  SCORM:      "📄",
  QUIZ:       "📝",
  ASSIGNMENT: "📋",
  LIVE:       "🎙️",
};

const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  VIDEO:      "영상",
  SCORM:      "SCORM",
  QUIZ:       "시험",
  ASSIGNMENT: "과제",
  LIVE:       "라이브",
};

function ActivityRow({ activity }: { activity: Activity }) {
  const meta =
    activity.duration
      ? `${activity.duration}분`
      : activity.questionCount
      ? `${activity.questionCount}문항`
      : "";

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 group rounded-lg">
      <GripVertical size={14} className="text-slate-300 cursor-grab flex-shrink-0" />
      <span className="text-base flex-shrink-0">{ACTIVITY_ICON[activity.type]}</span>
      <span className="flex-1 text-sm text-slate-700">{activity.title}</span>
      <span className="text-xs text-slate-400">
        {ACTIVITY_TYPE_LABEL[activity.type]}{meta ? ` · ${meta}` : ""}
      </span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 text-slate-400 hover:text-violet-600 rounded">
          <Pencil size={13} />
        </button>
        <button className="p-1 text-slate-400 hover:text-red-500 rounded">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function SubjectAccordion({
  subject,
  index,
}: {
  subject: Subject;
  index: number;
}) {
  const [open, setOpen] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Subject header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <GripVertical size={15} className="text-slate-300 cursor-grab flex-shrink-0" />
        {open ? (
          <ChevronDown size={15} className="text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronRight size={15} className="text-slate-500 flex-shrink-0" />
        )}
        <span className="text-sm font-semibold text-slate-700">
          {index + 1}. {subject.title}
        </span>
        <span className="text-xs text-slate-400 ml-1">{subject.activities.length}개 활동</span>
        <div className="ml-auto flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button className="p-1 text-slate-400 hover:text-violet-600 rounded">
            <Pencil size={13} />
          </button>
          <button className="p-1 text-slate-400 hover:text-red-500 rounded">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-2 py-1">
          {subject.activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
          <button
            onClick={() => setShowAddActivity(true)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors mt-1"
          >
            <Plus size={14} />
            활동 추가
          </button>
        </div>
      )}

      {showAddActivity && (
        <AddActivityModal
          subjectTitle={subject.title}
          onClose={() => setShowAddActivity(false)}
        />
      )}
    </div>
  );
}

export default function CurriculumTab({ subjects }: { subjects: Subject[] }) {
  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {subjects.map((subject, i) => (
        <SubjectAccordion key={subject.id} subject={subject} index={i} />
      ))}
      <button className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 hover:text-violet-600 border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-xl transition-colors">
        <Plus size={15} />
        과목 추가
      </button>
    </div>
  );
}
