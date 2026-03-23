"use client";

import { useState } from "react";
import type { InstructorPayout, InstructorPayoutStatus } from "@/lib/models";
import { payouts as initialPayouts, INSTRUCTOR_NAMES } from "./mockData";

const STATUS_TABS: { id: InstructorPayoutStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "전체" },
  { id: "PENDING", label: "정산 대기" },
  { id: "CONFIRMED", label: "확정" },
  { id: "PAID", label: "지급 완료" },
];

const STATUS_BADGE: Record<
  InstructorPayoutStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "정산 대기", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "확정", className: "bg-blue-100 text-blue-700" },
  PAID: { label: "지급 완료", className: "bg-green-100 text-green-700" },
};

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function formatPeriod(start: string, end: string) {
  return `${start.slice(0, 7)} (${start.slice(8, 10)}일~${end.slice(8, 10)}일)`;
}

export default function PayoutsFeature() {
  const [payouts, setPayouts] = useState<InstructorPayout[]>(initialPayouts);
  const [activeFilter, setActiveFilter] = useState<
    InstructorPayoutStatus | "ALL"
  >("ALL");

  const pendingTotal = payouts
    .filter((p) => p.status === "PENDING")
    .reduce((acc, p) => acc + p.netAmount, 0);

  const confirmedTotal = payouts
    .filter((p) => p.status === "CONFIRMED")
    .reduce((acc, p) => acc + p.netAmount, 0);

  const paidTotal = payouts
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.netAmount, 0);

  const visible =
    activeFilter === "ALL"
      ? payouts
      : payouts.filter((p) => p.status === activeFilter);

  function handleConfirm(id: string) {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "CONFIRMED" } : p))
    );
  }

  function handlePay(id: string) {
    const today = new Date().toISOString().slice(0, 10);
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "PAID", paidAt: today } : p
      )
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">강사 정산</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          강사별 수익 정산 현황을 관리합니다.
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard
          label="정산 대기 총액"
          value={formatKRW(pendingTotal)}
          accent="amber"
        />
        <SummaryCard
          label="이번 달 지급 예정"
          value={formatKRW(confirmedTotal)}
          accent="blue"
        />
        <SummaryCard
          label="누적 지급액"
          value={formatKRW(paidTotal)}
          accent="green"
        />
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1 border-b border-slate-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeFilter === tab.id
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                강사
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                정산 기간
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">
                총 매출
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">
                수수료 (20%)
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">
                실 지급액
              </th>
              <th className="text-center px-4 py-3 font-medium text-slate-500">
                상태
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                지급일
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-12 text-slate-400 text-sm"
                >
                  해당 상태의 정산 내역이 없습니다.
                </td>
              </tr>
            )}
            {visible.map((payout) => {
              const badge = STATUS_BADGE[payout.status];
              return (
                <tr
                  key={payout.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {INSTRUCTOR_NAMES[payout.instructorUserId] ??
                      payout.instructorUserId}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPeriod(payout.periodStart, payout.periodEnd)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatKRW(payout.grossRevenue)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {formatKRW(payout.platformFee)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {formatKRW(payout.netAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {payout.paidAt ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {payout.status === "PENDING" && (
                      <button
                        onClick={() => handleConfirm(payout.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        정산 확정
                      </button>
                    )}
                    {payout.status === "CONFIRMED" && (
                      <button
                        onClick={() => handlePay(payout.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
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

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "amber" | "blue" | "green";
}) {
  const accentClass = {
    amber: "text-amber-600",
    blue: "text-blue-600",
    green: "text-green-600",
  }[accent];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}
