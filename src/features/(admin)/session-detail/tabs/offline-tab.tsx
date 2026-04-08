"use client";

import { useState } from "react";
import { QrCode, ClipboardList } from "lucide-react";
import { type OfflineSession, type OfflineSessionStatus, type CourseInstructor, getOfflineSessions, getOfflineAttendances } from "../../course-detail/mockData";

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
import QrModal from "../../course-offline/modals/qr-modal";
import AttendanceModal from "../../course-offline/modals/attendance-modal";
import CreateOfflineSessionModal from "../../course-offline/modals/create-offline-session-modal";

const STATUS_CONFIG: Record<OfflineSessionStatus, { label: string; className: string }> = {
  SCHEDULED: { label: "예정", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "완료", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "취소", className: "bg-red-100 text-red-600" },
};

function calcAttendanceRate(offlineSessionId: string): string {
  const records = getOfflineAttendances(offlineSessionId);
  if (records.length === 0) return "—";
  const attended = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
  return `${Math.round((attended / records.length) * 100)}%`;
}

export default function SessionOfflineTab({ sessionId }: { sessionId: string }) {
  const [qrTarget, setQrTarget] = useState<OfflineSession | null>(null);
  const [attendanceTarget, setAttendanceTarget] = useState<OfflineSession | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const offlineSessions = getOfflineSessions(sessionId);

  return (
    <>
      <div className="max-w-5xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 회차 추가
          </button>
        </div>

        {offlineSessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 py-16 flex flex-col items-center gap-2 text-slate-400">
            <p className="text-sm">등록된 회차가 없습니다.</p>
            <p className="text-xs">회차를 추가해 출결을 관리하세요</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">회차</th>
                  <th className="text-left px-4 py-3 font-medium">날짜 / 시간</th>
                  <th className="text-left px-4 py-3 font-medium">장소</th>
                  <th className="text-left px-4 py-3 font-medium">강사</th>
                  <th className="text-left px-4 py-3 font-medium">정원</th>
                  <th className="text-left px-4 py-3 font-medium">출석률</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                  <th className="text-left px-4 py-3 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {offlineSessions.map((os) => {
                  const statusCfg = STATUS_CONFIG[os.status];
                  const rate = os.status === "SCHEDULED" ? "—" : calcAttendanceRate(os.id);
                  return (
                    <tr key={os.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-800">{os.dayNum}회차</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        <span className="font-medium text-slate-700">{os.startsAt.split("T")[0] ?? os.startsAt.split(" ")[0]}</span>
                        <br />
                        {os.startsAt} – {os.endsAt}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{os.location}</td>
                      <td className="px-4 py-3 text-slate-600"><InstructorCell instructors={os.instructors} /></td>
                      <td className="px-4 py-3 text-slate-600">{os.maxAttendees ?? "—"}명</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{rate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setQrTarget(os)}
                            className="flex items-center gap-1 text-xs px-2 py-1 text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          >
                            <QrCode size={12} />
                            QR
                          </button>
                          <button
                            onClick={() => setAttendanceTarget(os)}
                            className="flex items-center gap-1 text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                          >
                            <ClipboardList size={12} />
                            출결
                          </button>
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

      {qrTarget && <QrModal session={qrTarget} onClose={() => setQrTarget(null)} />}
      {attendanceTarget && <AttendanceModal session={attendanceTarget} onClose={() => setAttendanceTarget(null)} />}
      {showCreate && <CreateOfflineSessionModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
