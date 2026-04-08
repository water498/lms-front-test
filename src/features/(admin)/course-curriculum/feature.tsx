"use client";

import { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Lock,
  Info,
} from "lucide-react";
import {
  type CourseSubject,
  type CourseActivity,
  type ActivityType,
} from "../course-layout/mockData";
import { type SubjectPhase } from "@/lib/models";
import { mediaAssets } from "../media/mockData";
import AddActivityModal from "./modals/add-activity-modal";
import EditSubjectModal from "./modals/edit-subject-modal";
import EditActivityModal from "./modals/edit-activity-modal";
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
  VIDEO: "📹",
  SCORM: "📄",
  QUIZ: "📝",
  ASSIGNMENT: "📋",
  SURVEY: "📊",
  OFFLINE: "🏫",
};

const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  VIDEO: "영상",
  SCORM: "SCORM",
  QUIZ: "시험",
  ASSIGNMENT: "과제",
  SURVEY: "설문",
  OFFLINE: "오프라인",
};

const PHASE_CONFIG: Record<
  SubjectPhase,
  { label: string; badgeClass: string; bgClass: string }
> = {
  PRE: {
    label: "사전 평가 (PRE)",
    badgeClass: "bg-amber-100 text-amber-700",
    bgClass: "bg-amber-50/40",
  },
  LEARNING: {
    label: "학습 (LEARNING)",
    badgeClass: "bg-violet-100 text-violet-700",
    bgClass: "bg-white",
  },
  POST: {
    label: "사후 평가 (POST)",
    badgeClass: "bg-emerald-100 text-emerald-700",
    bgClass: "bg-emerald-50/40",
  },
};

const PHASE_ORDER: SubjectPhase[] = ["PRE", "LEARNING", "POST"];

