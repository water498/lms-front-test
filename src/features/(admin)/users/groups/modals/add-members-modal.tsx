"use client";

import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { users } from "../../mockData";
import type { UserGroup } from "../mockData";
import { useOrgStructureStore, type DeptNode } from "../../../shared/org-structure-store";

const ROLE_LABEL: Record<string, string> = {
  LEARNER: "수강생",
  INSTRUCTOR: "강사",
  ORG_ADMIN: "관리자",
  SUPER_ADMIN: "슈퍼관리자",
};

interface Props {
  group: UserGroup;
  onClose: () => void;
  onAdd: (memberIds: string[]) => void;
}

function flattenDepts(nodes: DeptNode[]): DeptNode[] {
  return nodes.flatMap((n) => [n, ...flattenDepts(n.children)]);
}

export default function AddMembersModal({ group, onClose, onAdd }: Props) {
  const { sites, departments, jobGrades } = useOrgStructureStore();
  const flatDepts = useMemo(() => flattenDepts(departments), [departments]);

  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const candidates = useMemo(() => {
    return users.filter((u) => {
      if (group.memberIds?.includes(u.id)) return false;
      if (search && !u.name.includes(search) && !u.email.includes(search)) return false;
      if (siteFilter && u.orgSiteId !== siteFilter) return false;
      if (deptFilter && u.orgTeamId !== deptFilter) return false;
      if (gradeFilter && u.orgPositionId !== gradeFilter) return false;
      return true;
    });
  }, [group.memberIds, search, siteFilter, deptFilter, gradeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.has(u.id)),
    [selectedIds]
  );

  const allFilteredSelected =
    candidates.length > 0 && candidates.every((u) => selectedIds.has(u.id));

  function toggleCandidate(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        candidates.forEach((u) => next.delete(u.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        candidates.forEach((u) => next.add(u.id));
        return next;
      });
    }
  }

  function removeSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            멤버 추가 — <span className="text-violet-600">{group.name}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left: candidates */}
          <div className="flex flex-col w-1/2 border-r border-slate-100 min-h-0">
            <div className="px-4 py-3 flex flex-col gap-2 border-b border-slate-100">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="이름 또는 이메일"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Filters */}
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                >
                  <option value="">사업장 전체</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <select
                  className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="">부서 전체</option>
                  {flatDepts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <select
                  className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="">직급 전체</option>
                  {jobGrades.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select all */}
            <label className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                className="accent-violet-600"
                checked={allFilteredSelected}
                onChange={toggleAll}
                disabled={candidates.length === 0}
              />
              <span className="text-xs font-medium text-slate-600">
                전체 선택 ({candidates.length}명)
              </span>
            </label>

            {/* Candidate list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {candidates.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">추가 가능한 유저가 없습니다</p>
              ) : (
                candidates.map((u) => (
                  <label key={u.id} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="accent-violet-600"
                      checked={selectedIds.has(u.id)}
                      onChange={() => toggleCandidate(u.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">
                      {ROLE_LABEL[u.role] ?? u.role}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Right: selected */}
          <div className="flex flex-col w-1/2 min-h-0">
            <div className="px-4 py-3 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-600">선택됨 ({selectedIds.size}명)</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {selectedUsers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">선택된 멤버 없음</p>
              ) : (
                selectedUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <button
                      onClick={() => removeSelected(u.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => onAdd(Array.from(selectedIds))}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selectedIds.size}명 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
