"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { type Course, type CourseStatus, courses, instructors } from "../../courses/mockData";
import { useTaxonomyStore } from "../../shared/taxonomy-store";

const STATUS_CONFIG: Record<CourseStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "게시됨",   className: "bg-emerald-100 text-emerald-700" },
  DRAFT:     { label: "임시저장", className: "bg-amber-100 text-amber-700" },
  ARCHIVED:  { label: "보관됨",   className: "bg-slate-100 text-slate-600" },
};

const allTags = [...new Set(courses.flatMap((c) => c.tags))];

export default function InfoTab({ course }: { course: Course }) {
  const { categories } = useTaxonomyStore();
  const [title, setTitle] = useState(course.title);
  const [instructor, setInstructor] = useState(course.instructor);
  const [category, setCategory] = useState(course.category ?? categories[0]);
  const [tags, setTags] = useState<string[]>(course.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const badge = STATUS_CONFIG[course.status];

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
    <div className="max-w-lg flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.className}`}>
          {badge.label}
        </span>
        {course.status === "DRAFT" && (
          <button className="text-xs px-3 py-1 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
            게시하기
          </button>
        )}
        {course.status === "PUBLISHED" && (
          <button className="text-xs px-3 py-1 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            보관하기
          </button>
        )}
      </div>

      {/* Thumbnail placeholder */}
      <div className="w-full h-36 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200">
        썸네일 이미지 업로드
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">과정명</label>
        <input
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
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
          {["온라인", "오프라인", "혼합"].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" defaultChecked={t === "온라인"} className="accent-violet-600" />
              <span className="text-sm text-slate-700">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-1">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
