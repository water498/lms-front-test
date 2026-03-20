"use client";

import { useState } from "react";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import type { LearningPath, LearningPathCourse, Course } from "@/lib/models";
import {
  learningPaths as initialPaths,
  learningPathCourses as initialPathCourses,
  courses,
  getLearningPathCourses,
} from "./mockData";
type PathStatus = "PUBLISHED" | "DRAFT";

const STATUS_CONFIG: Record<PathStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "게시됨",   className: "bg-emerald-100 text-emerald-700" },
  DRAFT:     { label: "임시저장", className: "bg-slate-100 text-slate-500" },
};

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ModalState {
  mode: "create" | "edit";
  path?: LearningPath;
}

interface ModalProps {
  state: ModalState;
  allCourses: Course[];
  currentPathCourses: LearningPathCourse[];
  onClose: () => void;
  onSave: (
    data: Omit<LearningPath, "id" | "tenantId" | "createdAt">,
    selectedCourseIds: string[]
  ) => void;
}

function LearningPathModal({
  state,
  allCourses,
  currentPathCourses,
  onClose,
  onSave,
}: ModalProps) {
  const { mode, path } = state;

  const initSelected = currentPathCourses
    .sort((a, b) => a.order - b.order)
    .map((lpc) => lpc.courseId);

  const [title, setTitle] = useState(path?.title ?? "");
  const [description, setDescription] = useState(path?.description ?? "");
  const [price, setPrice] = useState<string>(
    path?.price !== undefined ? String(path.price) : ""
  );
  const [pathStatus, setPathStatus] = useState<PathStatus>(path?.status ?? "DRAFT");
  const [selectedIds, setSelectedIds] = useState<string[]>(initSelected);

  function toggleCourse(courseId: string) {
    setSelectedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setSelectedIds((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx: number) {
    setSelectedIds((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        price: price !== "" ? Number(price) : undefined,
        status: pathStatus,
      },
      selectedIds
    );
  }

  const courseMap = Object.fromEntries(allCourses.map((c) => [c.id, c]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            {mode === "create" ? "학습 경로 만들기" : "학습 경로 수정"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* 제목 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              제목 <span className="text-rose-500">*</span>
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="학습 경로 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">설명</label>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              placeholder="학습 경로에 대한 설명을 입력하세요"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              가격 (B2C, 미입력 시 미설정)
            </label>
            <input
              type="number"
              min={0}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="예: 290000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* 코스 선택 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">
              코스 선택
            </label>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {allCourses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    className="accent-violet-600"
                    checked={selectedIds.includes(course.id)}
                    onChange={() => toggleCourse(course.id)}
                  />
                  <span className="text-sm text-slate-700 flex-1">{course.title}</span>
                  <span className="text-xs text-slate-400">{course.category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 선택된 코스 순서 */}
          {selectedIds.length > 0 && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">
                코스 순서
              </label>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                {selectedIds.map((id, idx) => {
                  const course = courseMap[id];
                  if (!course) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <span className="text-xs text-slate-400 w-5 text-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700 flex-1">{course.title}</span>
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === selectedIds.length - 1}
                        className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 상태 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">상태</label>
            <div className="flex gap-4">
              {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pathStatus"
                    value={s}
                    checked={pathStatus === s}
                    onChange={() => setPathStatus(s)}
                    className="accent-violet-600"
                  />
                  <span className="text-sm text-slate-700">
                    {s === "DRAFT" ? "임시저장" : "게시됨"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {mode === "create" ? "생성" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Feature ──────────────────────────────────────────────────────────────

export default function LearningPathsFeature() {
  const [paths, setPaths] = useState<LearningPath[]>(initialPaths);
  const [pathCourses, setPathCourses] =
    useState<LearningPathCourse[]>(initialPathCourses);
  const [modal, setModal] = useState<ModalState | null>(null);

  function openCreate() {
    setModal({ mode: "create" });
  }

  function openEdit(path: LearningPath) {
    setModal({ mode: "edit", path });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSave(
    data: Omit<LearningPath, "id" | "tenantId" | "createdAt">,
    selectedCourseIds: string[]
  ) {
    if (modal?.mode === "create") {
      const newId = `lp${Date.now()}`;
      const newPath: LearningPath = {
        id: newId,
        tenantId: "tenant-1",
        createdAt: new Date().toISOString().slice(0, 10),
        ...data,
      };
      setPaths((prev) => [...prev, newPath]);
      const newLinks: LearningPathCourse[] = selectedCourseIds.map((courseId, idx) => ({
        learningPathId: newId,
        courseId,
        order: idx + 1,
      }));
      setPathCourses((prev) => [...prev, ...newLinks]);
    } else if (modal?.mode === "edit" && modal.path) {
      const pathId = modal.path.id;
      setPaths((prev) =>
        prev.map((p) => (p.id === pathId ? { ...p, ...data } : p))
      );
      setPathCourses((prev) => {
        const without = prev.filter((lpc) => lpc.learningPathId !== pathId);
        const updated: LearningPathCourse[] = selectedCourseIds.map(
          (courseId, idx) => ({ learningPathId: pathId, courseId, order: idx + 1 })
        );
        return [...without, ...updated];
      });
    }
    closeModal();
  }

  function handleDelete(pathId: string) {
    setPaths((prev) => prev.filter((p) => p.id !== pathId));
    setPathCourses((prev) => prev.filter((lpc) => lpc.learningPathId !== pathId));
  }

  const currentPathCourses =
    modal?.path
      ? pathCourses.filter((lpc) => lpc.learningPathId === modal.path!.id)
      : [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">학습 경로</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            여러 코스를 묶어 하나의 학습 여정으로 제공합니다.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          + 학습 경로 추가
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">학습 경로명</th>
              <th className="text-left px-4 py-3 font-medium">포함 코스</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">가격</th>
              <th className="text-left px-4 py-3 font-medium">생성일</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {paths.map((path) => {
              const linked = pathCourses.filter(
                (lpc) => lpc.learningPathId === path.id
              );
              const badge = STATUS_CONFIG[path.status];
              return (
                <tr
                  key={path.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{path.title}</p>
                    {path.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {path.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{linked.length}개</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {path.price !== undefined
                      ? `${path.price.toLocaleString()}원`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{path.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(path)}
                        className="text-xs px-2 py-1 text-violet-600 hover:bg-violet-50 rounded transition-colors"
                      >
                        편집
                      </button>
                      <button
                        onClick={() => handleDelete(path.id)}
                        className="text-xs px-2 py-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paths.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-slate-400 text-sm"
                >
                  학습 경로가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <LearningPathModal
          state={modal}
          allCourses={courses}
          currentPathCourses={currentPathCourses}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
