"use client";

import { useState, useMemo } from "react";
import { X, RefreshCw } from "lucide-react";
import type { OfflineSession } from "../mockData";

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

interface Props {
  session: OfflineSession;
  onClose: () => void;
}

export default function QrModal({ session, onClose }: Props) {
  const [beforeMin, setBeforeMin] = useState(10);
  const [afterMin, setAfterMin] = useState(30);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 0x7fffffff));

  // 간단한 활성 상태 시뮬레이션 (실제 시각 비교 대신 항상 활성으로 표시)
  const isActive = session.status !== "CANCELLED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">{session.dayNum}회차 QR 코드</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* QR */}
        <div className="flex justify-center mb-5">
          <div className="p-3 border-2 border-slate-200 rounded-xl">
            <QrPlaceholder seed={seed} />
          </div>
        </div>

        {/* 유효시간 설정 */}
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

        {/* 상태 */}
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
  );
}
