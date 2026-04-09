"use client";

import SessionsTab from "@/features/(backoffice)/user-sessions/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { userId } = useUserDetail();
  return <SessionsTab userId={userId} />;
}
