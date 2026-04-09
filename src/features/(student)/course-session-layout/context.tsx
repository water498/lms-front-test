"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CourseSubject, EnrolledCourse } from "@/lib/models";
import {
  getStudentSession,
  getEnrolledCourseBySession,
  getCurriculumBySession,
  sessionQnaBySession,
  announcementsBySession,
  resourcesBySession,
  type StudentSession,
  type SessionAnnouncement,
  type StudentResource,
  type SessionQnaItem,
} from "./mockData";

interface SessionWorkspaceContextValue {
  sessionId: string;
  session: StudentSession;
  course: EnrolledCourse;
  subjects: CourseSubject[];
  qnaPosts: SessionQnaItem[];
  announcements: SessionAnnouncement[];
  resources: StudentResource[];
  urgentCount: number;
  totalActivities: number;
  learnHref: string;
}

const SessionWorkspaceContext = createContext<SessionWorkspaceContextValue | null>(null);

export function useSessionWorkspaceContext() {
  const ctx = useContext(SessionWorkspaceContext);
  if (!ctx) throw new Error("useSessionWorkspaceContext must be used within SessionWorkspaceProvider");
  return ctx;
}

interface SessionWorkspaceProviderProps {
  sessionId: string;
  children: ReactNode;
}

export function SessionWorkspaceProvider({ sessionId, children }: SessionWorkspaceProviderProps) {
  const session = getStudentSession(sessionId);
  const course = getEnrolledCourseBySession(sessionId);
  const subjects = getCurriculumBySession(sessionId);
  const qnaPosts = sessionQnaBySession[sessionId] ?? [];
  const announcements = announcementsBySession[sessionId] ?? [];
  const resources = resourcesBySession[sessionId] ?? [];

  const urgentCount = announcements.filter((a) => a.type === "URGENT").length;

  if (!session || !course) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">차수 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const totalActivities = subjects.reduce((s, sub) => s + sub.activities.length, 0);

  const firstActivity = subjects[0]?.activities[0];
  const learnHref = firstActivity
    ? `/student/learn/${session.courseId}/${firstActivity.id}`
    : "#";

  return (
    <SessionWorkspaceContext.Provider
      value={{
        sessionId,
        session,
        course,
        subjects,
        qnaPosts,
        announcements,
        resources,
        urgentCount,
        totalActivities,
        learnHref,
      }}
    >
      {children}
    </SessionWorkspaceContext.Provider>
  );
}
