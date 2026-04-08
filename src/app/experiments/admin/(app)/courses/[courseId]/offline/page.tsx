"use client";

import OfflineTab from "@/features/(admin)/course-offline/feature";
import { useCourseDetail } from "@/features/(admin)/course-layout/context";

export default function Page() {
  const { sessions } = useCourseDetail();
  return <OfflineTab sessions={sessions} />;
}
