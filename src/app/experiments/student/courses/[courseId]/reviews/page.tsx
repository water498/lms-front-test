"use client";

import { ReviewsTab } from "@/features/(student)/courses/sections/reviews-tab";
import { useCourseContext } from "@/features/(student)/courses/context";

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
