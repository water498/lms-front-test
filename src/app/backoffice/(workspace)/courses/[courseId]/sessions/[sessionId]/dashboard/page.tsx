"use client";

import DashboardTab from "@/features/(backoffice)/session-dashboard/feature";
import { useSessionDetail } from "@/features/(backoffice)/v2-session-layout/context";

export default function Page() {
  const { session, enrollees } = useSessionDetail();
  return <DashboardTab session={session} enrollees={enrollees} />;
}
