"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCourse } from "../course-layout/mockData";
import { CourseDetailProvider } from "./context";

const TABS = [
  { id: "info",       label: "과정 정보",  href: (base: string) => `${base}/info` },
  { id: "curriculum", label: "커리큘럼",    href: (base: string) => `${base}/curriculum` },
  { id: "sessions",   label: "차수 관리",   href: (base: string) => `${base}/sessions` },
  { id: "reviews",    label: "리뷰",        href: (base: string) => `${base}/reviews` },
  { id: "enrollees",  label: "수강생",      href: (base: string) => `${base}/enrollees` },
  { id: "offline",    label: "오프라인",    href: (base: string) => `${base}/offline` },
];

export default function CourseDetailShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  const course = getCourse(courseId);
  const base = `/experiments/admin/courses/${courseId}`;

  if (!course) {
    return <p className="text-slate-500">과정을 찾을 수 없습니다.</p>;
  }

  return (
    <CourseDetailProvider courseId={courseId}>
      <div className="flex flex-col gap-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/experiments/admin/courses"
            className="hover:text-violet-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            과정 관리
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{course.title}</span>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-200">
          {TABS.map((tab) => {
            const tabHref = tab.href(base);
            const isActive = pathname === tabHref || pathname.startsWith(tabHref + "/");
            return (
              <Link
                key={tab.id}
                href={tabHref}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Tab content */}
        <div>{children}</div>
      </div>
    </CourseDetailProvider>
  );
}
