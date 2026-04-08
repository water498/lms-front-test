"use client";

import { useState } from "react";
import { Users, TrendingUp, Award, AlertTriangle, ChevronRight, Bell } from "lucide-react";
import { type CourseSession, type CourseEnrollee, type SessionStatus } from "../../course-layout/mockData";
import EncourageModal from "../modals/encourage-modal";
import NotifyModal from "../modals/notify-modal";

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
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyContext, setNotifyContext] = useState<string | undefined>();

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
        {/* Lifecycle Timeline */}
        <LifecycleTimeline
          session={session}
          enrollees={enrollees}
          onNotify={(ctx) => { setNotifyContext(ctx); setShowNotifyModal(true); }}
        />

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
      {showNotifyModal && (
        <NotifyModal
          session={session}
          totalEnrolled={total}
          belowThresholdCount={belowCount}
          context={notifyContext}
          onClose={() => setShowNotifyModal(false)}
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

// ── Lifecycle Timeline ─────────────────────────────────────────────────────

const STAGES: { id: SessionStatus; label: string }[] = [
  { id: "DRAFT",   label: "모집 준비" },
  { id: "OPEN",    label: "모집 중" },
  { id: "ONGOING", label: "진행 중" },
  { id: "CLOSED",  label: "종료" },
];

const STAGE_ORDER: Record<SessionStatus, number> = {
  DRAFT: 0, OPEN: 1, ONGOING: 2, CLOSED: 3, CANCELLED: -1,
};

const TODAY = "2026-03-26";

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const today = new Date(TODAY);
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function dDayLabel(days: number): string {
  if (days === 0) return "D-Day";
  return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`;
}

function LifecycleTimeline({
  session,
  enrollees,
  onNotify,
}: {
  session: CourseSession;
  enrollees: CourseEnrollee[];
  onNotify: (ctx: string | undefined) => void;
}) {
  const currentOrder = STAGE_ORDER[session.status];
  const totalEnrolled = enrollees.length;

  const enrollRatio = session.capacity === 0
    ? null
    : `${totalEnrolled} / ${session.capacity}명`;

  const minEnrollWarning =
    session.status === "OPEN" &&
    session.minEnrollment != null &&
    totalEnrolled < session.minEnrollment;

  const startDays = daysUntil(session.startDate);
  const endDays = daysUntil(session.endDate);

  const dateInfo: string[] = [];
  if (session.startDate) {
    const label = startDays !== null ? dDayLabel(startDays) : "";
    dateInfo.push(`개강 ${session.startDate}${label ? ` (${label})` : ""}`);
  }
  if (session.endDate) {
    const label = endDays !== null ? dDayLabel(endDays) : "";
    dateInfo.push(`종강 ${session.endDate}${label ? ` (${label})` : ""}`);
  }

  const isCancelled = session.status === "CANCELLED";

  const nextStatus: SessionStatus | null =
    isCancelled ? null :
    session.status === "DRAFT"   ? "OPEN"    :
    session.status === "OPEN"    ? "ONGOING" :
    session.status === "ONGOING" ? "CLOSED"  : null;

  const nextStatusLabel: Record<SessionStatus, string> = {
    DRAFT: "모집 준비", OPEN: "모집 중", ONGOING: "진행 중", CLOSED: "종료", CANCELLED: "폐강",
  };

  const canCancel = session.status === "DRAFT" || session.status === "OPEN" || session.status === "ONGOING";

  // 현재 단계에 맞는 알림 컨텍스트 자동 계산
  const notifyCtx: string | undefined =
    session.status === "OPEN"    ? "SESSION_OPEN" :
    session.status === "ONGOING" ? (endDays !== null && endDays <= 7 ? "SESSION_CLOSE" : "SESSION_ENCOURAGE") :
    undefined;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-700">라이프사이클</h3>
        <button
          onClick={() => onNotify(notifyCtx)}
          className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 px-3 py-1.5 border border-violet-200 hover:border-violet-400 rounded-lg transition-colors"
        >
          <Bell size={13} />
          알림 발송
        </button>
      </div>

      {/* Cancelled banner */}
      {isCancelled && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-2">
          <AlertTriangle size={15} className="text-red-400 shrink-0" />
          <div>
            <span className="font-semibold">폐강된 차수입니다</span>
            {session.cancellationReason && (
              <span className="text-red-500 ml-2">— {session.cancellationReason}</span>
            )}
          </div>
        </div>
      )}

      {/* Stage bar */}
      <div className={`flex items-center gap-0 ${isCancelled ? "opacity-40" : ""}`}>
        {STAGES.map((stage, idx) => {
          const stageOrder = STAGE_ORDER[stage.id];
          const isPast    = stageOrder < currentOrder;
          const isCurrent = stageOrder === currentOrder;
          const isFuture  = stageOrder > currentOrder;
          return (
            <div key={stage.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-violet-600 text-white ring-4 ring-violet-100"
                    : isPast
                    ? "bg-slate-300 text-white"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}>
                  {isPast ? "✓" : idx + 1}
                </div>
                <span className={`text-[11px] font-medium text-center leading-tight ${
                  isCurrent ? "text-violet-700" : isPast ? "text-slate-400" : "text-slate-300"
                }`}>
                  {stage.label}
                </span>
              </div>
              {idx < STAGES.length - 1 && (
                <div className={`h-0.5 w-full mx-1 rounded-full ${stageOrder < currentOrder ? "bg-slate-300" : "bg-slate-100"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Details */}
      <div className="mt-5 flex flex-col gap-2">
        {enrollRatio && (
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-600">등록 {enrollRatio}</span>
            {minEnrollWarning && session.minEnrollment != null && (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <AlertTriangle size={12} />
                최소 인원 미달 (최소 {session.minEnrollment}명)
              </span>
            )}
          </div>
        )}
        {dateInfo.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 text-xs">📅</span>
            <span className="text-slate-600">{d}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {(nextStatus || canCancel) && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
          {nextStatus && (
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
              <ChevronRight size={13} />
              {nextStatusLabel[nextStatus]}(으)로 전환
            </button>
          )}
          {canCancel && (
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">
              폐강
            </button>
          )}
          {session.status === "OPEN" && minEnrollWarning && (
            <span className="text-xs text-rose-500 font-medium">
              ⚠ 인원 미달 상태에서 전환 시 차수가 취소될 수 있습니다
            </span>
          )}
        </div>
      )}
    </div>
  );
}
