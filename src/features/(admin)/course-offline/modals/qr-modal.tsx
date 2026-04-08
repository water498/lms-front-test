"use client";

import { useState, useMemo } from "react";
import { X, RefreshCw, ClipboardCheck, FileText } from "lucide-react";
import type { OfflineSession } from "../../course-detail/mockData";

const BEFORE_OPTIONS = [0, 5, 10, 15, 30];
const AFTER_OPTIONS = [10, 20, 30, 60];

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
        filled ? (
          <rect key={i} x={i % 8} y={Math.floor(i / 8)} width="1" height="1" fill="#1e293b" />
        ) : null
      )}
      {/* corner markers */}
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

// Mock: 해당 과정의 평가 Activity 목록
const ASSESSMENT_ACTIVITIES = [
  { id: "a0",  title: "안전 지식 사전 테스트", type: "QUIZ" as const,   phase: "PRE" },
  { id: "a3",  title: "개념 확인 퀴즈",       type: "QUIZ" as const,   phase: "LEARNING" },
  { id: "a9",  title: "종합 평가 시험",       type: "QUIZ" as const,   phase: "POST" },
  { id: "a10", title: "교육 만족도 설문",     type: "SURVEY" as const, phase: "POST" },
];

type QrMode = "attendance" | "assessment";

interface Props {
  session: OfflineSession;
  onClose: () => void;
}

export default function QrModal({ session, onClose }: Props) {
  const [mode, setMode] = useState<QrMode>("attendance");
  const [beforeMin, setBeforeMin] = useState(10);
  const [afterMin, setAfterMin] = useState(30);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 0x7fffffff));
  const [selectedActivityId, setSelectedActivityId] = useState<string>(ASSESSMENT_ACTIVITIES[0]?.id ?? "");

  const isActive = session.status !== "CANCELLED";

  const selectedActivity = ASSESSMENT_ACTIVITIES.find((a) => a.id === selectedActivityId);

  const qrLabel = mode === "attendance"
    ? `출결 — ${session.dayNum}회차`
    : `평가 — ${selectedActivity?.title ?? ""}`;

  // QR URL (mock)
  const qrUrl = mode === "attendance"
    ? `https://lms.example.com/offline/${session.id}/attendance`
    : `https://lms.example.com/learn/c1/${selectedActivityId}?offline=${session.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <h2 className="text-base font-semibold text-slate-800">{session.dayNum}회차 QR 코드</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 mx-5 mt-4 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setMode("attendance")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              mode === "attendance"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <ClipboardCheck size={13} />
            출결
          </button>
          <button
            onClick={() => setMode("assessment")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              mode === "assessment"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText size={13} />
            평가
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Assessment activity selector */}
          {mode === "assessment" && (
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">평가 항목 선택</label>
              <select
                value={selectedActivityId}
                onChange={(e) => { setSelectedActivityId(e.target.value); setSeed(Math.floor(Math.random() * 0x7fffffff)); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {ASSESSMENT_ACTIVITIES.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.phase}] {a.title} ({a.type === "QUIZ" ? "시험" : "설문"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* QR */}
          <div className="flex justify-center my-5">
            <div className="p-3 border-2 border-slate-200 rounded-xl">
              <QrPlaceholder seed={seed} />
            </div>
          </div>

          {/* QR label */}
          <p className="text-center text-xs text-slate-500 mb-4">{qrLabel}</p>

          {/* Validity settings (attendance only) */}
          {mode === "attendance" && (
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 mb-4">
              <p className="text-xs font-medium text-slate-500">유효 시간 설정</p>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span>시작</span>
                <select
                  value={beforeMin}
                  onChange={(e) => setBeforeMin(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  {BEFORE_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}분</option>
                  ))}
                </select>
                <span>전 ~</span>
                <span>시작</span>
                <select
                  value={afterMin}
                  onChange={(e) => setAfterMin(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  {AFTER_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}분</option>
                  ))}
                </select>
                <span>후</span>
              </div>
              <p className="text-xs text-slate-400">
                {session.startsAt} 기준 ±{beforeMin}/{afterMin}분
              </p>
            </div>
          )}

          {/* Assessment info */}
          {mode === "assessment" && selectedActivity && (
            <div className="bg-violet-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-violet-600">
                수강생이 QR을 스캔하면 <strong>{selectedActivity.title}</strong> 페이지로 이동합니다.
                로그인 상태에서만 응시 가능합니다.
              </p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 mb-5">
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
            <span className={`text-sm font-medium ${isActive ? "text-emerald-600" : "text-slate-400"}`}>
              {isActive ? "활성" : "만료됨"}
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 0x7fffffff))}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={13} />
              재발급
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
