"use client";

import WaitlistTab from "@/features/(backoffice)/session-waitlist/feature";
import { useSessionDetail } from "@/features/(backoffice)/session-layout/context";

export default function Page() {
  const { sessionId } = useSessionDetail();
  return <WaitlistTab sessionId={sessionId} />;
}
