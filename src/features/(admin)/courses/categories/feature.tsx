"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTaxonomyStore, type Category } from "../../shared/taxonomy-store";
import { courses } from "../mockData";

const MAX_DEPTH = 3; // 대 / 중 / 소

function getDepth(id: string, categories: Category[]): number {
  let depth = 0;
  let current: Category | undefined = categories.find((c) => c.id === id);
  while (current?.parentId) {
    depth++;
    current = categories.find((c) => c.id === current!.parentId);
  }
  return depth;
}

function getUsageCount(name: string): number {
  return courses.filter((c) => c.category === name).length;
}

interface NodeProps {
  cat: Category;
  depth: number;
  siblings: Category[];
}

function CategoryNode({ cat, depth, siblings }: NodeProps) {
  const { categories, addCategory, updateCategory, removeCategory, moveCategory } =
    useTaxonomyStore();

  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(cat.name);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const children = categories
    .filter((c) => c.parentId === cat.id)
    .sort((a, b) => a.order - b.order);

  const idx = siblings.findIndex((s) => s.id === cat.id);
  const canMoveUp = idx > 0;
  const canMoveDown = idx < siblings.length - 1;
  const canAddChild = depth + 1 < MAX_DEPTH;
  const usage = getUsageCount(cat.name);

  function confirmEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== cat.name) updateCategory(cat.id, trimmed);
    setEditing(false);
  }

  function confirmAdd() {
    const trimmed = newName.trim();
    if (trimmed) addCategory(trimmed, cat.id);
    setAdding(false);
    setNewName("");
    setExpanded(true);
  }

  const depthIndent = depth * 20;
  const DEPTH_LABELS = ["대분류", "중분류", "소분류"];

  return (
    <div>
      <div
        className="group flex items-center gap-1 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
        style={{ paddingLeft: `${12 + depthIndent}px` }}
      >
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`shrink-0 text-slate-400 transition-colors ${
            children.length > 0 ? "hover:text-slate-600" : "invisible"
          }`}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Name / edit input */}
        {editing ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              autoFocus
              className="flex-1 border border-slate-200 rounded-md px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmEdit();
                if (e.key === "Escape") { setEditing(false); setEditValue(cat.name); }
              }}
            />
            <button onClick={confirmEdit} className="text-emerald-600 hover:text-emerald-700">
              <Check size={14} />
            </button>
            <button
              onClick={() => { setEditing(false); setEditValue(cat.name); }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-sm text-slate-700">{cat.name}</span>
            <span className="text-xs text-slate-400 mr-2">{DEPTH_LABELS[depth]}</span>
            {usage > 0 && (
              <span className="text-xs text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded-full mr-1">
                {usage}개 과정
              </span>
            )}
          </>
        )}

        {/* Action buttons — visible on hover */}
        {!editing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => moveCategory(cat.id, "up")}
              disabled={!canMoveUp}
              className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUp size={13} />
            </button>
            <button
              onClick={() => moveCategory(cat.id, "down")}
              disabled={!canMoveDown}
              className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowDown size={13} />
            </button>
            {canAddChild && (
              <button
                onClick={() => { setAdding(true); setNewName(""); setExpanded(true); }}
                className="p-0.5 text-slate-400 hover:text-violet-600 transition-colors"
              >
                <Plus size={13} />
              </button>
            )}
            <button
              onClick={() => { setEditing(true); setEditValue(cat.name); }}
              className="p-0.5 text-slate-400 hover:text-violet-600 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => removeCategory(cat.id)}
              className="p-0.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && (
        <div>
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              cat={child}
              depth={depth + 1}
              siblings={children}
            />
          ))}
          {adding && (
            <div
              className="flex items-center gap-1.5 px-3 py-2"
              style={{ paddingLeft: `${12 + (depth + 1) * 20 + 18}px` }}
            >
              <input
                autoFocus
                placeholder={`${["중분류", "소분류"][depth]} 이름`}
                className="flex-1 border border-slate-200 rounded-md px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAdd();
                  if (e.key === "Escape") { setAdding(false); setNewName(""); }
                }}
              />
              <button onClick={confirmAdd} className="text-emerald-600 hover:text-emerald-700">
                <Check size={14} />
              </button>
              <button
                onClick={() => { setAdding(false); setNewName(""); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CategoriesFeature() {
  const { categories, addCategory } = useTaxonomyStore();
  const [addingTop, setAddingTop] = useState(false);
  const [newTopName, setNewTopName] = useState("");

  const topLevel = categories
    .filter((c) => c.parentId === null)
    .sort((a, b) => a.order - b.order);

  function confirmAddTop() {
    const trimmed = newTopName.trim();
    if (trimmed && !topLevel.some((c) => c.name === trimmed)) {
      addCategory(trimmed, null);
    }
    setAddingTop(false);
    setNewTopName("");
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">카테고리 관리</h2>
          <p className="text-xs text-slate-400 mt-0.5">최대 3단계 (대 / 중 / 소) 계층 구조</p>
        </div>
        <button
          onClick={() => { setAddingTop(true); setNewTopName(""); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus size={14} />
          대분류 추가
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 py-2">
        {topLevel.length === 0 && !addingTop ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">
            카테고리가 없습니다. 대분류를 추가해보세요.
          </p>
        ) : (
          topLevel.map((cat) => (
            <CategoryNode
              key={cat.id}
              cat={cat}
              depth={0}
              siblings={topLevel}
            />
          ))
        )}

        {addingTop && (
          <div className="flex items-center gap-1.5 px-3 py-2 ml-5">
            <input
              autoFocus
              placeholder="대분류 이름"
              className="flex-1 border border-slate-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={newTopName}
              onChange={(e) => setNewTopName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmAddTop();
                if (e.key === "Escape") { setAddingTop(false); setNewTopName(""); }
              }}
            />
            <button onClick={confirmAddTop} className="text-emerald-600 hover:text-emerald-700">
              <Check size={14} />
            </button>
            <button
              onClick={() => { setAddingTop(false); setNewTopName(""); }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        · 항목에 마우스를 올리면 편집 버튼이 나타납니다.<br />
        · 대분류 삭제 시 하위 중/소분류도 함께 삭제됩니다.
      </p>
    </div>
  );
}
