"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  MessageSquare,
  FileCheck,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Calendar,
  List,
  Star,
  Wallet,
  X,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ANNOUNCEMENTS } from "@/features/(platform-admin)/platform-announcement-list/mockData";

const BASE = "/backoffice";

/* ── Mock: 할 일 데이터 ── */
interface TodoItem {
  id: string;
  type: "GRADING" | "QNA" | "APPROVAL" | "REVIEW";
  title: string;
  subtitle: string;
  count: number;
  href: string;
  urgent: boolean;
}

const ADMIN_TODOS: TodoItem[] = [
  { id: "t1", type: "GRADING", title: "채점 대기", subtitle: "Python 기초 / 1차수", count: 12, href: `${BASE}/courses/c1/sessions/se1/grading`, urgent: true },
  { id: "t2", type: "QNA", title: "미답변 Q&A", subtitle: "안전관리 기초 / 2차수", count: 5, href: `${BASE}/courses/c1/sessions/se2/qna`, urgent: true },
  { id: "t3", type: "APPROVAL", title: "과정 게시 승인", subtitle: "UX 디자인 실전", count: 2, href: `${BASE}/courses`, urgent: false },
  { id: "t4", type: "REVIEW", title: "새 리뷰", subtitle: "지난 7일", count: 8, href: `${BASE}/courses/c1/reviews`, urgent: false },
];

const INSTRUCTOR_TODOS: TodoItem[] = [
  { id: "t1", type: "GRADING", title: "채점 대기", subtitle: "Python 기초 / 1차수", count: 12, href: `${BASE}/courses/c1/sessions/se1/grading`, urgent: true },
  { id: "t2", type: "QNA", title: "미답변 Q&A", subtitle: "Python 기초 / 1차수", count: 3, href: `${BASE}/courses/c1/sessions/se1/qna`, urgent: true },
];

/* ── Mock: KPI 데이터 ── */
interface KpiItem {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color: string;
}

