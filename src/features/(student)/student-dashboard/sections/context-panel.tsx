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
          <span className="font-semibold text-zinc-400">실험 소개</span>
          <span className="ml-auto text-zinc-600">{open ? "접기 ↑" : "펼치기 ↓"}</span>
        </button>
        {open && (
          <div className="pb-3 grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-zinc-500 font-medium mb-1">목적</p>
              <p className="text-zinc-400">OTT 스타일 LMS 수강생 대시보드 UI/UX 프로토타입 (온/오프라인 구분, 장바구니, 위시리스트, 마이페이지)</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">테스트 기술</p>
              <p className="text-zinc-400">유형 필터, 모듈 레벨 상태 공유, 오프라인 강의 카드 UI, 카트·위시리스트 토글</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">핵심 확인 포인트</p>
              <p className="text-zinc-400">온/오프라인 카드 UI 차이, 장바구니 badge 업데이트, 소프트 네비게이션 간 상태 유지</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
