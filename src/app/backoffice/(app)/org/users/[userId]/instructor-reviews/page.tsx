"use client";

import InstructorReviewsTab from "@/features/(backoffice)/user-instructor-reviews/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { instReviews } = useUserDetail();
  return <InstructorReviewsTab reviews={instReviews} />;
}
