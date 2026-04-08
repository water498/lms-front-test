"use client";

import EnrollmentsTab from "@/features/(admin)/user-layout/tabs/enrollments-tab";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <EnrollmentsTab userId={userId} />;
}
