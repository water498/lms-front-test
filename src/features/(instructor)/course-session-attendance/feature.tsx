"use client";

import { useState, useMemo } from "react";
import { MapPin, Clock, User, QrCode, X, RefreshCw, ClipboardCheck, FileText } from "lucide-react";
import {
  offlineSessionsBySession,
  attendanceByOfflineSession,
  enrollmentsBySession,
  type AttendanceStatus,
  type AttendanceMock,
} from "../shared/mockData";

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
  const [showQrModal, setShowQrModal] = useState(false);
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
          {selectedOs.instructors && selectedOs.instructors.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <User size={12} />
              <span>
                {selectedOs.instructors.map((i) =>
                  i.role === "PRIMARY" ? i.name : `${i.name} (보조)`
                ).join(", ")}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowQrModal(true)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-400 border border-zinc-700 hover:border-violet-500 rounded-lg transition-colors"
          >
            <QrCode size={13} />
            QR
          </button>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
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

      {showQrModal && selectedOs && (
        <InstructorQrModal
          session={selectedOs}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}

// ── QR 모달 (다크 테마) ──────────────────────────────────────────

function QrPlaceholder({ seed }: { seed: number }) {
  const grid = useMemo(() => {
    const cells: boolean[] = [];
    let s = seed;
    for (let i = 0; i < 64; i++) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      cells.push((s >>> 31) === 1);
    }
    return cells;
  }, [seed]);

  return (
    <svg width="160" height="160" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="rounded-lg">
      <rect width="8" height="8" fill="white" />
      {grid.map((filled, i) =>
        filled ? <rect key={i} x={i % 8} y={Math.floor(i / 8)} width="1" height="1" fill="#1e293b" /> : null
      )}
      {[[0,0],[5,0],[0,5]].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx} y={cy} width="3" height="3" fill="#1e293b" />
          <rect x={cx+0.5} y={cy+0.5} width="2" height="2" fill="white" />
          <rect x={cx+1} y={cy+1} width="1" height="1" fill="#1e293b" />
        </g>
      ))}
    </svg>
  );
}

const ASSESSMENT_ACTIVITIES = [
  { id: "a0",  title: "안전 지식 사전 테스트", type: "QUIZ" as const,   phase: "PRE" },
  { id: "a3",  title: "개념 확인 퀴즈",       type: "QUIZ" as const,   phase: "LEARNING" },
  { id: "a9",  title: "종합 평가 시험",       type: "QUIZ" as const,   phase: "POST" },
  { id: "a10", title: "교육 만족도 설문",     type: "SURVEY" as const, phase: "POST" },
];

const BEFORE_OPTIONS = [0, 5, 10, 15, 30];
const AFTER_OPTIONS = [10, 20, 30, 60];

type QrMode = "attendance" | "assessment";

function InstructorQrModal({ session, onClose }: { session: { id: string; dayNum: number; startsAt: string; status: string }; onClose: () => void }) {
  const [mode, setMode] = useState<QrMode>("attendance");
  const [beforeMin, setBeforeMin] = useState(10);
  const [afterMin, setAfterMin] = useState(30);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 0x7fffffff));
  const [selectedActivityId, setSelectedActivityId] = useState(ASSESSMENT_ACTIVITIES[0]?.id ?? "");

  const isActive = session.status !== "CANCELLED";
  const selectedActivity = ASSESSMENT_ACTIVITIES.find((a) => a.id === selectedActivityId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-base font-semibold text-white">{session.dayNum}회차 QR 코드</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 mx-5 mt-4 p-1 bg-zinc-800 rounded-lg">
          <button onClick={() => setMode("attendance")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${mode === "attendance" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            <ClipboardCheck size={13} /> 출결
          </button>
          <button onClick={() => setMode("assessment")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${mode === "assessment" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            <FileText size={13} /> 평가
          </button>
        </div>

        <div className="px-5 pb-5">
          {mode === "assessment" && (
            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">평가 항목 선택</label>
              <select value={selectedActivityId}
                onChange={(e) => { setSelectedActivityId(e.target.value); setSeed(Math.floor(Math.random() * 0x7fffffff)); }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                {ASSESSMENT_ACTIVITIES.map((a) => (
                  <option key={a.id} value={a.id}>[{a.phase}] {a.title} ({a.type === "QUIZ" ? "시험" : "설문"})</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-center my-5">
            <div className="p-3 border-2 border-zinc-700 rounded-xl">
              <QrPlaceholder seed={seed} />
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 mb-4">
            {mode === "attendance" ? `출결 — ${session.dayNum}회차` : `평가 — ${selectedActivity?.title ?? ""}`}
          </p>

          {mode === "attendance" && (
            <div className="bg-zinc-800/50 rounded-xl p-4 flex flex-col gap-3 mb-4">
              <p className="text-xs font-medium text-zinc-400">유효 시간 설정</p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <span>시작</span>
                <select value={beforeMin} onChange={(e) => setBeforeMin(Number(e.target.value))}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-violet-500">
                  {BEFORE_OPTIONS.map((m) => <option key={m} value={m}>{m}분</option>)}
                </select>
                <span>전 ~</span>
                <select value={afterMin} onChange={(e) => setAfterMin(Number(e.target.value))}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-violet-500">
                  {AFTER_OPTIONS.map((m) => <option key={m} value={m}>{m}분</option>)}
                </select>
                <span>후</span>
              </div>
              <p className="text-xs text-zinc-600">{session.startsAt} 기준 ±{beforeMin}/{afterMin}분</p>
            </div>
          )}

          {mode === "assessment" && selectedActivity && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-4">
              <p className="text-xs text-violet-400">수강생이 QR을 스캔하면 <strong>{selectedActivity.title}</strong> 페이지로 이동합니다.</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-5">
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-zinc-600"}`} />
            <span className={`text-sm font-medium ${isActive ? "text-emerald-400" : "text-zinc-500"}`}>{isActive ? "활성" : "만료됨"}</span>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setSeed(Math.floor(Math.random() * 0x7fffffff))}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
              <RefreshCw size={13} /> 재발급
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
