"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, X } from "lucide-react";
import {
  type ExamTemplate,
  type ExamSubType,
  type CompositionRule,
  examTemplates,
  bankQuestions,
} from "../mockData";

function makeId() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function newRule(): CompositionRule {
  return { id: makeId(), label: "", tagFilter: [], count: 5, shuffle: true };
}

function defaultExam(): Omit<ExamTemplate, "id" | "usageCount" | "createdAt"> {
  return { title: "", subType: "SHORT", passingScore: 70, timeLimit: null, rules: [] };
}

// All unique tags in the bank (EXAM only)
const allExamTags = Array.from(
  new Set(bankQuestions.filter((q) => q.kind === "EXAM").flatMap((q) => q.tags))
).sort();

interface Props { examId: string }

export default function ExamEditorFeature({ examId }: Props) {
  const found = examId === "new" ? null : examTemplates.find((e) => e.id === examId);
  const src = found ?? defaultExam();

  const [title, setTitle]               = useState(src.title);
  const [subType, setSubType]           = useState<ExamSubType>(src.subType);
  const [passingScore, setPassingScore] = useState(src.passingScore);
  const [timeLimit, setTimeLimit]       = useState<string>(src.timeLimit?.toString() ?? "");
  const [rules, setRules]               = useState<CompositionRule[]>(src.rules);
  const [selectedId, setSelectedId]     = useState<string | null>(src.rules[0]?.id ?? null);
  const [tagInput, setTagInput]         = useState("");

  const selected = rules.find((r) => r.id === selectedId) ?? null;
  const totalQ   = rules.reduce((s, r) => s + r.count, 0);

  function updateRule(id: string, patch: Partial<CompositionRule>) {
    setRules((rs) => rs.map((r) => r.id === id ? { ...r, ...patch } : r));
  }

  function addRule() {
    const r = newRule();
    setRules((rs) => [...rs, r]);
    setSelectedId(r.id);
  }

  function deleteRule(id: string) {
    setRules((rs) => {
      const next = rs.filter((r) => r.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  function addTag(ruleId: string, tag: string) {
    const t = tag.trim();
    if (!t) return;
    setRules((rs) => rs.map((r) => {
      if (r.id !== ruleId || r.tagFilter.includes(t)) return r;
      return { ...r, tagFilter: [...r.tagFilter, t] };
    }));
    setTagInput("");
  }

  function removeTag(ruleId: string, tag: string) {
    setRules((rs) => rs.map((r) =>
      r.id !== ruleId ? r : { ...r, tagFilter: r.tagFilter.filter((t) => t !== tag) }
    ));
  }

  // Matching bank questions for the selected rule
  const matchingQuestions = selected
    ? bankQuestions.filter(
        (q) => q.kind === "EXAM" && selected.tagFilter.every((t) => q.tags.includes(t))
      )
    : [];

  // Tag autocomplete suggestions
  const tagSuggestions = tagInput
    ? allExamTags.filter(
        (t) => t.toLowerCase().includes(tagInput.toLowerCase()) &&
               !(selected?.tagFilter.includes(t))
      )
    : [];

  return (
    <div className="-m-6 h-[calc(100vh-56px)] flex flex-col overflow-hidden bg-white">

      {/* ── Top bar ── */}
      <div className="h-14 border-b border-slate-200 flex items-center gap-4 px-5 flex-shrink-0">
        <Link
          href="/experiments/admin/assessments"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={15} />
          평가 관리
        </Link>
        <div className="w-px h-4 bg-slate-200" />
        <input
          className="flex-1 max-w-sm text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent focus:border-violet-400 focus:outline-none px-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="시험 제목"
        />
        <span className="ml-auto text-xs text-slate-400">총 {totalQ}문항 예상</span>
        <button className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left — rule list */}
        <aside className="w-60 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">규칙 목록</p>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {rules.length === 0 && (
              <p className="px-4 py-8 text-xs text-center text-slate-300">규칙이 없습니다</p>
            )}
            {rules.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left px-4 py-2.5 flex items-start gap-2.5 transition-colors ${
                  selectedId === r.id ? "bg-violet-50" : "hover:bg-slate-50"
                }`}
              >
                <span className={`text-xs font-bold mt-0.5 w-4 flex-shrink-0 ${
                  selectedId === r.id ? "text-violet-500" : "text-slate-300"
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    selectedId === r.id ? "text-violet-700" : "text-slate-700"
                  }`}>
                    {r.label || "(이름 없음)"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {r.tagFilter.length > 0
                      ? r.tagFilter.map((t) => `#${t}`).join(" ") + ` · ${r.count}문항`
                      : `${r.count}문항`}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100">
            <button
              onClick={addRule}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-violet-600 border border-dashed border-violet-300 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <Plus size={13} />
              규칙 추가
            </button>
          </div>
        </aside>

        {/* Center — rule editor */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-10">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-400 text-2xl mb-1">📋</div>
              <p className="text-sm text-slate-500">왼쪽에서 규칙을 선택하거나 추가하세요</p>
              <button
                onClick={addRule}
                className="mt-1 px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                + 첫 번째 규칙 추가
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto flex flex-col gap-4">

              {/* Rule label */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">라벨</label>
                  <input
                    className="w-full text-sm text-slate-800 bg-transparent border-b border-slate-200 focus:border-violet-400 focus:outline-none pb-1 placeholder:text-slate-300"
                    placeholder="예: 직장내괴롭힘 섹션"
                    value={selected.label}
                    onChange={(e) => updateRule(selected.id, { label: e.target.value })}
                  />
                </div>

                {/* Tag filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">태그 필터</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selected.tagFilter.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                        #{tag}
                        <button onClick={() => removeTag(selected.id, tag)} className="hover:text-red-500 transition-colors">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-slate-300"
                      placeholder="태그 입력 후 Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { addTag(selected.id, tagInput); e.preventDefault(); }
                      }}
                    />
                    {tagSuggestions.length > 0 && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                        {tagSuggestions.map((t) => (
                          <button
                            key={t}
                            onMouseDown={(e) => { e.preventDefault(); addTag(selected.id, t); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 transition-colors"
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Count & shuffle */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-400 block mb-2">출제 수</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                        value={selected.count}
                        onChange={(e) => updateRule(selected.id, { count: Math.max(1, Number(e.target.value)) })}
                      />
                      <span className="text-sm text-slate-500">문항</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-400 block mb-2">셔플</label>
                    <button
                      onClick={() => updateRule(selected.id, { shuffle: !selected.shuffle })}
                      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                        selected.shuffle ? "bg-violet-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        selected.shuffle ? "translate-x-5" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Matching preview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  매칭 문항 미리보기 — {matchingQuestions.length}개
                </p>
                {matchingQuestions.length === 0 ? (
                  <p className="text-xs text-slate-300 text-center py-4">
                    {selected.tagFilter.length === 0 ? "태그 필터를 추가하면 매칭 문항이 표시됩니다" : "해당 태그를 가진 문항이 없습니다"}
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {matchingQuestions.map((q) => (
                      <div key={q.id} className="flex items-start gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-300 mt-0.5 flex-shrink-0">📝</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 truncate">{q.text}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {q.tags.map((t) => `#${t}`).join(" ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Right — settings */}
        <aside className="w-64 border-l border-slate-200 overflow-y-auto bg-white flex flex-col">

          {/* Exam settings */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">시험 설정</p>
          </div>
          <div className="p-4 flex flex-col gap-4 border-b border-slate-100">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">유형</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={subType}
                onChange={(e) => setSubType(e.target.value as ExamSubType)}
              >
                <option value="SHORT">단답 시험</option>
                <option value="FINAL">최종 시험</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">통과 기준 (%)</label>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={passingScore}
                min={0} max={100}
                onChange={(e) => setPassingScore(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">시간 제한 (분)</label>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={timeLimit}
                min={1}
                placeholder="무제한"
                onChange={(e) => setTimeLimit(e.target.value)}
              />
            </div>
          </div>

          {/* Rule settings */}
          {selected && (
            <>
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">규칙 설정</p>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">출제 수</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={selected.count}
                    onChange={(e) => updateRule(selected.id, { count: Math.max(1, Number(e.target.value)) })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">셔플</span>
                  <button
                    onClick={() => updateRule(selected.id, { shuffle: !selected.shuffle })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      selected.shuffle ? "bg-violet-600" : "bg-slate-200"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      selected.shuffle ? "translate-x-4" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
                <button
                  onClick={() => deleteRule(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                  규칙 삭제
                </button>
              </div>
            </>
          )}
        </aside>

      </div>
    </div>
  );
}
