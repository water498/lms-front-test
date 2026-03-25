"use client";

import { BookOpen, Users, ClipboardList } from "lucide-react";

interface AssignedSession {
  id: string;
  courseTitle: string;
  sessionName: string;
  role: "PRIMARY" | "ASSISTANT";
  enrolleeCount: number;
  startDate: string;
  endDate?: string;
}

const MOCK_ASSIGNED_SESSIONS: AssignedSession[] = [
  { id: "se2", courseTitle: "React 기초",     sessionName: "2025-02기", role: "PRIMARY",   enrolleeCount: 76, startDate: "2025-03-03" },
  { id: "se5", courseTitle: "Next.js 마스터", sessionName: "2025-01기", role: "PRIMARY",   enrolleeCount: 51, startDate: "2025-02-10", endDate: "2025-04-04" },
];

const ROLE_BADGE: Record<"PRIMARY" | "ASSISTANT", string> = {
  PRIMARY:   "bg-violet-500/20 text-violet-300",
  ASSISTANT: "bg-zinc-700 text-zinc-400",
};

const ROLE_LABEL: Record<"PRIMARY" | "ASSISTANT", string> = {
  PRIMARY:   "주 강사",
  ASSISTANT: "보조 강사",
};

export function InstructorCoursesTab() {
  if (MOCK_ASSIGNED_SESSIONS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <BookOpen className="w-10 h-10 text-zinc-700" />
        <p className="text-sm text-zinc-500">배정된 과정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {MOCK_ASSIGNED_SESSIONS.map((session) => (
        <div
          key={session.id}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4"
        >
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white">{session.courseTitle}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[session.role]}`}>
                  {ROLE_LABEL[session.role]}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{session.sessionName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-zinc-500">
                {session.startDate} ~ {session.endDate ?? "진행 중"}
              </p>
            </div>
          </div>

          {/* 메타 */}
          <div className="flex items-center gap-5 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>수강생 {session.enrolleeCount}명</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-1 border-t border-zinc-800">
            <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              <ClipboardList className="w-3.5 h-3.5" />
              채점 관리
            </button>
            <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              <Users className="w-3.5 h-3.5" />
              수강생 목록
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
