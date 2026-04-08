"use client";

import EnrollmentsTab from "@/features/(admin)/user-enrollments/feature";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <EnrollmentsTab userId={userId} />;
}
