"use client";

import { useState } from "react";
import { MapPin, Clock } from "lucide-react";
import {
  offlineSessionsBySession,
  attendanceByOfflineSession,
  enrollmentsBySession,
  type AttendanceStatus,
  type AttendanceMock,
} from "../../shared/mockData";

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  PRESENT: "출석",
  LATE: "지각",
  ABSENT: "결석",
  EXCUSED: "공결",
};

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-500/15 text-emerald-400",
  LATE: "bg-amber-500/15 text-amber-400",
  ABSENT: "bg-red-500/15 text-red-400",
  EXCUSED: "bg-sky-500/15 text-sky-400",
};

const CYCLE: AttendanceStatus[] = ["PRESENT", "LATE", "ABSENT", "EXCUSED"];

export default function AttendanceTab({ sessionId }: { sessionId: string }) {
  const offlineSessions = offlineSessionsBySession[sessionId] ?? [];
  const [selectedOsId, setSelectedOsId] = useState(offlineSessions[0]?.id ?? "");
  const [attendanceState, setAttendanceState] = useState<
    Record<string, Record<string, AttendanceMock>>
  >(() => {
    const result: Record<string, Record<string, AttendanceMock>> = {};
    for (const os of offlineSessions) {
      result[os.id] = {};
      for (const a of attendanceByOfflineSession[os.id] ?? []) {
        result[os.id][a.userId] = { ...a };
      }
    }
    return result;
  });

  const enrollments = enrollmentsBySession[sessionId] ?? [];
  const selectedOs = offlineSessions.find((o) => o.id === selectedOsId);
  const osAttendance = attendanceState[selectedOsId] ?? {};

  const toggleStatus = (userId: string, name: string) => {
    if (selectedOs?.status !== "COMPLETED") return;
    setAttendanceState((prev) => {
      const current = prev[selectedOsId]?.[userId];
      const currentStatus: AttendanceStatus = current?.status ?? "ABSENT";
      const nextStatus = CYCLE[(CYCLE.indexOf(currentStatus) + 1) % CYCLE.length];
      return {
        ...prev,
        [selectedOsId]: {
          ...prev[selectedOsId],
          [userId]: { userId, name, status: nextStatus },
        },
      };
    });
  };

  if (offlineSessions.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <p className="text-sm">오프라인 회차가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 회차 선택 탭 */}
      <div className="flex gap-2 px-5 pt-4">
        {offlineSessions.map((os) => (
          <button
            key={os.id}
            onClick={() => setSelectedOsId(os.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedOsId === os.id
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {os.dayNum}일차
          </button>
        ))}
      </div>

      {/* 선택된 회차 정보 */}
      {selectedOs && (
        <div className="mx-5 bg-zinc-800/50 rounded-xl px-4 py-3 flex items-center gap-6">
          <div>
            <p className="text-xs text-zinc-500">회차</p>
            <p className="text-sm font-medium text-white">{selectedOs.title}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock size={12} />
            <span>{selectedOs.startsAt.replace("T", " ")} ~ {selectedOs.endsAt.split("T")[1]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin size={12} />
            <span>{selectedOs.location}</span>
          </div>
          <span className={`ml-auto inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            selectedOs.status === "COMPLETED"
              ? "bg-emerald-500/15 text-emerald-400"
              : selectedOs.status === "SCHEDULED"
              ? "bg-amber-500/15 text-amber-400"
              : "bg-zinc-700 text-zinc-500"
          }`}>
            {selectedOs.status === "COMPLETED" ? "완료" : selectedOs.status === "SCHEDULED" ? "예정" : "취소"}
          </span>
        </div>
      )}

      {/* 출결 테이블 */}
      {selectedOs?.status === "SCHEDULED" ? (
        <div className="text-center py-8 px-5 text-zinc-500">
          <p className="text-sm">예정된 회차입니다. 수업 후 출결을 입력할 수 있습니다.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">수강생</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500">출결 상태</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">비고</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">체크 시각</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => {
              const att = osAttendance[e.userId];
              const status: AttendanceStatus = att?.status ?? "ABSENT";
              return (
                <tr key={e.userId} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {e.name[0]}
                      </div>
                      <span className="text-zinc-200">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => toggleStatus(e.userId, e.name)}
                      title="클릭하여 변경"
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${STATUS_COLOR[status]}`}
                    >
                      {STATUS_LABEL[status]}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs">{att?.note ?? "—"}</td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs">
                    {att?.checkedAt ? att.checkedAt.replace("T", " ") : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
