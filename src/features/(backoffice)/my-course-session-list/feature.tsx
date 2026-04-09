"use client";

import Link from "next/link";
import { Users, Calendar, ChevronRight } from "lucide-react";
import {
  CURRENT_INSTRUCTOR_ID,
  instructorCourses,
  enrollmentsBySession,
} from "../shared/mockData";

const BASE = "/backoffice";

export default function InstructorSessionsFeature() {
  const courses = instructorCourses[CURRENT_INSTRUCTOR_ID] ?? [];

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">내 과정</h1>
        <p className="text-sm text-slate-500 mt-1">담당하고 있는 과정 차수 목록입니다.</p>
      </div>

      <div className="flex flex-col gap-3">
        {courses.map((c) => {
          const enrollments = enrollmentsBySession[c.sessionId];
          const studentCount = enrollments ? enrollments.length : c.enrolleeCount;
          const activeCount = enrollments
            ? enrollments.filter((e) => e.status === "ACTIVE").length
            : null;
          const isOngoing = !c.endDate;

          return (
            <Link
              key={c.sessionId}
              href={`${BASE}/sessions/${c.sessionId}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.role === "PRIMARY"
                        ? "bg-violet-50 text-violet-600"
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {c.role === "PRIMARY" ? "주 강사" : "보조 강사"}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      isOngoing
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      {isOngoing ? "진행 중" : "종료"}
                    </span>
                  </div>

                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-violet-500 transition-colors">
                    {c.courseTitle}
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">{c.sessionName}</p>

                  <div className="flex items-center gap-5 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users size={13} />
                      <span>{studentCount}명 수강{activeCount !== null && ` (활성 ${activeCount}명)`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={13} />
                      <span>
                        {c.startDate}
                        {c.endDate ? ` ~ ${c.endDate}` : " ~ 진행 중"}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-500 group-hover:text-slate-500 transition-colors shrink-0 mt-1"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-sm">담당 과정이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
