"use client";

import { useState, useMemo } from "react";
import { X, Search, Users } from "lucide-react";
import { users } from "../../user-list/mockData";
import { userGroups } from "../../user-group-list/mockData";
import { useOrgStructureStore, findDeptNode, type DeptNode } from "../../shared/org-structure-store";

type ModalTab = "individual" | "group" | "org";

function DeptTree({
  nodes,
  selected,
  onToggle,
  depth = 0,
}: {
  nodes: DeptNode[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  depth?: number;
}) {
  return (
    <>
      {nodes.map((node) => (
        <div key={node.id}>
          <label
            style={{ paddingLeft: `${depth * 12}px` }}
            className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selected.has(node.id)}
              onChange={() => onToggle(node.id)}
              className="accent-violet-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700">{node.name}</span>
          </label>
          {node.children.length > 0 && (
            <DeptTree
              nodes={node.children}
              selected={selected}
              onToggle={onToggle}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}

interface Props {
  sessionId: string;
  enrolledLearnerIds: string[];
  onClose: () => void;
}

export default function AddLearnerModal({ sessionId, enrolledLearnerIds, onClose }: Props) {
  const { departments, jobGrades, sites } = useOrgStructureStore();

  const [tab, setTab] = useState<ModalTab>("individual");
  const [search, setSearch] = useState("");

  // Shared selected set across all tabs
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Org tab filters
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set());
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());

  const learners = useMemo(() => users.filter((u) => u.role === "LEARNER"), []);

  const filtered = learners.filter(
    (u) => u.name.includes(search) || u.email.includes(search)
  );

  function toggle<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  }

  function toggleUser(id: string) {
    if (enrolledLearnerIds.includes(id)) return;
    setSelected((prev) => toggle(prev, id));
  }

  function toggleGroup(groupId: string) {
    const group = userGroups.find((g) => g.id === groupId);
    if (!group) return;
    const memberIds = (group.memberIds ?? []).filter(
      (id) => !enrolledLearnerIds.includes(id) && learners.some((u) => u.id === id)
    );
    const allSelected = memberIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        memberIds.forEach((id) => next.delete(id));
      } else {
        memberIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  // Org-filtered learner IDs
  const orgFilteredIds = useMemo(() => {
    const hasFilter =
      selectedSites.size > 0 || selectedDepts.size > 0 || selectedGrades.size > 0;
    if (!hasFilter) return [];
    return learners
      .filter((u) => {
        const siteOk =
          selectedSites.size === 0 ||
          (u.orgSiteId != null && selectedSites.has(u.orgSiteId));
        const deptOk =
          selectedDepts.size === 0 ||
          (u.orgTeamId != null && selectedDepts.has(u.orgTeamId));
        const gradeOk =
          selectedGrades.size === 0 ||
          (u.orgPositionId != null && selectedGrades.has(u.orgPositionId));
        return siteOk && deptOk && gradeOk;
      })
      .map((u) => u.id);
  }, [selectedSites, selectedDepts, selectedGrades, learners]);

  function selectAllOrgFiltered() {
    const toAdd = orgFilteredIds.filter((id) => !enrolledLearnerIds.includes(id));
    setSelected((prev) => new Set([...prev, ...toAdd]));
  }

  function handleConfirm() {
    console.log("수강 등록", { sessionId, learnerIds: [...selected] });
    onClose();
  }

  const TABS: { key: ModalTab; label: string }[] = [
    { key: "individual", label: "개인" },
    { key: "group", label: "그룹" },
    { key: "org", label: "조직" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[580px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">수강생 추가</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* 개인 tab */}
          {tab === "individual" && (
            <>
              <div className="relative mb-3">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="이름 또는 이메일 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                />
              </div>
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  검색 결과가 없습니다.
                </p>
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
                          onClick={() => toggleUser(u.id)}
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
                              <span className="ml-1.5 text-xs text-slate-400 font-normal">
                                이미 수강 중
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-slate-500">{u.email}</td>
                          <td className="py-2.5 text-slate-500">
                            {u.orgTeamId
                              ? (findDeptNode(departments, u.orgTeamId)?.name ?? "—")
                              : "—"}
                          </td>
                          <td className="py-2.5 text-slate-500">
                            {u.orgPositionId
                              ? (jobGrades.find((g) => g.id === u.orgPositionId)?.name ?? "—")
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* 그룹 tab */}
          {tab === "group" && (
            <div className="grid grid-cols-1 gap-3">
              {userGroups.map((group) => {
                const memberLearners = learners.filter((u) =>
                  group.memberIds?.includes(u.id)
                );
                const selectableMemberIds = memberLearners
                  .filter((u) => !enrolledLearnerIds.includes(u.id))
                  .map((u) => u.id);
                const allGroupSelected =
                  selectableMemberIds.length > 0 &&
                  selectableMemberIds.every((id) => selected.has(id));

                return (
                  <label
                    key={group.id}
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      allGroupSelected
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allGroupSelected}
                      onChange={() => toggleGroup(group.id)}
                      className="accent-violet-600 w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{group.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        <Users size={11} className="inline mr-1" />
                        멤버 {memberLearners.length}명
                        {selectableMemberIds.length < memberLearners.length && (
                          <span className="ml-1">
                            (이미 수강 중{" "}
                            {memberLearners.length - selectableMemberIds.length}명)
                          </span>
                        )}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* 조직 tab */}
          {tab === "org" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    사업장
                  </p>
                  <div className="space-y-0.5">
                    {sites.map((site) => (
                      <label
                        key={site.id}
                        className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSites.has(site.id)}
                          onChange={() =>
                            setSelectedSites((prev) => toggle(prev, site.id))
                          }
                          className="accent-violet-600 w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">{site.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    부서
                  </p>
                  <DeptTree
                    nodes={departments}
                    selected={selectedDepts}
                    onToggle={(id) =>
                      setSelectedDepts((prev) => toggle(prev, id))
                    }
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    직급
                  </p>
                  <div className="space-y-0.5">
                    {jobGrades.map((grade) => (
                      <label
                        key={grade.id}
                        className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGrades.has(grade.id)}
                          onChange={() =>
                            setSelectedGrades((prev) => toggle(prev, grade.id))
                          }
                          className="accent-violet-600 w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">{grade.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {orgFilteredIds.length > 0 ? (
                <div className="px-3 py-3 bg-violet-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-violet-700">
                    조건에 해당하는 수강생{" "}
                    <strong>{orgFilteredIds.length}명</strong>
                  </span>
                  <button
                    onClick={selectAllOrgFiltered}
                    className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    전체 선택
                  </button>
                </div>
              ) : (
                selectedSites.size + selectedDepts.size + selectedGrades.size > 0 && (
                  <p className="text-sm text-slate-400 text-center py-3">
                    조건에 해당하는 수강생이 없습니다.
                  </p>
                )
              )}

              {orgFilteredIds.length === 0 &&
                selectedSites.size + selectedDepts.size + selectedGrades.size === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">
                    사업장, 부서, 직급을 선택하면 해당 인원을 일괄 추가할 수 있습니다.
                  </p>
                )}
            </div>
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
