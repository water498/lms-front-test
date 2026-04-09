"use client";

import InstructorCoursesTab from "@/features/(backoffice)/user-instructor-courses/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { instCourses } = useUserDetail();
  return <InstructorCoursesTab courses={instCourses} />;
}
