"use client";

import ActivityTab from "@/features/(admin)/user-detail/tabs/activity-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <ActivityTab userId={userId} />;
}
