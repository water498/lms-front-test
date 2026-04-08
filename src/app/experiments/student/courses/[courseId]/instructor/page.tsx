"use client";

import { InstructorTab } from "@/features/(student)/course-layout/sections/instructor-tab";
import { useCourseContext } from "@/features/(student)/course-layout/context";

export default function InstructorPage() {
  const { detail, isCompleted, courseId, setInstructorModalOpen } = useCourseContext();
  return (
    <InstructorTab
      instructor={detail.instructor}
      isCompleted={isCompleted}
      courseId={courseId}
      onProfileClick={() => setInstructorModalOpen(true)}
    />
  );
}
