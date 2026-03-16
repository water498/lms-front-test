"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { useOrgStructureStore } from "../../shared/org-structure-store";

function ListSection({
  title,
  items,
  onAdd,
  onUpdate,
  onRemove,
  placeholder,
}: {
  title: string;
  items: string[];
  onAdd: (name: string) => void;
  onUpdate: (old: string, next: string) => void;
  onRemove: (name: string) => void;
  placeholder: string;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  function startEdit(i: number) {
    setEditingIndex(i);
    setEditValue(items[i]);
  }

  function confirmEdit() {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== items[editingIndex]) {
      onUpdate(items[editingIndex], trimmed);
    }
    setEditingIndex(null);
  }

  function confirmAdd() {
    const trimmed = newValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
    }
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
          추가
        </button>
      </div>

      <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-2 px-4 py-2.5 bg-white">
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
                <span className="flex-1 text-sm text-slate-700">{item}</span>
                <button
                  onClick={() => startEdit(i)}
                  className="text-slate-400 hover:text-violet-600 p-0.5 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onRemove(item)}
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
              placeholder={placeholder}
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

export default function OrgStructureTab() {
  const {
    departments, addDepartment, updateDepartment, removeDepartment,
    jobGrades, addJobGrade, updateJobGrade, removeJobGrade,
  } = useOrgStructureStore();

  return (
    <div className="flex flex-col gap-8">
      <ListSection
        title="부서 목록"
        items={departments}
        onAdd={addDepartment}
        onUpdate={updateDepartment}
        onRemove={removeDepartment}
        placeholder="새 부서 이름"
      />
      <ListSection
        title="직급 목록"
        items={jobGrades}
        onAdd={addJobGrade}
        onUpdate={updateJobGrade}
        onRemove={removeJobGrade}
        placeholder="새 직급 이름"
      />
    </div>
  );
}
