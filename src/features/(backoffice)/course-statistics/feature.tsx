"use client";

import { useState } from "react";
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

/* ── Mock Data ── */

interface SessionStat {
  id: string;
  name: string;
  type: "COHORT" | "SELF_PACED";
  enrolled: number;
  completed: number;
  avgProgress: number;
  avgScore: number;
  dropoutRate: number;
  status: "ONGOING" | "CLOSED" | "OPEN" | "DRAFT";
}

interface WeeklyTrend {
  week: string;
  enrollments: number;
  completions: number;
}

const SESSION_STATS: SessionStat[] = [
  { id: "se1", name: "1기 (2025 Q1)", type: "COHORT", enrolled: 28, completed: 24, avgProgress: 92, avgScore: 78, dropoutRate: 7, status: "CLOSED" },
  { id: "se2", name: "2기 (2025 Q2)", type: "COHORT", enrolled: 50, completed: 31, avgProgress: 68, avgScore: 74, dropoutRate: 4, status: "ONGOING" },
  { id: "se3", name: "3기 (2025 Q3)", type: "COHORT", enrolled: 12, completed: 0, avgProgress: 0, avgScore: 0, dropoutRate: 0, status: "OPEN" },
  { id: "se6", name: "자유수강", type: "SELF_PACED", enrolled: 87, completed: 52, avgProgress: 61, avgScore: 71, dropoutRate: 12, status: "ONGOING" },
];

const WEEKLY_TRENDS: WeeklyTrend[] = [
  { week: "3/3", enrollments: 8, completions: 3 },
  { week: "3/10", enrollments: 12, completions: 5 },
  { week: "3/17", enrollments: 6, completions: 7 },
  { week: "3/24", enrollments: 15, completions: 4 },
  { week: "3/31", enrollments: 9, completions: 8 },
  { week: "4/7", enrollments: 11, completions: 6 },
];

const ACTIVITY_COMPLETION = [
  { name: "안전수칙 영상", type: "VIDEO", completionRate: 94 },
  { name: "보호장구 SCORM", type: "SCORM", completionRate: 88 },
  { name: "개념 확인 퀴즈", type: "QUIZ", completionRate: 82 },
  { name: "현장 사례 분석", type: "ASSIGNMENT", completionRate: 65 },
  { name: "종합 시험", type: "QUIZ", completionRate: 71 },
  { name: "교육 만족도 설문", type: "SURVEY", completionRate: 58 },
];

const SCORE_DISTRIBUTION = [
  { range: "90~100", count: 18, color: "bg-emerald-500" },
  { range: "80~89", count: 32, color: "bg-emerald-400" },
  { range: "70~79", count: 27, color: "bg-amber-400" },
  { range: "60~69", count: 14, color: "bg-amber-500" },
  { range: "~59", count: 8, color: "bg-red-400" },
];

/* ── Components ── */

function KpiCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400"
          }`}>
            {trend === "up" && <ArrowUpRight size={12} />}
            {trend === "down" && <ArrowDownRight size={12} />}
            {trend === "flat" && <Minus size={12} />}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBarChart({ data, maxVal }: { data: WeeklyTrend[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end" style={{ height: "100px" }}>
            <div
              className="flex-1 bg-violet-200 rounded-t"
              style={{ height: `${(d.enrollments / maxVal) * 100}%` }}
              title={`수강 ${d.enrollments}`}
            />
            <div
              className="flex-1 bg-emerald-300 rounded-t"
              style={{ height: `${(d.completions / maxVal) * 100}%` }}
              title={`수료 ${d.completions}`}
            />
          </div>
          <span className="text-[10px] text-slate-400">{d.week}</span>
        </div>
      ))}
    </div>
  );
}

function SessionComparisonTable({ sessions }: { sessions: SessionStat[] }) {
  const statusStyles: Record<string, string> = {
    ONGOING: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-600",
    OPEN: "bg-blue-50 text-blue-700",
    DRAFT: "bg-slate-50 text-slate-400",
  };
  const statusLabels: Record<string, string> = {
    ONGOING: "진행 중",
    CLOSED: "종료",
    OPEN: "모집 중",
    DRAFT: "초안",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">차수</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">상태</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">수강생</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">수료</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">수료율</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">평균 진도</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">평균 점수</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400">이탈률</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const completionRate = s.enrolled > 0 ? Math.round((s.completed / s.enrolled) * 100) : 0;
            return (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[s.status]}`}>
                    {statusLabels[s.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-600">{s.enrolled}명</td>
                <td className="px-4 py-3 text-center text-slate-600">{s.completed}명</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${completionRate >= 70 ? "text-emerald-600" : completionRate >= 50 ? "text-amber-600" : "text-red-500"}`}>
                    {completionRate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-600">{s.avgProgress}%</td>
                <td className="px-4 py-3 text-center text-slate-600">{s.avgScore > 0 ? `${s.avgScore}점` : "-"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`${s.dropoutRate > 10 ? "text-red-500" : "text-slate-500"}`}>
                    {s.dropoutRate}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ActivityCompletionChart({ activities }: { activities: typeof ACTIVITY_COMPLETION }) {
  return (
    <div className="flex flex-col gap-3">
      {activities.map((a) => (
        <div key={a.name} className="flex items-center gap-3">
          <span className="text-xs text-slate-600 w-36 truncate" title={a.name}>{a.name}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                a.completionRate >= 80 ? "bg-emerald-400" : a.completionRate >= 60 ? "bg-amber-400" : "bg-red-400"
              }`}
              style={{ width: `${a.completionRate}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-700 w-10 text-right">{a.completionRate}%</span>
        </div>
      ))}
    </div>
  );
}

function ScoreDistribution({ data }: { data: typeof SCORE_DISTRIBUTION }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex flex-col gap-2">
      {data.map((d) => (
        <div key={d.range} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-14 text-right">{d.range}</span>
          <div className="flex-1 h-6 bg-slate-50 rounded overflow-hidden">
            <div
              className={`h-full ${d.color} rounded transition-all`}
              style={{ width: `${(d.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 w-16 text-right">{d.count}명 ({Math.round((d.count / total) * 100)}%)</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main ── */

export default function CourseStatisticsFeature() {
  const totalEnrolled = SESSION_STATS.reduce((sum, s) => sum + s.enrolled, 0);
  const totalCompleted = SESSION_STATS.reduce((sum, s) => sum + s.completed, 0);
  const overallCompletionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;
  const avgProgress = Math.round(SESSION_STATS.filter((s) => s.enrolled > 0).reduce((sum, s) => sum + s.avgProgress, 0) / SESSION_STATS.filter((s) => s.enrolled > 0).length);
  const avgScore = Math.round(SESSION_STATS.filter((s) => s.avgScore > 0).reduce((sum, s) => sum + s.avgScore, 0) / SESSION_STATS.filter((s) => s.avgScore > 0).length);

  const trendMax = Math.max(...WEEKLY_TRENDS.flatMap((d) => [d.enrollments, d.completions]));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="총 수강생" value={`${totalEnrolled}명`} icon={Users} color="text-violet-600 bg-violet-50" trend="up" />
        <KpiCard label="수료율" value={`${overallCompletionRate}%`} sub={`${totalCompleted}명 수료`} icon={Award} color="text-emerald-600 bg-emerald-50" trend="up" />
        <KpiCard label="평균 진도율" value={`${avgProgress}%`} icon={TrendingUp} color="text-sky-600 bg-sky-50" trend="flat" />
        <KpiCard label="평균 점수" value={`${avgScore}점`} icon={BarChart3} color="text-amber-600 bg-amber-50" trend="up" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Weekly Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">주간 수강/수료 추이</h3>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-violet-200" /> 수강</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-300" /> 수료</span>
            </div>
          </div>
          <MiniBarChart data={WEEKLY_TRENDS} maxVal={trendMax} />
        </div>

        {/* Score Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">점수 분포</h3>
          <ScoreDistribution data={SCORE_DISTRIBUTION} />
        </div>
      </div>

      {/* Activity Completion */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">활동별 완료율</h3>
        <ActivityCompletionChart activities={ACTIVITY_COMPLETION} />
      </div>

      {/* Session Comparison */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">차수별 비교</h3>
        </div>
        <SessionComparisonTable sessions={SESSION_STATS} />
      </div>
    </div>
  );
}
