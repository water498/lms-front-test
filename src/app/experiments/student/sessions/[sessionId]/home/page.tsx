"use client";

import { HomeTab } from "@/features/(student)/course-session-home/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/course-session-layout/context";

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
