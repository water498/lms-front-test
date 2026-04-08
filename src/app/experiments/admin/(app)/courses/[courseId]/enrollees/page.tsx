"use client";

import EnrolleesTab from "@/features/(admin)/course-enrollees/feature";
import { useCourseDetail } from "@/features/(admin)/course-detail/context";

export default function Page() {
  const { sessions, enrollees } = useCourseDetail();
  return <EnrolleesTab sessions={sessions} enrollees={enrollees} />;
}
