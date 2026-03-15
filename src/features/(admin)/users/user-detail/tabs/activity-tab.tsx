"use client";

import { activityLogs } from "../mockData";

export default function ActivityTab({ userId }: { userId: string }) {
  const logs = activityLogs[userId] ?? [];

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-16 text-center text-slate-400 text-sm">
        활동 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50">
      {logs.map((log, i) => (
        <div key={i} className="flex items-start gap-4 px-5 py-3">
          <span className="text-xs text-slate-400 tabular-nums whitespace-nowrap pt-0.5 w-36 flex-shrink-0">
            {log.date}
          </span>
          <div>
            <span className="text-sm font-medium text-slate-700">{log.action}</span>
            <span className="text-sm text-slate-400 ml-2">{log.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
