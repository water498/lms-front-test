"use client";

import { HomeTab } from "@/features/(student)/session-workspace/sections/home-tab";
import { useSessionWorkspaceContext } from "@/features/(student)/session-workspace/context";

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
