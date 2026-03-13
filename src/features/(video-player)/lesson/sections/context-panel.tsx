"use client";

import { useState } from "react";

export function ContextPanel() {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-zinc-800 bg-zinc-900/30 shrink-0">
      <div className="px-6 py-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center w-full py-1.5 text-xs"
        >
          <span className="font-semibold text-zinc-400">실험 소개</span>
          <span className="ml-auto text-zinc-600">{open ? "접기 ↑" : "펼치기 ↓"}</span>
        </button>
        {open && (
          <div className="pb-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-zinc-500 font-medium mb-1">목적</p>
              <p className="text-zinc-400">Video.js mp4/HLS 재생 방식 비교 및 법정의무교육 제어 로직 탐색</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">테스트 기술</p>
              <p className="text-zinc-400">Video.js 8 VHS (HLS 내장), 시청 구간 Range 추적, seeking 이벤트 제어</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">핵심 확인 포인트</p>
              <p className="text-zinc-400">HLS vs mp4 버퍼 차이, 앞으로 건너뛰기 차단, 80% 시청 완료 조건</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium mb-1">HLS 변환 (ffmpeg)</p>
              <p className="text-zinc-400 font-mono break-all leading-relaxed">
                ffmpeg -i public/sample-video.mp4 -codec: copy -hls_time 10 -f hls public/sample-hls/playlist.m3u8
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
