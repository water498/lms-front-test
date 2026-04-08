"use client";

import { userEnrollments, type UserEnrollment } from "../mockData";

const STATUS_CONFIG = {
  ACTIVE:    { label: "진행중",   className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "완료",     className: "bg-emerald-100 text-emerald-700" },
  FAILED:    { label: "수료불가", className: "bg-red-100 text-red-600" },
  CANCELLED: { label: "취소",     className: "bg-slate-100 text-slate-500" },
  EXPIRED:   { label: "만료",     className: "bg-amber-100 text-amber-700" },
} satisfies Record<UserEnrollment["status"], { label: string; className: string }>;

export default function EnrollmentsTab({ userId }: { userId: string }) {
  const enrollments = userEnrollments[userId] ?? [];

  if (enrollments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-16 text-center text-slate-400 text-sm">
        수강 이력이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">과정</th>
            <th className="text-left px-4 py-3 font-medium">차수</th>
            <th className="text-left px-4 py-3 font-medium">진행률</th>
            <th className="text-left px-4 py-3 font-medium">상태</th>
            <th className="text-left px-4 py-3 font-medium">수료증</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e, i) => {
            const s = STATUS_CONFIG[e.status];
            return (
              <tr key={i} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-slate-800">{e.courseTitle}</td>
                <td className="px-4 py-3 text-slate-500">{e.session}</td>
                <td className="px-4 py-3 w-40">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">{e.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.className}`}>
                    {s.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {e.hasCertificate ? (
                    <span className="text-xs text-emerald-600 font-medium">발급됨</span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
