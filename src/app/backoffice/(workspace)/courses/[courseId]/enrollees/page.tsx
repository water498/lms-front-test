"use client";

import EnrolleesTab from "@/features/(backoffice)/course-enrollees/feature";
import { useCourseDetail } from "@/features/(backoffice)/v2-course-layout/context";

export default function Page() {
  const { sessions, enrollees } = useCourseDetail();
  return <EnrolleesTab sessions={sessions} enrollees={enrollees} />;
}
