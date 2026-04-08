"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Pencil, Trash2, Check, X, Plus, ChevronRight, ChevronDown, Upload, Download, AlertCircle, Users, Search } from "lucide-react";
import { useOrgStructureStore, type DeptNode, type JobGrade, type Site, flatDeptIds, findDeptNode } from "../shared/org-structure-store";
import { useUsersStore } from "../shared/users-store";
import type { User, OrgPositionRoleType } from "@/lib/models";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DeleteTarget {
  type: "dept" | "grade" | "site";
  id: string;
  name: string;
  affectedUsers: number;
  affectedDepts?: number;
}

interface ParsedRow {
  name: string;
  email: string;
  siteName: string;
  teamName: string;
  positionName: string;
  siteId?: string;
  teamId?: string;
  positionId?: string;
  existingUserId?: string;
  status: "matched" | "no-user" | "no-org";
}

type SelectedNode =
  | { type: "site"; id: string; name: string }
  | { type: "team"; id: string; name: string }
  | null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function flatDepts(nodes: DeptNode[]): DeptNode[] {
  return nodes.flatMap((n) => [n, ...flatDepts(n.children)]);
}

// ── DeleteConfirmModal ────────────────────────────────────────────────────────

function DeleteConfirmModal({ target, onConfirm, onCancel }: {
  target: DeleteTarget;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const label = target.type === "dept" ? "부서" : target.type === "grade" ? "직급" : "사업장";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-800">{label} 삭제 확인</h3>
        <div className="text-sm text-slate-600 flex flex-col gap-1">
          <p><span className="font-medium text-slate-800">&quot;{target.name}&quot;</span>을(를) 삭제합니다.</p>
          {target.affectedUsers > 0 && <p>소속 구성원 <span className="font-semibold text-red-600">{target.affectedUsers}명</span>의 소속이 해제됩니다.</p>}
          {(target.affectedDepts ?? 0) > 0 && <p>소속 부서 <span className="font-semibold text-red-600">{target.affectedDepts}개</span>도 함께 삭제됩니다.</p>}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">취소</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">삭제</button>
        </div>
      </div>
    </div>
  );
}

// ── DeptTreeNode ──────────────────────────────────────────────────────────────

