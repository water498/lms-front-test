"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { orgSettings } from "../mockData";

export default function BrandingTab() {
  const [color, setColor] = useState(orgSettings.brandColor);
  const portalUrl = `${orgSettings.subdomain}.lms.io`;

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

      {/* Portal URL — read-only */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-2 block">포털 URL</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="flex-1 text-sm font-mono text-slate-700">{portalUrl}</span>
          <a
            href={`https://${portalUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-violet-600 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
        <p className="text-xs text-slate-400 mt-1">URL 변경은 플랫폼 관리자에게 문의하세요.</p>
      </div>

      <div className="pt-1">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
