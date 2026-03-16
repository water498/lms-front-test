"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, AlertCircle } from "lucide-react";
import { useTaxonomyStore } from "../../shared/taxonomy-store";
import { courses } from "../../courses/mockData";

export default function CategoriesTab() {
  const { categories, addCategory, updateCategory, removeCategory } = useTaxonomyStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  // 삭제 시도한 카테고리명 — 사용 중이면 패널 열림, 없으면 즉시 삭제
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const blockedCourses =
    deleteTarget != null
      ? courses.filter((c) => c.category === deleteTarget)
      : [];

  function handleDeleteClick(cat: string) {
    const inUse = courses.some((c) => c.category === cat);
    if (inUse) {
      setDeleteTarget(cat);
    } else {
      removeCategory(cat);
    }
  }

  function startEdit(index: number) {
    setDeleteTarget(null);
    setEditingIndex(index);
    setEditValue(categories[index]);
  }

  function confirmEdit() {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== categories[editingIndex]) {
      updateCategory(categories[editingIndex], trimmed);
    }
    setEditingIndex(null);
  }

  function confirmAdd() {
    const trimmed = newValue.trim();
    if (trimmed && !categories.includes(trimmed)) {
      addCategory(trimmed);
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
        {categories.map((cat, i) => (
          <div key={cat}>
            {/* 행 */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white">
              {editingIndex === i ? (
                <>
                  <input
                    autoFocus
                    className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEdit();
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                  />
                  <button onClick={confirmEdit} className="text-emerald-600 hover:text-emerald-700 p-0.5">
                    <Check size={15} />
                  </button>
                  <button onClick={() => setEditingIndex(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-slate-700">{cat}</span>
                  <button
                    onClick={() => startEdit(i)}
                    className="text-slate-400 hover:text-violet-600 p-0.5 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat)}
                    className={`p-0.5 transition-colors ${
                      deleteTarget === cat
                        ? "text-red-500"
                        : "text-slate-400 hover:text-red-500"
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>

            {/* 삭제 블록 패널 — 사용 중인 과정이 있을 때 */}
            {deleteTarget === cat && blockedCourses.length > 0 && (
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
                  onClick={() => setDeleteTarget(null)}
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

        {categories.length === 0 && !isAdding && (
          <div className="px-4 py-6 text-center text-sm text-slate-400">
            카테고리가 없습니다. 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
