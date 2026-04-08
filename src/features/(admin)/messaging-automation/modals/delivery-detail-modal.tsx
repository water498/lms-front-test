"use client";

import { X } from "lucide-react";
import type { MessageHistory, MessageDelivery } from "@/lib/models";

const CHANNEL_LABEL: Record<string, string> = {
  SMS: "SMS",
  EMAIL: "이메일",
  KAKAO: "알림톡",
};

const DELIVERY_STATUS_CONFIG: Record<MessageDelivery["status"], { label: string; className: string }> = {
  PENDING:   { label: "대기",   className: "bg-slate-100 text-slate-600" },
  DELIVERED: { label: "성공",   className: "bg-emerald-100 text-emerald-700" },
  FAILED:    { label: "실패",   className: "bg-red-100 text-red-600" },
  BOUNCED:   { label: "반송",   className: "bg-amber-100 text-amber-700" },
};

interface Props {
  history: MessageHistory;
  deliveries: MessageDelivery[];
  onClose: () => void;
}

export default function DeliveryDetailModal({ history, deliveries, onClose }: Props) {
  const statusCounts = {
    total: deliveries.length,
    delivered: deliveries.filter((d) => d.status === "DELIVERED").length,
    failed: deliveries.filter((d) => d.status === "FAILED").length,
    bounced: deliveries.filter((d) => d.status === "BOUNCED").length,
    pending: deliveries.filter((d) => d.status === "PENDING").length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">발송 상세</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message info */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400 w-16 flex-shrink-0">채널</span>
            <span className="text-slate-700 font-medium">{CHANNEL_LABEL[history.channel] ?? history.channel}</span>
          </div>
          {history.emailSubject && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-400 w-16 flex-shrink-0">제목</span>
              <span className="text-slate-700">{history.emailSubject}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400 w-16 flex-shrink-0">발송일시</span>
            <span className="text-slate-700 tabular-nums">{history.sentAt}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-slate-400 w-16 flex-shrink-0">내용</span>
            <span className="text-slate-600 text-xs leading-relaxed">{history.preview}</span>
          </div>
        </div>

        {/* Status summary bar */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>전체 <strong className="text-slate-700">{statusCounts.total}</strong>건</span>
            <span className="text-slate-200">|</span>
            <span>성공 <strong className="text-emerald-600">{statusCounts.delivered}</strong></span>
            <span className="text-slate-200">|</span>
            <span>실패 <strong className="text-red-600">{statusCounts.failed}</strong></span>
            {statusCounts.bounced > 0 && (
              <>
                <span className="text-slate-200">|</span>
                <span>반송 <strong className="text-amber-600">{statusCounts.bounced}</strong></span>
              </>
            )}
            {statusCounts.pending > 0 && (
              <>
                <span className="text-slate-200">|</span>
                <span>대기 <strong className="text-slate-600">{statusCounts.pending}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Deliveries table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left px-6 py-2.5 font-medium">수신 연락처</th>
                <th className="text-left px-4 py-2.5 font-medium">상태</th>
                <th className="text-left px-4 py-2.5 font-medium">수신 시각</th>
                <th className="text-left px-4 py-2.5 font-medium">오류</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => {
                const st = DELIVERY_STATUS_CONFIG[d.status];
                return (
                  <tr key={d.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-2.5 text-slate-700 text-xs tabular-nums">{d.recipientContact}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-400 tabular-nums">
                      {d.deliveredAt ?? "-"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-red-500">
                      {d.errorMessage ?? ""}
                    </td>
                  </tr>
                );
              })}
              {deliveries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                    발송 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
