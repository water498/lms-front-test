"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import {
  CURRENT_INSTRUCTOR_ID,
  instructorBankAccounts,
} from "../shared/mockData";
import type { InstructorBankAccount } from "@/lib/models";

const BANKS = [
  "카카오뱅크", "신한은행", "국민은행", "우리은행", "하나은행",
  "기업은행", "농협은행", "토스뱅크", "케이뱅크",
];

export default function InstructorBankFeature() {
  const initial = instructorBankAccounts[CURRENT_INSTRUCTOR_ID] ?? [];
  const [accounts, setAccounts] = useState<InstructorBankAccount[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bankName: "", accountNumber: "", accountHolder: "" });

  const handleAdd = () => {
    if (!form.bankName || !form.accountNumber.trim() || !form.accountHolder.trim()) return;
    const newAcc: InstructorBankAccount = {
      id: `ba-${Date.now()}`,
      instructorId: CURRENT_INSTRUCTOR_ID,
      bankName: form.bankName,
      accountNumber: form.accountNumber.trim(),
      accountHolder: form.accountHolder.trim(),
      isPrimary: accounts.length === 0,
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, newAcc]);
    setForm({ bankName: "", accountNumber: "", accountHolder: "" });
    setShowForm(false);
  };

  const handleSetPrimary = (id: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id })));
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // 삭제된 계좌가 primary였다면 첫 번째를 primary로
      const deletedWasPrimary = prev.find((a) => a.id === id)?.isPrimary;
      if (deletedWasPrimary && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isPrimary: true };
      }
      return filtered;
    });
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">계좌 정보</h1>
          <p className="text-sm text-slate-500 mt-1">정산금을 수령할 계좌를 관리합니다.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-slate-900 text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={15} />
            계좌 추가
          </button>
        )}
      </div>

      {/* 계좌 등록 폼 */}
      {showForm && (
        <div className="bg-white border border-violet-600/40 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-900">새 계좌 등록</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-500">은행</label>
              <select
                value={form.bankName}
                onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="">선택</option>
                {BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-500">계좌번호</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                placeholder="숫자만 입력"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-500">예금주</label>
              <input
                type="text"
                value={form.accountHolder}
                onChange={(e) => setForm((f) => ({ ...f, accountHolder: e.target.value }))}
                placeholder="예금주명"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => { setShowForm(false); setForm({ bankName: "", accountNumber: "", accountHolder: "" }); }}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-slate-900 text-sm font-medium rounded-lg transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 계좌 목록 */}
      <div className="flex flex-col gap-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`bg-white border rounded-xl p-5 flex items-center gap-4 ${
              acc.isPrimary ? "border-violet-600/50" : "border-slate-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              acc.isPrimary ? "bg-violet-50" : "bg-slate-50"
            }`}>
              <CreditCard size={18} className={acc.isPrimary ? "text-violet-600" : "text-slate-400"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{acc.bankName}</p>
                {acc.isPrimary && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-full">
                    <Check size={10} />
                    주 계좌
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {acc.accountNumber} · {acc.accountHolder}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!acc.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(acc.id)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg transition-colors"
                >
                  주 계좌로 설정
                </button>
              )}
              <button
                onClick={() => handleDelete(acc.id)}
                className="p-1.5 text-slate-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && !showForm && (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
          <CreditCard size={32} className="text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">등록된 계좌가 없습니다.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 px-4 py-2 text-sm text-violet-600 hover:text-violet-500 transition-colors"
          >
            + 계좌 추가
          </button>
        </div>
      )}
    </div>
  );
}
