"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronRight, GripVertical, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { type CourseSubject, type CourseActivity, type ActivityType } from "../mockData";
import { mediaAssets } from "../../media/mockData";
import AddActivityModal from "../modals/add-activity-modal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ACTIVITY_ICON: Record<ActivityType, string> = {
  VIDEO:      "📹",
  SCORM:      "📄",
  QUIZ:       "📝",
  ASSIGNMENT: "📋",
  SURVEY:     "📊",
};

const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  VIDEO:      "영상",
  SCORM:      "SCORM",
  QUIZ:       "시험",
  ASSIGNMENT: "과제",
  SURVEY:     "설문",
};

interface DeleteWarningDialogProps {
  enrolleeCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteWarningDialog({ enrolleeCount, onConfirm, onCancel }: DeleteWarningDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">운영 중인 과정입니다</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              현재 {enrolleeCount}명이 수강 중입니다. 활동을 삭제하면<br />
              신규 수강자에게 표시되지 않으며, 기존 수강생의<br />
              학습 기록은 유지됩니다.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

interface ActivityRowProps {
  activity: CourseActivity;
  hasOngoingSessions: boolean;
  enrolleeCount: number;
  onDelete: () => void;
}

function ActivityRow({ activity, hasOngoingSessions, enrolleeCount, onDelete }: ActivityRowProps) {
  const [showWarning, setShowWarning] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id });

  const asset = activity.mediaAssetId
    ? mediaAssets.find((a) => a.id === activity.mediaAssetId)
    : null;

  const meta =
    activity.duration
      ? `${activity.duration}분`
      : activity.questionCount
      ? `${activity.questionCount}문항`
      : "";

  function handleDeleteClick() {
    if (hasOngoingSessions) {
      setShowWarning(true);
    } else {
      onDelete();
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 group rounded-lg"
      >
        <GripVertical size={14} className="text-slate-300 cursor-grab flex-shrink-0" {...attributes} {...listeners} />
        <span className="text-base flex-shrink-0">{ACTIVITY_ICON[activity.type]}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm text-slate-700">{activity.title}</span>
          {asset && (
            <p className="text-xs text-slate-400 truncate">{asset.originalName}</p>
          )}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {ACTIVITY_TYPE_LABEL[activity.type]}{meta ? ` · ${meta}` : ""}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 text-slate-400 hover:text-violet-600 rounded">
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 text-slate-400 hover:text-red-500 rounded"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {showWarning && (
        <DeleteWarningDialog
          enrolleeCount={enrolleeCount}
          onConfirm={() => { setShowWarning(false); onDelete(); }}
          onCancel={() => setShowWarning(false)}
        />
      )}
    </>
  );
}

interface SubjectAccordionProps {
  subject: CourseSubject;
  index: number;
  hasOngoingSessions: boolean;
  enrolleeCount: number;
  onDelete: () => void;
  onAddActivity: (activity: CourseActivity) => void;
  onDeleteActivity: (activityId: string) => void;
}

function SubjectAccordion({
  subject,
  index,
  hasOngoingSessions,
  enrolleeCount,
  onDelete,
  onAddActivity,
  onDeleteActivity,
}: SubjectAccordionProps) {
  const [open, setOpen] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [localActivities, setLocalActivities] = useState(subject.activities);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: subject.id });

  const activitySensors = useSensors(useSensor(PointerSensor));

  function handleActivityDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalActivities((items) => {
        const oldIndex = items.findIndex((a) => a.id === active.id);
        const newIndex = items.findIndex((a) => a.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border border-slate-200 rounded-xl overflow-hidden"
    >
      {/* Subject header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <GripVertical size={15} className="text-slate-300 cursor-grab flex-shrink-0" {...attributes} {...listeners} />
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
          <button
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-red-500 rounded"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-2 py-1">
          <DndContext sensors={activitySensors} collisionDetection={closestCenter} onDragEnd={handleActivityDragEnd}>
            <SortableContext items={localActivities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              {localActivities.map((activity) => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  hasOngoingSessions={hasOngoingSessions}
                  enrolleeCount={enrolleeCount}
                  onDelete={() => onDeleteActivity(activity.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
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
          onAdd={(activity) => {
            onAddActivity(activity);
            setShowAddActivity(false);
          }}
          onClose={() => setShowAddActivity(false)}
        />
      )}
    </div>
  );
}

interface CurriculumTabProps {
  subjects: CourseSubject[];
  hasOngoingSessions: boolean;
  enrolleeCount: number;
  onAddSubject: (title: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddActivity: (subjectId: string, activity: CourseActivity) => void;
  onDeleteActivity: (subjectId: string, activityId: string) => void;
}

export default function CurriculumTab({
  subjects,
  hasOngoingSessions,
  enrolleeCount,
  onAddSubject,
  onDeleteSubject,
  onAddActivity,
  onDeleteActivity,
}: CurriculumTabProps) {
  const [addingSubject, setAddingSubject] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [localSubjects, setLocalSubjects] = useState(subjects);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  function commitNewSubject() {
    const trimmed = newSubjectTitle.trim();
    if (trimmed) onAddSubject(trimmed);
    setNewSubjectTitle("");
    setAddingSubject(false);
  }

  function handleSubjectDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalSubjects((items) => {
        const oldIndex = items.findIndex((s) => s.id === active.id);
        const newIndex = items.findIndex((s) => s.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSubjectDragEnd}>
        <SortableContext items={localSubjects.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {localSubjects.map((subject, i) => (
            <SubjectAccordion
              key={subject.id}
              subject={subject}
              index={i}
              hasOngoingSessions={hasOngoingSessions}
              enrolleeCount={enrolleeCount}
              onDelete={() => onDeleteSubject(subject.id)}
              onAddActivity={(activity) => onAddActivity(subject.id, activity)}
              onDeleteActivity={(activityId) => onDeleteActivity(subject.id, activityId)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {addingSubject ? (
        <div className="flex items-center gap-2 px-4 py-3 border-2 border-violet-300 rounded-xl bg-violet-50">
          <Plus size={15} className="text-violet-400 flex-shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            placeholder="과목 이름을 입력하세요"
            value={newSubjectTitle}
            onChange={(e) => setNewSubjectTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitNewSubject();
              if (e.key === "Escape") { setAddingSubject(false); setNewSubjectTitle(""); }
            }}
            onBlur={commitNewSubject}
          />
        </div>
      ) : (
        <button
          onClick={() => setAddingSubject(true)}
          className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 hover:text-violet-600 border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-xl transition-colors"
        >
          <Plus size={15} />
          과목 추가
        </button>
      )}
    </div>
  );
}