const ADMIN_KPIS: KpiItem[] = [
  { label: "활성 과정", value: "24", change: "+3", icon: BookOpen, color: "text-violet-600 bg-violet-50" },
  { label: "전체 수강생", value: "1,284", change: "+89", icon: Users, color: "text-sky-600 bg-sky-50" },
  { label: "수료율", value: "76%", change: "+2%", icon: Award, color: "text-emerald-600 bg-emerald-50" },
  { label: "이번 달 수료", value: "156", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
];

const INSTRUCTOR_KPIS: KpiItem[] = [
  { label: "내 과정", value: "4", icon: BookOpen, color: "text-violet-600 bg-violet-50" },
  { label: "총 수강생", value: "87", icon: Users, color: "text-sky-600 bg-sky-50" },
  { label: "평균 평점", value: "4.6", icon: Star, color: "text-amber-600 bg-amber-50" },
  { label: "정산 대기", value: "₩320,000", icon: Wallet, color: "text-emerald-600 bg-emerald-50" },
];

/* ── Mock: 일정 데이터 ── */
interface ScheduleItem {
  id: string;
  title: string;
  courseTitle: string;
  date: string;
  type: "START" | "END" | "DEADLINE";
}

const SCHEDULES: ScheduleItem[] = [
  { id: "sc1", title: "1차수 시작", courseTitle: "Python 기초", date: "2026-04-14", type: "START" },
  { id: "sc2", title: "과제 마감", courseTitle: "데이터분석 입문", date: "2026-04-15", type: "DEADLINE" },
  { id: "sc3", title: "2차수 종료", courseTitle: "UX 디자인 실전", date: "2026-04-18", type: "END" },
  { id: "sc4", title: "3차수 시작", courseTitle: "리더십 교육", date: "2026-04-21", type: "START" },
];

/* ── Components ── */

const TODO_ICONS: Record<string, React.ElementType> = {
  GRADING: ClipboardCheck,
  QNA: MessageSquare,
  APPROVAL: FileCheck,
  REVIEW: Star,
};

function PlatformBanners() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const banners = ANNOUNCEMENTS.filter(
    (a) =>
      a.status === "PUBLISHED" &&
      (a.subtype === "URGENT" || a.subtype === "MAINTENANCE") &&
      !dismissedIds.includes(a.id)
  );
  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {banners.map((b) => {
        const isUrgent = b.subtype === "URGENT";
        return (
          <div
            key={b.id}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
              isUrgent ? "bg-red-50 border border-red-200 text-red-800" : "bg-amber-50 border border-amber-200 text-amber-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {isUrgent ? <AlertTriangle size={15} className="text-red-500" /> : <Wrench size={15} className="text-amber-500" />}
              <Link href={`${BASE}/org/announcements`} className="hover:underline">
                [{isUrgent ? "긴급" : "점검"}] {b.title}
              </Link>
            </div>
            <button onClick={() => setDismissedIds((prev) => [...prev, b.id])} className="ml-4 hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function TodoSection({ todos }: { todos: TodoItem[] }) {
  const urgentCount = todos.reduce((sum, t) => sum + (t.urgent ? t.count : 0), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-violet-600" />
          <h2 className="text-sm font-semibold text-slate-900">오늘 할 일</h2>
          {urgentCount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
              긴급 {urgentCount}건
            </span>
          )}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {todos.map((todo) => {
          const Icon = TODO_ICONS[todo.type] ?? CheckCircle2;
          return (
            <Link
              key={todo.id}
              href={todo.href}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                todo.urgent ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
              }`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{todo.title}</p>
                <p className="text-xs text-slate-400">{todo.subtitle}</p>
              </div>
              <span className={`text-lg font-bold ${todo.urgent ? "text-red-600" : "text-slate-700"}`}>
                {todo.count}
              </span>
            </Link>
          );
        })}
        {todos.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            처리할 항목이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCards({ kpis }: { kpis: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map(({ label, value, change, icon: Icon, color }) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">{label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              {change && (
                <span className="text-xs font-medium text-emerald-600">{change}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar({ schedules, typeStyles }: { schedules: ScheduleItem[]; typeStyles: Record<string, { bg: string; label: string }> }) {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 3, 1)); // 2026-04

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // 날짜별 일정 매핑
  const schedulesByDay: Record<number, ScheduleItem[]> = {};
  schedules.forEach((s) => {
    const d = new Date(s.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!schedulesByDay[day]) schedulesByDay[day] = [];
      schedulesByDay[day].push(s);
    }
  });

  const DOW = ["일", "월", "화", "수", "목", "금", "토"];
  const monthLabel = `${year}년 ${month + 1}월`;

  const dotColor: Record<string, string> = {
    START: "bg-emerald-500",
    END: "bg-slate-400",
    DEADLINE: "bg-red-500",
  };

  return (
    <div className="px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors">‹</button>
        <span className="text-sm font-semibold text-slate-800">{monthLabel}</span>
        <button onClick={nextMonth} className="text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors">›</button>
      </div>

      {/* DOW header */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d, i) => (
          <div key={d} className={`text-center text-[10px] font-medium py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-400"}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} className="h-10" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const daySchedules = schedulesByDay[day] ?? [];
          const dow = (firstDay + i) % 7;

          return (
            <div
              key={day}
              className={`relative h-10 flex flex-col items-center justify-center rounded-lg transition-colors ${
                isToday ? "bg-violet-50" : daySchedules.length > 0 ? "hover:bg-slate-50 cursor-default" : ""
              }`}
              title={daySchedules.map((s) => `[${typeStyles[s.type]?.label}] ${s.title}`).join("\n") || undefined}
            >
              <span className={`text-xs ${
                isToday ? "font-bold text-violet-600" : dow === 0 ? "text-red-400" : dow === 6 ? "text-blue-400" : "text-slate-600"
              }`}>
                {day}
              </span>
              {daySchedules.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {daySchedules.slice(0, 3).map((s, idx) => (
                    <span key={idx} className={`w-1.5 h-1.5 rounded-full ${dotColor[s.type] ?? "bg-slate-400"}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        {Object.entries(typeStyles).map(([type, { bg, label }]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dotColor[type]}`} />
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleWidget() {
  const [view, setView] = useState<"list" | "calendar">("calendar");

  const typeStyles: Record<string, { bg: string; label: string }> = {
    START: { bg: "bg-emerald-100 text-emerald-700", label: "시작" },
    END: { bg: "bg-slate-200 text-slate-600", label: "종료" },
    DEADLINE: { bg: "bg-red-100 text-red-700", label: "마감" },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-violet-600" />
          <h2 className="text-sm font-semibold text-slate-900">다가오는 일정</h2>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setView("calendar")}
            className={`p-1.5 rounded-md transition-colors ${view === "calendar" ? "bg-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Calendar size={14} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <MiniCalendar schedules={SCHEDULES} typeStyles={typeStyles} />
      ) : (
        <div className="divide-y divide-slate-100">
          {SCHEDULES.map((s) => {
            const style = typeStyles[s.type];
            return (
              <div key={s.id} className="flex items-center gap-4 px-5 py-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg}`}>
                  {style.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{s.title}</p>
                  <p className="text-xs text-slate-400">{s.courseTitle}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{s.date}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main ── */
export default function DashboardV2Feature() {
  const { role } = useAuthStore();
  const isAdmin = role === "ORG_ADMIN" || role === "SUPER_ADMIN";

  const todos = isAdmin ? ADMIN_TODOS : INSTRUCTOR_TODOS;
  const kpis = isAdmin ? ADMIN_KPIS : INSTRUCTOR_KPIS;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">대시보드</h1>
        <p className="text-sm text-slate-500 mt-0.5">오늘 처리할 항목과 주요 현황을 확인하세요.</p>
      </div>

      <PlatformBanners />
      <KpiCards kpis={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TodoSection todos={todos} />
        <ScheduleWidget />
      </div>
    </div>
  );
}
