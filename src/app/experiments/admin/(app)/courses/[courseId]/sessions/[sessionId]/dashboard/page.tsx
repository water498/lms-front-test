"use client";

import DashboardTab from "@/features/(admin)/session-dashboard/feature";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { session, enrollees } = useSessionDetail();
  return <DashboardTab session={session} enrollees={enrollees} />;
}
