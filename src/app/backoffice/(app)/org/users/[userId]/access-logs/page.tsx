"use client";

import AccessLogsFeature from "@/features/(backoffice)/user-access-log-list/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <AccessLogsFeature userId={userId} />;
}
