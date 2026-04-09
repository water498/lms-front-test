"use client";

import InfoTab from "@/features/(admin)/course-info/feature";
import { useCourseDetail } from "@/features/(admin)/course-layout/context";

export default function Page() {
  const { course } = useCourseDetail();
  return <InfoTab course={course} />;
}
