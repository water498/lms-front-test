"use client";

import SessionInfoTab from "@/features/(admin)/session-detail/tabs/info-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { session } = useSessionDetail();
  return <SessionInfoTab session={session} />;
}
