"use client";

import { HomeTab } from "@/features/(student)/session-home/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/session-layout/context";

export default function HomePage() {
  const { session, announcements } = useSessionWorkspaceContext();
  return (
    <HomeTab
      session={session}
      announcements={announcements}
      isClosed={session.status === "CLOSED"}
    />
  );
}
