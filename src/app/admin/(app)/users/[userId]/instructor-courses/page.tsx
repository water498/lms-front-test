"use client";

import InstructorCoursesTab from "@/features/(admin)/user-instructor-courses/feature";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { instCourses } = useUserDetail();
  return <InstructorCoursesTab courses={instCourses} />;
}
