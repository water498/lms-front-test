"use client";

import { useState } from "react";
import { Zap, RefreshCw, X, Check } from "lucide-react";
import type { MessageChannel, CreditLedger, CreditTransactionType } from "@/lib/models";
import { creditPool, CREDITS_PER_MESSAGE, creditLedger as INITIAL_LEDGER } from "@/features/(admin)/messaging/mockData";

const TOPUP_PACKAGES = [1000, 5000, 10000, 30000];

const CHANNEL_BADGE: Record<MessageChannel, string> = {
  SMS:   "bg-blue-100 text-blue-700",
  KAKAO: "bg-amber-100 text-amber-700",
  EMAIL: "bg-violet-100 text-violet-700",
};
const CHANNEL_LABEL: Record<MessageChannel, string> = {
  SMS: "SMS", KAKAO: "알림톡", EMAIL: "이메일",
};

const TX_CONFIG: Record<CreditTransactionType, { label: string; className: string }> = {
  TOPUP: { label: "충전",     className: "bg-blue-100 text-blue-700" },
  GRANT: { label: "플랫폼지급", className: "bg-green-100 text-green-700" },
  USAGE: { label: "사용",     className: "bg-slate-100 text-slate-500" },
};

interface TopUpModal {
  selected: number | null;
  customAmount: string;
}

interface AutoEdit {
  threshold: string;
  amount: string;
}

