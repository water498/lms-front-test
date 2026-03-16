"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { instructors, courses } from "../mockData";
import { useTaxonomyStore } from "../../shared/taxonomy-store";

interface Props {
  onClose: () => void;
}

const allTags = [...new Set(courses.flatMap((c) => c.tags))];

export default function CreateCourseModal({ onClose }: Props) {
  const { categories } = useTaxonomyStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [instructor, setInstructor] = useState(instructors[0]);
  const [type, setType] = useState<"online" | "offline" | "blended">("online");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = tagInput.trim()
    ? allTags.filter(
        (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
      )
    : [];

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0);
  }, [tagInput, suggestions.length]);

  function addTag(value: string) {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
    setShowSuggestions(false);
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
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
              {categories.map((c) => <option key={c}>{c}</option>)}
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
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">태그</label>
            <div
              className="w-full border border-slate-200 rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:ring-2 focus-within:ring-violet-400"
              onClick={() => inputRef.current?.focus()}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setTags(tags.filter((t) => t !== tag)); }}
                    className="text-violet-400 hover:text-violet-700"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <div className="relative flex-1 min-w-[120px]">
                <input
                  ref={inputRef}
                  className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
                  placeholder={tags.length === 0 ? "태그 입력 후 Enter 또는 , " : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                {showSuggestions && (
                  <ul className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-md w-48 overflow-hidden">
                    {suggestions.map((s) => (
                      <li
                        key={s}
                        onMouseDown={() => addTag(s)}
                        className="px-3 py-1.5 text-sm text-slate-700 hover:bg-violet-50 cursor-pointer"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
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

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
