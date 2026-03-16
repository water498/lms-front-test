"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, AlertCircle } from "lucide-react";
import { useTaxonomyStore } from "../../shared/taxonomy-store";
import { courses } from "../../courses/mockData";

export default function CategoriesTab() {
  const { categories, addCategory, updateCategory, removeCategory } = useTaxonomyStore();
  const topLevel = categories
    .filter((c) => c.parentId === null)
    .sort((a, b) => a.order - b.order);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const deleteTarget = deleteTargetId ? topLevel.find((c) => c.id === deleteTargetId) : null;
  const blockedCourses =
    deleteTarget != null
      ? courses.filter((c) => c.category === deleteTarget.name)
      : [];

  function handleDeleteClick(id: string, name: string) {
    const inUse = courses.some((c) => c.category === name);
    if (inUse) {
      setDeleteTargetId(id);
    } else {
      removeCategory(id);
    }
  }

  function startEdit(id: string, name: string) {
    setDeleteTargetId(null);
    setEditingId(id);
    setEditValue(name);
  }

  function confirmEdit() {
    if (!editingId) return;
    const trimmed = editValue.trim();
    if (trimmed) updateCategory(editingId, trimmed);
    setEditingId(null);
  }

  function confirmAdd() {
    const trimmed = newValue.trim();
    if (trimmed && !topLevel.some((c) => c.name === trimmed)) {
      addCategory(trimmed, null);
    }
    setIsAdding(false);
    setNewValue("");
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">카테고리 목록</h3>
        <button
          onClick={() => { setIsAdding(true); setNewValue(""); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
        >
          <Plus size={13} />
          추가
        </button>
      </div>

      <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {topLevel.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white">
              {editingId === cat.id ? (
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
                  <span className="flex-1 text-sm text-slate-700">{cat.name}</span>
                  <button
                    onClick={() => startEdit(cat.id, cat.name)}
                    className="text-slate-400 hover:text-violet-600 p-0.5 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat.id, cat.name)}
                    className={`p-0.5 transition-colors ${
                      deleteTargetId === cat.id
                        ? "text-red-500"
                        : "text-slate-400 hover:text-red-500"
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>

            {deleteTargetId === cat.id && blockedCourses.length > 0 && (
              <div className="border-t border-red-100 bg-red-50 px-4 py-3 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700 font-medium">
                    {blockedCourses.length}개 과정이 이 카테고리를 사용 중입니다.
                    모든 과정의 카테고리를 변경한 후 삭제할 수 있습니다.
                  </p>
                </div>
                <ul className="flex flex-col gap-1 pl-5">
                  {blockedCourses.map((c) => (
                    <li key={c.id} className="text-xs text-red-600">
                      · {c.title}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="self-end text-xs text-slate-500 hover:text-slate-700"
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white">
            <input
              autoFocus
              placeholder="새 카테고리 이름"
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

        {topLevel.length === 0 && !isAdding && (
          <div className="px-4 py-6 text-center text-sm text-slate-400">
            카테고리가 없습니다. 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
