"use client";

import ActivityTab from "@/features/(backoffice)/user-activity/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <ActivityTab userId={userId} />;
}
