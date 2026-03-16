"use client";

import { useState } from "react";
import { Users, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { type CourseSession, type CourseEnrollee } from "../../course-detail/mockData";
import EncourageModal from "../modals/encourage-modal";

interface Props {
  session: CourseSession;
  enrollees: CourseEnrollee[];
}

const BUCKETS = [
  { label: "0 – 24%",     min: 0,   max: 24,  color: "bg-slate-300" },
  { label: "25 – 49%",    min: 25,  max: 49,  color: "bg-slate-400" },
  { label: "50 – 74%",    min: 50,  max: 74,  color: "bg-violet-300" },
  { label: "75 – 99%",    min: 75,  max: 99,  color: "bg-violet-400" },
  { label: "완료 (100%)", min: 100, max: 100, color: "bg-violet-500" },
];

export default function DashboardTab({ session, enrollees }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  const threshold = session.completionThreshold;
  const total = enrollees.length;

  const avgProgress = total === 0 ? 0 : Math.round(enrollees.reduce((s, e) => s + e.progress, 0) / total);
  const completedCount = enrollees.filter((e) => e.progress >= threshold).length;
  const belowCount = total - completedCount;
  const completionRate = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const belowThreshold = enrollees.filter((e) => e.progress < threshold);

  function toggleAll() {
    if (selectedIds.size === belowThreshold.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(belowThreshold.map((e) => e.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedLearners = belowThreshold
    .filter((e) => selectedIds.has(e.id))
    .map((e) => ({ id: e.learnerId, name: e.learner }));

  return (
    <>
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Section A — KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            icon={<Users size={16} className="text-violet-500" />}
            label="수강 인원"
            value={`${session.enrolled} / ${session.capacity === 0 ? "무제한" : session.capacity}`}
          />
          <KpiCard
            icon={<TrendingUp size={16} className="text-blue-500" />}
            label="평균 진도율"
            value={`${avgProgress}%`}
          />
          <KpiCard
            icon={<Award size={16} className="text-emerald-500" />}
            label={`수료율 (기준 ${threshold}%)`}
            value={`${completionRate}%`}
            sub={`${completedCount}명 수료`}
          />
          <KpiCard
            icon={<AlertTriangle size={16} className="text-amber-500" />}
            label="수료 기준 미달"
            value={`${belowCount}명`}
            highlight={belowCount > 0}
          />
        </div>

        {/* Section B — Progress distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">진도율 분포</h3>
          {total === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">수강생 데이터가 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {BUCKETS.map((bucket) => {
                const count = enrollees.filter((e) =>
                  bucket.min === bucket.max
                    ? e.progress === bucket.max
                    : e.progress >= bucket.min && e.progress <= bucket.max
                ).length;
                const pct = total === 0 ? 0 : Math.round((count / total) * 100);
                return (
                  <div key={bucket.label} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-xs text-slate-500">{bucket.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`${bucket.color} h-2.5 rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-20 shrink-0 text-right text-xs text-slate-500">
                      {count}명 ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section C — Below threshold table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-700">
              수료 기준 미달
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({threshold}% 미만 · {belowCount}명)
              </span>
            </span>
            <button
              onClick={() => setShowModal(true)}
              disabled={selectedIds.size === 0}
              className="px-3 py-1.5 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              독려 메시지 발송 {selectedIds.size > 0 && `(${selectedIds.size}명)`}
            </button>
          </div>

          {belowThreshold.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-slate-400">
              <p className="text-sm">모든 수강생이 수료 기준을 달성했습니다 🎉</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === belowThreshold.length}
                      onChange={toggleAll}
                      className="accent-violet-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">진도</th>
                  <th className="px-4 py-3 text-left font-medium">수강 시작일</th>
                </tr>
              </thead>
              <tbody>
                {belowThreshold.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(e.id)}
                        onChange={() => toggleOne(e.id)}
                        className="accent-violet-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{e.learner}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full"
                            style={{ width: `${e.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{e.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{e.enrolledAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <EncourageModal
          learners={selectedLearners}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col gap-2 ${highlight ? "border-amber-200 bg-amber-50/40" : "border-slate-200"}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${highlight ? "text-amber-600" : "text-slate-800"}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
