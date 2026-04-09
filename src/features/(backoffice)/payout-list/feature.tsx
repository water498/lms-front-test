"use client";

import { CURRENT_INSTRUCTOR_ID, instructorRevenues } from "../shared/mockData";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "지급 대기",
  APPROVED: "승인됨",
  PAID: "지급 완료",
  CANCELLED: "취소됨",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  APPROVED: "bg-sky-50 text-sky-600",
  PAID: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-slate-200 text-slate-400",
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
        <h1 className="text-2xl font-bold text-slate-900">정산 내역</h1>
        <p className="text-sm text-slate-500 mt-1">월별 정산 현황을 확인할 수 있습니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400 mb-1">지급 완료</p>
          <p className="text-2xl font-bold text-emerald-600">₩{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400 mb-1">지급 대기 / 승인</p>
          <p className="text-2xl font-bold text-amber-600">₩{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* 정산 테이블 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">정산 기간</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">유형</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-400">매출</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-400">수수료율</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-400">정산액</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-400">상태</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">지급일</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map((r) => (
              <tr key={r.id} className="border-b border-slate-200/50 hover:bg-slate-100/20 transition-colors">
                <td className="px-5 py-3.5 text-slate-600">
                  {r.periodStart} ~ {r.periodEnd}
                </td>
                <td className="px-5 py-3.5 text-slate-500">
                  {r.revenueType === "COURSE_SALE" ? "강의 판매" : r.revenueType}
                </td>
                <td className="px-5 py-3.5 text-right text-slate-600">
                  ₩{r.grossAmount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-center text-slate-500">
                  {r.commissionRate}%
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                  ₩{r.netAmount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status] ?? "bg-slate-200 text-slate-500"}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">
                  {r.paidAt ? r.paidAt : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {revenues.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">정산 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
