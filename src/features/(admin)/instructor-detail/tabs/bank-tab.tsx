"use client";

import { useState } from "react";
import { CreditCard, Plus, X } from "lucide-react";
import type { InstructorBankAccount } from "@/lib/models";

interface Props {
  accounts: InstructorBankAccount[];
  instructorId: string;
}

export default function InstructorBankTab({ accounts, instructorId }: Props) {
  const [items, setItems] = useState<InstructorBankAccount[]>(accounts);
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  function handleAdd() {
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) return;
    const newAccount: InstructorBankAccount = {
      id: `ba-${Date.now()}`,
      instructorId,
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
      isPrimary: items.length === 0,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newAccount]);
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
    setShowForm(false);
  }

  function handleSetPrimary(id: string) {
    setItems((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id })));
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">등록 계좌</p>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-violet-600 font-medium hover:text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <Plus size={13} />
            계좌 추가
          </button>
        </div>

        {items.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <CreditCard size={36} className="text-slate-200" />
            <p className="text-sm">등록된 계좌가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((acc) => (
              <div key={acc.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <CreditCard size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{acc.bankName}</p>
                      {acc.isPrimary && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                          주계좌
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {acc.accountNumber} · {acc.accountHolder}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!acc.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(acc.id)}
                      className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      주계좌 설정
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 추가 폼 */}
        {showForm && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
            <p className="text-xs font-semibold text-slate-600">새 계좌 등록</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">은행명</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="예: 신한은행"
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">계좌번호</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="'-' 없이 입력"
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">예금주</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="예금주명"
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="text-xs text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                disabled={!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
