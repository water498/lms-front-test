"use client";

import { AnnouncementsTab } from "@/features/(student)/session-layout/sections/announcements-tab";
import { useSessionWorkspaceContext } from "@/features/(student)/session-layout/context";

export default function AnnouncementsPage() {
  const { announcements } = useSessionWorkspaceContext();
  return <AnnouncementsTab announcements={announcements} />;
}
