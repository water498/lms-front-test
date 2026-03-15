"use client";

import StatsRow from "./sections/stats-row";
import CourseStatusOverview from "./sections/course-status-overview";
import RecentEnrollments from "./sections/recent-enrollments";
import ActivityFeed from "./sections/activity-feed";

export default function HomeFeature() {
  return (
    <div className="flex flex-col gap-5">
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
