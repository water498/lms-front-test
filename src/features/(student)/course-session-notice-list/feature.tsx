"use client";

import { AlertTriangle, Megaphone } from "lucide-react";
import type { SessionAnnouncement } from "../course-session-layout/mockData";

interface AnnouncementsTabProps {
  announcements: SessionAnnouncement[];
}

export function AnnouncementsTab({ announcements }: AnnouncementsTabProps) {
  if (announcements.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500 text-sm">등록된 공지가 없습니다.</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((a) => (
        <div
          key={a.id}
          className={`flex gap-4 rounded-2xl border p-5 ${
            a.type === "URGENT"
              ? "bg-rose-950/30 border-rose-800/50"
              : "bg-zinc-900 border-zinc-800"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {a.type === "URGENT" ? (
              <AlertTriangle size={16} className="text-rose-400" />
            ) : (
              <Megaphone size={16} className="text-zinc-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {a.type === "URGENT" && (
                <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">긴급</span>
              )}
              <p className="text-sm font-semibold text-zinc-200">{a.title}</p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{a.body}</p>
            <p className="text-xs text-zinc-600 mt-2">{a.authorName} · {a.createdAt}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
