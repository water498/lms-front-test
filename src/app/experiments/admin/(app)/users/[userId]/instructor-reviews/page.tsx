"use client";

import InstructorReviewsTab from "@/features/(admin)/user-layout/tabs/instructor-reviews-tab";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { instReviews } = useUserDetail();
  return <InstructorReviewsTab reviews={instReviews} />;
}
