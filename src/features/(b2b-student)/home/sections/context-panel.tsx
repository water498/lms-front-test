"use client";

import { useState } from "react";

export function ContextPanel() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-zinc-900/60 border-b border-zinc-800/70">
      <div className="max-w-screen-xl mx-auto px-6 py-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center w-full py-1.5 text-xs"
        >
          <span className="font-semibold text-zinc-400">실험 소개 (B2B)</span>
          <span className="ml-auto text-zinc-600">{open ? "접기 ↑" : "펼치기 ↓"}</span>
        </button>
        {open && (
          <div className="pb-3 grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-zinc-500 font-medium mb-1">목적</p>
              <p className="text-zinc-400">B2B SSO 테넌트 대시보드 — 테넌트 브랜딩, 필수 수강 섹션, 필수/선택 배지, 개인 결제 없음</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">B2C 대비 차이점</p>
              <p className="text-zinc-400">장바구니 없음, 위시리스트만 유지, 필수 수강 과정 섹션 추가, Navbar에 부서 표시</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">핵심 확인 포인트</p>
              <p className="text-zinc-400">필수/선택 배지, 테넌트 로고 텍스트, 마이페이지 SSO 필드 read-only</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
