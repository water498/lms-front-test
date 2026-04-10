"use client";

import OfflineTab from "@/features/(backoffice)/course-offline/feature";
import { useCourseDetail } from "@/features/(backoffice)/v2-course-layout/context";

export default function Page() {
  const { sessions } = useCourseDetail();
  return <OfflineTab sessions={sessions} />;
}
