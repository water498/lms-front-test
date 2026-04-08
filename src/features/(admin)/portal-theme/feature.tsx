"use client";

import { useState } from "react";
import { orgSettings } from "../settings/mockData";

const PRESET_COLORS = [
  "#7C3AED", // violet
  "#2563EB", // blue
  "#0891B2", // cyan
  "#059669", // emerald
  "#D97706", // amber
  "#DC2626", // red
  "#DB2777", // pink
  "#1E293B", // slate dark
];

export default function PortalThemeFeature() {
  const [color, setColor] = useState(orgSettings.brandColor);

  const handleSave = () => {
    alert(`테마 저장\n메인 컬러: ${color}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 mb-0.5">테마</h2>
        <p className="text-xs text-slate-400">학습자 포털의 브랜드 컬러를 설정합니다.</p>
      </div>

      {/* 메인 컬러 */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-slate-600">메인 컬러</label>

        {/* 프리셋 */}
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                color === c ? "border-slate-800 scale-110" : "border-transparent hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* 직접 입력 */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 w-36 font-mono"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#7C3AED"
          />
          <div
            className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-slate-400">미리보기</span>
        </div>
      </div>

      {/* 컬러 적용 미리보기 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-600">적용 예시</label>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* 헤더 */}
          <div
            className="h-10 px-4 flex items-center gap-2"
            style={{ backgroundColor: color }}
          >
            <div className="w-4 h-4 bg-white/30 rounded" />
            <span className="text-xs text-white font-medium">포털명</span>
          </div>
          {/* 버튼 예시 */}
          <div className="p-4 bg-slate-50 flex items-center gap-3">
            <button
              className="px-4 py-1.5 text-xs text-white rounded-lg"
              style={{ backgroundColor: color }}
            >
              수강 신청
            </button>
            <button
              className="px-4 py-1.5 text-xs rounded-lg border"
              style={{ color, borderColor: color }}
            >
              자세히 보기
            </button>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <button
          onClick={handleSave}
          className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  );
}
