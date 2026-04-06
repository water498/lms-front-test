"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import {
  type SurveyTemplate,
  type SurveyTriggerType,
  type AssessmentSection,
  surveyTemplates,
  allQuestions,
  questionGroups,
} from "../mockData";

function makeId() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function newSection(): AssessmentSection {
  return { id: makeId(), templateId: "", templateKind: "SURVEY", label: "", groupId: "", count: 3, shuffle: false, order: 0 };
}

function defaultSurvey(): Omit<SurveyTemplate, "id" | "responseCount" | "status" | "createdAt"> {
  return { title: "", anonymous: true, triggerType: "MANUAL", rules: [] };
}

const TRIGGER_LABELS: Record<SurveyTriggerType, string> = {
  MANUAL:          "수동",
  COURSE_COMPLETE: "과정 완료 시 자동",
};

const TYPE_LABELS: Record<string, string> = {
  LIKERT: "리커트", SINGLE: "단일 선택", MULTIPLE: "복수 선택", TEXT: "자유 서술",
};

// SURVEY 그룹만 필터
const surveyGroups = questionGroups.filter((g) => g.kind === "SURVEY" && !g.isArchived);
const groupMap = Object.fromEntries(surveyGroups.map((g) => [g.id, g]));

interface Props { surveyId: string }

