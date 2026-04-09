"use client";

import SessionInfoTab from "@/features/(backoffice)/session-info/feature";
import { useSessionDetail } from "@/features/(backoffice)/session-layout/context";

export default function Page() {
  const { session } = useSessionDetail();
  return <SessionInfoTab session={session} />;
}
