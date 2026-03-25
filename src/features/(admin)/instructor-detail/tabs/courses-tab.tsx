"use client";

import { BookOpen } from "lucide-react";
import type { InstructorCourseAssignment } from "../../instructors/mockData";

interface Props {
  courses: InstructorCourseAssignment[];
}

const ROLE_BADGE: Record<"PRIMARY" | "ASSISTANT", { label: string; className: string }> = {
  PRIMARY:   { label: "주 강사",  className: "bg-violet-100 text-violet-700" },
  ASSISTANT: { label: "보조 강사", className: "bg-slate-100 text-slate-600" },
};

export default function InstructorCoursesTab({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <BookOpen size={36} className="text-slate-200" />
        <p className="text-sm">배정된 차수가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">담당 차수</p>
        <span className="text-xs text-slate-400">{courses.length}개</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-5 py-2.5 font-semibold text-slate-500">과정명</th>
            <th className="text-left px-5 py-2.5 font-semibold text-slate-500">차수</th>
            <th className="text-center px-5 py-2.5 font-semibold text-slate-500">역할</th>
            <th className="text-center px-5 py-2.5 font-semibold text-slate-500">수강생</th>
            <th className="text-left px-5 py-2.5 font-semibold text-slate-500">시작일</th>
            <th className="text-left px-5 py-2.5 font-semibold text-slate-500">종료일</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => {
            const badge = ROLE_BADGE[c.role];
            return (
              <tr key={c.sessionId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{c.courseTitle}</td>
                <td className="px-5 py-3 text-slate-600">{c.sessionName}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-5 py-3 text-center text-slate-700">{c.enrolleeCount}명</td>
                <td className="px-5 py-3 text-slate-500">{c.startDate}</td>
                <td className="px-5 py-3 text-slate-500">{c.endDate ?? "진행 중"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
