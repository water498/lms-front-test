"use client";

import { learningEvents } from "../mockData";
import type { ActivityLog, ActivityVerb } from "@/lib/models";

const VERB_LABEL: Record<ActivityVerb, string> = {
  ENROLLED:             "수강 신청",
  ACTIVITY_STARTED:     "레슨 시작",
  ACTIVITY_COMPLETED:   "레슨 완료",
  VIDEO_WATCHED:        "강의 시청",
  EXAM_SUBMITTED:       "시험 제출",
  ASSIGNMENT_SUBMITTED: "과제 제출",
  SURVEY_SUBMITTED:     "설문 응답",
  COURSE_COMPLETED:     "수료",
  CERTIFICATE_ISSUED:   "수료증 발급",
};

const VERB_COLOR: Record<ActivityVerb, string> = {
  ENROLLED:             "bg-blue-100 text-blue-600",
  ACTIVITY_STARTED:     "bg-slate-100 text-slate-500",
  ACTIVITY_COMPLETED:   "bg-violet-100 text-violet-600",
  VIDEO_WATCHED:        "bg-violet-100 text-violet-600",
  EXAM_SUBMITTED:       "bg-amber-100 text-amber-600",
  ASSIGNMENT_SUBMITTED: "bg-orange-100 text-orange-600",
  SURVEY_SUBMITTED:     "bg-teal-100 text-teal-600",
  COURSE_COMPLETED:     "bg-emerald-100 text-emerald-700",
  CERTIFICATE_ISSUED:   "bg-emerald-100 text-emerald-700",
};

function getDetail(log: ActivityLog): string {
  const parts: string[] = [];
  if (log.objectTitle) parts.push(log.objectTitle);
  if (log.result?.score !== undefined) parts.push(`${log.result.score}점`);
  if (log.result?.passed === false) parts.push("불합격");
  return parts.join(" · ");
}

export default function ActivityTab({ userId }: { userId: string }) {
  const logs = learningEvents[userId] ?? [];

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-16 text-center text-slate-400 text-sm">
        활동 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4 px-5 py-3">
          <span className="text-xs text-slate-400 tabular-nums whitespace-nowrap pt-0.5 w-36 flex-shrink-0">
            {log.timestamp}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${VERB_COLOR[log.verb]}`}>
              {VERB_LABEL[log.verb]}
            </span>
            <span className="text-sm text-slate-500">{getDetail(log)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
