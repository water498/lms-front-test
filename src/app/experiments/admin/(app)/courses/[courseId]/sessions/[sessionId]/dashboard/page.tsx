"use client";

import DashboardTab from "@/features/(admin)/session-detail/tabs/dashboard-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { session, enrollees } = useSessionDetail();
  return <DashboardTab session={session} enrollees={enrollees} />;
}
