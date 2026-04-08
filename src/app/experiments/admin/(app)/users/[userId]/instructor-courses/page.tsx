"use client";

import InstructorCoursesTab from "@/features/(admin)/user-detail/tabs/instructor-courses-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { instCourses } = useUserDetail();
  return <InstructorCoursesTab courses={instCourses} />;
}
