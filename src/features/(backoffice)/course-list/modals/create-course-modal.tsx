"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { instructors } from "../mockData";
import { useTaxonomyStore } from "../../shared/taxonomy-store";

interface Props {
  onClose: () => void;
}

export default function CreateCourseModal({ onClose }: Props) {
  const router = useRouter();
  const { categories } = useTaxonomyStore();
  const categoryNames = categories.filter((c) => c.parentId === null).map((c) => c.name);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categoryNames[0] ?? "");
  const [instructor, setInstructor] = useState(instructors[0]);
  const [type, setType] = useState<"online" | "offline" | "blended">("online");

  function handleCreate() {
    // 실험: DRAFT인 c5로 redirect (실제에선 생성된 ID 사용)
    onClose();
    router.push("/backoffice/courses/c5");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">새 과정 만들기</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">과정명</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="과정 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">카테고리</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryNames.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">강사</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            >
              {instructors.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">수업 유형</label>
            <div className="flex gap-4">
              {(["online", "offline", "blended"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="accent-violet-600"
                  />
                  <span className="text-sm text-slate-700">
                    {t === "online" ? "온라인" : t === "offline" ? "오프라인" : "혼합"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-400 leading-relaxed">
          생성하면 DRAFT로 저장되며, 상세 페이지에서 썸네일·소개·취소규정 등을 설정할 수 있습니다.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
