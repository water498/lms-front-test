"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, AlertTriangle, Megaphone, Award } from "lucide-react";
import { Navbar } from "../home/components/navbar";
import { QnaTab } from "../courses/sections/qna-tab";
import { CurriculumTab } from "../courses/sections/curriculum-tab";
import {
  getStudentSession,
  getEnrolledCourseBySession,
  getCurriculumBySession,
  sessionQnaBySession,
  announcementsBySession,
  type SessionAnnouncement,
} from "./mockData";

interface Props {
  sessionId: string;
}

type Tab = "home" | "curriculum" | "qna" | "announcements";
const TABS: { id: Tab; label: string }[] = [
  { id: "home",          label: "홈" },
  { id: "curriculum",   label: "커리큘럼" },
  { id: "qna",          label: "Q&A" },
  { id: "announcements", label: "공지" },
];

export default function SessionWorkspaceFeature({ sessionId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const session = getStudentSession(sessionId);
  const course = getEnrolledCourseBySession(sessionId);
  const subjects = getCurriculumBySession(sessionId);
  const qnaPosts = sessionQnaBySession[sessionId] ?? [];
  const announcements = announcementsBySession[sessionId] ?? [];

  const urgentCount = announcements.filter((a) => a.type === "URGENT").length;

  if (!session || !course) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">차수 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const totalActivities = subjects.reduce((s, sub) => s + sub.activities.length, 0);

  // next activity link (first subject, first activity)
  const firstActivity = subjects[0]?.activities[0];
  const learnHref = firstActivity
    ? `/experiments/student/learn/${session.courseId}/${firstActivity.id}`
    : "#";

  const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    OPEN:    { label: "모집 중",  className: "bg-blue-900/50 text-blue-300 border border-blue-700" },
    ONGOING: { label: "진행 중",  className: "bg-violet-900/50 text-violet-300 border border-violet-700" },
    CLOSED:  { label: "종료",    className: "bg-zinc-800 text-zinc-400 border border-zinc-700" },
  };
  const badge = STATUS_BADGE[session.status] ?? STATUS_BADGE.CLOSED;

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar cartCount={0} />

      <div className="max-w-screen-lg mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link
            href={`/experiments/student/courses/${session.courseId}`}
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
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "home" && (
            <HomeTab session={session} announcements={announcements} isClosed={session.status === "CLOSED"} />
          )}
          {activeTab === "curriculum" && (
            <CurriculumTab subjects={subjects} />
          )}
          {activeTab === "qna" && (
            <QnaTab courseId={session.courseId} canPost sessionId={sessionId} posts={qnaPosts} />
          )}
          {activeTab === "announcements" && (
            <AnnouncementsTab announcements={announcements} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── 홈 탭 ─────────────────────────────────────────────────────────────────

function HomeTab({
  session,
  announcements,
  isClosed,
}: {
  session: ReturnType<typeof getStudentSession>;
  announcements: SessionAnnouncement[];
  isClosed: boolean;
}) {
  if (!session) return null;

  const urgent = announcements.filter((a) => a.type === "URGENT");

  return (
    <div className="flex flex-col gap-5">
      {/* Urgent announcements */}
      {urgent.length > 0 && (
        <div className="flex flex-col gap-2">
          {urgent.map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-3 bg-rose-950/40 border border-rose-800/60 rounded-xl">
              <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-rose-300">{a.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session info grid */}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard label="개강일" value={session.startDate} />
        <InfoCard label="종강일" value={session.endDate} />
        <InfoCard label="수강 인원" value={`${session.enrolled} / ${session.capacity}명`} />
        <InfoCard label="수료 기준" value={`진도율 ${session.completionThreshold}% 이상`} />
      </div>

      {/* Certificate section — shown when session has ended */}
      {isClosed && (
        <div className="flex items-center justify-between bg-amber-950/30 border border-amber-700/40 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">수료증이 발급되었습니다</p>
              <p className="text-xs text-zinc-400 mt-0.5">과정을 완료하셨습니다. 수료증을 확인해 보세요.</p>
            </div>
          </div>
          <Link
            href="/experiments/student/my/certificates"
            className="shrink-0 px-3 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-lg transition-colors"
          >
            수료증 보기
          </Link>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  );
}

// ── 공지 탭 ───────────────────────────────────────────────────────────────

function AnnouncementsTab({ announcements }: { announcements: SessionAnnouncement[] }) {
  if (announcements.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500 text-sm">등록된 공지가 없습니다.</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((a) => (
        <div
          key={a.id}
          className={`flex gap-4 rounded-2xl border p-5 ${
            a.type === "URGENT"
              ? "bg-rose-950/30 border-rose-800/50"
              : "bg-zinc-900 border-zinc-800"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {a.type === "URGENT" ? (
              <AlertTriangle size={16} className="text-rose-400" />
            ) : (
              <Megaphone size={16} className="text-zinc-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {a.type === "URGENT" && (
                <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">긴급</span>
              )}
              <p className="text-sm font-semibold text-zinc-200">{a.title}</p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{a.body}</p>
            <p className="text-xs text-zinc-600 mt-2">{a.authorName} · {a.createdAt}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
