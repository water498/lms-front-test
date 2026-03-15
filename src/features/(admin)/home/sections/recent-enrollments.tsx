import { recentEnrollments, type EnrollmentStatus } from "../mockData";

const STATUS_BADGE: Record<EnrollmentStatus, { label: string; className: string }> = {
  ACTIVE:    { label: "활성",     className: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "완료",     className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "취소됨",   className: "bg-red-100 text-red-600" },
};

export default function RecentEnrollments() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">최근 수강 신청</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left pb-2 font-medium">학습자</th>
            <th className="text-left pb-2 font-medium">코스</th>
            <th className="text-left pb-2 font-medium">세션</th>
            <th className="text-left pb-2 font-medium">상태</th>
            <th className="text-left pb-2 font-medium">신청일</th>
          </tr>
        </thead>
        <tbody>
          {recentEnrollments.map((e) => {
            const badge = STATUS_BADGE[e.status];
            return (
              <tr key={e.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 font-medium text-slate-800">{e.learner}</td>
                <td className="py-2.5 text-slate-600">{e.course}</td>
                <td className="py-2.5 text-slate-500">{e.session}</td>
                <td className="py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="py-2.5 text-slate-400">{e.enrolledAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
