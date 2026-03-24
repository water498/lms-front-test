"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, X, Check } from "lucide-react";
import {
  type QuestionBank,
  type QuestionBankKind,
  type QuestionType,
  type SurveyQuestionType,
  bankQuestions as initialBank,
} from "../mockData";

function makeId() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function newQuestion(kind: QuestionBankKind): QuestionBank {
  return {
    id: makeId(),
    kind,
    type: kind === "EXAM" ? "SINGLE" : "LIKERT",
    text: "",
    options: kind === "EXAM"
      ? [{ id: makeId(), text: "", correct: true, order: 1 }, { id: makeId(), text: "", correct: false, order: 2 }]
      : undefined,
    scale: kind === "SURVEY" ? 5 : undefined,
    tags: [],
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

const EXAM_TYPE_LABELS: Record<QuestionType, string> = {
  SINGLE:     "객관식 (단일)",
  MULTIPLE:   "객관식 (복수)",
  TRUE_FALSE: "O / X",
  SHORT:      "주관식",
};

const SURVEY_TYPE_LABELS: Record<SurveyQuestionType, string> = {
  LIKERT:   "리커트 척도",
  SINGLE:   "객관식 (단일)",
  MULTIPLE: "객관식 (복수)",
  TEXT:     "자유 서술",
};

export default function QuestionBankFeature() {
  const [kind, setKind]           = useState<QuestionBankKind>("EXAM");
  const [questions, setQuestions] = useState<QuestionBank[]>(initialBank);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [tagInput, setTagInput]   = useState("");

  const kindQuestions  = questions.filter((q) => q.kind === kind);
  const filteredQ      = tagFilter ? kindQuestions.filter((q) => q.tags.includes(tagFilter)) : kindQuestions;
  const selected       = questions.find((q) => q.id === selectedId) ?? null;

  // All tags for this kind
  const allTags = Array.from(new Set(kindQuestions.flatMap((q) => q.tags))).sort();

  // Tag autocomplete for the selected question
  const tagSuggestions = tagInput
    ? allTags.filter(
        (t) => t.toLowerCase().includes(tagInput.toLowerCase()) &&
               !(selected?.tags.includes(t))
      )
    : [];

  function updateQ(id: string, patch: Partial<QuestionBank>) {
    setQuestions((qs) => qs.map((q) => q.id === id ? { ...q, ...patch } : q));
  }

  function addQuestion() {
    const q = newQuestion(kind);
    setQuestions((qs) => [...qs, q]);
    setSelectedId(q.id);
  }

  function deleteQuestion(id: string) {
    setQuestions((qs) => {
      const next = qs.filter((q) => q.id !== id);
      if (selectedId === id) setSelectedId(next.filter((q) => q.kind === kind)[0]?.id ?? null);
      return next;
    });
  }

  function changeType(id: string, type: QuestionType | SurveyQuestionType) {
    setQuestions((qs) => qs.map((q) => {
      if (q.id !== id) return q;
      if (q.kind === "EXAM") {
        const t = type as QuestionType;
        if (t === "TRUE_FALSE") return { ...q, type: t, options: [
          { id: "tf_t", text: "True", correct: true, order: 1 },
          { id: "tf_f", text: "False", correct: false, order: 2 },
        ]};
        if (t === "SHORT") return { ...q, type: t, options: undefined };
        return { ...q, type: t, options: q.options?.length ? q.options : [
          { id: makeId(), text: "", correct: true, order: 1 },
          { id: makeId(), text: "", correct: false, order: 2 },
        ]};
      } else {
        const t = type as SurveyQuestionType;
        if (t === "LIKERT") return { ...q, type: t, scale: 5, options: undefined };
        if (t === "TEXT")   return { ...q, type: t, scale: undefined, options: undefined };
        return { ...q, type: t, scale: undefined, options: q.options?.length ? q.options : [
          { id: makeId(), text: "", order: 1 },
          { id: makeId(), text: "", order: 2 },
        ]};
      }
    }));
  }

  function addOption(id: string) {
    setQuestions((qs) => qs.map((q) => q.id !== id ? q : {
      ...q,
      options: [...(q.options ?? []), { id: makeId(), text: "", correct: false, order: (q.options?.length ?? 0) + 1 }],
    }));
  }

  function updateOption(qId: string, oId: string, patch: { text?: string; correct?: boolean }) {
    setQuestions((qs) => qs.map((q) => {
      if (q.id !== qId) return q;
      let options = q.options?.map((o) => o.id === oId ? { ...o, ...patch } : o) ?? [];
      if (patch.correct && (q.type === "SINGLE")) {
        options = options.map((o) => ({ ...o, correct: o.id === oId }));
      }
      return { ...q, options };
    }));
  }

  function deleteOption(qId: string, oId: string) {
    setQuestions((qs) => qs.map((q) => q.id !== qId ? q : {
      ...q,
      options: q.options?.filter((o) => o.id !== oId) ?? [],
    }));
  }

  function addTag(qId: string, tag: string) {
    const t = tag.trim();
    if (!t) return;
    setQuestions((qs) => qs.map((q) => {
      if (q.id !== qId || q.tags.includes(t)) return q;
      return { ...q, tags: [...q.tags, t] };
    }));
    setTagInput("");
  }

  function removeTag(qId: string, tag: string) {
    setQuestions((qs) => qs.map((q) =>
      q.id !== qId ? q : { ...q, tags: q.tags.filter((t) => t !== tag) }
    ));
  }

  const typeLabels = kind === "EXAM" ? EXAM_TYPE_LABELS : SURVEY_TYPE_LABELS;

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
        <span className="text-sm font-semibold text-slate-800">문항 뱅크</span>

        {/* Kind switcher */}
        <div className="ml-4 flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {(["EXAM", "SURVEY"] as QuestionBankKind[]).map((k) => (
            <button
              key={k}
              onClick={() => { setKind(k); setSelectedId(null); setTagFilter(null); }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                kind === k ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {k === "EXAM" ? "시험용" : "설문용"}
            </button>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="ml-auto px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} />
          문항 추가
        </button>
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left — tag filter + question list */}
        <aside className="w-64 border-r border-slate-200 flex flex-col overflow-hidden bg-white">

          {/* Tag filter */}
          <div className="px-3 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">태그 필터</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setTagFilter(null)}
                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                  tagFilter === null ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                전체
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    tagFilter === tag ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Question list */}
          <div className="flex-1 overflow-y-auto py-1">
            {filteredQ.length === 0 && (
              <p className="px-4 py-8 text-xs text-center text-slate-300">문항이 없습니다</p>
            )}
            {filteredQ.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedId(q.id)}
                className={`w-full text-left px-4 py-2.5 flex items-start gap-2 transition-colors ${
                  selectedId === q.id ? "bg-violet-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    selectedId === q.id ? "text-violet-700" : "text-slate-700"
                  }`}>
                    {q.text || "(내용 없음)"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-slate-400">
                      {typeLabels[q.type as keyof typeof typeLabels]}
                    </span>
                    {q.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] text-violet-500">#{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100">
            <button
              onClick={addQuestion}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-violet-600 border border-dashed border-violet-300 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <Plus size={13} />
              문항 추가
            </button>
          </div>
        </aside>

        {/* Center — question editor */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-10">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-400 text-2xl mb-1">📝</div>
              <p className="text-sm text-slate-500">왼쪽에서 문항을 선택하거나 추가하세요</p>
              <button
                onClick={addQuestion}
                className="mt-1 px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                + 새 문항 추가
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto flex flex-col gap-4">

              {/* Question text */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <textarea
                  className="w-full text-[15px] text-slate-800 bg-transparent resize-none focus:outline-none placeholder:text-slate-300 leading-relaxed"
                  rows={3}
                  placeholder="문항 내용을 입력하세요"
                  value={selected.text}
                  onChange={(e) => updateQ(selected.id, { text: e.target.value })}
                />
              </div>

              {/* EXAM options: SINGLE / MULTIPLE / TRUE_FALSE */}
              {selected.kind === "EXAM" && selected.type !== "SHORT" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-2.5">
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">
                    {selected.type === "MULTIPLE" ? "선지 — 정답 복수 선택 가능" : "선지 — 정답 하나 선택"}
                  </p>
                  {(selected.options ?? []).map((opt, oi) => (
                    <div key={opt.id} className="flex items-center gap-3">
                      <button
                        onClick={() => updateOption(selected.id, opt.id, { correct: !opt.correct })}
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          opt.correct
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-slate-300 hover:border-violet-400"
                        }`}
                      >
                        {opt.correct && <Check size={11} strokeWidth={3} />}
                      </button>
                      {selected.type === "TRUE_FALSE" ? (
                        <span className="flex-1 text-sm text-slate-700">{opt.text}</span>
                      ) : (
                        <input
                          className="flex-1 text-sm text-slate-700 bg-transparent border-b border-slate-200 focus:border-violet-400 focus:outline-none py-1 placeholder:text-slate-300"
                          placeholder={`선지 ${oi + 1}`}
                          value={opt.text}
                          onChange={(e) => updateOption(selected.id, opt.id, { text: e.target.value })}
                        />
                      )}
                      {selected.type !== "TRUE_FALSE" && (
                        <button
                          onClick={() => deleteOption(selected.id, opt.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  {selected.type !== "TRUE_FALSE" && (
                    <button
                      onClick={() => addOption(selected.id)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors mt-1 w-fit"
                    >
                      <Plus size={12} /> 선지 추가
                    </button>
                  )}
                </div>
              )}

              {/* EXAM SHORT */}
              {selected.kind === "EXAM" && selected.type === "SHORT" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <p className="text-xs font-semibold text-slate-400 mb-2">모범 답안 (선택)</p>
                  <textarea
                    className="w-full text-sm text-slate-700 bg-slate-50 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 border border-slate-200 placeholder:text-slate-300"
                    rows={3}
                    placeholder="모범 답안을 입력하세요"
                    value={selected.answer ?? ""}
                    onChange={(e) => updateQ(selected.id, { answer: e.target.value })}
                  />
                </div>
              )}

              {/* SURVEY LIKERT */}
              {selected.kind === "SURVEY" && selected.type === "LIKERT" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <p className="text-xs font-semibold text-slate-400 mb-4">응답 미리보기 — {selected.scale ?? 5}점 척도</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-20 text-right flex-shrink-0">매우 불만족</span>
                    <div className="flex gap-2 flex-1 justify-center">
                      {Array.from({ length: selected.scale ?? 5 }, (_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-sm font-medium text-slate-400"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 w-20 flex-shrink-0">매우 만족</span>
                  </div>
                </div>
              )}

              {/* SURVEY SINGLE / MULTIPLE */}
              {selected.kind === "SURVEY" && (selected.type === "SINGLE" || selected.type === "MULTIPLE") && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-2.5">
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">선지</p>
                  {(selected.options ?? []).map((opt, oi) => (
                    <div key={opt.id} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-4 h-4 border-2 border-slate-300 ${
                        selected.type === "SINGLE" ? "rounded-full" : "rounded"
                      }`} />
                      <input
                        className="flex-1 text-sm text-slate-700 bg-transparent border-b border-slate-200 focus:border-violet-400 focus:outline-none py-1 placeholder:text-slate-300"
                        placeholder={`선지 ${oi + 1}`}
                        value={opt.text}
                        onChange={(e) => updateOption(selected.id, opt.id, { text: e.target.value })}
                      />
                      <button
                        onClick={() => deleteOption(selected.id, opt.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(selected.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors mt-1 w-fit"
                  >
                    <Plus size={12} /> 선지 추가
                  </button>
                </div>
              )}

              {/* SURVEY TEXT */}
              {selected.kind === "SURVEY" && selected.type === "TEXT" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <p className="text-xs font-semibold text-slate-400 mb-3">응답 미리보기</p>
                  <div className="w-full h-24 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-300">
                    학습자가 자유롭게 텍스트를 입력하는 영역
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right — question settings */}
        <aside className="w-64 border-l border-slate-200 overflow-y-auto bg-white flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">문항 설정</p>
          </div>

          {selected ? (
            <div className="p-4 flex flex-col gap-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">문항 유형</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={selected.type}
                  onChange={(e) => changeType(selected.id, e.target.value as QuestionType | SurveyQuestionType)}
                >
                  {(Object.entries(typeLabels) as [string, string][]).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              {/* LIKERT scale */}
              {selected.kind === "SURVEY" && selected.type === "LIKERT" && (
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">척도</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={selected.scale ?? 5}
                    onChange={(e) => updateQ(selected.id, { scale: Number(e.target.value) })}
                  >
                    <option value={5}>5점 척도</option>
                    <option value={7}>7점 척도</option>
                  </select>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">태그</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                      #{tag}
                      <button onClick={() => removeTag(selected.id, tag)} className="hover:text-red-500 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-slate-300"
                    placeholder="태그 입력 후 Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { addTag(selected.id, tagInput); e.preventDefault(); }
                    }}
                  />
                  {tagSuggestions.length > 0 && (
                    <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      {tagSuggestions.map((t) => (
                        <button
                          key={t}
                          onMouseDown={(e) => { e.preventDefault(); addTag(selected.id, t); }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-violet-50 transition-colors"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteQuestion(selected.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} />
                문항 삭제
              </button>
            </div>
          ) : (
            <p className="px-4 py-8 text-xs text-center text-slate-300">문항을 선택하세요</p>
          )}
        </aside>

      </div>
    </div>
  );
}
