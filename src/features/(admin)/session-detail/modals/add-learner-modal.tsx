"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { orgUsers } from "../../users/mockData";

interface Props {
  sessionId: string;
  enrolledLearnerIds: string[];
  onClose: () => void;
}

export default function AddLearnerModal({ sessionId, enrolledLearnerIds, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const learners = orgUsers.filter((u) => u.role === "LEARNER");

  const filtered = learners.filter((u) =>
    u.name.includes(search) || u.email.includes(search)
  );

  function toggle(id: string) {
    if (enrolledLearnerIds.includes(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    console.log("수강 등록", { sessionId, learnerIds: [...selected] });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[520px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">수강생 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="이름 또는 이메일 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">검색 결과가 없습니다.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 w-8" />
                  <th className="text-left py-2 font-medium">이름</th>
                  <th className="text-left py-2 font-medium">이메일</th>
                  <th className="text-left py-2 font-medium">부서</th>
                  <th className="text-left py-2 font-medium">직급</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const alreadyEnrolled = enrolledLearnerIds.includes(u.id);
                  const isChecked = selected.has(u.id);
                  return (
                    <tr
                      key={u.id}
                      onClick={() => toggle(u.id)}
                      className={`border-b border-slate-50 last:border-0 transition-colors ${
                        alreadyEnrolled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-slate-50 cursor-pointer"
                      }`}
                    >
                      <td className="py-2.5 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          disabled={alreadyEnrolled}
                          className="accent-violet-600 w-4 h-4"
                        />
                      </td>
                      <td className="py-2.5 font-medium text-slate-800">
                        {u.name}
                        {alreadyEnrolled && (
                          <span className="ml-1.5 text-xs text-slate-400 font-normal">이미 수강 중</span>
                        )}
                      </td>
                      <td className="py-2.5 text-slate-500">{u.email}</td>
                      <td className="py-2.5 text-slate-500">{u.department ?? "—"}</td>
                      <td className="py-2.5 text-slate-500">{u.jobGrade ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {selected.size > 0 ? `${selected.size}명 선택됨` : "수강생을 선택하세요"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-5 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
