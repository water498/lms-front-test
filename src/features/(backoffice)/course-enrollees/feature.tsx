"use client";

import { useState } from "react";
import { type CourseEnrollee, type CourseSession } from "../course-layout/mockData";
import UserDrawer from "./components/user-drawer";

interface Props {
  enrollees: CourseEnrollee[];
  sessions: CourseSession[];
}

export default function EnrolleesTab({ enrollees, sessions }: Props) {
  const [sessionFilter, setSessionFilter] = useState("ALL");
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);

  const filtered = enrollees.filter(
    (e) => sessionFilter === "ALL" || e.session === sessionFilter
  );

  return (
    <>
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <select
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
          >
            <option value="ALL">전체 차수</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <span className="text-sm text-slate-500">{filtered.length}명</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">학습자</th>
                <th className="text-left px-4 py-3 font-medium">차수</th>
                <th className="text-left px-4 py-3 font-medium">진행률</th>
                <th className="text-left px-4 py-3 font-medium">수강 신청일</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelectedLearnerId(e.learnerId)}
                      className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                    >
                      {e.learner}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{e.session}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-violet-500 h-1.5 rounded-full"
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{e.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{e.enrolledAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserDrawer
        userId={selectedLearnerId}
        onClose={() => setSelectedLearnerId(null)}
      />
    </>
  );
}
