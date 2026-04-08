"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Course, CourseSession, CourseEnrollee } from "@/lib/models";
import { getCourse, getSessionById, getEnrolleesBySession } from "../course-layout/mockData";

interface SessionDetailContextValue {
  course: Course;
  courseId: string;
  session: CourseSession;
  sessionId: string;
  enrollees: CourseEnrollee[];
  isOffline: boolean;
  isCohort: boolean;
}

const SessionDetailContext = createContext<SessionDetailContextValue | null>(null);

export function useSessionDetail() {
  const ctx = useContext(SessionDetailContext);
  if (!ctx) throw new Error("useSessionDetail must be used within SessionDetailProvider");
  return ctx;
}

export function SessionDetailProvider({ sessionId, children }: { sessionId: string; children: ReactNode }) {
  const session = getSessionById(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const courseId = session.courseId;
  const course = getCourse(courseId);
  const enrollees = getEnrolleesBySession(session.id);

  if (!course) throw new Error(`Course ${courseId} not found`);

  const isOffline = course.mode === "OFFLINE" || course.mode === "BLENDED";
  const isCohort = session.type === "COHORT";

  return (
    <SessionDetailContext.Provider value={{ course, courseId, session, sessionId, enrollees, isOffline, isCohort }}>
      {children}
    </SessionDetailContext.Provider>
  );
}
