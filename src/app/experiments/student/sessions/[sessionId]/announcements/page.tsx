"use client";

import { AnnouncementsTab } from "@/features/(student)/session-workspace/sections/announcements-tab";
import { useSessionWorkspaceContext } from "@/features/(student)/session-workspace/context";

export default function AnnouncementsPage() {
  const { announcements } = useSessionWorkspaceContext();
  return <AnnouncementsTab announcements={announcements} />;
}
