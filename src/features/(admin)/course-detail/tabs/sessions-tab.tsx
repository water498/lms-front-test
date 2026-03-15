"use client";

import { useState } from "react";
import { type CourseSession, type SessionStatus } from "../mockData";
import CreateSessionModal from "../modals/create-session-modal";

const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string }> = {
  OPEN:        { label: "모집중",  className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "진행중",  className: "bg-emerald-100 text-emerald-700" },
  CLOSED:      { label: "종료",    className: "bg-slate-100 text-slate-500" },
};

export default function SessionsTab({ sessions }: { sessions: CourseSession[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{sessions.length}개 세션</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 새 세션 개설
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">회차명</th>
                <th className="text-left px-4 py-3 font-medium">기간</th>
                <th className="text-left px-4 py-3 font-medium">정원 / 수강</th>
                <th className="text-left px-4 py-3 font-medium">강사</th>
                <th className="text-left px-4 py-3 font-medium">장소</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const badge = STATUS_CONFIG[s.status];
                return (
                  <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {s.startDate} ~ {s.endDate}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className={s.enrolled >= s.capacity ? "text-red-500 font-medium" : ""}>
                        {s.enrolled}
                      </span>
                      <span className="text-slate-400"> / {s.capacity}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.instructor}</td>
                    <td className="px-4 py-3 text-slate-400">{s.venue ?? "온라인"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CreateSessionModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
