"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { users } from "../mockData";
import ProfileTab from "./tabs/profile-tab";
import EnrollmentsTab from "./tabs/enrollments-tab";
import ActivityTab from "./tabs/activity-tab";

type Tab = "profile" | "enrollments" | "activity";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile",     label: "기본 정보" },
  { id: "enrollments", label: "수강 이력" },
  { id: "activity",    label: "활동 로그" },
];

interface Props {
  userId: string;
  hideBackLink?: boolean;
}

export default function UserDetailFeature({ userId, hideBackLink }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const user = users.find((u) => u.id === userId);

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

      {activeTab === "profile"     && <ProfileTab user={user} />}
      {activeTab === "enrollments" && <EnrollmentsTab userId={userId} />}
      {activeTab === "activity"    && <ActivityTab userId={userId} />}
    </div>
  );
}
