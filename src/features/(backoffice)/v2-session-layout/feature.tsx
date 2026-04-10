"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { SessionDetailProvider, useSessionDetail } from "./context";
import NotifyModal from "../session-dashboard/modals/notify-modal";

const TABS_BASE = [
  { id: "dashboard",  label: "대시보드",   href: (base: string) => `${base}/dashboard` },
  { id: "enrollees",  label: "수강생",     href: (base: string) => `${base}/enrollees` },
  { id: "grading",    label: "채점",       href: (base: string) => `${base}/grading` },
  { id: "attendance", label: "출석",       href: (base: string) => `${base}/attendance` },
  { id: "qna",        label: "Q&A",       href: (base: string) => `${base}/qna` },
  { id: "resources",  label: "자료실",     href: (base: string) => `${base}/resources` },
];

const TAB_OFFLINE  = { id: "offline",  label: "오프라인 관리", href: (base: string) => `${base}/offline` };

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { course, courseId, session, sessionId, enrollees, isOffline } = useSessionDetail();
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const base = `/backoffice/courses/${courseId}/sessions/${sessionId}`;

  const TABS = [
    ...TABS_BASE,
    ...(isOffline ? [TAB_OFFLINE] : []),
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header: session name + actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{session.name}</h2>
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

export default function SessionDetailShellV2({ children }: { children: React.ReactNode }) {
  const params = useParams<{ courseId: string; sessionId: string }>();

  return (
    <SessionDetailProvider courseId={params.courseId} sessionId={params.sessionId}>
      <ShellInner>{children}</ShellInner>
    </SessionDetailProvider>
  );
}