function DeptTreeNode({ node, depth, count, onAddChild, onUpdate, onRemoveRequest, onSelect, isSelected }: {
  node: DeptNode;
  depth: number;
  count: number;
  onAddChild: (parentId: string, name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onRemoveRequest: (id: string) => void;
  onSelect: (node: SelectedNode) => void;
  isSelected: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [isAdding, setIsAdding] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const hasChildren = node.children.length > 0 || isAdding;

  function confirmEdit() {
    const t = editValue.trim();
    if (t && t !== node.name) onUpdate(node.id, t);
    setIsEditing(false);
  }
  function confirmAdd() {
    const t = newChildName.trim();
    if (t) { onAddChild(node.id, t); setOpen(true); }
    setIsAdding(false); setNewChildName("");
  }

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1.5 group rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-violet-50" : "hover:bg-slate-50"}`}
        style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
        onClick={() => onSelect({ type: "team", id: node.id, name: node.name })}
      >
        <button onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
          className={`text-slate-300 hover:text-slate-500 flex-shrink-0 ${hasChildren ? "visible" : "invisible"}`}>
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {isEditing ? (
          <>
            <input autoFocus className="flex-1 border border-slate-200 rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={editValue} onChange={(e) => setEditValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") { setIsEditing(false); setEditValue(node.name); } }} />
            <button onClick={(e) => { e.stopPropagation(); confirmEdit(); }} className="text-emerald-600 p-0.5"><Check size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditValue(node.name); }} className="text-slate-400 p-0.5"><X size={14} /></button>
          </>
        ) : (
          <>
            <span className={`flex-1 text-sm ${isSelected ? "text-violet-700 font-medium" : "text-slate-700"}`}>{node.name}</span>
            {count > 0 && <span className="text-xs text-slate-400 mr-1">{count}명</span>}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pr-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setIsAdding(true); setNewChildName(""); setOpen(true); }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded">
                <Plus size={11} />하위
              </button>
              <button onClick={() => { setIsEditing(true); setEditValue(node.name); }} className="p-0.5 text-slate-400 hover:text-violet-600 rounded"><Pencil size={13} /></button>
              <button onClick={() => onRemoveRequest(node.id)} className="p-0.5 text-slate-400 hover:text-red-500 rounded"><Trash2 size={13} /></button>
            </div>
          </>
        )}
      </div>
      {open && (
        <div>
          {node.children.map((child) => (
            <DeptTreeNode key={child.id} node={child} depth={depth + 1} count={0}
              onAddChild={onAddChild} onUpdate={onUpdate} onRemoveRequest={onRemoveRequest}
              onSelect={onSelect} isSelected={false} />
          ))}
          {isAdding && (
            <div className="flex items-center gap-1 py-1.5" style={{ paddingLeft: `${(depth + 2) * 20 + 8 + 14}px` }}>
              <input autoFocus placeholder="새 하위 부서 이름"
                className="flex-1 border border-slate-200 rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={newChildName} onChange={(e) => setNewChildName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmAdd(); if (e.key === "Escape") { setIsAdding(false); setNewChildName(""); } }} />
              <button onClick={confirmAdd} className="text-emerald-600 p-0.5"><Check size={14} /></button>
              <button onClick={() => { setIsAdding(false); setNewChildName(""); }} className="text-slate-400 p-0.5"><X size={14} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SiteNode ──────────────────────────────────────────────────────────────────

function SiteNode({ site, depts, siteCount, teamCountMap, onAddDept, onUpdateSite, onRemoveSiteRequest, onAddChildDept, onUpdateDept, onRemoveDeptRequest, onSelect, selectedNode, isGlobal = false }: {
  site?: Site;
  depts: DeptNode[];
  siteCount: number;
  teamCountMap: Map<string, number>;
  onAddDept: (name: string) => void;
  onUpdateSite?: (id: string, name: string) => void;
  onRemoveSiteRequest?: (id: string) => void;
  onAddChildDept: (parentId: string, name: string) => void;
  onUpdateDept: (id: string, name: string) => void;
  onRemoveDeptRequest: (id: string) => void;
  onSelect: (node: SelectedNode) => void;
  selectedNode: SelectedNode;
  isGlobal?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(site?.name ?? "");
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const displayName = isGlobal ? "전사 공통" : (site?.name ?? "");
  const isSelected = !isGlobal && site ? selectedNode?.type === "site" && selectedNode.id === site.id : false;

  function confirmEdit() {
    if (!site) return;
    const t = editValue.trim();
    if (t && t !== site.name) onUpdateSite?.(site.id, t);
    setIsEditing(false);
  }
  function confirmAddDept() {
    const t = newDeptName.trim();
    if (t) { onAddDept(t); setOpen(true); }
    setIsAddingDept(false); setNewDeptName("");
  }

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div
        className={`flex items-center gap-1 px-3 py-2 group cursor-pointer transition-colors ${isSelected ? "bg-violet-50" : "bg-slate-50 hover:bg-slate-100"}`}
        onClick={() => !isGlobal && site && onSelect({ type: "site", id: site.id, name: site.name })}
      >
        <button onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {isEditing && site ? (
          <>
            <input autoFocus className="flex-1 border border-slate-200 rounded-lg px-2 py-0.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={editValue} onChange={(e) => setEditValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") { setIsEditing(false); setEditValue(site.name); } }} />
            <button onClick={(e) => { e.stopPropagation(); confirmEdit(); }} className="text-emerald-600 p-0.5"><Check size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditValue(site.name); }} className="text-slate-400 p-0.5"><X size={14} /></button>
          </>
        ) : (
          <>
            <span className={`flex-1 text-sm font-semibold ${isSelected ? "text-violet-700" : "text-slate-700"}`}>{displayName}</span>
            {siteCount > 0 && <span className="text-xs text-slate-500 mr-1">{siteCount}명</span>}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setIsAddingDept(true); setNewDeptName(""); setOpen(true); }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors">
                <Plus size={11} />부서 추가
              </button>
              {!isGlobal && site && (
                <>
                  <button onClick={() => { setIsEditing(true); setEditValue(site.name); }} className="p-1 text-slate-400 hover:text-violet-600 rounded"><Pencil size={13} /></button>
                  <button onClick={() => onRemoveSiteRequest?.(site.id)} className="p-1 text-slate-400 hover:text-red-500 rounded"><Trash2 size={13} /></button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {open && (
        <div className="py-1">
          {depts.map((node) => (
            <DeptTreeNode key={node.id} node={node} depth={0}
              count={teamCountMap.get(node.id) ?? 0}
              onAddChild={onAddChildDept} onUpdate={onUpdateDept} onRemoveRequest={onRemoveDeptRequest}
              onSelect={onSelect} isSelected={selectedNode?.type === "team" && selectedNode.id === node.id} />
          ))}
          {isAddingDept && (
            <div className="flex items-center gap-1 py-1.5" style={{ paddingLeft: "34px" }}>
              <input autoFocus placeholder="새 부서 이름"
                className="flex-1 border border-slate-200 rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmAddDept(); if (e.key === "Escape") { setIsAddingDept(false); setNewDeptName(""); } }} />
              <button onClick={confirmAddDept} className="text-emerald-600 p-0.5"><Check size={14} /></button>
              <button onClick={() => { setIsAddingDept(false); setNewDeptName(""); }} className="text-slate-400 p-0.5"><X size={14} /></button>
            </div>
          )}
          {depts.length === 0 && !isAddingDept && (
            <p className="px-8 py-3 text-xs text-slate-400">부서가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── AssignModal ───────────────────────────────────────────────────────────────

function AssignModal({ mode, user, defaultSiteId, defaultTeamId, allUsers, sites, departments, jobGrades, onSave, onClose }: {
  mode: "edit" | "add";
  user?: User;
  defaultSiteId?: string;
  defaultTeamId?: string;
  allUsers: User[];
  sites: Site[];
  departments: DeptNode[];
  jobGrades: JobGrade[];
  onSave: (userId: string, siteId?: string, teamId?: string, positionId?: string) => void;
  onClose: () => void;
}) {
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(user?.id ?? "");
  const [assignSiteId, setAssignSiteId] = useState(user?.orgSiteId ?? defaultSiteId ?? "");
  const [assignTeamId, setAssignTeamId] = useState(user?.orgTeamId ?? defaultTeamId ?? "");
  const [assignPositionId, setAssignPositionId] = useState(user?.orgPositionId ?? "");
  const [showDropdown, setShowDropdown] = useState(false);

  const allDepts = useMemo(() => flatDepts(departments), [departments]);

  const siteDepts = useMemo(() => {
    if (!assignSiteId) return allDepts;
    const roots = departments.filter((d) => d.siteId === assignSiteId);
    return flatDepts(roots);
  }, [assignSiteId, departments, allDepts]);

  const matchingUsers = useMemo(() => {
    if (!userSearch.trim()) return [];
    const q = userSearch.toLowerCase();
    return allUsers.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 8);
  }, [userSearch, allUsers]);

  const selectedUser = mode === "edit" ? user : allUsers.find((u) => u.id === selectedUserId);

  function handleSave() {
    if (!selectedUserId) return;
    onSave(selectedUserId, assignSiteId || undefined, assignTeamId || undefined, assignPositionId || undefined);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-800">{mode === "edit" ? "소속 변경" : "구성원 추가"}</h3>

        {mode === "add" && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">구성원</label>
            {selectedUser ? (
              <div className="flex items-center gap-2 px-3 py-2 border border-violet-300 rounded-lg bg-violet-50">
                <span className="flex-1 text-sm text-slate-800">{selectedUser.name}</span>
                <span className="text-xs text-slate-500 truncate max-w-[120px]">{selectedUser.email}</span>
                <button onClick={() => { setSelectedUserId(""); setUserSearch(""); }} className="text-slate-400 hover:text-slate-600 flex-shrink-0"><X size={14} /></button>
              </div>
            ) : (
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  autoFocus
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="이름 또는 이메일 검색..."
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />
                {showDropdown && matchingUsers.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
                    {matchingUsers.map((u) => (
                      <button key={u.id}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-violet-50 text-left"
                        onMouseDown={() => { setSelectedUserId(u.id); setShowDropdown(false); setUserSearch(""); }}>
                        <span className="text-sm text-slate-800">{u.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">{u.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === "edit" && user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-600 flex-shrink-0">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-slate-500 mb-1 block">사업장</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={assignSiteId} onChange={(e) => { setAssignSiteId(e.target.value); setAssignTeamId(""); }}>
            <option value="">선택 안 함</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">부서</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={assignTeamId} onChange={(e) => setAssignTeamId(e.target.value)}>
            <option value="">선택 안 함</option>
            {siteDepts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">직급</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={assignPositionId} onChange={(e) => setAssignPositionId(e.target.value)}>
            <option value="">선택 안 함</option>
            {jobGrades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">취소</button>
          <button onClick={handleSave} disabled={mode === "add" && !selectedUserId}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MemberPanel ───────────────────────────────────────────────────────────────

function MemberPanel({ selectedNode, users, sites, departments, jobGrades, onUpdateUser }: {
  selectedNode: SelectedNode;
  users: User[];
  sites: Site[];
  departments: DeptNode[];
  jobGrades: JobGrade[];
  onUpdateUser: (id: string, patch: Partial<User>) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    setSearchQuery("");
    setVisibleCount(50);
    setEditingUserId(null);
    setIsAddingMember(false);
  }, [selectedNode]);

  const allDepts = useMemo(() => flatDepts(departments), [departments]);
  const positionMap = useMemo(() => new Map(jobGrades.map((g) => [g.id, g.name])), [jobGrades]);
  const teamMap = useMemo(() => new Map(allDepts.map((d) => [d.id, d.name])), [allDepts]);

  const nodeUsers = useMemo(() => {
    if (!selectedNode) return null;
    if (selectedNode.type === "site") return users.filter((u) => u.orgSiteId === selectedNode.id);
    return users.filter((u) => u.orgTeamId === selectedNode.id);
  }, [selectedNode, users]);

  const unassigned = useMemo(() => users.filter((u) => !u.orgTeamId && !u.orgSiteId), [users]);

  const assignModalCommonProps = {
    allUsers: users, sites, departments, jobGrades,
    onSave: (userId: string, siteId?: string, teamId?: string, positionId?: string) => {
      onUpdateUser(userId, { orgSiteId: siteId, orgTeamId: teamId, orgPositionId: positionId });
    },
  };

  function MemberRow({ u, borderColor = "border-slate-200" }: { u: User; borderColor?: string }) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 bg-white group">
        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-600 flex-shrink-0">
          {u.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 truncate">{u.name}</p>
          {u.orgTeamId && <p className="text-xs text-slate-400 truncate">{teamMap.get(u.orgTeamId) ?? ""}</p>}
        </div>
        {u.orgPositionId && (
          <span className="text-xs text-slate-500 flex-shrink-0">{positionMap.get(u.orgPositionId) ?? ""}</span>
        )}
        <button onClick={() => setEditingUserId(u.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-violet-600 rounded transition-opacity flex-shrink-0">
          <Pencil size={13} />
        </button>
      </div>
    );
  }

  if (!selectedNode) {
    const siteStats = sites.map((s) => ({
      site: s,
      count: users.filter((u) => u.orgSiteId === s.id).length,
    }));
    const unassignedCount = unassigned.length;

    const searchedUnassigned = useMemo(() => {
      if (!searchQuery.trim()) return unassigned;
      const q = searchQuery.toLowerCase();
      return unassigned.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [unassigned, searchQuery]);

    const visibleUnassigned = searchedUnassigned.slice(0, visibleCount);

    return (
      <div className="flex flex-col gap-4">
        {editingUserId && (
          <AssignModal mode="edit" user={users.find((u) => u.id === editingUserId)}
            {...assignModalCommonProps} onClose={() => setEditingUserId(null)} />
        )}
        <p className="text-xs text-slate-400">사업장 또는 부서를 선택하면 구성원을 확인할 수 있습니다.</p>
        <div className="flex flex-col gap-1">
          {siteStats.map(({ site, count }) => (
            <div key={site.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-700">{site.name}</span>
              <span className="text-sm font-medium text-slate-600">{count}명</span>
            </div>
          ))}
          {unassignedCount > 0 && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50">
              <span className="text-sm text-amber-700">미배치</span>
              <span className="text-sm font-medium text-amber-600">{unassignedCount}명</span>
            </div>
          )}
          {siteStats.length === 0 && unassignedCount === 0 && (
            <p className="text-sm text-slate-400 px-1">등록된 구성원이 없습니다.</p>
          )}
        </div>

        {unassigned.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
              <AlertCircle size={12} />미배치 구성원 {unassignedCount}명
            </p>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="이름 또는 이메일 검색..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(50); }}
              />
            </div>
            <div className="flex flex-col divide-y divide-slate-100 border border-amber-100 rounded-xl overflow-hidden">
              {visibleUnassigned.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-3 py-2 bg-white group">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 flex-shrink-0">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <button onClick={() => setEditingUserId(u.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-violet-600 rounded transition-opacity flex-shrink-0">
                    <Pencil size={13} />
                  </button>
                </div>
              ))}
              {visibleUnassigned.length === 0 && (
                <p className="px-3 py-3 text-sm text-slate-400">검색 결과가 없습니다.</p>
              )}
            </div>
            {searchedUnassigned.length > visibleCount && (
              <button onClick={() => setVisibleCount((v) => v + 50)}
                className="text-xs text-violet-600 hover:text-violet-700 py-1 text-center">
                50명 더 보기 (총 {searchedUnassigned.length}명)
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const searchFiltered = useMemo(() => {
    if (!nodeUsers) return [];
    if (!searchQuery.trim()) return nodeUsers;
    const q = searchQuery.toLowerCase();
    return nodeUsers.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [nodeUsers, searchQuery]);

  const visibleUsers = searchFiltered.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-3">
      {editingUserId && (
        <AssignModal mode="edit" user={users.find((u) => u.id === editingUserId)}
          {...assignModalCommonProps} onClose={() => setEditingUserId(null)} />
      )}
      {isAddingMember && (
        <AssignModal mode="add"
          defaultSiteId={selectedNode.type === "site" ? selectedNode.id : undefined}
          defaultTeamId={selectedNode.type === "team" ? selectedNode.id : undefined}
          {...assignModalCommonProps} onClose={() => setIsAddingMember(false)} />
      )}

      <div className="flex items-center gap-2">
        <Users size={14} className="text-violet-500" />
        <span className="text-sm font-semibold text-slate-700">{selectedNode.name}</span>
        <span className="text-xs text-slate-400">{nodeUsers?.length ?? 0}명</span>
        <button onClick={() => setIsAddingMember(true)}
          className="ml-auto flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50">
          <Plus size={11} />구성원 추가
        </button>
      </div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="이름 또는 이메일 검색..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(50); }}
        />
      </div>

      {visibleUsers.length > 0 ? (
        <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {visibleUsers.map((u) => <MemberRow key={u.id} u={u} />)}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{searchQuery ? "검색 결과가 없습니다." : "배치된 구성원이 없습니다."}</p>
      )}

      {searchFiltered.length > visibleCount && (
        <button onClick={() => setVisibleCount((v) => v + 50)}
          className="text-xs text-violet-600 hover:text-violet-700 py-1 text-center">
          50명 더 보기 (총 {searchFiltered.length}명)
        </button>
      )}
    </div>
  );
}

// ── JobGradeList ──────────────────────────────────────────────────────────────

const ROLE_CFG: Record<OrgPositionRoleType, { label: string; active: string; inactive: string }> = {
  EXECUTIVE: { label: "경영진", active: "bg-amber-100 text-amber-700 border-amber-200",   inactive: "bg-slate-50 text-slate-400 border-slate-200 hover:border-amber-200 hover:text-amber-500" },
  LEADER:    { label: "리더",   active: "bg-violet-100 text-violet-700 border-violet-200", inactive: "bg-slate-50 text-slate-400 border-slate-200 hover:border-violet-200 hover:text-violet-500" },
  MEMBER:    { label: "구성원", active: "bg-slate-200 text-slate-700 border-slate-300",    inactive: "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600" },
};

function RolePills({ roleType, onChange }: { roleType: OrgPositionRoleType; onChange: (r: OrgPositionRoleType) => void }) {
  return (
    <div className="flex gap-1">
      {(Object.keys(ROLE_CFG) as OrgPositionRoleType[]).map((r) => (
        <button key={r} onClick={() => onChange(r)}
          className={`px-2 py-0.5 text-xs font-medium rounded-full border transition-colors ${roleType === r ? ROLE_CFG[r].active : ROLE_CFG[r].inactive}`}>
          {ROLE_CFG[r].label}
        </button>
      ))}
    </div>
  );
}

function JobGradeList({ grades, positionCountMap, onAdd, onUpdate, onRemoveRequest }: {
  grades: JobGrade[];
  positionCountMap: Map<string, number>;
  onAdd: (name: string, roleType: OrgPositionRoleType) => void;
  onUpdate: (id: string, name: string, roleType: OrgPositionRoleType) => void;
  onRemoveRequest: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRoleType, setNewRoleType] = useState<OrgPositionRoleType>("MEMBER");

  function confirmEdit() {
    if (!editingId) return;
    const t = editValue.trim();
    const cur = grades.find((g) => g.id === editingId);
    if (t && cur) onUpdate(editingId, t, cur.roleType);
    setEditingId(null);
  }
  function confirmAdd() {
    const t = newName.trim();
    if (t && !grades.some((g) => g.name === t)) onAdd(t, newRoleType);
    setIsAdding(false); setNewName(""); setNewRoleType("MEMBER");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">직급 목록 <span className="text-xs font-normal text-slate-400">전사 공통</span></h3>
        <button onClick={() => { setIsAdding(true); setNewName(""); setNewRoleType("MEMBER"); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50">
          <Plus size={13} />추가
        </button>
      </div>
      <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {grades.map((g) => (
          <div key={g.id} className="flex items-center gap-2 px-4 py-2.5 bg-white">
            {editingId === g.id ? (
              <>
                <input autoFocus className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={editValue} onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") setEditingId(null); }} />
                <button onClick={confirmEdit} className="text-emerald-600 p-0.5"><Check size={14} /></button>
                <button onClick={() => setEditingId(null)} className="text-slate-400 p-0.5"><X size={14} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-slate-700">{g.name}</span>
                {(positionCountMap.get(g.id) ?? 0) > 0 && (
                  <span className="text-xs text-slate-400">{positionCountMap.get(g.id)}명</span>
                )}
                <RolePills roleType={g.roleType} onChange={(r) => onUpdate(g.id, g.name, r)} />
                <button onClick={() => { setEditingId(g.id); setEditValue(g.name); }} className="text-slate-400 hover:text-violet-600 p-0.5"><Pencil size={13} /></button>
                <button onClick={() => onRemoveRequest(g.id)} className="text-slate-400 hover:text-red-500 p-0.5"><Trash2 size={13} /></button>
              </>
            )}
          </div>
        ))}
        {isAdding && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white">
            <input autoFocus placeholder="새 직급 이름"
              className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmAdd(); if (e.key === "Escape") { setIsAdding(false); setNewName(""); } }} />
            <RolePills roleType={newRoleType} onChange={setNewRoleType} />
            <button onClick={confirmAdd} className="text-emerald-600 p-0.5"><Check size={14} /></button>
            <button onClick={() => { setIsAdding(false); setNewName(""); }} className="text-slate-400 p-0.5"><X size={14} /></button>
          </div>
        )}
        {grades.length === 0 && !isAdding && (
          <div className="px-4 py-6 text-center text-sm text-slate-400">항목이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

// ── CsvImportModal ────────────────────────────────────────────────────────────

const CSV_TEMPLATE = `이름,이메일,사업장,부서,직급\n홍길동,hong@company.kr,서울 본사,백엔드팀,과장\n김영희,kim@company.kr,부산 지점,영업팀,대리\n이민준,lee@company.kr,서울 본사,마케팅본부,사원`;

function CsvImportModal({ onClose }: { onClose: () => void }) {
  const { sites, departments, jobGrades } = useOrgStructureStore();
  const { users, updateUser } = useUsersStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [imported, setImported] = useState<number | null>(null);

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "구성원_업로드_템플릿.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function parseAndPreview(text: string) {
    const cleaned = text.replace(/^\uFEFF/, "");
    const lines = cleaned.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map((h) => h.trim());
    const idx = (k: string) => headers.indexOf(k);
    const allDepts = flatDepts(departments);
    const rows: ParsedRow[] = lines.slice(1).map((line) => {
      const v = line.split(",").map((x) => x.trim());
      const row: ParsedRow = {
        name: v[idx("이름")] ?? "", email: v[idx("이메일")] ?? "",
        siteName: v[idx("사업장")] ?? "", teamName: v[idx("부서")] ?? "", positionName: v[idx("직급")] ?? "",
        status: "matched",
      };
      row.siteId = sites.find((s) => s.name === row.siteName)?.id;
      row.teamId = allDepts.find((d) => d.name === row.teamName)?.id;
      row.positionId = jobGrades.find((g) => g.name === row.positionName)?.id;
      row.existingUserId = users.find((u) => u.email === row.email)?.id;
      if (!row.existingUserId) row.status = "no-user";
      else if (!row.siteId && !row.teamId && !row.positionId) row.status = "no-org";
      return row;
    }).filter((r) => r.email);
    setPreview(rows); setImported(null);
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => parseAndPreview(e.target?.result as string);
    reader.readAsText(file, "utf-8");
  }

  function confirmImport() {
    if (!preview) return;
    let count = 0;
    preview.forEach((row) => {
      if (!row.existingUserId) return;
      updateUser(row.existingUserId, { orgSiteId: row.siteId, orgTeamId: row.teamId, orgPositionId: row.positionId });
      count++;
    });
    setImported(count); setPreview(null);
  }

  const matchedCount = preview?.filter((r) => r.status === "matched").length ?? 0;
  const noUserCount = preview?.filter((r) => r.status === "no-user").length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">CSV로 구성원 가져오기</h3>
            <p className="text-xs text-slate-400 mt-0.5">이름, 이메일, 사업장, 부서, 직급을 한 번에 배치합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadTemplate} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              <Download size={13} />템플릿
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4 flex flex-col gap-4">
          {imported !== null ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              <Check size={15} /><span><span className="font-semibold">{imported}명</span>의 조직 정보가 업데이트됐습니다.</span>
            </div>
          ) : !preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 cursor-pointer transition-colors ${isDragging ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"}`}
            >
              <Upload size={20} className="text-slate-400" />
              <p className="text-sm text-slate-500">CSV 파일을 드래그하거나 클릭해서 선택</p>
              <p className="text-xs text-slate-400">UTF-8 인코딩 권장 · .csv</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>총 {preview.length}명</span>
                <span className="text-emerald-600 font-medium">· 매칭 {matchedCount}명</span>
                {noUserCount > 0 && <span className="text-amber-600 font-medium">· 미등록 {noUserCount}명</span>}
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                      {["이름","이메일","사업장","부서","직급","상태"].map((h) => (
                        <th key={h} className="pb-2 font-medium pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {preview.map((row, i) => (
                      <tr key={i} className={row.status !== "matched" ? "opacity-50" : ""}>
                        <td className="py-2 text-slate-800 pr-3">{row.name}</td>
                        <td className="py-2 text-slate-500 text-xs pr-3 max-w-[120px] truncate">{row.email}</td>
                        <td className="py-2 pr-3">{row.siteId ? row.siteName : <span className="text-slate-400">{row.siteName || "—"}</span>}</td>
                        <td className="py-2 pr-3">{row.teamId ? row.teamName : <span className="text-slate-400">{row.teamName || "—"}</span>}</td>
                        <td className="py-2 pr-3">{row.positionId ? row.positionName : <span className="text-slate-400">{row.positionName || "—"}</span>}</td>
                        <td className="py-2">
                          {row.status === "matched" && <span className="text-xs text-emerald-600 font-medium">업데이트</span>}
                          {row.status === "no-user" && <span className="flex items-center gap-1 text-xs text-amber-600"><AlertCircle size={11} />미등록</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          {preview ? (
            <>
              <button onClick={() => setPreview(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">다시 선택</button>
              <button onClick={confirmImport} disabled={matchedCount === 0}
                className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed">
                {matchedCount}명 가져오기
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">닫기</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── OrgStructureTab ───────────────────────────────────────────────────────────

export default function OrgStructureTab() {
  const {
    departments, addRootDept, addChildDept, updateDept, removeDept,
    jobGrades, addJobGrade, updateJobGrade, removeJobGrade,
    sites, addSite, updateSite, removeSite,
  } = useOrgStructureStore();
  const { users, updateUser } = useUsersStore();

  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isCsvOpen, setIsCsvOpen] = useState(false);

  // 인원수 캐시
  const { teamCountMap, siteCountMap, positionCountMap } = useMemo(() => {
    const teamCountMap = new Map<string, number>();
    const siteCountMap = new Map<string, number>();
    const positionCountMap = new Map<string, number>();
    users.forEach((u) => {
      if (u.orgTeamId) teamCountMap.set(u.orgTeamId, (teamCountMap.get(u.orgTeamId) ?? 0) + 1);
      if (u.orgSiteId) siteCountMap.set(u.orgSiteId, (siteCountMap.get(u.orgSiteId) ?? 0) + 1);
      if (u.orgPositionId) positionCountMap.set(u.orgPositionId, (positionCountMap.get(u.orgPositionId) ?? 0) + 1);
    });
    return { teamCountMap, siteCountMap, positionCountMap };
  }, [users]);

  function requestDeptDelete(id: string) {
    const node = findDeptNode(departments, id);
    if (!node) return;
    const ids = new Set(flatDeptIds([node]));
    setDeleteTarget({ type: "dept", id, name: node.name, affectedUsers: users.filter((u) => u.orgTeamId && ids.has(u.orgTeamId)).length });
  }
  function requestGradeDelete(id: string) {
    const g = jobGrades.find((x) => x.id === id);
    if (!g) return;
    setDeleteTarget({ type: "grade", id, name: g.name, affectedUsers: users.filter((u) => u.orgPositionId === id).length });
  }
  function requestSiteDelete(id: string) {
    const s = sites.find((x) => x.id === id);
    if (!s) return;
    setDeleteTarget({ type: "site", id, name: s.name, affectedUsers: users.filter((u) => u.orgSiteId === id).length, affectedDepts: departments.filter((d) => d.siteId === id).length });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    if (type === "dept") {
      const node = findDeptNode(departments, id);
      if (node) { const ids = new Set(flatDeptIds([node])); users.forEach((u) => { if (u.orgTeamId && ids.has(u.orgTeamId)) updateUser(u.id, { orgTeamId: undefined }); }); }
      removeDept(id);
      if (selectedNode?.type === "team" && selectedNode.id === id) setSelectedNode(null);
    } else if (type === "grade") {
      users.forEach((u) => { if (u.orgPositionId === id) updateUser(u.id, { orgPositionId: undefined }); });
      removeJobGrade(id);
    } else {
      users.forEach((u) => { if (u.orgSiteId === id) updateUser(u.id, { orgSiteId: undefined }); });
      if (selectedNode?.type === "site" && selectedNode.id === id) setSelectedNode(null);
      removeSite(id);
    }
    setDeleteTarget(null);
  }

  return (
    <>
      {deleteTarget && <DeleteConfirmModal target={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      {isCsvOpen && <CsvImportModal onClose={() => setIsCsvOpen(false)} />}

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">조직 구조 관리</h2>
          <p className="text-xs text-slate-400 mt-0.5">사업장·부서·직급을 설정하고 구성원을 배치하세요.</p>
        </div>
        <button onClick={() => setIsCsvOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          <Upload size={13} />CSV로 구성원 가져오기
        </button>
      </div>

      {/* 2단 레이아웃 */}
      <div className="flex gap-6 items-start">
        {/* 좌측 — 설정 */}
        <div className="flex flex-col gap-6 w-80 flex-shrink-0">
          {/* 조직 트리 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">조직 구조</h3>
              <button onClick={() => { setIsAddingSite(true); setNewSiteName(""); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50">
                <Plus size={13} />사업장 추가
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              {sites.map((site) => (
                <SiteNode key={site.id} site={site}
                  depts={departments.filter((d) => d.siteId === site.id)}
                  siteCount={siteCountMap.get(site.id) ?? 0}
                  teamCountMap={teamCountMap}
                  onAddDept={(name) => addRootDept(name, site.id)}
                  onUpdateSite={updateSite} onRemoveSiteRequest={requestSiteDelete}
                  onAddChildDept={addChildDept} onUpdateDept={updateDept} onRemoveDeptRequest={requestDeptDelete}
                  onSelect={setSelectedNode} selectedNode={selectedNode}
                />
              ))}
              <SiteNode isGlobal
                depts={departments.filter((d) => !d.siteId)}
                siteCount={0} teamCountMap={teamCountMap}
                onAddDept={(name) => addRootDept(name, undefined)}
                onAddChildDept={addChildDept} onUpdateDept={updateDept} onRemoveDeptRequest={requestDeptDelete}
                onSelect={setSelectedNode} selectedNode={selectedNode}
              />
              {isAddingSite && (
                <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
                  <input autoFocus placeholder="새 사업장 이름"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={newSiteName} onChange={(e) => setNewSiteName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { const t = newSiteName.trim(); if (t) addSite(t); setIsAddingSite(false); setNewSiteName(""); }
                      if (e.key === "Escape") { setIsAddingSite(false); setNewSiteName(""); }
                    }} />
                  <button onClick={() => { const t = newSiteName.trim(); if (t) addSite(t); setIsAddingSite(false); setNewSiteName(""); }} className="text-emerald-600"><Check size={15} /></button>
                  <button onClick={() => { setIsAddingSite(false); setNewSiteName(""); }} className="text-slate-400"><X size={15} /></button>
                </div>
              )}
            </div>
          </div>

          {/* 직급 */}
          <JobGradeList grades={jobGrades} positionCountMap={positionCountMap}
            onAdd={addJobGrade} onUpdate={updateJobGrade} onRemoveRequest={requestGradeDelete} />
        </div>

        {/* 우측 — 구성원 현황 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">구성원 현황</h3>
            {selectedNode && (
              <button onClick={() => setSelectedNode(null)} className="text-xs text-slate-400 hover:text-slate-600">
                전체 보기
              </button>
            )}
          </div>
          <MemberPanel selectedNode={selectedNode} users={users} sites={sites} departments={departments} jobGrades={jobGrades} onUpdateUser={updateUser} />
        </div>
      </div>
    </>
  );
}
