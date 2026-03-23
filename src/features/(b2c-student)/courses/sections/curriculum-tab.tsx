"use client";

import { useState } from "react";
import { Play, HelpCircle, Clipboard, FileText, ChevronDown, Clock } from "lucide-react";
import { type CourseSubject, type ActivityType } from "@/lib/models";

const ACTIVITY_ICON: Record<ActivityType, React.ReactNode> = {
  VIDEO:      <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />,
  QUIZ:       <HelpCircle className="w-3.5 h-3.5 text-amber-400" />,
  ASSIGNMENT: <Clipboard className="w-3.5 h-3.5 text-violet-400" />,
  SCORM:      <FileText className="w-3.5 h-3.5 text-emerald-400" />,
  SURVEY:     <FileText className="w-3.5 h-3.5 text-indigo-400" />,
};

interface Props {
  subjects: CourseSubject[];
}

export function CurriculumTab({ subjects }: Props) {
  const [open, setOpen] = useState<Set<string>>(new Set([subjects[0]?.id]));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalActivities = subjects.reduce((sum, s) => sum + s.activities.length, 0);
  const totalMinutes = subjects.reduce(
    (sum, s) => sum + s.activities.reduce((acc, a) => acc + (a.duration ?? 0), 0),
    0
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-zinc-400">
          총 {subjects.length}개 섹션 · {totalActivities}강 ·{" "}
          {totalMinutes >= 60
            ? `${Math.floor(totalMinutes / 60)}시간 ${totalMinutes % 60 > 0 ? `${totalMinutes % 60}분` : ""}`
            : `${totalMinutes}분`}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {subjects.map((subject) => {
          const isOpen = open.has(subject.id);
          const sectionMinutes = subject.activities.reduce((acc, a) => acc + (a.duration ?? 0), 0);

          return (
            <div key={subject.id} className="border border-zinc-800 rounded-xl overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggle(subject.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                  />
                  <span className="text-sm font-medium text-white">
                    {subject.order}. {subject.title}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 shrink-0 ml-2">
                  {subject.activities.length}강
                  {sectionMinutes > 0 && ` · ${sectionMinutes}분`}
                </span>
              </button>

              {/* Activities */}
              {isOpen && (
                <div className="divide-y divide-zinc-800/60">
                  {subject.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 px-4 py-2.5 bg-zinc-950/60">
                      <span className="shrink-0">{ACTIVITY_ICON[activity.type]}</span>
                      <span className="flex-1 text-sm text-zinc-300">{activity.title}</span>
                      <span className="shrink-0 text-xs text-zinc-600 flex items-center gap-1">
                        {activity.type === "VIDEO" && activity.duration !== undefined && (
                          <>
                            <Clock className="w-3 h-3" />
                            {activity.duration}분
                          </>
                        )}
                        {(activity.type === "QUIZ" || activity.type === "ASSIGNMENT") &&
                          activity.questionCount !== undefined && (
                            <>{activity.questionCount}문항</>
                          )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
