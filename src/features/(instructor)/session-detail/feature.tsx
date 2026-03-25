"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, CalendarCheck, ClipboardList } from "lucide-react";
import { instructorCourses, CURRENT_INSTRUCTOR_ID } from "../shared/mockData";
import StudentsTab from "./tabs/students-tab";
import AttendanceTab from "./tabs/attendance-tab";
import GradingTab from "./tabs/grading-tab";

type Tab = "students" | "attendance" | "grading";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "students",   label: "수강생",  icon: Users },
  { id: "attendance", label: "출결",    icon: CalendarCheck },
  { id: "grading",    label: "채점",    icon: ClipboardList },
];

export default function InstructorSessionDetailFeature({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("students");

  const courses = instructorCourses[CURRENT_INSTRUCTOR_ID] ?? [];
  const course = courses.find((c) => c.sessionId === sessionId);

  if (!course) {
    return (
      <div className="p-8 text-center text-zinc-500">
        <p className="text-sm">세션을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors shrink-0 mt-0.5"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{course.courseTitle}</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {course.sessionName} · {course.enrolleeCount}명 수강 ·{" "}
            <span className={`font-medium ${course.role === "PRIMARY" ? "text-violet-400" : "text-zinc-400"}`}>
              {course.role === "PRIMARY" ? "주 강사" : "보조 강사"}
            </span>
          </p>
        </div>
      </div>

      {/* 탭 + 콘텐츠 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-zinc-800">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? "text-white border-violet-500"
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "students"   && <StudentsTab   sessionId={sessionId} />}
        {activeTab === "attendance" && <AttendanceTab sessionId={sessionId} />}
        {activeTab === "grading"    && <GradingTab    sessionId={sessionId} />}
      </div>
    </div>
  );
}
