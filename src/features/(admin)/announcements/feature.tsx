"use client";

import AnnouncementTable from "./sections/announcement-table";

export default function AnnouncementsFeature() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">플랫폼 공지</h2>
        <p className="text-sm text-slate-500">플랫폼 운영팀에서 전달한 공지입니다 (읽기 전용)</p>
      </div>
      <AnnouncementTable />
    </div>
  );
}
