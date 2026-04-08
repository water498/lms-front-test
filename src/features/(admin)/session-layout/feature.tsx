"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { SessionDetailProvider, useSessionDetail } from "./context";
import NotifyModal from "../session-dashboard/modals/notify-modal";

const TABS_BASE = [
  { id: "dashboard",  label: "대시보드",      href: (base: string) => `${base}/dashboard` },
  { id: "info",       label: "차수 정보",     href: (base: string) => `${base}/info` },
  { id: "enrollees",  label: "수강생",        href: (base: string) => `${base}/enrollees` },
  { id: "grading",    label: "채점",          href: (base: string) => `${base}/grading` },
  { id: "qna",        label: "Q&A",          href: (base: string) => `${base}/qna` },
  { id: "history",    label: "학습 이력",     href: (base: string) => `${base}/history` },
  { id: "resources",  label: "자료실",        href: (base: string) => `${base}/resources` },
];

const TAB_OFFLINE  = { id: "offline",  label: "오프라인 관리", href: (base: string) => `${base}/offline` };
const TAB_WAITLIST = { id: "waitlist", label: "대기자",        href: (base: string) => `${base}/waitlist` };

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { course, courseId, session, sessionId, enrollees, isOffline, isCohort } = useSessionDetail();
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const base = `/experiments/admin/sessions/${sessionId}`;

  const TABS = [
    ...TABS_BASE,
    ...(isOffline ? [TAB_OFFLINE]  : []),
    ...(isCohort  ? [TAB_WAITLIST] : []),
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb + header actions */}
      <div className="flex items-center justify-between">
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
        <button
          onClick={() => setShowNotifyModal(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 px-3 py-2 border border-violet-200 hover:border-violet-400 rounded-lg transition-colors"
        >
          <Bell size={14} />
          알림 발송
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => {
          const tabHref = tab.href(base);
          const isActive = pathname === tabHref || pathname.startsWith(tabHref + "/");
          return (
            <Link
              key={tab.id}
              href={tabHref}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab content */}
      <div>{children}</div>

      {showNotifyModal && (
        <NotifyModal
          session={session}
          totalEnrolled={enrollees.length}
          belowThresholdCount={enrollees.filter((e) => e.progress < session.completionThreshold).length}
          onClose={() => setShowNotifyModal(false)}
        />
      )}
    </div>
  );
}

export default function SessionDetailShell({ children }: { children: React.ReactNode }) {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  return (
    <SessionDetailProvider sessionId={sessionId}>
      <ShellInner>{children}</ShellInner>
    </SessionDetailProvider>
  );
}
