"use client";

import { useState } from "react";
import { type CourseEnrollee } from "../../course-layout/mockData";
import UserDrawer from "../../course-enrollees/components/user-drawer";
import AddLearnerModal from "../modals/add-learner-modal";

interface Props {
  enrollees: CourseEnrollee[];
  sessionId: string;
}

export default function SessionEnrolleesTab({ enrollees, sessionId }: Props) {
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const enrolledLearnerIds = enrollees.map((e) => e.learnerId);

  return (
    <>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500">{enrollees.length}명</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 수강생 추가
          </button>
        </div>

        {enrollees.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 py-16 flex flex-col items-center gap-2 text-slate-400">
            <p className="text-sm">수강생이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-medium">학습자</th>
                  <th className="text-left px-4 py-3 font-medium">진행률</th>
                  <th className="text-left px-4 py-3 font-medium">수강 신청일</th>
                </tr>
              </thead>
              <tbody>
                {enrollees.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelectedLearnerId(e.learnerId)}
                        className="font-medium text-slate-800 hover:text-violet-600 transition-colors"
                      >
                        {e.learner}
                      </button>
                    </td>
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
        )}
      </div>

      <UserDrawer
        userId={selectedLearnerId}
        onClose={() => setSelectedLearnerId(null)}
      />

      {showAddModal && (
        <AddLearnerModal
          sessionId={sessionId}
          enrolledLearnerIds={enrolledLearnerIds}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}
