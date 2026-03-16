"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourse } from "../course-detail/mockData";
import { getSessions, getEnrolleesBySession } from "../course-detail/mockData";
import SessionInfoTab from "./tabs/info-tab";
import SessionEnrolleesTab from "./tabs/enrollees-tab";
import SessionOfflineTab from "./tabs/offline-tab";
import DashboardTab from "./tabs/dashboard-tab";

type TabId = "dashboard" | "info" | "enrollees" | "offline";

interface Props {
  courseId: string;
  sessionId: string;
}

export default function SessionDetailFeature({ courseId, sessionId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  const course = getCourse(courseId);
  const sessions = getSessions(courseId);
  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];
  const enrollees = getEnrolleesBySession(session.id);

  if (!course) return <p className="text-slate-500">과정을 찾을 수 없습니다.</p>;

  const isOffline = course.mode === "OFFLINE" || course.mode === "BLENDED";

  const TABS: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "대시보드" },
    { id: "info",      label: "차수 정보" },
    { id: "enrollees", label: "수강생" },
    ...(isOffline ? [{ id: "offline" as TabId, label: "오프라인 관리" }] : []),
  ];

  return (
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
        <Link
          href={`/experiments/admin/courses/${courseId}`}
          className="hover:text-violet-600 transition-colors"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{session.name}</span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "dashboard" && <DashboardTab session={session} enrollees={enrollees} />}
        {activeTab === "info"      && <SessionInfoTab session={session} />}
        {activeTab === "enrollees" && <SessionEnrolleesTab enrollees={enrollees} sessionId={session.id} />}
        {activeTab === "offline"   && <SessionOfflineTab sessionId={session.id} />}
      </div>
    </div>
  );
}