interface DeleteWarningDialogProps {
  enrolleeCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteWarningDialog({
  enrolleeCount,
  onConfirm,
  onCancel,
}: DeleteWarningDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              운영 중인 과정입니다
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              현재 {enrolleeCount}명이 수강 중입니다. 활동을 삭제하면
              <br />
              신규 수강자에게 표시되지 않으며, 기존 수강생의
              <br />
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
  onEdit: (updated: Partial<CourseActivity> & { id: string }) => void;
  onDelete: () => void;
}

function ActivityRow({
  activity,
  hasOngoingSessions,
  enrolleeCount,
  onEdit,
  onDelete,
}: ActivityRowProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const asset = activity.mediaAssetId
    ? mediaAssets.find((a) => a.id === activity.mediaAssetId)
    : null;

  const meta = activity.videoDurationMin
    ? `${activity.videoDurationMin}분`
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
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 group rounded-lg"
      >
        <GripVertical
          size={14}
          className={`flex-shrink-0 ${hasOngoingSessions ? "text-slate-200 cursor-default" : "text-slate-300 cursor-grab"}`}
          {...attributes}
          {...(hasOngoingSessions ? {} : listeners)}
        />
        <span className="text-base flex-shrink-0">
          {ACTIVITY_ICON[activity.type]}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-sm text-slate-700">{activity.title}</span>
          {asset && (
            <p className="text-xs text-slate-400 truncate">
              {asset.originalName}
            </p>
          )}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {ACTIVITY_TYPE_LABEL[activity.type]}
          {meta ? ` · ${meta}` : ""}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setShowEditModal(true)} className="p-1 text-slate-400 hover:text-violet-600 rounded">
            <Pencil size={13} />
          </button>
          <button
            onClick={hasOngoingSessions ? undefined : handleDeleteClick}
            disabled={hasOngoingSessions}
            className={`p-1 rounded ${hasOngoingSessions ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-red-500"}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {showWarning && !hasOngoingSessions && (
        <DeleteWarningDialog
          enrolleeCount={enrolleeCount}
          onConfirm={() => {
            setShowWarning(false);
            onDelete();
          }}
          onCancel={() => setShowWarning(false)}
        />
      )}

      {showEditModal && (
        <EditActivityModal
          activity={activity}
          onSave={(updated) => { onEdit(updated); setShowEditModal(false); }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}

interface SubjectAccordionProps {
  subject: CourseSubject;
  index: number;
  hasOngoingSessions: boolean;
  hasInstructor: boolean;
  enrolleeCount: number;
  courseMode: string;
  onDelete: () => void;
  onAddActivity: (activity: CourseActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onEditSubject: (updated: Partial<CourseSubject> & { id: string }) => void;
  onEditActivity: (updated: Partial<CourseActivity> & { id: string }) => void;
}

function SubjectAccordion({
  subject,
  index,
  hasOngoingSessions,
  hasInstructor,
  enrolleeCount,
  courseMode,
  onDelete,
  onAddActivity,
  onDeleteActivity,
  onEditSubject,
  onEditActivity,
}: SubjectAccordionProps) {
  const [open, setOpen] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [localActivities, setLocalActivities] = useState(subject.activities);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subject.id });

  const activitySensors = useSensors(useSensor(PointerSensor));

  const phaseConfig = PHASE_CONFIG[subject.phase];

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
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="border border-slate-200 rounded-xl overflow-hidden"
    >
      {/* Subject header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <GripVertical
          size={15}
          className={`flex-shrink-0 ${hasOngoingSessions ? "text-slate-200 cursor-default" : "text-slate-300 cursor-grab"}`}
          {...attributes}
          {...(hasOngoingSessions ? {} : listeners)}
        />
        {open ? (
          <ChevronDown size={15} className="text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronRight size={15} className="text-slate-500 flex-shrink-0" />
        )}
        <span className="text-sm font-semibold text-slate-700">
          {index + 1}. {subject.title}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${phaseConfig.badgeClass}`}
        >
          {subject.phase}
        </span>
        {subject.requiredDayNum && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700 flex items-center gap-0.5">
            <Lock size={9} />
            {subject.requiredDayNum}회차 출석 필요
          </span>
        )}
        <span className="text-xs text-slate-400 ml-1">
          {subject.activities.length}개 활동
        </span>
        <div
          className="ml-auto flex gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setShowEditModal(true)} className="p-1 text-slate-400 hover:text-violet-600 rounded">
            <Pencil size={13} />
          </button>
          <button
            onClick={hasOngoingSessions ? undefined : onDelete}
            disabled={hasOngoingSessions}
            className={`p-1 rounded ${hasOngoingSessions ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-red-500"}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-2 py-1">
          <DndContext
            sensors={activitySensors}
            collisionDetection={closestCenter}
            onDragEnd={handleActivityDragEnd}
          >
            <SortableContext
              items={localActivities.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              {localActivities.map((activity) => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  hasOngoingSessions={hasOngoingSessions}
                  enrolleeCount={enrolleeCount}
                  onEdit={onEditActivity}
                  onDelete={() => onDeleteActivity(activity.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            onClick={false ? undefined : () => setShowAddActivity(true)}
            disabled={false}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors mt-1 ${
              hasOngoingSessions
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-400 hover:text-violet-600 hover:bg-violet-50"
            }`}
          >
            <Plus size={14} />
            활동 추가
          </button>
        </div>
      )}

      {showAddActivity && (
        <AddActivityModal
          subjectTitle={subject.title}
          hasInstructor={hasInstructor}
          onAdd={(activity) => {
            onAddActivity(activity);
            setShowAddActivity(false);
          }}
          onClose={() => setShowAddActivity(false)}
        />
      )}

      {showEditModal && (
        <EditSubjectModal
          subject={subject}
          courseMode={courseMode}
          onSave={(updated) => { onEditSubject(updated); setShowEditModal(false); }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

interface PhraseSectionProps {
  phase: SubjectPhase;
  subjects: CourseSubject[];
  hasOngoingSessions: boolean;
  hasInstructor: boolean;
  enrolleeCount: number;
  courseMode: string;
  onDeleteSubject: (subjectId: string) => void;
  onAddActivity: (subjectId: string, activity: CourseActivity) => void;
  onDeleteActivity: (subjectId: string, activityId: string) => void;
  onAddSubject: (title: string, phase: SubjectPhase) => void;
  onEditSubject: (updated: Partial<CourseSubject> & { id: string }) => void;
  onEditActivity: (subjectId: string, updated: Partial<CourseActivity> & { id: string }) => void;
}

function PhaseSection({
  phase,
  subjects,
  hasOngoingSessions,
  hasInstructor,
  enrolleeCount,
  courseMode,
  onDeleteSubject,
  onAddActivity,
  onDeleteActivity,
  onAddSubject,
  onEditSubject,
  onEditActivity,
}: PhraseSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [localSubjects, setLocalSubjects] = useState(subjects);

  const config = PHASE_CONFIG[phase];
  const sensors = useSensors(useSensor(PointerSensor));

  function commitNewSubject() {
    const trimmed = newSubjectTitle.trim();
    if (trimmed) onAddSubject(trimmed, phase);
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

  // Sync local subjects when prop changes
  const prevSubjectsRef = useRef(subjects);
  if (prevSubjectsRef.current !== subjects) {
    prevSubjectsRef.current = subjects;
    setLocalSubjects(subjects);
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 overflow-hidden ${config.bgClass}`}
    >
      {/* Phase header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-slate-50/50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
        )}
        <span className="text-sm font-bold text-slate-700">{config.label}</span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.badgeClass}`}
        >
          {localSubjects.length}개 과목
        </span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 flex flex-col gap-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSubjectDragEnd}
          >
            <SortableContext
              items={localSubjects.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {localSubjects.map((subject, i) => (
                <SubjectAccordion
                  key={subject.id}
                  subject={subject}
                  index={i}
                  hasOngoingSessions={hasOngoingSessions}
                  hasInstructor={hasInstructor}
                  enrolleeCount={enrolleeCount}
                  courseMode={courseMode}
                  onDelete={() => onDeleteSubject(subject.id)}
                  onAddActivity={(activity) =>
                    onAddActivity(subject.id, activity)
                  }
                  onDeleteActivity={(activityId) =>
                    onDeleteActivity(subject.id, activityId)
                  }
                  onEditSubject={onEditSubject}
                  onEditActivity={(updated) => onEditActivity(subject.id, updated)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {localSubjects.length === 0 && !addingSubject && (
            <p className="text-xs text-slate-400 px-4 py-2">
              이 단계에 아직 과목이 없습니다.
            </p>
          )}

          {!hasOngoingSessions && addingSubject ? (
            <div className="flex items-center gap-2 px-4 py-3 border-2 border-violet-300 rounded-xl bg-violet-50">
              <Plus size={15} className="text-violet-400 flex-shrink-0" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                placeholder="과목 이름을 입력하세요"
                value={newSubjectTitle}
                onChange={(e) => setNewSubjectTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitNewSubject();
                  if (e.key === "Escape") {
                    setAddingSubject(false);
                    setNewSubjectTitle("");
                  }
                }}
                onBlur={commitNewSubject}
              />
            </div>
          ) : (
            <button
              onClick={
                hasOngoingSessions ? undefined : () => setAddingSubject(true)
              }
              disabled={hasOngoingSessions}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border-2 border-dashed rounded-xl transition-colors ${
                hasOngoingSessions
                  ? "text-slate-300 border-slate-100 cursor-not-allowed"
                  : "text-slate-400 hover:text-violet-600 border-slate-200 hover:border-violet-300"
              }`}
            >
              <Plus size={14} />
              과목 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface CurriculumTabProps {
  subjects: CourseSubject[];
  hasOngoingSessions: boolean;
  hasInstructor: boolean;
  enrolleeCount: number;
  isSequential: boolean;
  courseMode: string;
  onToggleSequential: (value: boolean) => void;
  onAddSubject: (title: string, phase?: SubjectPhase) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddActivity: (subjectId: string, activity: CourseActivity) => void;
  onDeleteActivity: (subjectId: string, activityId: string) => void;
  onEditSubject: (updated: Partial<CourseSubject> & { id: string }) => void;
  onEditActivity: (subjectId: string, updated: Partial<CourseActivity> & { id: string }) => void;
}

export default function CurriculumTab({
  subjects,
  hasOngoingSessions,
  hasInstructor,
  enrolleeCount,
  isSequential,
  courseMode,
  onToggleSequential,
  onAddSubject,
  onDeleteSubject,
  onAddActivity,
  onDeleteActivity,
  onEditSubject,
  onEditActivity,
}: CurriculumTabProps) {
  // Group subjects by phase
  const subjectsByPhase: Record<SubjectPhase, CourseSubject[]> = {
    PRE: subjects.filter((s) => s.phase === "PRE"),
    LEARNING: subjects.filter((s) => s.phase === "LEARNING"),
    POST: subjects.filter((s) => s.phase === "POST"),
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* 순서 강제 토글 */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Lock size={15} className="text-slate-500" />
          <div>
            <span className="text-sm font-medium text-slate-700">활동 순서 강제</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Info size={11} className="text-slate-400" />
              <span className="text-[11px] text-slate-400">
                Phase 순서(사전→학습→사후)는 항상 적용됩니다
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggleSequential(!isSequential)}
          className={`relative w-10 h-5.5 rounded-full transition-colors ${
            isSequential ? "bg-violet-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
              isSequential ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {isSequential && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-violet-50 border border-violet-200 rounded-xl text-violet-700 text-xs">
          <Lock size={13} className="text-violet-400 flex-shrink-0" />
          <span>
            학습자는 각 Phase 내에서 과목·활동을 순서대로 완료해야 다음 항목에 접근할 수 있습니다.
            법정교육·규제 교육에 적합합니다.
          </span>
        </div>
      )}

      {hasOngoingSessions && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
          <span>
            진행 중인 차수가 있어 커리큘럼을 수정할 수 없습니다. 수정하려면
            과정을 복제하거나 새 차수를 여세요.
          </span>
        </div>
      )}

      {PHASE_ORDER.map((phase) => (
        <PhaseSection
          key={phase}
          phase={phase}
          subjects={subjectsByPhase[phase]}
          hasOngoingSessions={hasOngoingSessions}
          hasInstructor={hasInstructor}
          enrolleeCount={enrolleeCount}
          courseMode={courseMode}
          onDeleteSubject={onDeleteSubject}
          onAddActivity={onAddActivity}
          onDeleteActivity={onDeleteActivity}
          onAddSubject={onAddSubject}
          onEditSubject={onEditSubject}
          onEditActivity={onEditActivity}
        />
      ))}
    </div>
  );
}
