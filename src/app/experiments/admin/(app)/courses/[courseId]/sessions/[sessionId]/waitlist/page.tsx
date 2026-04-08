"use client";

import WaitlistTab from "@/features/(admin)/session-detail/tabs/waitlist-tab";
import { useSessionDetail } from "@/features/(admin)/session-detail/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <WaitlistTab sessionId={sessionId} />;
}
