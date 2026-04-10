"use client";

import SessionsTab from "@/features/(backoffice)/course-sessions/feature";
import { useCourseDetail } from "@/features/(backoffice)/v2-course-layout/context";

export default function Page() {
  const { sessions, courseId, course } = useCourseDetail();
  return <SessionsTab sessions={sessions} courseId={courseId} defaultMinEnrollment={course.defaultMinLearners} />;
}
