"use client";

import ReviewsTab from "@/features/(backoffice)/course-reviews/feature";
import { useCourseDetail } from "@/features/(backoffice)/course-layout/context";

export default function Page() {
  const { reviews } = useCourseDetail();
  return <ReviewsTab reviews={reviews} />;
}
