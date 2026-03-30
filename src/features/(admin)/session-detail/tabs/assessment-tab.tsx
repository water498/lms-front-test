"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { CourseSession } from "../../course-detail/mockData";
import { examTemplates, surveyTemplates, assignmentTemplates } from "../../assessments/mockData";

interface DraftState {
  preExamTemplateId: string;
  postExamTemplateId: string;
  postExamRequired: boolean;
  preSurveyTemplateId: string;
  postSurveyTemplateId: string;
  postSurveyRequired: boolean;
  preAssignmentTemplateId: string;
  postAssignmentTemplateId: string;
  postAssignmentRequired: boolean;
}

function toDraft(s: CourseSession): DraftState {
  return {
    preExamTemplateId:        s.preExamTemplateId ?? "",
    postExamTemplateId:       s.postExamTemplateId ?? "",
    postExamRequired:         s.postExamRequired ?? false,
    preSurveyTemplateId:      s.preSurveyTemplateId ?? "",
    postSurveyTemplateId:     s.postSurveyTemplateId ?? "",
    postSurveyRequired:       s.postSurveyRequired ?? false,
    preAssignmentTemplateId:  s.preAssignmentTemplateId ?? "",
    postAssignmentTemplateId: s.postAssignmentTemplateId ?? "",
    postAssignmentRequired:   s.postAssignmentRequired ?? false,
  };
}

function Row({ label, value, required }: { label: string; value: string | undefined; required?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium text-slate-500 w-24 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        {required && (
          <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded font-medium">수료 필수</span>
        )}
        <span className={`text-sm ${value ? "text-slate-800" : "text-slate-400"}`}>
          {value ?? "미설정"}
        </span>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  selectCls,
  required,
  onRequiredChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; title: string }[];
  selectCls: string;
  required?: boolean;
  onRequiredChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        <option value="">미설정</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.title}</option>
        ))}
      </select>
      {onRequiredChange && value && (
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={required ?? false}
            onChange={(e) => onRequiredChange(e.target.checked)}
            className="accent-violet-600"
          />
          <span className="text-xs text-slate-600">수료 조건 필수</span>
        </label>
      )}
    </div>
  );
}

export default function SessionAssessmentTab({ session }: { session: CourseSession }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DraftState>(() => toDraft(session));

  function handleEdit() {
    setDraft(toDraft(session));
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft(toDraft(session));
    setIsEditing(false);
  }

  function handleSave() {
    console.log("평가 설정 저장", {
      id: session.id,
      preExamTemplateId:        draft.preExamTemplateId || undefined,
      postExamTemplateId:       draft.postExamTemplateId || undefined,
      postExamRequired:         draft.postExamTemplateId ? draft.postExamRequired : false,
      preSurveyTemplateId:      draft.preSurveyTemplateId || undefined,
      postSurveyTemplateId:     draft.postSurveyTemplateId || undefined,
      postSurveyRequired:       draft.postSurveyTemplateId ? draft.postSurveyRequired : false,
      preAssignmentTemplateId:  draft.preAssignmentTemplateId || undefined,
      postAssignmentTemplateId: draft.postAssignmentTemplateId || undefined,
      postAssignmentRequired:   draft.postAssignmentTemplateId ? draft.postAssignmentRequired : false,
    });
    setIsEditing(false);
  }

  function set<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const selectCls =
    "w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  const preExamTitle        = examTemplates.find((e) => e.id === session.preExamTemplateId)?.title;
  const postExamTitle       = examTemplates.find((e) => e.id === session.postExamTemplateId)?.title;
  const preSurveyTitle      = surveyTemplates.find((s) => s.id === session.preSurveyTemplateId)?.title;
  const postSurveyTitle     = surveyTemplates.find((s) => s.id === session.postSurveyTemplateId)?.title;
  const preAssignTitle      = assignmentTemplates.find((a) => a.id === session.preAssignmentTemplateId)?.title;
  const postAssignTitle     = assignmentTemplates.find((a) => a.id === session.postAssignmentTemplateId)?.title;

  return (
    <div className="max-w-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">평가 설정</p>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors"
          >
            <Pencil size={13} />
            편집
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <SectionCard title="시험">
            <div className="flex flex-col gap-3 mt-2">
              <SelectField
                label="수강 전 (진단)"
                value={draft.preExamTemplateId}
                onChange={(v) => set("preExamTemplateId", v)}
                options={examTemplates}
                selectCls={selectCls}
              />
              <SelectField
                label="수료 후"
                value={draft.postExamTemplateId}
                onChange={(v) => {
                  set("postExamTemplateId", v);
                  if (!v) set("postExamRequired", false);
                }}
                options={examTemplates}
                selectCls={selectCls}
                required={draft.postExamRequired}
                onRequiredChange={(v) => set("postExamRequired", v)}
              />
            </div>
          </SectionCard>

          <SectionCard title="설문">
            <div className="flex flex-col gap-3 mt-2">
              <SelectField
                label="수강 전"
                value={draft.preSurveyTemplateId}
                onChange={(v) => set("preSurveyTemplateId", v)}
                options={surveyTemplates}
                selectCls={selectCls}
              />
              <SelectField
                label="수료 후"
                value={draft.postSurveyTemplateId}
                onChange={(v) => {
                  set("postSurveyTemplateId", v);
                  if (!v) set("postSurveyRequired", false);
                }}
                options={surveyTemplates}
                selectCls={selectCls}
                required={draft.postSurveyRequired}
                onRequiredChange={(v) => set("postSurveyRequired", v)}
              />
            </div>
          </SectionCard>

          <SectionCard title="과제">
            <div className="flex flex-col gap-3 mt-2">
              <SelectField
                label="수강 전"
                value={draft.preAssignmentTemplateId}
                onChange={(v) => set("preAssignmentTemplateId", v)}
                options={assignmentTemplates}
                selectCls={selectCls}
              />
              <SelectField
                label="수료 후"
                value={draft.postAssignmentTemplateId}
                onChange={(v) => {
                  set("postAssignmentTemplateId", v);
                  if (!v) set("postAssignmentRequired", false);
                }}
                options={assignmentTemplates}
                selectCls={selectCls}
                required={draft.postAssignmentRequired}
                onRequiredChange={(v) => set("postAssignmentRequired", v)}
              />
            </div>
          </SectionCard>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <SectionCard title="시험">
            <Row label="수강 전 (진단)" value={preExamTitle} />
            <Row label="수료 후" value={postExamTitle} required={session.postExamRequired && !!postExamTitle} />
          </SectionCard>

          <SectionCard title="설문">
            <Row label="수강 전" value={preSurveyTitle} />
            <Row label="수료 후" value={postSurveyTitle} required={session.postSurveyRequired && !!postSurveyTitle} />
          </SectionCard>

          <SectionCard title="과제">
            <Row label="수강 전" value={preAssignTitle} />
            <Row label="수료 후" value={postAssignTitle} required={session.postAssignmentRequired && !!postAssignTitle} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
