"use client";

import WaitlistTab from "@/features/(admin)/session-waitlist/feature";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <WaitlistTab sessionId={sessionId} />;
}
