"use client";

import { AnnouncementsTab } from "@/features/(student)/course-session-notice-list/feature";
import { useSessionWorkspaceContext } from "@/features/(student)/course-session-layout/context";

export default function AnnouncementsPage() {
  const { announcements } = useSessionWorkspaceContext();
  return <AnnouncementsTab announcements={announcements} />;
}
