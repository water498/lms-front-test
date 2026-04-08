"use client";

import { AnnouncementsTab } from "@/features/(student)/session-announcements/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/session-layout/context";

export default function AnnouncementsPage() {
  const { announcements } = useSessionWorkspaceContext();
  return <AnnouncementsTab announcements={announcements} />;
}
