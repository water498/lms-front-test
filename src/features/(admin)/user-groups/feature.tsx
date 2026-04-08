"use client";

import { useState } from "react";
import { Users, Plus, X, CalendarDays, Trash2 } from "lucide-react";
import { userGroups as initialGroups } from "./mockData";
import type { UserGroup } from "./mockData";
import { users } from "../users/mockData";
import CreateGroupModal from "./modals/create-group-modal";
import AddMembersModal from "./modals/add-members-modal";

const ROLE_LABEL: Record<string, string> = {
  LEARNER: "수강생",
  INSTRUCTOR: "강사",
  ORG_ADMIN: "관리자",
  SUPER_ADMIN: "슈퍼관리자",
};

const ROLE_COLOR: Record<string, string> = {
  LEARNER: "bg-blue-50 text-blue-600",
  INSTRUCTOR: "bg-amber-50 text-amber-600",
  ORG_ADMIN: "bg-violet-50 text-violet-600",
  SUPER_ADMIN: "bg-rose-50 text-rose-600",
};

export default function GroupsFeature() {
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  const selectedMembers = selectedGroup
    ? users.filter((u) => selectedGroup.memberIds?.includes(u.id))
    : [];

  function handleCreate(group: UserGroup) {
    setGroups((prev) => [...prev, group]);
    setSelectedGroupId(group.id);
    setShowCreateModal(false);
  }

  function removeMember(groupId: string, userId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, memberIds: (g.memberIds ?? []).filter((id) => id !== userId) }
          : g
      )
    );
  }

  function handleAddMembers(ids: string[]) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? { ...g, memberIds: [...new Set([...(g.memberIds ?? []), ...ids])] }
          : g
      )
    );
    setShowAddMembersModal(false);
  }

  function handleDeleteGroup(groupId: string) {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (selectedGroupId === groupId) setSelectedGroupId(null);
    setConfirmDeleteId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">그룹 관리</h1>
        <p className="text-sm text-slate-500 mt-0.5">그룹을 생성하고 멤버를 관리합니다. 과정 일괄 배정 및 공지 대상 지정에 활용할 수 있습니다.</p>
      </div>
      <div className="flex gap-4" style={{ minHeight: "calc(100vh - 180px)" }}>
        {/* ── Left: group list ── */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">그룹 목록</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus size={13} />
              그룹 생성
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {groups.map((g) => (
              <div key={g.id} className="relative group/card">
                {confirmDeleteId === g.id ? (
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                    <p className="text-xs text-red-700 mb-3 leading-relaxed">
                      <span className="font-semibold">{g.name}</span>을 삭제하시겠습니까?<br />
                      기존 수강 배정에는 영향이 없습니다.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 py-1 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        className="flex-1 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedGroupId === g.id
                        ? "border-violet-300 bg-violet-50 ring-1 ring-violet-300"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-medium text-sm text-slate-800 mb-1 pr-6">{g.name}</div>
                    {g.description && (
                      <div className="text-xs text-slate-500 mb-2 line-clamp-1">{g.description}</div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {g.memberIds?.length ?? 0}명
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {g.createdAt}
                      </span>
                    </div>
                  </button>
                )}

                {confirmDeleteId !== g.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(g.id); }}
                    className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: member panel ── */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          {!selectedGroup ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Users size={32} className="opacity-30" />
              <p className="text-sm">그룹을 선택하면 멤버 목록이 표시됩니다</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">{selectedGroup.name}</h3>
                  {selectedGroup.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{selectedGroup.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowAddMembersModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                >
                  <Plus size={13} />
                  멤버 추가
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {selectedMembers.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-12">
                    <Users size={24} className="opacity-30" />
                    <p className="text-sm">멤버가 없습니다</p>
                  </div>
                )}
                {selectedMembers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLOR[u.role] ?? "bg-slate-100 text-slate-500"}`}>
                      {ROLE_LABEL[u.role]}
                    </span>
                    <button
                      onClick={() => removeMember(selectedGroup.id, u.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showCreateModal && (
          <CreateGroupModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
          />
        )}

        {showAddMembersModal && selectedGroup && (
          <AddMembersModal
            group={selectedGroup}
            onClose={() => setShowAddMembersModal(false)}
            onAdd={handleAddMembers}
          />
        )}
      </div>
    </div>
  );
}
