"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourse, getCurriculum, getSessions, getEnrollees, type Subject, type Activity } from "./mockData";
import InfoTab from "./tabs/info-tab";
import CurriculumTab from "./tabs/curriculum-tab";
import SessionsTab from "./tabs/sessions-tab";

type TabId = "info" | "curriculum" | "sessions";

export default function CourseDetailFeature({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("curriculum");

  const course = getCourse(courseId);
  const sessions = getSessions(courseId);
  const enrollees = getEnrollees(courseId);

  const [subjects, setSubjects] = useState<Subject[]>(() => getCurriculum(courseId));

  if (!course) return <p className="text-slate-500">과정을 찾을 수 없습니다.</p>;

  const hasOngoingSessions = sessions.some((s) => s.status === "ONGOING");

  const TABS: { id: TabId; label: string }[] = [
    { id: "info",       label: "과정 정보" },
    { id: "curriculum", label: "커리큘럼" },
    { id: "sessions",   label: "차수 관리" },
  ];

  function handleAddSubject(title: string) {
    const id = `s${Date.now()}`;
    setSubjects((prev) => [
      ...prev,
      { id, title, order: prev.length + 1, activities: [] },
    ]);
  }

  function handleDeleteSubject(subjectId: string) {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  }

  function handleAddActivity(subjectId: string, activity: Activity) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId ? { ...s, activities: [...s.activities, activity] } : s
      )
    );
  }

  function handleDeleteActivity(subjectId: string, activityId: string) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) }
          : s
      )
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/experiments/admin/courses" className="hover:text-violet-600 flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={14} />
          과정 관리
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
        {activeTab === "curriculum" && (
          <CurriculumTab
            subjects={subjects}
            hasOngoingSessions={hasOngoingSessions}
            enrolleeCount={enrollees.length}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
        {activeTab === "sessions"   && <SessionsTab sessions={sessions} courseId={courseId} />}
      </div>
    </div>
  );
}
