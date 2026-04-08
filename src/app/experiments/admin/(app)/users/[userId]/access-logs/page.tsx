"use client";

import AccessLogsFeature from "@/features/(admin)/user-access-logs/feature";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <AccessLogsFeature userId={userId} />;
}
