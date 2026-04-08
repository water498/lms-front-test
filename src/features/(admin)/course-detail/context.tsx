"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import type { Course, CourseSubject, CourseActivity, CourseSession, CourseEnrollee, CourseReview } from "@/lib/models";
import { getCourse, getCurriculum, getSessions, getEnrollees, getReviews } from "./mockData";

interface CourseDetailContextValue {
  course: Course;
  courseId: string;
  subjects: CourseSubject[];
  setSubjects: Dispatch<SetStateAction<CourseSubject[]>>;
  isSequential: boolean;
  setIsSequential: (v: boolean) => void;
  sessions: CourseSession[];
  enrollees: CourseEnrollee[];
  reviews: CourseReview[];
  hasOngoingSessions: boolean;
  handleEditSubject: (updated: Partial<CourseSubject> & { id: string }) => void;
  handleEditActivity: (subjectId: string, updated: Partial<CourseActivity> & { id: string }) => void;
  handleAddSubject: (title: string, phase?: "PRE" | "LEARNING" | "POST") => void;
  handleDeleteSubject: (subjectId: string) => void;
  handleAddActivity: (subjectId: string, activity: CourseActivity) => void;
  handleDeleteActivity: (subjectId: string, activityId: string) => void;
}

const CourseDetailContext = createContext<CourseDetailContextValue | null>(null);

export function useCourseDetail() {
  const ctx = useContext(CourseDetailContext);
  if (!ctx) throw new Error("useCourseDetail must be used within CourseDetailProvider");
  return ctx;
}

export function CourseDetailProvider({ courseId, children }: { courseId: string; children: ReactNode }) {
  const course = getCourse(courseId);
  const sessions = getSessions(courseId);
  const enrollees = getEnrollees(courseId);
  const reviews = getReviews(courseId);

  const [subjects, setSubjects] = useState<CourseSubject[]>(() => getCurriculum(courseId));
  const [isSequential, setIsSequential] = useState(course?.isSequential ?? false);

  if (!course) throw new Error(`Course ${courseId} not found`);

  const hasOngoingSessions = sessions.some((s) => s.status === "ONGOING");

  function handleAddSubject(title: string, phase: "PRE" | "LEARNING" | "POST" = "LEARNING") {
    const id = `s${Date.now()}`;
    setSubjects((prev) => [
      ...prev,
      { id, courseId, title, phase, order: prev.length + 1, activities: [] },
    ]);
  }

  function handleDeleteSubject(subjectId: string) {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  }

  function handleAddActivity(subjectId: string, activity: CourseActivity) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId ? { ...s, activities: [...s.activities, activity] } : s
      )
    );
  }

  function handleDeleteActivity(subjectId: string, activityId: string) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) }
          : s
      )
    );
  }

  function handleEditSubject(updated: Partial<CourseSubject> & { id: string }) {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
  }

  function handleEditActivity(subjectId: string, updated: Partial<CourseActivity> & { id: string }) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, activities: s.activities.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)) }
          : s
      )
    );
  }

  return (
    <CourseDetailContext.Provider
      value={{
        course,
        courseId,
        subjects,
        setSubjects,
        isSequential,
        setIsSequential,
        sessions,
        enrollees,
        reviews,
        hasOngoingSessions,
        handleEditSubject,
        handleEditActivity,
        handleAddSubject,
        handleDeleteSubject,
        handleAddActivity,
        handleDeleteActivity,
      }}
    >
      {children}
    </CourseDetailContext.Provider>
  );
}
