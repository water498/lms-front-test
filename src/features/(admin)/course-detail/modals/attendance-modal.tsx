"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { type OfflineSession, type OfflineAttendance, type AttendanceStatus, getOfflineAttendances } from "../mockData";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; className: string; activeClassName: string }> = {
  PRESENT: { label: "출석", className: "text-slate-500 hover:bg-slate-100",         activeClassName: "bg-emerald-100 text-emerald-700 font-semibold" },
  LATE:    { label: "지각", className: "text-slate-500 hover:bg-slate-100",         activeClassName: "bg-amber-100 text-amber-700 font-semibold" },
  ABSENT:  { label: "결석", className: "text-slate-500 hover:bg-slate-100",         activeClassName: "bg-red-100 text-red-600 font-semibold" },
  EXCUSED: { label: "공결", className: "text-slate-500 hover:bg-slate-100",         activeClassName: "bg-slate-100 text-slate-600 font-semibold" },
};

const BADGE_CLASS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-100 text-emerald-700",
  LATE:    "bg-amber-100 text-amber-700",
  ABSENT:  "bg-red-100 text-red-600",
  EXCUSED: "bg-slate-100 text-slate-500",
};

interface Props {
  session: OfflineSession;
  onClose: () => void;
}

export default function AttendanceModal({ session, onClose }: Props) {
  const [records, setRecords] = useState<OfflineAttendance[]>(() => getOfflineAttendances(session.id));

  function changeStatus(id: string, status: AttendanceStatus) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, method: "MANUAL" as const, checkedAt: undefined } : r
      )
    );
  }

  const counts = records.reduce(
    (acc, r) => { acc[r.status]++; return acc; },
    { PRESENT: 0, LATE: 0, ABSENT: 0, EXCUSED: 0 } as Record<AttendanceStatus, number>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-slate-800">
            {session.dayNum}회차 ({session.date}) 출결 관리
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* 요약 */}
        <div className="flex gap-4 mb-4 text-sm">
          <span className="text-emerald-600">출석 {counts.PRESENT}</span>
          <span className="text-amber-600">지각 {counts.LATE}</span>
          <span className="text-red-500">결석 {counts.ABSENT}</span>
          <span className="text-slate-500">공결 {counts.EXCUSED}</span>
          <span className="text-slate-400 ml-auto">총 {records.length}명</span>
        </div>

        {/* 테이블 */}
        <div className="overflow-y-auto flex-1 rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">이름</th>
                <th className="text-left px-4 py-3 font-medium">현재 상태</th>
                <th className="text-left px-4 py-3 font-medium">방법</th>
                <th className="text-left px-4 py-3 font-medium">변경</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{r.learnerName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_CLASS[r.status]}`}>
                      {STATUS_CONFIG[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.method === "QR" ? "QR" : "수동"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(["PRESENT", "LATE", "ABSENT", "EXCUSED"] as AttendanceStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => changeStatus(r.id, s)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            r.status === s
                              ? STATUS_CONFIG[s].activeClassName
                              : STATUS_CONFIG[s].className
                          }`}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
