"use client";

import { InstructorTab } from "@/features/(student)/courses/sections/instructor-tab";
import { useCourseContext } from "@/features/(student)/courses/context";

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
