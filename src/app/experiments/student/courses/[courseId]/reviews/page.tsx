"use client";

import { ReviewsTab } from "@/features/(student)/course-reviews/feature";
import { useCourseContext } from "@/features/(student)/course-layout/context";

export default function ReviewsPage() {
  const { detail, averageRating, isCompleted, courseId } = useCourseContext();
  return (
    <ReviewsTab
      reviews={detail.reviews}
      averageRating={averageRating}
      canWrite={isCompleted}
      courseId={courseId}
      instructor={detail.instructor}
    />
  );
}
