"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { orgSettings } from "../settings-layout/mockData";

export default function GeneralTab() {
  const [contactEmail, setContactEmail] = useState(orgSettings.contactEmail);

  return (
    <div className="max-w-lg flex flex-col gap-5">
      {/* 조직명 — read-only */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">조직명</label>
        <input
          readOnly
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-default"
          value={orgSettings.name}
        />
        <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
          <Info size={12} />
          변경이 필요하면 플랫폼 관리자에게 문의하세요.
        </p>
      </div>

      {/* 학습자 문의 이메일 */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">학습자 문의 이메일</label>
        <input
          type="email"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-1">수강생이 도움을 요청할 때 표시되는 연락처입니다.</p>
      </div>

      <div className="pt-2">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
