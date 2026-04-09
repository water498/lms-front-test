"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { users } from "../user-list/mockData";
import { UserDetailProvider } from "./context";

const BASE_TABS = [
  { id: "profile",      label: "기본 정보",  slug: "profile" },
  { id: "enrollments",  label: "수강 이력",  slug: "enrollments" },
  { id: "activity",     label: "활동 로그",  slug: "activity" },
  { id: "sessions",     label: "접속 기기",  slug: "sessions" },
  { id: "accessLogs",   label: "접속 이력",  slug: "access-logs" },
];

const INSTRUCTOR_TABS = [
  { id: "instCourses",  label: "담당 과정",  slug: "instructor-courses" },
  { id: "instReviews",  label: "강사 평가",  slug: "instructor-reviews" },
  { id: "instPayouts",  label: "정산 내역",  slug: "instructor-payouts" },
  { id: "instBank",     label: "계좌 정보",  slug: "instructor-bank" },
];

export default function UserDetailShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const user = users.find((u) => u.id === userId);
  const base = `/admin/users/${userId}`;
  const isInstructor = user?.role === "INSTRUCTOR";
  const tabs = isInstructor ? [...BASE_TABS, ...INSTRUCTOR_TABS] : BASE_TABS;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-slate-500 text-sm">존재하지 않는 유저입니다.</p>
        <Link
          href="/backoffice/users"
          className="text-sm text-violet-600 hover:underline"
        >
          유저 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <UserDetailProvider userId={userId}>
      <div className="flex flex-col gap-5">
        {/* Breadcrumb */}
        <Link
          href="/backoffice/users"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
        >
          <ChevronLeft size={15} />
          유저 목록
        </Link>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-200">
          {tabs.map((tab) => {
            const tabHref = `${base}/${tab.slug}`;
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
    </UserDetailProvider>
  );
}
