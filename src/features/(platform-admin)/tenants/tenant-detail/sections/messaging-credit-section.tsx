"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CreditLedger } from "@/lib/models";

const GRANT_PRESETS = [1000, 5000, 10000, 30000];

interface GrantModal {
  selected: number | null;
  customAmount: string;
  note: string;
}

interface Props {
  tenantId: string;
}

// 테넌트별 초기 잔액 (실험용 하드코드)
const INITIAL_BALANCES: Record<string, number> = {
  default: 10000,
};

export default function MessagingCreditSection({ tenantId }: Props) {
  const [balance, setBalance] = useState(INITIAL_BALANCES[tenantId] ?? INITIAL_BALANCES.default);
  const [ledger, setLedger] = useState<CreditLedger[]>([]);
  const [grantModal, setGrantModal] = useState<GrantModal | null>(null);

  function executeGrant() {
    if (!grantModal) return;
    const amt = grantModal.selected ?? parseInt(grantModal.customAmount, 10);
    if (!amt || amt <= 0) return;
    const entry: CreditLedger = {
      id: `pg-${Date.now()}`,
      channel: null,
      type: "GRANT",
      amount: amt,
      description: grantModal.note.trim() || "플랫폼 수동 지급",
      createdAt: new Date().toLocaleString("ko-KR", { hour12: false }).replace(/\. /g, "-").replace(/\./g, ""),
    };
    setBalance((prev) => prev + amt);
    setLedger((prev) => [entry, ...prev]);
    setGrantModal(null);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">메시징 크레딧</h3>

      {/* 단일 잔액 카드 */}
      <div className="bg-slate-50 rounded-xl p-5 flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">잔여 크레딧</p>
          <p className="text-3xl font-bold tabular-nums text-slate-800">{balance.toLocaleString()} cr</p>
        </div>
        <button
          onClick={() => setGrantModal({ selected: null, customAmount: "", note: "" })}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
        >
          크레딧 지급
        </button>
      </div>

      {/* 지급 이력 */}
      {ledger.length > 0 && (
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2.5 font-medium">일시</th>
                <th className="text-left px-4 py-2.5 font-medium">내용</th>
                <th className="text-right px-4 py-2.5 font-medium">지급량</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-2.5 text-xs text-slate-400 tabular-nums">{e.createdAt}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{e.description}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 tabular-nums text-right">
                    +{e.amount.toLocaleString()} cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 지급 모달 */}
      {grantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800">크레딧 지급</h2>
              <button onClick={() => setGrantModal(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <p className="text-xs text-slate-400 mb-2">지급량 선택</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {GRANT_PRESETS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setGrantModal({ ...grantModal, selected: amt, customAmount: "" })}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    grantModal.selected === amt
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {amt.toLocaleString()} cr
                </button>
              ))}
            </div>

            <div className="relative mb-3">
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right pr-8 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="직접 입력"
                value={grantModal.customAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setGrantModal({ ...grantModal, customAmount: raw, selected: null });
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">cr</span>
            </div>

            <div className="mb-5">
              <p className="text-xs text-slate-400 mb-1.5">메모 (선택)</p>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="예: 계약 기본 제공, 이벤트 지급 등"
                value={grantModal.note}
                onChange={(e) => setGrantModal({ ...grantModal, note: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setGrantModal(null)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={executeGrant}
                disabled={!grantModal.selected && !grantModal.customAmount}
                className="px-4 py-2 text-sm text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-40 transition-colors"
              >
                지급
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
