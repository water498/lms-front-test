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
  onClose: () => void;
  onCreate: (group: UserGroup) => void;
}

let _nextGroupId = 4;

function flattenDepts(nodes: DeptNode[]): DeptNode[] {
  return nodes.flatMap((n) => [n, ...flattenDepts(n.children)]);
}

export default function CreateGroupModal({ onClose, onCreate }: Props) {
  const { sites, departments, jobGrades } = useOrgStructureStore();
  const flatDepts = useMemo(() => flattenDepts(departments), [departments]);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.includes(search) ||
        u.email.includes(search) ||
        u.roles.some((r) => ROLE_LABEL[r]?.includes(search));
      if (!matchSearch) return false;
      if (siteFilter && u.siteId !== siteFilter) return false;
      if (deptFilter && u.departmentId !== deptFilter) return false;
      if (gradeFilter && u.jobGradeId !== gradeFilter) return false;
      return true;
    });
  }, [search, siteFilter, deptFilter, gradeFilter]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCreate() {
    if (!groupName.trim()) return;
    onCreate({
      id: `group-${_nextGroupId++}`,
      name: groupName.trim(),
      description: description.trim(),
      memberIds: Array.from(selectedIds),
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">그룹 생성</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">그룹명 <span className="text-red-400">*</span></label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="예: 신입 온보딩"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">설명 <span className="text-slate-400 font-normal">(선택)</span></label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="그룹에 대한 간단한 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">
              멤버 선택 <span className="text-slate-400 font-normal">({selectedIds.size}명 선택됨)</span>
            </label>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="이름, 이메일, 역할 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-2">
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
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">검색 결과 없음</p>
              )}
              {filtered.map((u) => (
                <label key={u.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="accent-violet-600"
                    checked={selectedIds.has(u.id)}
                    onChange={() => toggle(u.id)}
                  />
                  <span className="flex-1 text-sm text-slate-700">{u.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {ROLE_LABEL[u.roles[0]]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim()}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            그룹 생성
          </button>
        </div>
      </div>
    </div>
  );
}
