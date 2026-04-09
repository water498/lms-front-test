"use client";

import SessionsTab from "@/features/(admin)/course-sessions/feature";
import { useCourseDetail } from "@/features/(admin)/course-layout/context";

export default function Page() {
  const { sessions, courseId, course } = useCourseDetail();
  return <SessionsTab sessions={sessions} courseId={courseId} defaultMinEnrollment={course.defaultMinLearners} />;
}
