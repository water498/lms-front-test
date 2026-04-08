"use client";

import ActivityTab from "@/features/(admin)/user-layout/tabs/activity-tab";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <ActivityTab userId={userId} />;
}
