"use client";

import { useState } from "react";
import Link from "next/link";
import { X, AlertTriangle, Wrench } from "lucide-react";
import { ANNOUNCEMENTS } from "@/features/(platform-admin)/announcements/mockData";
import StatsRow from "./sections/stats-row";
import CourseStatusOverview from "./sections/course-status-overview";
import RecentEnrollments from "./sections/recent-enrollments";
import ActivityFeed from "./sections/activity-feed";

function PlatformBanners() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const banners = ANNOUNCEMENTS.filter(
    (a) =>
      a.status === "PUBLISHED" &&
      (a.subtype === "URGENT" || a.subtype === "MAINTENANCE") &&
      !dismissedIds.includes(a.id)
  );

  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {banners.map((b) => {
        const isUrgent = b.subtype === "URGENT";
        return (
          <div
            key={b.id}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
              isUrgent
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-amber-50 border border-amber-200 text-amber-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {isUrgent ? (
                <AlertTriangle size={15} className="shrink-0 text-red-500" />
              ) : (
                <Wrench size={15} className="shrink-0 text-amber-500" />
              )}
              <Link href="/experiments/admin/announcements" className="hover:underline">
                [{isUrgent ? "긴급" : "점검"}] {b.title}
              </Link>
            </div>
            <button
              onClick={() => setDismissedIds((prev) => [...prev, b.id])}
              className={`ml-4 shrink-0 hover:opacity-70 transition-opacity ${isUrgent ? "text-red-400" : "text-amber-400"}`}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function HomeFeature() {
  return (
    <div className="flex flex-col gap-5">
      <PlatformBanners />
      <StatsRow />
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <RecentEnrollments />
        </div>
        <CourseStatusOverview />
      </div>
      <ActivityFeed />
    </div>
  );
}
