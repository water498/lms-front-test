"use client";

import { useState } from "react";
import { orgSettings } from "../mockData";

export default function BrandingTab() {
  const [color, setColor] = useState(orgSettings.brandColor);
  const [subdomain, setSubdomain] = useState(orgSettings.subdomain);

  return (
    <div className="max-w-lg flex flex-col gap-6">
      {/* Logo upload */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-2 block">로고</label>
        <div className="w-32 h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-violet-400 hover:text-violet-400 cursor-pointer transition-colors">
          <span className="text-2xl">+</span>
          <span className="text-xs">업로드</span>
        </div>
      </div>

      {/* Brand color */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-2 block">메인 컬러</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 w-32 font-mono"
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

      {/* Subdomain */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-2 block">서브도메인 (Portal URL)</label>
        <div className="flex items-center gap-0">
          <input
            type="text"
            className="border border-r-0 border-slate-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
          />
          <span className="px-3 py-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-r-lg">
            .lms.io
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          포털 주소: <span className="font-mono">{subdomain}.lms.io</span>
        </p>
      </div>

      <div className="pt-1">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
