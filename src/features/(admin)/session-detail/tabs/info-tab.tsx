"use client";

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="text-sm text-slate-800">{children}</div>
    </div>
  );
}

export default function SessionInfoTab({ session }: { session: CourseSession }) {
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

  return (
    <div className="max-w-lg bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.className}`}>
          {statusCfg.label}
        </span>
        <span className="text-sm font-semibold text-slate-800">{session.name}</span>
      </div>

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
      </div>

      <div className="pt-1">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
