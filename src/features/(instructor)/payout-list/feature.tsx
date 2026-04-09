"use client";

import { CURRENT_INSTRUCTOR_ID, instructorRevenues } from "../shared/mockData";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "지급 대기",
  APPROVED: "승인됨",
  PAID: "지급 완료",
  CANCELLED: "취소됨",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-sky-500/15 text-sky-400",
  PAID: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-zinc-700 text-zinc-500",
};

export default function InstructorPayoutsFeature() {
  const revenues = instructorRevenues[CURRENT_INSTRUCTOR_ID] ?? [];

  const totalPaid = revenues
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + r.netAmount, 0);
  const totalPending = revenues
    .filter((r) => r.status === "PENDING" || r.status === "APPROVED")
    .reduce((sum, r) => sum + r.netAmount, 0);

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">정산 내역</h1>
        <p className="text-sm text-zinc-400 mt-1">월별 정산 현황을 확인할 수 있습니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-xs text-zinc-500 mb-1">지급 완료</p>
          <p className="text-2xl font-bold text-emerald-400">₩{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-xs text-zinc-500 mb-1">지급 대기 / 승인</p>
          <p className="text-2xl font-bold text-amber-400">₩{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* 정산 테이블 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">정산 기간</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">유형</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500">매출</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500">수수료율</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500">정산액</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500">상태</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">지급일</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-3.5 text-zinc-300">
                  {r.periodStart} ~ {r.periodEnd}
                </td>
                <td className="px-5 py-3.5 text-zinc-400">
                  {r.revenueType === "COURSE_SALE" ? "강의 판매" : r.revenueType}
                </td>
                <td className="px-5 py-3.5 text-right text-zinc-300">
                  ₩{r.grossAmount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-center text-zinc-400">
                  {r.commissionRate}%
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-white">
                  ₩{r.netAmount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status] ?? "bg-zinc-700 text-zinc-400"}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-zinc-400">
                  {r.paidAt ? r.paidAt : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {revenues.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-sm">정산 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
