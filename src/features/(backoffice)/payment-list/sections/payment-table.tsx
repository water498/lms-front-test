"use client";

import { useState } from "react";
import { payments, orders, orderItems, learnerNames, courseTitles, type PaymentStatus } from "../mockData";

const STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  PAID:      { label: "결제 완료", className: "bg-emerald-100 text-emerald-700" },
  REFUNDED:  { label: "환불",     className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "취소",     className: "bg-slate-100 text-slate-500" },
};

const METHOD_LABEL: Record<string, string> = {
  CARD: "카드", BANK_TRANSFER: "계좌이체", KAKAO_PAY: "카카오페이", NAVER_PAY: "네이버페이",
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
              <th className="text-left px-4 py-3 font-medium">과정</th>
              <th className="text-right px-4 py-3 font-medium">정가</th>
              <th className="text-right px-4 py-3 font-medium">할인</th>
              <th className="text-right px-4 py-3 font-medium">결제액</th>
              <th className="text-left px-4 py-3 font-medium">수단</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">결제일</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const order = orders.find((o) => o.id === p.orderId);
              const items = orderItems.filter((i) => i.orderId === p.orderId);
              const courseLabel =
                items.length === 0 ? "—"
                : items.length === 1 ? (courseTitles[items[0].courseId] ?? items[0].courseId)
                : `${courseTitles[items[0].courseId] ?? ""} 외 ${items.length - 1}건`;
              const badge = STATUS_CONFIG[p.status];
              return (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{order?.orderNumber ?? p.orderId}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{order ? (learnerNames[order.userId] ?? order.userId) : "—"}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{courseLabel}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{order ? `${order.originalPrice.toLocaleString()}원` : "—"}</td>
                  <td className="px-4 py-3 text-right text-rose-500">
                    {order?.discountAmount ? `−${order.discountAmount.toLocaleString()}원` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{p.amount.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{p.paymentMethod ? METHOD_LABEL[p.paymentMethod] : "—"}</td>
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