export default function CreditsFeature() {
  const [balance, setBalance] = useState(creditPool.balance);
  const [autoTopUp, setAutoTopUp] = useState(creditPool.autoTopUp);
  const [autoThreshold, setAutoThreshold] = useState(creditPool.autoTopUpThreshold);
  const [autoAmount, setAutoAmount] = useState(creditPool.autoTopUpAmount);
  const [ledger, setLedger] = useState<CreditLedger[]>(INITIAL_LEDGER);
  const [topUpModal, setTopUpModal] = useState<TopUpModal | null>(null);
  const [autoEdit, setAutoEdit] = useState<AutoEdit | null>(null);

  function executeTopUp() {
    if (!topUpModal) return;
    const amt = topUpModal.selected ?? parseInt(topUpModal.customAmount, 10);
    if (!amt || amt <= 0) return;
    const entry: CreditLedger = {
      id: `cl-${Date.now()}`,
      channel: null,
      type: "TOPUP",
      amount: amt,
      description: "셀프 충전",
      createdAt: new Date().toLocaleString("ko-KR", { hour12: false }).replace(/\. /g, "-").replace(/\./g, ""),
    };
    setBalance((prev) => prev + amt);
    setLedger((prev) => [entry, ...prev]);
    setTopUpModal(null);
  }

  function saveAutoEdit() {
    if (!autoEdit) return;
    const threshold = parseInt(autoEdit.threshold, 10);
    const amount = parseInt(autoEdit.amount, 10);
    if (!threshold || !amount) return;
    setAutoThreshold(threshold);
    setAutoAmount(amount);
    setAutoEdit(null);
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* 상단 요약 카드 */}
      <div className="bg-slate-800 rounded-2xl p-6 text-white">
        <p className="text-sm font-medium text-slate-400 mb-1">잔여 크레딧</p>
        <p className="text-4xl font-bold tabular-nums mb-4">{balance.toLocaleString()} cr</p>
        <div className="flex gap-3 flex-wrap">
          {(["SMS", "KAKAO", "EMAIL"] as MessageChannel[]).map((ch) => {
            const cost = CREDITS_PER_MESSAGE[ch];
            const count = Math.floor(balance / cost);
            return (
              <div key={ch} className="bg-white/10 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
                <span className="text-xs text-slate-400">{CHANNEL_LABEL[ch]}</span>
                <span className="text-sm font-semibold tabular-nums">약 {count.toLocaleString()}건</span>
                <span className="text-xs text-slate-400">건당 {cost} cr</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 충전 섹션 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">크레딧 충전</h3>
          <button
            onClick={() => setTopUpModal({ selected: null, customAmount: "" })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Zap size={14} />
            충전하기
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TOPUP_PACKAGES.map((pkg) => (
            <div key={pkg} className="border border-slate-200 rounded-xl px-4 py-3 text-center">
              <p className="text-base font-bold text-slate-800 tabular-nums">{pkg.toLocaleString()} cr</p>
            </div>
          ))}
        </div>
      </div>

      {/* 자동 충전 설정 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={15} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">자동 충전</h3>
          </div>
          <button
            onClick={() => setAutoTopUp((v) => !v)}
            className={`w-9 h-5 rounded-full transition-colors relative ${autoTopUp ? "bg-violet-500" : "bg-slate-200"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${autoTopUp ? "left-4" : "left-0.5"}`} />
          </button>
        </div>

        {autoTopUp && (
          autoEdit ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>잔액</span>
              <input
                className="w-24 border border-slate-200 rounded px-2 py-1 text-right text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-400"
                value={autoEdit.threshold}
                onChange={(e) => setAutoEdit({ ...autoEdit, threshold: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="2000"
              />
              <span>cr 이하 시</span>
              <input
                className="w-24 border border-slate-200 rounded px-2 py-1 text-right text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-400"
                value={autoEdit.amount}
                onChange={(e) => setAutoEdit({ ...autoEdit, amount: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="10000"
              />
              <span>cr 충전</span>
              <button onClick={saveAutoEdit} className="p-1 text-violet-600 hover:bg-violet-50 rounded"><Check size={12} /></button>
              <button onClick={() => setAutoEdit(null)} className="p-1 text-slate-400 hover:bg-slate-50 rounded"><X size={12} /></button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                잔액 <strong className="text-slate-700">{autoThreshold.toLocaleString()} cr</strong> 이하 시{" "}
                <strong className="text-slate-700">{autoAmount.toLocaleString()} cr</strong> 자동 충전
              </span>
              <button
                onClick={() => setAutoEdit({ threshold: String(autoThreshold), amount: String(autoAmount) })}
                className="text-violet-600 hover:underline"
              >
                수정
              </button>
            </div>
          )
        )}
        {!autoTopUp && (
          <p className="text-xs text-slate-400">자동 충전 비활성화 — 잔액 부족 시 수동으로 충전해야 합니다.</p>
        )}
      </div>

      {/* 이력 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">충전 및 사용 이력</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-2.5 font-medium">일시</th>
              <th className="text-left px-4 py-2.5 font-medium">유형</th>
              <th className="text-left px-4 py-2.5 font-medium">채널</th>
              <th className="text-left px-4 py-2.5 font-medium">내용</th>
              <th className="text-right px-5 py-2.5 font-medium">크레딧</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => {
              const txCfg = TX_CONFIG[entry.type];
              return (
                <tr key={entry.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-2.5 text-slate-400 text-xs tabular-nums">{entry.createdAt}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${txCfg.className}`}>{txCfg.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {entry.channel ? (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${CHANNEL_BADGE[entry.channel]}`}>
                        {CHANNEL_LABEL[entry.channel]}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{entry.description}</td>
                  <td className={`px-5 py-2.5 text-sm font-semibold tabular-nums text-right ${entry.amount > 0 ? "text-blue-600" : "text-slate-500"}`}>
                    {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()} cr
                  </td>
                </tr>
              );
            })}
            {ledger.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">이력이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 충전 모달 */}
      {topUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800">크레딧 충전</h2>
              <button onClick={() => setTopUpModal(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <p className="text-xs text-slate-400 mb-3">패키지 선택</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {TOPUP_PACKAGES.map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setTopUpModal({ ...topUpModal, selected: pkg, customAmount: "" })}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    topUpModal.selected === pkg
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {pkg.toLocaleString()} cr
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1.5">직접 입력</p>
              <div className="relative">
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right pr-8 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="0"
                  value={topUpModal.customAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setTopUpModal({ ...topUpModal, customAmount: raw, selected: null });
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">cr</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setTopUpModal(null)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={executeTopUp}
                disabled={!topUpModal.selected && !topUpModal.customAmount}
                className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 transition-colors"
              >
                충전하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
