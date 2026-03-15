"use client";

import { useState } from "react";
import { payments, type PaymentStatus } from "../mockData";

const STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  PAID:      { label: "결제 완료", className: "bg-emerald-100 text-emerald-700" },
  REFUNDED:  { label: "환불",     className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "취소",     className: "bg-slate-100 text-slate-500" },
};

export default function PaymentTable() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");

  const filtered = payments.filter(
    (p) => statusFilter === "ALL" || p.status === statusFilter
  );

  const totalAmount = filtered
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-700">
        ⚠️ 이 메뉴는 <strong>B2C 테넌트</strong>에서만 활성화됩니다. B2B 조직(SSO 테넌트)에서는 개인 결제 기능이 없습니다.
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex gap-1">
            {(["ALL", "PAID", "REFUNDED", "CANCELLED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === s ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s === "ALL" ? "전체" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-slate-500">
            결제 합계: <span className="font-semibold text-slate-800">{totalAmount.toLocaleString()}원</span>
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">주문번호</th>
              <th className="text-left px-4 py-3 font-medium">학습자</th>
              <th className="text-left px-4 py-3 font-medium">코스</th>
              <th className="text-left px-4 py-3 font-medium">금액</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">결제일</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const badge = STATUS_CONFIG[p.status];
              return (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{p.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.learner}</td>
                  <td className="px-4 py-3 text-slate-600">{p.course}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{p.amount.toLocaleString()}원</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{p.paidAt}</td>
                  <td className="px-4 py-3">
                    {p.status === "PAID" && (
                      <button className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        환불
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
