"use client";

import { useState } from "react";
import { messageHistory, type MessageChannel, type MessageStatus } from "../mockData";

const CHANNEL_CONFIG: Record<MessageChannel, { label: string; className: string }> = {
  SMS:   { label: "SMS",    className: "bg-blue-100 text-blue-700" },
  EMAIL: { label: "이메일", className: "bg-violet-100 text-violet-700" },
  KAKAO: { label: "알림톡", className: "bg-amber-100 text-amber-700" },
};

const STATUS_CONFIG: Record<MessageStatus, { label: string; className: string }> = {
  SENT:      { label: "발송완료", className: "bg-emerald-100 text-emerald-700" },
  FAILED:    { label: "실패",     className: "bg-red-100 text-red-600" },
  SCHEDULED: { label: "예약중",   className: "bg-amber-100 text-amber-700" },
};

type StatusFilter = MessageStatus | "ALL";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "ALL",       label: "전체" },
  { id: "SCHEDULED", label: "예약 대기" },
  { id: "SENT",      label: "발송 완료" },
  { id: "FAILED",    label: "실패" },
];

interface Props {
  channel: MessageChannel;
  onSendClick: () => void;
}

export default function HistoryTab({ channel, onSendClick }: Props) {
  const [history, setHistory] = useState(messageHistory);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const channelHistory = history.filter((m) => m.channel === channel);
  const filtered = channelHistory.filter(
    (m) => statusFilter === "ALL" || m.status === statusFilter
  );

  const cancelScheduled = (id: string) => {
    setHistory((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                statusFilter === f.id
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={onSendClick}
          className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          + 메시지 발송
        </button>
      </div>
      <p className="px-5 py-2 text-xs text-slate-400">{filtered.length}건</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">발송일시</th>
            <th className="text-left px-4 py-3 font-medium">수신자</th>
            <th className="text-left px-4 py-3 font-medium">내용</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
            <th className="text-left px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => {
            const st = STATUS_CONFIG[m.status];
            const isScheduled = m.status === "SCHEDULED";
            return (
              <tr
                key={m.id}
                className={`border-b border-slate-50 last:border-0 transition-colors ${
                  isScheduled ? "bg-amber-50/40 hover:bg-amber-50/60" : "hover:bg-slate-50/50"
                }`}
              >
                <td className="px-5 py-3 text-slate-400 text-xs tabular-nums">
                  {m.sentAt}
                  {isScheduled && (
                    <span className="ml-1.5 text-amber-600 font-medium">(예약)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700 font-medium">{m.recipient}</p>
                  <p className="text-xs text-slate-400">{m.recipientCount}명</p>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  {m.subject && <p className="text-xs font-medium text-slate-700 mb-0.5">{m.subject}</p>}
                  <p className="text-xs text-slate-400 truncate">{m.preview}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>
                    {st.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {isScheduled && (
                    <button
                      onClick={() => cancelScheduled(m.id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      예약 취소
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                발송 이력이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
