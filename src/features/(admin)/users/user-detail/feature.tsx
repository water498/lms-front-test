"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { users } from "../mockData";
import type { User } from "../mockData";
import ProfileTab from "./tabs/profile-tab";
import EnrollmentsTab from "./tabs/enrollments-tab";
import ActivityTab from "./tabs/activity-tab";
import SessionsTab from "./tabs/sessions-tab";
import AccessLogsFeature from "../access-logs/feature";
import InstructorCoursesTab from "./tabs/instructor-courses-tab";
import InstructorReviewsTab from "./tabs/instructor-reviews-tab";
import InstructorPayoutsTab from "./tabs/instructor-payouts-tab";
import InstructorBankTab from "./tabs/instructor-bank-tab";
import {
  instructorCourses,
  instructorReviews,
  instructorBankAccounts,
  instructorRevenues,
} from "./mockData";

type Tab = "profile" | "enrollments" | "activity" | "sessions" | "accessLogs" | "instCourses" | "instReviews" | "instPayouts" | "instBank";

const BASE_TABS: { id: Tab; label: string }[] = [
  { id: "profile",     label: "기본 정보" },
  { id: "enrollments", label: "수강 이력" },
  { id: "activity",    label: "활동 로그" },
  { id: "sessions",    label: "접속 기기" },
  { id: "accessLogs",  label: "접속 이력" },
];

const INSTRUCTOR_TABS: { id: Tab; label: string }[] = [
  { id: "instCourses",  label: "담당 과정" },
  { id: "instReviews",  label: "강사 평가" },
  { id: "instPayouts",  label: "정산 내역" },
  { id: "instBank",     label: "계좌 정보" },
];

interface Props {
  userId: string;
  hideBackLink?: boolean;
}

export default function UserDetailFeature({ userId, hideBackLink }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [user, setUser] = useState<User | undefined>(() => users.find((u) => u.id === userId));

  const isInstructor = user?.role === "INSTRUCTOR";
  const tabs = isInstructor ? [...BASE_TABS, ...INSTRUCTOR_TABS] : BASE_TABS;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-slate-500 text-sm">존재하지 않는 유저입니다.</p>
        <Link
          href="/experiments/admin/users"
          className="text-sm text-violet-600 hover:underline"
        >
          유저 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {!hideBackLink && (
        <Link
          href="/experiments/admin/users"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
        >
          <ChevronLeft size={15} />
          유저 목록
        </Link>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile"     && <ProfileTab user={user} onUserChange={setUser} />}
      {activeTab === "enrollments" && <EnrollmentsTab userId={userId} />}
      {activeTab === "activity"    && <ActivityTab userId={userId} />}
      {activeTab === "sessions"    && <SessionsTab userId={userId} />}
      {activeTab === "accessLogs"  && <AccessLogsFeature userId={userId} />}
      {activeTab === "instCourses" && <InstructorCoursesTab courses={instructorCourses[userId] ?? []} />}
      {activeTab === "instReviews" && <InstructorReviewsTab reviews={instructorReviews[userId] ?? []} />}
      {activeTab === "instPayouts" && <InstructorPayoutsTab revenues={instructorRevenues[userId] ?? []} />}
      {activeTab === "instBank"    && <InstructorBankTab accounts={instructorBankAccounts[userId] ?? []} instructorId={userId} />}
    </div>
  );
}
