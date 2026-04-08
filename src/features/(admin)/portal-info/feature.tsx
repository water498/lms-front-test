"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { orgSettings } from "../settings-layout/mockData";

export default function PortalInfoFeature() {
  const [portalName, setPortalName] = useState(orgSettings.portalName);
  const portalUrl = `${orgSettings.subdomain}.lms.io`;

  const handleSave = () => {
    alert(`포털 정보 저장\n포털명: ${portalName}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 mb-0.5">포털 정보</h2>
        <p className="text-xs text-slate-400">학습자에게 노출되는 포털의 기본 정보를 설정합니다.</p>
      </div>

      {/* 포털명 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-600">포털명</label>
        <input
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={portalName}
          onChange={(e) => setPortalName(e.target.value)}
        />
        <p className="text-xs text-slate-400">브라우저 탭, 이메일 발신자명, 로그인 화면 등에 표시됩니다.</p>
      </div>

      {/* 로고 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-600">로고</label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-violet-400 hover:text-violet-400 cursor-pointer transition-colors">
            <span className="text-2xl">+</span>
            <span className="text-xs">업로드</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            PNG, SVG 권장<br />
            최소 200×80px
          </p>
        </div>
      </div>

      {/* 파비콘 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-600">파비콘</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-violet-400 hover:text-violet-400 cursor-pointer transition-colors">
            <span className="text-xl">+</span>
            <span className="text-xs">업로드</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            ICO, PNG 권장<br />
            32×32px 또는 64×64px
          </p>
        </div>
      </div>

      {/* 포털 URL — 읽기 전용 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-600">포털 URL</label>
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
        <p className="text-xs text-slate-400">URL 변경은 플랫폼 관리자에게 문의하세요.</p>
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
