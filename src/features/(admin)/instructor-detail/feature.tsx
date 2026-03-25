"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  instructors,
  instructorProfiles,
  instructorCourses,
  instructorReviews,
  instructorBankAccounts,
  instructorRevenues,
} from "../instructors/mockData";
import InstructorProfileTab from "./tabs/profile-tab";
import InstructorCoursesTab from "./tabs/courses-tab";
import InstructorReviewsTab from "./tabs/reviews-tab";
import InstructorPayoutsTab from "./tabs/payouts-tab";
import InstructorBankTab    from "./tabs/bank-tab";

type Tab = "profile" | "courses" | "reviews" | "payouts" | "bank";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile",  label: "프로필" },
  { id: "courses",  label: "담당 과정" },
  { id: "reviews",  label: "강사 평가" },
  { id: "payouts",  label: "정산 내역" },
  { id: "bank",     label: "계좌 정보" },
];

interface Props {
  instructorId: string;
}

export default function InstructorDetailFeature({ instructorId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const instructor = instructors.find((i) => i.id === instructorId);
  const profile    = instructorProfiles[instructorId];
  const courses    = instructorCourses[instructorId] ?? [];
  const reviews    = instructorReviews[instructorId] ?? [];
  const accounts   = instructorBankAccounts[instructorId] ?? [];
  const revenues   = instructorRevenues[instructorId] ?? [];

  if (!instructor || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-slate-500 text-sm">존재하지 않는 강사입니다.</p>
        <Link
          href="/experiments/admin/instructors"
          className="text-sm text-violet-600 hover:underline"
        >
          강사 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/experiments/admin/instructors"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
      >
        <ChevronLeft size={15} />
        강사 목록
      </Link>

      {/* 탭 바 */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
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

      {activeTab === "profile"  && <InstructorProfileTab profile={profile} instructorName={instructor.name} />}
      {activeTab === "courses"  && <InstructorCoursesTab courses={courses} />}
      {activeTab === "reviews"  && <InstructorReviewsTab reviews={reviews} />}
      {activeTab === "payouts"  && <InstructorPayoutsTab revenues={revenues} />}
      {activeTab === "bank"     && <InstructorBankTab accounts={accounts} instructorId={instructorId} />}
    </div>
  );
}
