"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourse, getCurriculum, getSessions, getEnrollees } from "./mockData";
import InfoTab from "./tabs/info-tab";
import CurriculumTab from "./tabs/curriculum-tab";
import SessionsTab from "./tabs/sessions-tab";
import EnrolleesTab from "./tabs/enrollees-tab";

const TABS = [
  { id: "info",       label: "코스 정보" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "sessions",   label: "세션 관리" },
  { id: "enrollees",  label: "수강생" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CourseDetailFeature({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("curriculum");

  const course = getCourse(courseId);
  const curriculum = getCurriculum(courseId);
  const sessions = getSessions(courseId);
  const enrollees = getEnrollees(courseId);

  if (!course) return <p className="text-slate-500">코스를 찾을 수 없습니다.</p>;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/experiments/admin/courses" className="hover:text-violet-600 flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={14} />
          코스 관리
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{course.title}</span>
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
        {activeTab === "info"       && <InfoTab course={course} />}
        {activeTab === "curriculum" && <CurriculumTab subjects={curriculum} />}
        {activeTab === "sessions"   && <SessionsTab sessions={sessions} />}
        {activeTab === "enrollees"  && <EnrolleesTab enrollees={enrollees} sessions={sessions} />}
      </div>
    </div>
  );
}
