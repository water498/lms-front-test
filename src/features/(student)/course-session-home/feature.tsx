"use client";

import Link from "next/link";
import { AlertTriangle, Award } from "lucide-react";
import type { StudentSession, SessionAnnouncement } from "../course-session-layout/mockData";

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  );
}

interface HomeTabProps {
  session: StudentSession;
  announcements: SessionAnnouncement[];
  isClosed: boolean;
}

export function HomeTab({ session, announcements, isClosed }: HomeTabProps) {
  const urgent = announcements.filter((a) => a.type === "URGENT");

  return (
    <div className="flex flex-col gap-5">
      {/* Urgent announcements */}
      {urgent.length > 0 && (
        <div className="flex flex-col gap-2">
          {urgent.map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-3 bg-rose-950/40 border border-rose-800/60 rounded-xl">
              <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-rose-300">{a.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session info grid */}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard label="개강일" value={session.startDate} />
        <InfoCard label="종강일" value={session.endDate} />
        <InfoCard label="수강 인원" value={`${session.enrolled} / ${session.capacity}명`} />
        <InfoCard label="수료 기준" value={`진도율 ${session.completionThreshold}% 이상`} />
      </div>

      {/* Certificate section -- shown when session has ended */}
      {isClosed && (
        <div className="flex items-center justify-between bg-amber-950/30 border border-amber-700/40 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">수료증이 발급되었습니다</p>
              <p className="text-xs text-zinc-400 mt-0.5">과정을 완료하셨습니다. 수료증을 확인해 보세요.</p>
            </div>
          </div>
          <Link
            href="/student/my/certificates"
            className="shrink-0 px-3 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-lg transition-colors"
          >
            수료증 보기
          </Link>
        </div>
      )}
    </div>
  );
}
