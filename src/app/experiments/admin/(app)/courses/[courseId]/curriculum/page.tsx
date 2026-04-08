"use client";

import CurriculumTab from "@/features/(admin)/course-curriculum/feature";
import { useCourseDetail } from "@/features/(admin)/course-detail/context";

export default function Page() {
  const {
    subjects,
    hasOngoingSessions,
    course,
    enrollees,
    isSequential,
    setIsSequential,
    handleAddSubject,
    handleDeleteSubject,
    handleAddActivity,
    handleDeleteActivity,
    handleEditSubject,
    handleEditActivity,
  } = useCourseDetail();

  return (
    <CurriculumTab
      subjects={subjects}
      hasOngoingSessions={hasOngoingSessions}
      hasInstructor={!!course.instructorId}
      enrolleeCount={enrollees.length}
      isSequential={isSequential}
      courseMode={course.mode ?? "ONLINE"}
      onToggleSequential={setIsSequential}
      onAddSubject={handleAddSubject}
      onDeleteSubject={handleDeleteSubject}
      onAddActivity={handleAddActivity}
      onDeleteActivity={handleDeleteActivity}
      onEditSubject={handleEditSubject}
      onEditActivity={handleEditActivity}
    />
  );
}
