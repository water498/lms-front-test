"use client";

import EnrollmentsTab from "@/features/(admin)/user-detail/tabs/enrollments-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <EnrollmentsTab userId={userId} />;
}
