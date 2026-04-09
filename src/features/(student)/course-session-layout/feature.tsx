"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { Navbar } from "../student-dashboard/components/navbar";
import { SessionWorkspaceProvider, useSessionWorkspaceContext } from "./context";

type Tab = "home" | "curriculum" | "qna" | "announcements" | "resources";
const TABS: { id: Tab; label: string }[] = [
  { id: "home",          label: "홈" },
  { id: "curriculum",    label: "커리큘럼" },
  { id: "qna",           label: "Q&A" },
  { id: "announcements", label: "공지" },
  { id: "resources",     label: "자료실" },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  OPEN:    { label: "모집 중",  className: "bg-blue-900/50 text-blue-300 border border-blue-700" },
  ONGOING: { label: "진행 중",  className: "bg-violet-900/50 text-violet-300 border border-violet-700" },
  CLOSED:  { label: "종료",    className: "bg-zinc-800 text-zinc-400 border border-zinc-700" },
};

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    sessionId,
    session,
    course,
    urgentCount,
    totalActivities,
    learnHref,
  } = useSessionWorkspaceContext();

  const baseUrl = `/student/sessions/${sessionId}`;
  const activeTab = TABS.find((t) => pathname.endsWith(`/${t.id}`))?.id ?? "home";
  const badge = STATUS_BADGE[session.status] ?? STATUS_BADGE.CLOSED;

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar cartCount={0} />

      <div className="max-w-screen-lg mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link
            href={`/student/courses/${session.courseId}`}
            className="hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            과정 소개
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{session.name}</span>
        </div>

        {/* Header card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-zinc-500 font-medium">{course.title}</p>
              <h1 className="text-xl font-bold text-white">{session.name}</h1>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
                <span>{session.startDate} ~ {session.endDate}</span>
                <span>강사: {session.instructor}</span>
              </div>
            </div>
            <Link
              href={learnHref}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              이어 학습
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
              <span>내 진도율</span>
              <span className="font-medium text-zinc-300">{course.progress}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">다음: {course.nextLessonTitle}</p>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex items-center gap-5 text-xs text-zinc-500 border-t border-zinc-800 pt-4">
            <span>정원 {session.enrolled}/{session.capacity}명</span>
            <span>수료 기준 {session.completionThreshold}% 이상</span>
            <span>총 {totalActivities}개 활동</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-zinc-800">
          {TABS.map((tab) => {
            const showBadge = tab.id === "announcements" && urgentCount > 0;
            return (
              <Link
                key={tab.id}
                href={`${baseUrl}/${tab.id}`}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-violet-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {showBadge && (
                  <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                    {urgentCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Tab content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SessionWorkspaceShell({ children }: { children: React.ReactNode }) {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  return (
    <SessionWorkspaceProvider sessionId={sessionId}>
      <ShellInner>{children}</ShellInner>
    </SessionWorkspaceProvider>
  );
}
