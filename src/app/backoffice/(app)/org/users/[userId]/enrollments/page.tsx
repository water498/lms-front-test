"use client";

import EnrollmentsTab from "@/features/(backoffice)/user-enrollments/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <EnrollmentsTab userId={userId} />;
}
