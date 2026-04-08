"use client";

import { useState } from "react";
import { Navbar } from "../student-dashboard/components/navbar";
import { announcements } from "../student-dashboard/mockData";
import store from "../student-dashboard/store";

const FILTERS = ["전체", "NOTICE", "UPDATE", "EVENT"] as const;
type Filter = (typeof FILTERS)[number];

const SUBTYPE_LABEL: Record<string, string> = {
  NOTICE: "공지",
  EVENT:  "이벤트",
  UPDATE: "업데이트",
};

const FILTER_LABEL: Record<string, string> = {
  전체:   "전체",
  NOTICE: "공지",
  EVENT:  "이벤트",
  UPDATE: "업데이트",
};

const SUBTYPE_STYLES: Record<string, string> = {
  NOTICE: "bg-zinc-700/50 text-zinc-300",
  EVENT:  "bg-rose-900/40 text-rose-300",
  UPDATE: "bg-sky-900/40 text-sky-300",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Mock: add body text to announcements
const BODY_TEXT: Record<string, string> = {
  a1: "3월 10일부터 4월 30일까지 안전교육 전 강의를 30% 할인된 가격으로 수강하실 수 있습니다. 회원가입 후 쿠폰 코드 SPRING30을 입력해 주세요.",
  a2: "수료증 발급 시스템이 개선되어 발급 속도가 최대 3배 빨라졌습니다. 기존 발급 이력도 새로운 시스템에서 모두 확인하실 수 있습니다.",
  a3: "모바일 앱 v3.2 업데이트에서 오프라인 재생 기능이 추가되었습니다. 강의를 미리 다운로드해 두면 인터넷 없이도 학습이 가능합니다.",
  a4: "2026년 3월 1일부로 개인정보 처리방침이 일부 개정됩니다. 주요 변경 사항은 제3조(개인정보의 처리 목적) 항목입니다. 자세한 내용은 약관 페이지에서 확인하세요.",
  a5: "친구를 초대하면 초대자와 피초대자 모두에게 안전교육 수강권(30일)을 드립니다. 마이페이지 → 친구 초대 메뉴에서 초대 링크를 공유하세요.",
  a6: "설 연휴(1/28~1/30) 기간 동안 CS 운영 시간이 단축됩니다. 오전 10시 ~ 오후 3시까지만 응대 가능하오니 양해 부탁드립니다.",
};

export default function AnnouncementsFeature() {
  const cartCount = store.cart.size;
  const [filter, setFilter] = useState<Filter>("전체");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = announcements.filter(
    (a) => filter === "전체" || a.subtype === filter,
  );

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar cartCount={cartCount} />

      <main className="max-w-screen-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">공지사항</h1>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {FILTER_LABEL[f] ?? f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {filtered.map((ann) => {
            const isNew = ann.createdAt
              ? Date.now() - new Date(ann.createdAt).getTime() < SEVEN_DAYS_MS
              : false;
            const subtype = ann.subtype ?? "NOTICE";
            const dateStr = ann.sentAt
              ? ann.sentAt.slice(0, 10)
              : ann.createdAt.slice(0, 10);
            const isOpen = expanded === ann.id;

            return (
              <div
                key={ann.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : ann.id)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left"
                >
                  <span
                    className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                      SUBTYPE_STYLES[subtype] ?? "bg-zinc-700/50 text-zinc-300"
                    }`}
                  >
                    {SUBTYPE_LABEL[subtype] ?? subtype}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-zinc-200 truncate">{ann.title}</p>
                      {isNew && (
                        <span className="shrink-0 text-[10px] font-bold text-violet-400">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">{dateStr}</p>
                  </div>
                  <span className="shrink-0 text-zinc-600 text-xs mt-1">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="border-t border-zinc-800 pt-4">
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {BODY_TEXT[ann.id] ?? "내용이 없습니다."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
