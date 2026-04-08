"use client";

import DashboardTab from "@/features/(admin)/session-layout/tabs/dashboard-tab";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { session, enrollees } = useSessionDetail();
  return <DashboardTab session={session} enrollees={enrollees} />;
}
