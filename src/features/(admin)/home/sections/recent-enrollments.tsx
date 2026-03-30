import { recentEnrollments, type EnrollmentStatus } from "../mockData";
import { learnerNames, courseTitlesMap, sessionNamesMap } from "../../enrollments/mockData";

const STATUS_BADGE: Record<EnrollmentStatus, { label: string; className: string }> = {
  ACTIVE:    { label: "활성",     className: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "완료",     className: "bg-blue-100 text-blue-700" },
  FAILED:    { label: "수료 불가", className: "bg-red-100 text-red-600" },
  CANCELLED: { label: "취소됨",   className: "bg-slate-100 text-slate-500" },
  EXPIRED:   { label: "만료됨",   className: "bg-slate-100 text-slate-500" },
};

export default function RecentEnrollments() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">최근 수강 신청</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left pb-2 font-medium">학습자</th>
            <th className="text-left pb-2 font-medium">과정</th>
            <th className="text-left pb-2 font-medium">차수</th>
            <th className="text-left pb-2 font-medium">상태</th>
            <th className="text-left pb-2 font-medium">신청일</th>
          </tr>
        </thead>
        <tbody>
          {recentEnrollments.map((e) => {
            const badge = STATUS_BADGE[e.status];
            return (
              <tr key={e.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 font-medium text-slate-800">{learnerNames[e.learnerId] ?? e.learnerId}</td>
                <td className="py-2.5 text-slate-600">{courseTitlesMap[e.courseId] ?? e.courseId}</td>
                <td className="py-2.5 text-slate-500">{sessionNamesMap[e.courseSessionId] ?? e.courseSessionId}</td>
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
