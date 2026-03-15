"use client";

import { messageHistory, type MessageChannel, type MessageStatus } from "../mockData";

const CHANNEL_CONFIG: Record<MessageChannel, { label: string; className: string }> = {
  SMS:   { label: "SMS",    className: "bg-blue-100 text-blue-700" },
  EMAIL: { label: "이메일", className: "bg-violet-100 text-violet-700" },
  KAKAO: { label: "알림톡", className: "bg-amber-100 text-amber-700" },
};

const STATUS_CONFIG: Record<MessageStatus, { label: string; className: string }> = {
  SENT:      { label: "발송완료", className: "bg-emerald-100 text-emerald-700" },
  FAILED:    { label: "실패",     className: "bg-red-100 text-red-600" },
  SCHEDULED: { label: "예약중",   className: "bg-slate-100 text-slate-600" },
};

interface Props {
  onSendClick: () => void;
}

export default function HistoryTab({ onSendClick }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">{messageHistory.length}건</p>
        <button
          onClick={onSendClick}
          className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          + 메시지 발송
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">발송일시</th>
            <th className="text-left px-4 py-3 font-medium">수신자</th>
            <th className="text-left px-4 py-3 font-medium">채널</th>
            <th className="text-left px-4 py-3 font-medium">내용</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {messageHistory.map((m) => {
            const ch = CHANNEL_CONFIG[m.channel];
            const st = STATUS_CONFIG[m.status];
            return (
              <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-slate-400 text-xs tabular-nums">{m.sentAt}</td>
                <td className="px-4 py-3">
                  <p className="text-slate-700 font-medium">{m.recipient}</p>
                  <p className="text-xs text-slate-400">{m.recipientCount}명</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ch.className}`}>
                    {ch.label}
                  </span>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
