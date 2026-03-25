"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { enrollments } from "../../enrollments/mockData";
import { users } from "../../users/mockData";
import { useOrgStructureStore, findDeptNode } from "../../shared/org-structure-store";

export default function OrgStats() {
  const { departments, sites } = useOrgStructureStore();

  const learners = useMemo(() => users.filter((u) => u.role === "LEARNER"), []);

  const deptStats = useMemo(() => {
    // Collect all department IDs that have learners
    const deptIds = [...new Set(learners.map((u) => u.orgTeamId).filter(Boolean))] as string[];

    return deptIds.map((deptId) => {
      const deptNode = findDeptNode(departments, deptId);
      const deptLearners = learners.filter((u) => u.orgTeamId === deptId);
      const deptEnrollments = enrollments.filter((e) =>
        deptLearners.some((u) => u.id === e.learnerId)
      );

      const total = deptLearners.length;
      const enrolledCount = new Set(deptEnrollments.map((e) => e.learnerId)).size;
      const completedCount = deptEnrollments.filter(
        (e) => e.status === "COMPLETED"
      ).length;
      const totalEnrollments = deptEnrollments.length;
      const completionRate =
        totalEnrollments > 0
          ? Math.round((completedCount / totalEnrollments) * 100)
          : 0;
      const avgProgress =
        totalEnrollments > 0
          ? Math.round(
              deptEnrollments.reduce((s, e) => s + e.progress, 0) / totalEnrollments
            )
          : 0;
      const notStarted = deptEnrollments.filter((e) => e.progress === 0).length;

      const site = sites.find(
        (s) => s.id === deptLearners[0]?.orgSiteId
      );

      return {
        deptId,
        deptName: deptNode?.name ?? deptId,
        siteName: site?.name ?? "—",
        total,
        enrolledCount,
        completionRate,
        avgProgress,
        notStarted,
        totalEnrollments,
      };
    });
  }, [departments, sites, learners]);

  const totals = useMemo(
    () => ({
      learners: learners.length,
      enrollments: enrollments.length,
      completed: enrollments.filter((e) => e.status === "COMPLETED").length,
    }),
    [learners]
  );

  const overallRate =
    totals.enrollments > 0
      ? Math.round((totals.completed / totals.enrollments) * 100)
      : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">조직별 학습 현황</h1>
        <button
          onClick={() => alert("CSV 내보내기 (시뮬레이션)")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={14} />
          내보내기
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "전체 구성원", value: learners.length, color: "text-slate-800" },
          { label: "수강 중 구성원", value: totals.enrollments, color: "text-blue-600" },
          { label: "수료 완료", value: totals.completed, color: "text-green-600" },
          { label: "전체 수료율", value: `${overallRate}%`, color: "text-violet-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium">부서</th>
              <th className="text-left px-4 py-3 font-medium">사업장</th>
              <th className="text-right px-4 py-3 font-medium">구성원</th>
              <th className="text-right px-4 py-3 font-medium">수강 인원</th>
              <th className="text-right px-4 py-3 font-medium">미시작</th>
              <th className="text-left px-4 py-3 font-medium w-44">수료율</th>
              <th className="text-left px-4 py-3 font-medium w-40">평균 진도율</th>
            </tr>
          </thead>
          <tbody>
            {deptStats.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              deptStats.map((row) => (
                <tr
                  key={row.deptId}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{row.deptName}</td>
                  <td className="px-4 py-3 text-slate-500">{row.siteName}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.total}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {row.enrolledCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.notStarted > 0 ? (
                      <span className="text-orange-600 font-medium">{row.notStarted}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.totalEnrollments > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${row.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-green-600 w-9 text-right">
                          {row.completionRate}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.totalEnrollments > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${row.avgProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-violet-600 w-9 text-right">
                          {row.avgProgress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {deptStats.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            총 {deptStats.length}개 부서
          </div>
        )}
      </div>
    </div>
  );
}
