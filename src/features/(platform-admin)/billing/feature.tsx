"use client";

import { useState } from "react";
import { TrendingUp, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { BILLING } from "./mockData";
import type { BillingPlan, BillingPaymentStatus, TenantInvoice } from "@/lib/models";

// ── 헬퍼 ───────────────────────────────────────────────────

function fmt(n: number) {
  if (n === 0) return "—";
  return n >= 100_000_000
    ? `${(n / 100_000_000).toFixed(0)}억`
    : `${(n / 10_000).toLocaleString()}만원`;
}

function fmtFull(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

const PLAN_COLOR: Record<BillingPlan, string> = {
  TRIAL:      "bg-amber-100 text-amber-700",
  STARTER:    "bg-slate-100 text-slate-600",
  BUSINESS:   "bg-blue-100 text-blue-700",
  ENTERPRISE: "bg-violet-100 text-violet-700",
};

const PAYMENT_CFG: Record<BillingPaymentStatus, { label: string; cls: string }> = {
  PAID:    { label: "납부 완료", cls: "bg-green-100 text-green-700" },
  OVERDUE: { label: "연체",     cls: "bg-red-100 text-red-700" },
  PENDING: { label: "청구 중",  cls: "bg-amber-100 text-amber-700" },
  EXEMPT:  { label: "해당 없음", cls: "bg-slate-100 text-slate-400" },
};

const INV_STATUS_CFG: Record<TenantInvoice["status"], { label: string; cls: string }> = {
  PAID:    { label: "납부", cls: "text-green-600" },
  OVERDUE: { label: "연체", cls: "text-red-600 font-semibold" },
  PENDING: { label: "청구", cls: "text-amber-600" },
};

// ── 메인 ───────────────────────────────────────────────────

export default function BillingFeature() {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const mrr = BILLING.reduce((s, b) => s + b.monthlyFeeKRW, 0);
  const arr = mrr * 12;
  const activeContracts = BILLING.filter(
    (b) => b.plan !== "TRIAL" && b.paymentStatus !== "EXEMPT",
  ).length;
  const overdueCount = BILLING.filter((b) => b.paymentStatus === "OVERDUE").length;

  const allInvoices = BILLING.flatMap((b) =>
    b.invoices.map((inv) => ({ ...inv, tenantName: b.tenantName, tenantId: b.tenantId })),
  ).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

  const detailBilling = selectedTenant
    ? BILLING.find((b) => b.tenantId === selectedTenant) ?? null
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">청구/결제</h2>
        <p className="text-sm text-slate-500">테넌트별 플랜·결제 현황 및 인보이스</p>
      </div>

      {/* ── 요약 카드 4개 ── */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          icon={<TrendingUp size={15} className="text-white" />}
          iconBg="bg-blue-500"
          label="MRR"
          value={fmt(mrr)}
          sub="월 반복 수익"
        />
        <SummaryCard
          icon={<TrendingUp size={15} className="text-white" />}
          iconBg="bg-indigo-500"
          label="ARR"
          value={fmt(arr)}
          sub="연간 반복 수익 (추정)"
        />
        <SummaryCard
          icon={<CreditCard size={15} className="text-white" />}
          iconBg="bg-teal-500"
          label="활성 계약"
          value={`${activeContracts}건`}
          sub="TRIAL·EXEMPT 제외"
        />
        <SummaryCard
          icon={<AlertCircle size={15} className="text-white" />}
          iconBg={overdueCount > 0 ? "bg-red-500" : "bg-slate-400"}
          label="연체"
          value={overdueCount > 0 ? `${overdueCount}건` : "없음"}
          sub="즉시 조치 필요"
          highlight={overdueCount > 0}
        />
      </div>

      {/* ── 청구 현황 테이블 ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">테넌트별 청구 현황</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["테넌트", "유형", "플랜", "월 요금", "결제 상태", "다음 청구일"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BILLING.map((b) => {
              const pay = PAYMENT_CFG[b.paymentStatus];
              return (
                <tr
                  key={b.tenantId}
                  className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedTenant === b.tenantId ? "bg-blue-50" : ""
                  }`}
                  onClick={() =>
                    setSelectedTenant(selectedTenant === b.tenantId ? null : b.tenantId)
                  }
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{b.tenantName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      b.tenantType === "B2B" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"
                    }`}>
                      {b.tenantType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_COLOR[b.plan]}`}>
                      {b.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {b.monthlyFeeKRW === 0 ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      fmtFull(b.monthlyFeeKRW)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pay.cls}`}>
                      {pay.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {b.nextBillingAt ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 인보이스 상세 (클릭 시 확장) ── */}
      {detailBilling && (
        <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">
              {detailBilling.tenantName} — 인보이스 이력
            </h3>
            <button
              onClick={() => setSelectedTenant(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              닫기
            </button>
          </div>
          {detailBilling.invoices.length === 0 ? (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">
              인보이스가 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["인보이스 ID", "발행일", "청구 기간", "금액", "상태"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailBilling.invoices.map((inv) => {
                  const cfg = INV_STATUS_CFG[inv.status];
                  return (
                    <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-xs font-mono text-slate-500">{inv.id}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-700">{inv.issuedAt}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">
                        {inv.periodStart} ~ {inv.periodEnd}
                      </td>
                      <td className="px-4 py-2.5 text-sm font-medium text-slate-800">
                        {fmtFull(inv.amountKRW)}
                      </td>
                      <td className={`px-4 py-2.5 text-xs ${cfg.cls}`}>{cfg.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── 최근 인보이스 전체 ── */}
      {!detailBilling && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">최근 인보이스</h3>
            <span className="text-xs text-slate-400">테넌트 행을 클릭하면 상세 인보이스 조회</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["발행일", "테넌트", "금액", "상태"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allInvoices.slice(0, 10).map((inv) => {
                const cfg = INV_STATUS_CFG[inv.status];
                return (
                  <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-xs text-slate-500">{inv.issuedAt}</td>
                    <td className="px-4 py-2.5 text-sm text-slate-700">{inv.tenantName}</td>
                    <td className="px-4 py-2.5 text-sm font-medium text-slate-800">
                      {fmtFull(inv.amountKRW)}
                    </td>
                    <td className={`px-4 py-2.5 text-xs ${cfg.cls}`}>{cfg.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon, iconBg, label, value, sub, highlight = false,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${highlight ? "border-red-200" : "border-slate-200"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-bold mb-1 ${highlight ? "text-red-600" : "text-slate-800"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}
