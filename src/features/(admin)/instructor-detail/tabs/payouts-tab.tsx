"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import type { InstructorRevenue, InstructorRevenueStatus } from "@/lib/models";

interface Props {
  revenues: InstructorRevenue[];
}

const STATUS_BADGE: Record<InstructorRevenueStatus, { label: string; className: string }> = {
  PENDING:  { label: "정산 대기", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "확정",     className: "bg-blue-100 text-blue-700" },
  PAID:     { label: "지급 완료", className: "bg-emerald-100 text-emerald-700" },
};

const REVENUE_TYPE_LABEL: Record<string, string> = {
  COURSE_SALE: "과정 판매",
  FLAT_FEE:    "고정 계약",
  BONUS:       "보너스",
  ADJUSTMENT:  "조정",
};

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function InstructorPayoutsTab({ revenues }: Props) {
  const [items, setItems] = useState<InstructorRevenue[]>(revenues);

  function handleConfirm(id: string) {
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, status: "APPROVED" as const } : p));
  }

  function handlePay(id: string) {
    setItems((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: "PAID" as const, paidAt: new Date().toISOString().slice(0, 10) } : p)
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Wallet size={36} className="text-slate-200" />
        <p className="text-sm">정산 내역이 없습니다.</p>
      </div>
    );
  }

  const pendingTotal  = items.filter((p) => p.status === "PENDING").reduce((a, p) => a + p.netAmount, 0);
  const approvedTotal = items.filter((p) => p.status === "APPROVED").reduce((a, p) => a + p.netAmount, 0);
  const paidTotal     = items.filter((p) => p.status === "PAID").reduce((a, p) => a + p.netAmount, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "정산 대기",    value: formatKRW(pendingTotal),  color: "text-amber-600" },
          { label: "지급 예정",    value: formatKRW(approvedTotal), color: "text-blue-600" },
          { label: "누적 지급액",  value: formatKRW(paidTotal),     color: "text-emerald-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-2.5 font-semibold text-slate-500">정산 유형</th>
              <th className="text-left px-5 py-2.5 font-semibold text-slate-500">정산 기간</th>
              <th className="text-right px-5 py-2.5 font-semibold text-slate-500">총 매출</th>
              <th className="text-right px-5 py-2.5 font-semibold text-slate-500">실 지급액</th>
              <th className="text-center px-5 py-2.5 font-semibold text-slate-500">상태</th>
              <th className="text-left px-5 py-2.5 font-semibold text-slate-500">지급일</th>
              <th className="px-5 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">
                    {REVENUE_TYPE_LABEL[item.revenueType] ?? item.revenueType}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {item.periodStart && item.periodEnd
                      ? `${item.periodStart.slice(0, 7)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-700">{formatKRW(item.grossAmount)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-800">{formatKRW(item.netAmount)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{item.paidAt ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    {item.status === "PENDING" && (
                      <button
                        onClick={() => handleConfirm(item.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        확정
                      </button>
                    )}
                    {item.status === "APPROVED" && (
                      <button
                        onClick={() => handlePay(item.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        지급 처리
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
