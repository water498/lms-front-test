"use client";

import Link from "next/link";
import { BookOpen, Users, Star, Wallet } from "lucide-react";
import {
  CURRENT_INSTRUCTOR_ID,
  instructorCourses,
  instructorReviews,
  instructorRevenues,
  enrollmentsBySession,
} from "../shared/mockData";

const BASE = "/backoffice";

export default function InstructorDashboardFeature() {
  const courses = instructorCourses[CURRENT_INSTRUCTOR_ID] ?? [];
  const reviews = instructorReviews[CURRENT_INSTRUCTOR_ID] ?? [];
  const revenues = instructorRevenues[CURRENT_INSTRUCTOR_ID] ?? [];

  // 총 수강생 수 (담당 세션 enrollments 합산)
  const totalStudents = courses.reduce((sum, c) => {
    const enrollments = enrollmentsBySession[c.sessionId];
    return sum + (enrollments ? enrollments.length : c.enrolleeCount);
  }, 0);

  // 평균 평점
  const visibleReviews = reviews.filter((r) => r.visible);
  const avgRating =
    visibleReviews.length > 0
      ? visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length
      : 0;

  // 정산 대기 금액 (PENDING 합산)
  const pendingAmount = revenues
    .filter((r) => r.status === "PENDING")
    .reduce((sum, r) => sum + r.netAmount, 0);

  const stats: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    color: "violet" | "sky" | "amber" | "emerald";
    href: string;
  }[] = [
    {
      label: "담당 과정",
      value: `${courses.length}개`,
      icon: BookOpen,
      color: "violet",
      href: `${BASE}/sessions`,
    },
    {
      label: "총 수강생",
      value: `${totalStudents}명`,
      icon: Users,
      color: "sky",
      href: `${BASE}/sessions`,
    },
    {
      label: "강사 평점",
      value: avgRating > 0 ? avgRating.toFixed(1) : "—",
      sub: avgRating > 0 ? `리뷰 ${reviews.length}개` : "리뷰 없음",
      icon: Star,
      color: "amber",
      href: `${BASE}/reviews`,
    },
    {
      label: "정산 대기",
      value: pendingAmount > 0 ? `₩${pendingAmount.toLocaleString()}` : "없음",
      sub: pendingAmount > 0 ? "지급 예정" : "",
      icon: Wallet,
      color: "emerald",
      href: `${BASE}/payouts`,
    },
  ];

  const colorMap = {
    violet: "bg-violet-50 text-violet-600",
    sky: "bg-sky-500/10 text-sky-600",
    amber: "bg-amber-500/10 text-amber-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
        <p className="text-sm text-slate-500 mt-1">강사 활동 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-300 transition-colors"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
              {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* 담당 과정 요약 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">담당 과정</h2>
          <Link
            href={`${BASE}/sessions`}
            className="text-xs text-violet-600 hover:text-violet-500 transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">과정명</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">차수</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-400">수강생</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-400">역할</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">시작일</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.sessionId} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-900">{c.courseTitle}</td>
                <td className="px-5 py-3.5 text-slate-500">{c.sessionName}</td>
                <td className="px-5 py-3.5 text-center text-slate-500">{c.enrolleeCount}명</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.role === "PRIMARY"
                      ? "bg-violet-50 text-violet-600"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {c.role === "PRIMARY" ? "주 강사" : "보조 강사"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{c.startDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 최근 리뷰 */}
      {reviews.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">최근 리뷰</h2>
            <Link
              href={`${BASE}/reviews`}
              className="text-xs text-violet-600 hover:text-violet-500 transition-colors"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="divide-y divide-slate-200/50">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 text-xs font-semibold shrink-0">
                  {r.learnerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-600">{r.learnerName}</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < r.rating ? "text-amber-600 fill-amber-400" : "text-slate-400"}
                        />
                      ))}
                    </span>
                    {!r.visible && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded">비공개</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
