"use client";

import { enrollmentsBySession } from "../shared/mockData";

const STATUS_LABEL = { ACTIVE: "수강 중", COMPLETED: "수료", CANCELLED: "취소" };
const STATUS_COLOR = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  COMPLETED: "bg-violet-500/15 text-violet-400",
  CANCELLED: "bg-zinc-700 text-zinc-500",
};

export default function StudentsTab({ sessionId }: { sessionId: string }) {
  const enrollments = enrollmentsBySession[sessionId] ?? [];

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <p className="text-sm">수강생이 없습니다.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-800">
          <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">수강생</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">이메일</th>
          <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500">진도</th>
          <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500">상태</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">등록일</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((e) => (
          <tr key={e.userId} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {e.name[0]}
                </div>
                <span className="font-medium text-zinc-200">{e.name}</span>
              </div>
            </td>
            <td className="px-5 py-3.5 text-zinc-400">{e.email}</td>
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-800 rounded-full h-1.5 max-w-[80px] mx-auto">
                  <div
                    className="bg-violet-500 h-1.5 rounded-full"
                    style={{ width: `${e.progress}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-8 text-right">{e.progress}%</span>
              </div>
            </td>
            <td className="px-5 py-3.5 text-center">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[e.status]}`}>
                {STATUS_LABEL[e.status]}
              </span>
            </td>
            <td className="px-5 py-3.5 text-zinc-400">{e.enrolledAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
