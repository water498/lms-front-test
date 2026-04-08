"use client";

import InstructorReviewsTab from "@/features/(admin)/user-detail/tabs/instructor-reviews-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { instReviews } = useUserDetail();
  return <InstructorReviewsTab reviews={instReviews} />;
}
