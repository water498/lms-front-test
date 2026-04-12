"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type CourseSession, type SessionStatus, type SessionType, type CourseInstructor } from "../course-layout/mockData";

function InstructorCell({ instructors }: { instructors: CourseInstructor[] }) {
  const primary = instructors.find((i) => i.role === "PRIMARY");
  const assistantCount = instructors.filter((i) => i.role === "ASSISTANT").length;
  if (!primary) return <span className="text-slate-400">—</span>;
  return (
    <span className="flex items-center gap-1">
      {primary.name}
      {assistantCount > 0 && (
        <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">
          +{assistantCount}
        </span>
      )}
    </span>
  );
}
import CreateSessionModal from "./modals/create-session-modal";

const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string }> = {
  DRAFT:   { label: "준비중",  className: "bg-slate-100 text-slate-500" },
  OPEN:    { label: "모집중",  className: "bg-blue-100 text-blue-700" },
  ONGOING: { label: "진행중",  className: "bg-emerald-100 text-emerald-700" },
  CLOSED:    { label: "종료",    className: "bg-slate-100 text-slate-400" },
  CANCELLED: { label: "폐강",    className: "bg-red-100 text-red-500" },
};

const TYPE_CONFIG: Record<SessionType, { label: string; className: string }> = {
  SELF_PACED: { label: "자유수강", className: "bg-violet-100 text-violet-700" },
  COHORT:     { label: "정규",     className: "bg-amber-100 text-amber-700" },
};

function SessionTypeBadge({ session }: { session: CourseSession }) {
  const cfg = TYPE_CONFIG[session.type];
  const label = session.type === "COHORT" && session.cohortNumber
    ? `${session.cohortNumber}기`
    : cfg.label;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}>
      {label}
    </span>
  );
}

interface SessionsTabProps {
  sessions: CourseSession[];
  courseId: string;
  defaultMinEnrollment?: number | null;
}

function DeleteSessionModal({ sessionName, onConfirm, onClose }: { sessionName: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-2">차수 삭제</h3>
        <p className="text-sm text-slate-500 mb-1">
          <span className="font-medium text-slate-700">{sessionName}</span>을(를) 삭제하시겠습니까?
        </p>
        <p className="text-xs text-red-500 mb-5">삭제된 차수는 복구할 수 없으며, 수강 기록도 함께 삭제됩니다.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">취소</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function SessionsTab({ sessions, courseId, defaultMinEnrollment }: SessionsTabProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{sessions.length}개 차수</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 차수 추가
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 py-16 flex flex-col items-center gap-2 text-slate-400">
            <p className="text-sm">등록된 차수가 없습니다.</p>
            <p className="text-xs">첫 차수를 만들어보세요</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">차수명</th>
                  <th className="text-left px-4 py-3 font-medium">유형</th>
                  <th className="text-left px-4 py-3 font-medium">기간</th>
                  <th className="text-left px-4 py-3 font-medium">수강 / 정원</th>
                  <th className="text-left px-4 py-3 font-medium">강사</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                  <th className="w-20 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const status = STATUS_CONFIG[s.status];
                  return (
                    <tr
                      key={s.id}
                      onClick={() => router.push(`/backoffice/courses/${courseId}/sessions/${s.id}`)}
                      className="group border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800">{s.name}</td>
                      <td className="px-4 py-3">
                        <SessionTypeBadge session={s} />
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {s.type === "SELF_PACED"
                          ? <span className="text-slate-400">상시</span>
                          : `${s.startDate} ~ ${s.endDate}`
                        }
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className={s.capacity > 0 && s.enrolled >= s.capacity ? "text-red-500 font-medium" : ""}>
                            {s.enrolled}
                          </span>
                          <span className="text-slate-400">/ {s.capacity === 0 ? "∞" : s.capacity}</span>
                          {s.minEnrollment != null &&
                            s.enrolled < s.minEnrollment &&
                            (s.status === "OPEN" || s.status === "ONGOING") && (
                            <span className="text-[10px] px-1 py-0.5 rounded font-medium bg-red-100 text-red-600">미달</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600"><InstructorCell instructors={s.instructors} /></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); alert(`"${s.name}" 복사됨`); }}
                            className="text-xs px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded transition-colors"
                          >복사</button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: s.id, name: s.name }); }}
                            className="text-xs px-2 py-1 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                          >삭제</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CreateSessionModal
          defaultMinEnrollment={defaultMinEnrollment}
          onClose={() => setShowModal(false)}
        />
      )}

      {deleteTarget && (
        <DeleteSessionModal
          sessionName={deleteTarget.name}
          onConfirm={() => {
            // TODO: API call to delete session
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
