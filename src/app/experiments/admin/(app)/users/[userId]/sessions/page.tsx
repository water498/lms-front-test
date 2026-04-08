"use client";

import SessionsTab from "@/features/(admin)/user-detail/tabs/sessions-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <SessionsTab userId={userId} />;
}
