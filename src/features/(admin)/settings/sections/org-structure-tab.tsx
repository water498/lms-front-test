"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { useOrgStructureStore, type DeptNode, type JobGrade, type Site, flatDeptIds, findDeptNode } from "../../shared/org-structure-store";
import { useUsersStore } from "../../shared/users-store";

// ── Delete confirmation modal ─────────────────────────────────────────────────

interface DeleteTarget {
  type: 'dept' | 'grade' | 'site';
  id: string;
  name: string;
  affectedCount: number;
}

function DeleteConfirmModal({
  target,
  onConfirm,
  onCancel,
}: {
  target: DeleteTarget;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const typeLabel = target.type === 'dept' ? '부서' : target.type === 'grade' ? '직급' : '사업장';
  const releaseDesc =
    target.type === 'dept' ? '소속 부서가 해제' :
    target.type === 'grade' ? '직급이 해제' :
    '사업장 소속이 해제';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-slate-800">
            {typeLabel} 삭제 확인
          </h3>
          {target.affectedCount > 0 ? (
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-medium text-slate-800">&quot;{target.name}&quot;</span>을(를) 삭제하면{" "}
              이 {typeLabel}에 속한 구성원{" "}
              <span className="font-semibold text-red-600">{target.affectedCount}명</span>의{" "}
              {releaseDesc}됩니다.
            </p>
          ) : (
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-medium text-slate-800">&quot;{target.name}&quot;</span>을(를) 삭제하시겠습니까?
            </p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DeptTreeNode ──────────────────────────────────────────────────────────────

function DeptTreeNode({
  node,
  depth,
  onAddChild,
  onUpdate,
  onRemoveRequest,
}: {
  node: DeptNode;
  depth: number;
  onAddChild: (parentId: string, name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onRemoveRequest: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [isAdding, setIsAdding] = useState(false);
  const [newChildName, setNewChildName] = useState("");

  const hasChildren = node.children.length > 0 || isAdding;

  function confirmEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== node.name) onUpdate(node.id, trimmed);
    setIsEditing(false);
  }

  function confirmAdd() {
    const trimmed = newChildName.trim();
    if (trimmed) {
      onAddChild(node.id, trimmed);
      setOpen(true);
    }
    setIsAdding(false);
    setNewChildName("");
  }

  return (
    <div>
      {/* Node row */}
      <div
        className="flex items-center gap-1 px-3 py-2 hover:bg-slate-50 group rounded-lg"
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {/* Expand/collapse toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0 ${
            hasChildren ? "visible" : "invisible"
          }`}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {isEditing ? (
          <>
            <input
              autoFocus
              className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmEdit();
                if (e.key === "Escape") { setIsEditing(false); setEditValue(node.name); }
              }}
            />
            <button onClick={confirmEdit} className="text-emerald-600 hover:text-emerald-700 p-0.5">
              <Check size={15} />
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditValue(node.name); }}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm text-slate-700">{node.name}</span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setIsAdding(true); setNewChildName(""); setOpen(true); }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
              >
                <Plus size={12} />
                하위 추가
              </button>
              <button
                onClick={() => { setIsEditing(true); setEditValue(node.name); }}
                className="p-1 text-slate-400 hover:text-violet-600 transition-colors rounded"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onRemoveRequest(node.id)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Children */}
      {open && (
        <div>
          {node.children.map((child) => (
            <DeptTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onAddChild={onAddChild}
              onUpdate={onUpdate}
              onRemoveRequest={onRemoveRequest}
            />
          ))}

          {isAdding && (
            <div
              className="flex items-center gap-1 px-3 py-2"
              style={{ paddingLeft: `${12 + (depth + 1) * 20 + 18}px` }}
            >
              <input
                autoFocus
                placeholder="새 하위 부서 이름"
                className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAdd();
                  if (e.key === "Escape") { setIsAdding(false); setNewChildName(""); }
                }}
              />
              <button onClick={confirmAdd} className="text-emerald-600 hover:text-emerald-700 p-0.5">
                <Check size={15} />
              </button>
              <button
                onClick={() => { setIsAdding(false); setNewChildName(""); }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── FlatItemList — shared UI for JobGrade and Site ────────────────────────────

function FlatItemList({
  title,
  addLabel,
  addPlaceholder,
  items,
  onAdd,
  onUpdate,
  onRemoveRequest,
}: {
  title: string;
  addLabel: string;
  addPlaceholder: string;
  items: { id: string; name: string }[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onRemoveRequest: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  function confirmEdit() {
    if (!editingId) return;
    const trimmed = editValue.trim();
    const current = items.find((i) => i.id === editingId);
    if (trimmed && trimmed !== current?.name) onUpdate(editingId, trimmed);
    setEditingId(null);
  }

  function confirmAdd() {
    const trimmed = newValue.trim();
    if (trimmed && !items.some((i) => i.name === trimmed)) onAdd(trimmed);
    setIsAdding(false);
    setNewValue("");
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <button
          onClick={() => { setIsAdding(true); setNewValue(""); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
        >
          <Plus size={13} />
          {addLabel}
        </button>
      </div>

      <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 px-4 py-2.5 bg-white">
            {editingId === item.id ? (
              <>
                <input
                  autoFocus
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button onClick={confirmEdit} className="text-emerald-600 hover:text-emerald-700 p-0.5">
                  <Check size={15} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                  <X size={15} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-slate-700">{item.name}</span>
                <button
                  onClick={() => { setEditingId(item.id); setEditValue(item.name); }}
                  className="text-slate-400 hover:text-violet-600 p-0.5 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onRemoveRequest(item.id)}
                  className="text-slate-400 hover:text-red-500 p-0.5 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white">
            <input
              autoFocus
              placeholder={addPlaceholder}
              className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmAdd();
                if (e.key === "Escape") { setIsAdding(false); setNewValue(""); }
              }}
            />
            <button onClick={confirmAdd} className="text-emerald-600 hover:text-emerald-700 p-0.5">
              <Check size={15} />
            </button>
            <button onClick={() => { setIsAdding(false); setNewValue(""); }} className="text-slate-400 hover:text-slate-600 p-0.5">
              <X size={15} />
            </button>
          </div>
        )}

        {items.length === 0 && !isAdding && (
          <div className="px-4 py-6 text-center text-sm text-slate-400">
            항목이 없습니다. 추가해보세요.
          </div>
        )}
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

  const [isAddingRoot, setIsAddingRoot] = useState(false);
  const [newRootName, setNewRootName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  function confirmAddRoot() {
    const trimmed = newRootName.trim();
    if (trimmed) addRootDept(trimmed);
    setIsAddingRoot(false);
    setNewRootName("");
  }

  // ── delete request handlers ──────────────────────────────────────────────

  function requestDeptDelete(id: string) {
    const node = findDeptNode(departments, id);
    if (!node) return;
    const idsToRemove = new Set(flatDeptIds([node]));
    const affectedCount = users.filter((u) => u.departmentId && idsToRemove.has(u.departmentId)).length;
    setDeleteTarget({ type: 'dept', id, name: node.name, affectedCount });
  }

  function requestGradeDelete(id: string) {
    const grade = jobGrades.find((g) => g.id === id);
    if (!grade) return;
    const affectedCount = users.filter((u) => u.jobGradeId === id).length;
    setDeleteTarget({ type: 'grade', id, name: grade.name, affectedCount });
  }

  function requestSiteDelete(id: string) {
    const site = sites.find((s) => s.id === id);
    if (!site) return;
    const affectedCount = users.filter((u) => u.siteId === id).length;
    setDeleteTarget({ type: 'site', id, name: site.name, affectedCount });
  }

  // ── delete confirm ────────────────────────────────────────────────────────

  function confirmDelete() {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;

    if (type === 'dept') {
      const node = findDeptNode(departments, id);
      if (node) {
        const idsToRemove = new Set(flatDeptIds([node]));
        users.forEach((u) => {
          if (u.departmentId && idsToRemove.has(u.departmentId)) {
            updateUser(u.id, { departmentId: undefined });
          }
        });
      }
      removeDept(id);
    } else if (type === 'grade') {
      users.forEach((u) => {
        if (u.jobGradeId === id) updateUser(u.id, { jobGradeId: undefined });
      });
      removeJobGrade(id);
    } else {
      users.forEach((u) => {
        if (u.siteId === id) updateUser(u.id, { siteId: undefined });
      });
      removeSite(id);
    }

    setDeleteTarget(null);
  }

  return (
    <>
      {deleteTarget && (
        <DeleteConfirmModal
          target={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex flex-col gap-8">
        {/* 부서 트리 */}
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">부서 구조</h3>
            <button
              onClick={() => { setIsAddingRoot(true); setNewRootName(""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <Plus size={13} />
              부서 추가
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white py-1">
            {departments.map((node) => (
              <DeptTreeNode
                key={node.id}
                node={node}
                depth={0}
                onAddChild={addChildDept}
                onUpdate={updateDept}
                onRemoveRequest={requestDeptDelete}
              />
            ))}

            {isAddingRoot && (
              <div className="flex items-center gap-1 px-3 py-2" style={{ paddingLeft: "30px" }}>
                <input
                  autoFocus
                  placeholder="새 부서 이름"
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={newRootName}
                  onChange={(e) => setNewRootName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmAddRoot();
                    if (e.key === "Escape") { setIsAddingRoot(false); setNewRootName(""); }
                  }}
                />
                <button onClick={confirmAddRoot} className="text-emerald-600 hover:text-emerald-700 p-0.5">
                  <Check size={15} />
                </button>
                <button
                  onClick={() => { setIsAddingRoot(false); setNewRootName(""); }}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {departments.length === 0 && !isAddingRoot && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                부서가 없습니다. 추가해보세요.
              </div>
            )}
          </div>
        </div>

        {/* 직급 목록 */}
        <FlatItemList
          title="직급 목록"
          addLabel="추가"
          addPlaceholder="새 직급 이름"
          items={jobGrades}
          onAdd={addJobGrade}
          onUpdate={updateJobGrade}
          onRemoveRequest={requestGradeDelete}
        />

        {/* 사업장 목록 */}
        <FlatItemList
          title="사업장 목록"
          addLabel="추가"
          addPlaceholder="새 사업장 이름"
          items={sites}
          onAdd={addSite}
          onUpdate={updateSite}
          onRemoveRequest={requestSiteDelete}
        />
      </div>
    </>
  );
}
