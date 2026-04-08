"use client";

import SessionsTab from "@/features/(admin)/user-sessions/feature";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <SessionsTab userId={userId} />;
}
