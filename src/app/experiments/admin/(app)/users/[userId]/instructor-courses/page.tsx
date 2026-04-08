"use client";

import InstructorCoursesTab from "@/features/(admin)/user-layout/tabs/instructor-courses-tab";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { instCourses } = useUserDetail();
  return <InstructorCoursesTab courses={instCourses} />;
}
