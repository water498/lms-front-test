"use client";

import ReviewsTab from "@/features/(admin)/course-reviews/feature";
import { useCourseDetail } from "@/features/(admin)/course-layout/context";

export default function Page() {
  const { reviews } = useCourseDetail();
  return <ReviewsTab reviews={reviews} />;
}
