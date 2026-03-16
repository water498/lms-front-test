"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { type CourseSession, type SessionStatus, type SessionType } from "../../course-detail/mockData";

const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string }> = {
  DRAFT:   { label: "준비중", className: "bg-slate-100 text-slate-500" },
  OPEN:    { label: "모집중", className: "bg-blue-100 text-blue-700" },
  ONGOING: { label: "진행중", className: "bg-emerald-100 text-emerald-700" },
  CLOSED:  { label: "종료",   className: "bg-slate-100 text-slate-400" },
};

const TYPE_CONFIG: Record<SessionType, string> = {
  SELF_PACED: "자유수강",
  COHORT:     "정규",
};

const STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: "DRAFT",   label: "준비중" },
  { value: "OPEN",    label: "모집중" },
  { value: "ONGOING", label: "진행중" },
  { value: "CLOSED",  label: "종료" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-1"
        }`}
      />
    </button>
  );
}

interface DraftState {
  name: string;
  status: SessionStatus;
  startDate: string;
  endDate: string;
  capacity: string;
  instructors: string;
  location: string;
  visible: boolean;
  forSale: boolean;
  completionThreshold: string;
}

function toDraft(s: CourseSession): DraftState {
  return {
    name: s.name,
    status: s.status,
    startDate: s.startDate ?? "",
    endDate: s.endDate ?? "",
    capacity: String(s.capacity),
    instructors: s.instructors.join(", "),
    location: s.location ?? "",
    visible: s.visible,
    forSale: s.forSale,
    completionThreshold: String(s.completionThreshold),
  };
}

export default function SessionInfoTab({ session }: { session: CourseSession }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DraftState>(() => toDraft(session));

  const statusCfg = STATUS_CONFIG[session.status];
  const typeLabel = session.type === "COHORT" && session.cohortNumber
    ? `정규 (${session.cohortNumber}기)`
    : TYPE_CONFIG[session.type];

  const periodLabel = session.type === "SELF_PACED"
    ? "상시"
    : `${session.startDate ?? "—"} ~ ${session.endDate ?? "—"}`;

  const capacityLabel = session.capacity === 0
    ? `무제한 (현재 ${session.enrolled}명 수강)`
    : `${session.enrolled} / ${session.capacity}명`;

  function handleEdit() {
    setDraft(toDraft(session));
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft(toDraft(session));
    setIsEditing(false);
  }

  function handleSave() {
    console.log("차수 정보 저장", {
      id: session.id,
      name: draft.name,
      status: draft.status,
      startDate: draft.startDate || undefined,
      endDate: draft.endDate || undefined,
      capacity: Number(draft.capacity),
      instructors: draft.instructors.split(",").map((s) => s.trim()).filter(Boolean),
      location: draft.location || undefined,
      visible: draft.visible,
      forSale: draft.forSale,
      completionThreshold: Number(draft.completionThreshold),
    });
    setIsEditing(false);
  }

  function set<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";
  const selectCls = inputCls + " bg-white";

  return (
    <div className="max-w-lg bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.className}`}>
            {statusCfg.label}
          </span>
          <span className="text-sm font-semibold text-slate-800">{session.name}</span>
        </div>
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

      {/* Fields */}
      {isEditing ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* 차수 이름 — full width */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">차수 이름</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* 상태 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">상태</label>
            <select
              value={draft.status}
              onChange={(e) => set("status", e.target.value as SessionStatus)}
              className={selectCls}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* 정원 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">정원 (0 = 무제한)</label>
            <input
              type="number"
              min={0}
              value={draft.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* 시작일 / 종료일 — COHORT only */}
          {session.type === "COHORT" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">시작일</label>
                <input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">종료일</label>
                <input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                  className={inputCls}
                />
              </div>
            </>
          )}

          {/* 강사 */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">강사 (쉼표 구분)</label>
            <input
              type="text"
              value={draft.instructors}
              onChange={(e) => set("instructors", e.target.value)}
              placeholder="예: 김강사, 이강사"
              className={inputCls}
            />
          </div>

          {/* 장소 — offline only */}
          {session.location !== undefined && (
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">장소</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => set("location", e.target.value)}
                className={inputCls}
              />
            </div>
          )}

          {/* 수료 기준 진도율 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">수료 기준 진도율 (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={draft.completionThreshold}
              onChange={(e) => set("completionThreshold", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 justify-center">
            <div className="flex items-center gap-3">
              <Toggle checked={draft.visible} onChange={(v) => set("visible", v)} />
              <span className="text-sm text-slate-700">공개</span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle checked={draft.forSale} onChange={(v) => set("forSale", v)} />
              <span className="text-sm text-slate-700">판매</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field label="유형">{typeLabel}</Field>
          <Field label="기간">{periodLabel}</Field>
          <Field label="정원 / 수강">{capacityLabel}</Field>
          <Field label="강사">{session.instructors.join(", ") || "—"}</Field>
          {session.location && (
            <Field label="장소">{session.location}</Field>
          )}
          <Field label="판매 여부">
            <span className={session.forSale ? "text-emerald-600" : "text-slate-400"}>
              {session.forSale ? "판매 중" : "비판매"}
            </span>
          </Field>
          <Field label="공개 여부">
            <span className={session.visible ? "text-emerald-600" : "text-slate-400"}>
              {session.visible ? "공개" : "비공개"}
            </span>
          </Field>
          <Field label="수료 기준">{session.completionThreshold}%</Field>
        </div>
      )}

      {/* Action row */}
      {isEditing && (
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
      )}
    </div>
  );
}
