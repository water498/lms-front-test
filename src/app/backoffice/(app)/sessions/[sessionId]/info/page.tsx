"use client";

import SessionInfoTab from "@/features/(admin)/session-info/feature";
import { useSessionDetail } from "@/features/(admin)/session-layout/context";

export default function Page() {
  const { session } = useSessionDetail();
  return <SessionInfoTab session={session} />;
}
