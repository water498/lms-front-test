"use client";

import InfoTab from "@/features/(backoffice)/course-info/feature";
import { useCourseDetail } from "@/features/(backoffice)/v2-course-layout/context";

export default function Page() {
  const { course } = useCourseDetail();
  return <InfoTab course={course} />;
}