export default function SurveyEditorFeature({ surveyId }: Props) {
  const found = surveyId === "new" ? null : surveyTemplates.find((s) => s.id === surveyId);
  const src = found ?? defaultSurvey();

  const [title, setTitle]         = useState(src.title);
  const [anonymous, setAnonymous] = useState(src.anonymous);
  const [triggerType, setTrigger] = useState<SurveyTriggerType>(src.triggerType);
  const [sections, setSections]   = useState<AssessmentSection[]>(src.rules);
  const [selectedId, setSelectedId] = useState<string | null>(src.rules[0]?.id ?? null);

  const selected      = sections.find((s) => s.id === selectedId) ?? null;
  const totalQ        = sections.reduce((sum, s) => sum + s.count, 0);
  const selectedGroup = selected?.groupId ? groupMap[selected.groupId] : undefined;

  const groupQuestions = selected?.groupId
    ? allQuestions.filter((q) => q.kind === "SURVEY" && q.groupId === selected.groupId)
    : [];

  const matchingQuestions = selected?.typeFilter
    ? groupQuestions.filter((q) => q.type === selected.typeFilter)
    : groupQuestions;

  const typeCounts = groupQuestions.reduce<Record<string, number>>((acc, q) => {
    acc[q.type] = (acc[q.type] ?? 0) + 1;
    return acc;
  }, {});

  const SURVEY_TYPE_LABELS: Record<string, string> = {
    LIKERT: "리커트 척도", SINGLE: "객관식(단일)", MULTIPLE: "객관식(복수)", TEXT: "자유 서술",
  };

  const countExceedsPool =
    selected !== null &&
    matchingQuestions.length > 0 &&
    selected.count > matchingQuestions.length;

  const canSave = !countExceedsPool;

  function updateSection(id: string, patch: Partial<AssessmentSection>) {
    setSections((ss) => ss.map((s) => s.id === id ? { ...s, ...patch } : s));
  }

  function addSection() {
    const s = newSection();
    setSections((ss) => [...ss, s]);
    setSelectedId(s.id);
  }

  function deleteSection(id: string) {
    setSections((ss) => {
      const next = ss.filter((s) => s.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  function moveSection(id: string, dir: -1 | 1) {
    setSections((ss) => {
      const idx = ss.findIndex((s) => s.id === id);
      const target = idx + dir;
      if (target < 0 || target >= ss.length) return ss;
      const next = [...ss];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">

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
          placeholder="설문 제목"
        />
        <span className="ml-auto text-xs text-slate-400">총 {totalQ}문항 예상</span>
        <button
          disabled={!canSave}
          className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          저장
        </button>
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left — section list */}
        <aside className="w-60 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">섹션 목록</p>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {sections.length === 0 && (
              <p className="px-4 py-8 text-xs text-center text-slate-300">섹션이 없습니다</p>
            )}
            {sections.map((s, idx) => {
              const group = s.groupId ? groupMap[s.groupId] : undefined;
              const isActive = selectedId === s.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-start gap-1 pr-2 transition-colors ${
                    isActive ? "bg-violet-50" : "hover:bg-slate-50"
                  }`}
                >
                  {/* Order buttons */}
                  <div className="flex flex-col pt-2 pl-1 gap-0">
                    <button
                      onClick={() => moveSection(s.id, -1)}
                      disabled={idx === 0}
                      className="p-0.5 text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => moveSection(s.id, 1)}
                      disabled={idx === sections.length - 1}
                      className="p-0.5 text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedId(s.id)}
                    className="flex-1 text-left px-2 py-2.5 flex items-start gap-2"
                  >
                    <span className={`text-xs font-bold mt-0.5 w-4 flex-shrink-0 ${
                      isActive ? "text-violet-500" : "text-slate-300"
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${
                        isActive ? "text-violet-700" : "text-slate-700"
                      }`}>
                        {s.label || "(이름 없음)"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {group ? `${group.title} · ${s.count}문항` : `${s.count}문항`}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-100">
            <button
              onClick={addSection}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-violet-600 border border-dashed border-violet-300 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <Plus size={13} />
              섹션 추가
            </button>
          </div>
        </aside>

        {/* Center — section editor */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-10">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl mb-1">📋</div>
              <p className="text-sm text-slate-500">왼쪽에서 섹션을 선택하거나 추가하세요</p>
              <button
                onClick={addSection}
                className="mt-1 px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                + 첫 번째 섹션 추가
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto flex flex-col gap-4">

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
                {/* Section label */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">섹션 이름</label>
                  <input
                    className="w-full text-sm text-slate-800 bg-transparent border-b border-slate-200 focus:border-violet-400 focus:outline-none pb-1 placeholder:text-slate-300"
                    placeholder="예: 만족도 리커트 섹션"
                    value={selected.label}
                    onChange={(e) => updateSection(selected.id, { label: e.target.value })}
                  />
                </div>

                {/* Group selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">문항 그룹</label>
                  <select
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    value={selected.groupId}
                    onChange={(e) => updateSection(selected.id, { groupId: e.target.value })}
                  >
                    <option value="">— 그룹 선택 —</option>
                    {surveyGroups.map((g) => {
                      const cnt = allQuestions.filter((q) => q.groupId === g.id).length;
                      return (
                        <option key={g.id} value={g.id}>
                          {g.title} ({cnt}문항)
                        </option>
                      );
                    })}
                  </select>
                  {selectedGroup && (
                    <div className="mt-1.5">
                      <p className="text-[11px] text-slate-400">
                        {Object.entries(typeCounts).map(([t, c]) => `${SURVEY_TYPE_LABELS[t] ?? t} ${c}`).join(" · ")} · 총 {groupQuestions.length}문항
                      </p>
                    </div>
                  )}
                </div>

                {/* Type filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">유형 필터 (선택)</label>
                  <select
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    value={selected.typeFilter ?? ""}
                    onChange={(e) => updateSection(selected.id, { typeFilter: (e.target.value || undefined) as AssessmentSection["typeFilter"] })}
                  >
                    <option value="">전체 유형 ({groupQuestions.length}문항)</option>
                    {Object.entries(SURVEY_TYPE_LABELS).map(([val, label]) => {
                      const cnt = typeCounts[val] ?? 0;
                      return (
                        <option key={val} value={val} disabled={cnt === 0}>
                          {label} ({cnt}문항)
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    필터 적용 시 <span className="font-medium text-violet-600">{matchingQuestions.length}문항</span> 대상으로 출제
                  </p>
                </div>

                {/* Count & shuffle */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-400 block mb-2">출제 수</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={matchingQuestions.length || undefined}
                        className={`w-20 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                          countExceedsPool
                            ? "border-red-300 focus:ring-red-300"
                            : "border-slate-200 focus:ring-violet-300"
                        }`}
                        value={selected.count}
                        onChange={(e) => updateSection(selected.id, { count: Math.max(1, Number(e.target.value)) })}
                      />
                      <span className="text-sm text-slate-500">문항</span>
                    </div>
                    {countExceedsPool && (
                      <p className="text-[11px] text-red-500 mt-1">
                        그룹 보유 문항({matchingQuestions.length})을 초과합니다 — 저장 불가
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-400 block mb-2">셔플</label>
                    <button
                      onClick={() => updateSection(selected.id, { shuffle: !selected.shuffle })}
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
                  그룹 내 문항 미리보기 — {matchingQuestions.length}개
                </p>
                {matchingQuestions.length === 0 ? (
                  <p className="text-xs text-slate-300 text-center py-4">
                    {!selected.groupId ? "문항 그룹을 선택하면 소속 문항이 표시됩니다" : "해당 그룹에 문항이 없습니다"}
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

          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">설문 설정</p>
          </div>
          <div className="p-4 flex flex-col gap-4 border-b border-slate-100">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">트리거</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={triggerType}
                onChange={(e) => setTrigger(e.target.value as SurveyTriggerType)}
              >
                {(Object.entries(TRIGGER_LABELS) as [SurveyTriggerType, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">익명 응답</span>
              <button
                onClick={() => setAnonymous((a) => !a)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  anonymous ? "bg-violet-600" : "bg-slate-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  anonymous ? "translate-x-4" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>

          {selected && (
            <>
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">섹션 설정</p>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">출제 수</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={selected.count}
                    onChange={(e) => updateSection(selected.id, { count: Math.max(1, Number(e.target.value)) })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">셔플</span>
                  <button
                    onClick={() => updateSection(selected.id, { shuffle: !selected.shuffle })}
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
                  onClick={() => deleteSection(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                  섹션 삭제
                </button>
              </div>
            </>
          )}
        </aside>

      </div>
    </div>
  );
}
