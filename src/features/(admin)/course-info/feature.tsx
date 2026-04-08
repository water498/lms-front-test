"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, AlertTriangle } from "lucide-react";
import {
  type Course,
  type CourseStatus,
  type CancellationPolicy,
  type CancellationRule,
  courses,
  instructors,
  DEFAULT_CANCELLATION_POLICY,
} from "../courses/mockData";
import { type CertConfig } from "../../../lib/models";
import { useCertStore } from "../certificates/store";
import RichEditor from "../shared/rich-editor";
import { type CoursePrerequisite, getPrerequisites } from "../course-layout/mockData";
import { useTaxonomyStore } from "../shared/taxonomy-store";

const STATUS_CONFIG: Record<CourseStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "게시됨",   className: "bg-emerald-100 text-emerald-700" },
  DRAFT:     { label: "임시저장", className: "bg-amber-100 text-amber-700" },
  ARCHIVED:  { label: "보관됨",   className: "bg-slate-100 text-slate-600" },
};

const allTags = [...new Set(courses.flatMap((c) => c.tags))];

export default function InfoTab({ course }: { course: Course }) {
  const { categories } = useTaxonomyStore();
  const categoryNames = categories.filter((c) => c.parentId === null).map((c) => c.name);
  const [title, setTitle] = useState(course.title);
  const [instructor, setInstructor] = useState(course.instructor);
  const [category, setCategory] = useState(course.category ?? categoryNames[0]);
  const [tags, setTags] = useState<string[]>(course.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [courseStatus, setCourseStatus] = useState<CourseStatus>(course.status as CourseStatus);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const badge = STATUS_CONFIG[courseStatus];

  const [description, setDescription] = useState(course.description ?? "");
  const [price, setPrice] = useState<string>(course.price !== undefined ? String(course.price) : "");
  const [defaultMinEnrollment, setDefaultMinEnrollment] = useState<string>(
    course.defaultMinLearners != null ? String(course.defaultMinLearners) : ""
  );
  const [policy, setPolicy] = useState<CancellationPolicy>(course.cancellationPolicy ?? DEFAULT_CANCELLATION_POLICY);
  const { templates } = useCertStore();
  const [certConfig, setCertConfig] = useState<CertConfig | null>(course.certConfig ?? null);
  const [prereqs, setPrereqs] = useState<CoursePrerequisite[]>(() => getPrerequisites(course.id));

  const otherCourses = courses.filter((c) => c.id !== course.id);

  function addPrereq() {
    const firstAvailable = otherCourses.find((c) => !prereqs.some((p) => p.prerequisiteCourseId === c.id));
    if (!firstAvailable) return;
    setPrereqs([...prereqs, { courseId: course.id, prerequisiteCourseId: firstAvailable.id, requiredCompletion: false }]);
  }

  function updatePrereqCourse(index: number, prerequisiteCourseId: string) {
    setPrereqs(prereqs.map((p, i) => i === index ? { ...p, prerequisiteCourseId } : p));
  }

  function updatePrereqRequired(index: number, requiredCompletion: boolean) {
    setPrereqs(prereqs.map((p, i) => i === index ? { ...p, requiredCompletion } : p));
  }

  function removePrereq(index: number) {
    setPrereqs(prereqs.filter((_, i) => i !== index));
  }

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

  function updateRule(index: number, field: keyof CancellationRule, value: number) {
    const newRules = policy.rules.map((r, i) => i === index ? { ...r, [field]: value } : r);
    setPolicy({ ...policy, rules: newRules });
  }

  function addRule() {
    setPolicy({ ...policy, rules: [...policy.rules, { id: `cr-${Date.now()}`, courseId: course.id, daysBeforeStart: 0, refundPct: 0 }] });
  }

  function removeRule(index: number) {
    setPolicy({ ...policy, rules: policy.rules.filter((_, i) => i !== index) });
  }

  function handleSave() {
    // 저장 시 daysBeforeStart 내림차순 정렬
    setPolicy((p) => ({ ...p, rules: [...p.rules].sort((a, b) => b.daysBeforeStart - a.daysBeforeStart) }));
  }

  return (
    <>
    <div className="max-w-2xl flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.className}`}>
          {badge.label}
        </span>
        {courseStatus === "DRAFT" && (
          <button
            onClick={() => setCourseStatus("PUBLISHED")}
            className="text-xs px-3 py-1 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            게시하기
          </button>
        )}
        {courseStatus === "PUBLISHED" && (
          <button
            onClick={() => setShowArchiveModal(true)}
            className="text-xs px-3 py-1 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            폐강 처리
          </button>
        )}
      </div>

      {/* Thumbnail placeholder */}
      <div className="w-full h-36 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
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
          {categoryNames.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">대표 강사</label>
        <select
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
        >
          {instructors.map((i) => <option key={i}>{i}</option>)}
        </select>
        <p className="text-xs text-slate-400 mt-1">실제 운영 강사는 차수별로 설정합니다.</p>
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

      {/* 과정 소개 */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">과정 소개</label>
        <RichEditor
          value={description}
          onChange={setDescription}
          placeholder="학습 목표, 대상 수강생, 주요 내용을 입력하세요"
        />
      </div>

      {/* 판매가 */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">판매가</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            className="w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <span className="text-sm text-slate-500">원</span>
          <span className="text-xs text-slate-400 ml-1">(빈 값 = 무료 과정)</span>
        </div>
      </div>

      {/* 최소 수강 인원 (기본값) */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">최소 수강 인원 (기본값)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            className="w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="미설정"
            value={defaultMinEnrollment}
            onChange={(e) => setDefaultMinEnrollment(e.target.value)}
          />
          <span className="text-sm text-slate-500">명</span>
          <span className="text-xs text-slate-400 ml-1">(빈 값 = 미설정)</span>
        </div>
      </div>

      {/* 선수과정 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-600">선수과정</label>
          <button
            type="button"
            onClick={addPrereq}
            disabled={prereqs.length >= otherCourses.length}
            className="text-xs text-violet-600 hover:text-violet-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Plus size={12} />
            선수과정 추가
          </button>
        </div>

        {prereqs.length === 0 ? (
          <p className="text-sm text-slate-400">선수 과정 없음</p>
        ) : (
          <div className="flex flex-col gap-2">
            {prereqs.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                <select
                  className="flex-1 border border-slate-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  value={p.prerequisiteCourseId}
                  onChange={(e) => updatePrereqCourse(i, e.target.value)}
                >
                  {otherCourses.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      disabled={prereqs.some((pr, pi) => pi !== i && pr.prerequisiteCourseId === c.id)}
                    >
                      {c.title}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={p.requiredCompletion}
                    onChange={(e) => updatePrereqRequired(i, e.target.checked)}
                    className="accent-violet-600"
                  />
                  수료 필수
                </label>
                <button
                  type="button"
                  onClick={() => removePrereq(i)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 수료증 설정 */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-2 block">수료증 설정</label>
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={certConfig !== null}
              onChange={(e) => {
                if (e.target.checked) {
                  const first = templates.find((t) => t.active);
                  setCertConfig({ templateId: first?.id ?? "", completionRate: 80, autoIssue: false });
                } else {
                  setCertConfig(null);
                }
              }}
              className="accent-violet-600"
            />
            <span className="text-sm text-slate-700 font-medium">수료증 발급 사용</span>
          </label>

          {certConfig !== null && (
            <div className="flex flex-col gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">템플릿</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  value={certConfig.templateId}
                  onChange={(e) => setCertConfig({ ...certConfig, templateId: e.target.value })}
                >
                  {templates.filter((t) => t.active).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500 whitespace-nowrap">이수율 기준</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={certConfig.completionRate}
                  onChange={(e) => setCertConfig({ ...certConfig, completionRate: Number(e.target.value) })}
                />
                <span className="text-sm text-slate-500">% 이상 달성 시</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certConfig.autoIssue}
                  onChange={(e) => setCertConfig({ ...certConfig, autoIssue: e.target.checked })}
                  className="accent-violet-600"
                />
                <span className="text-sm text-slate-700">조건 충족 시 자동 발급</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 취소·환불 규정 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-600">취소·환불 규정</label>
          <button
            type="button"
            onClick={() => setPolicy(DEFAULT_CANCELLATION_POLICY)}
            className="text-xs text-violet-600 hover:text-violet-800 transition-colors"
          >
            기본값으로 초기화
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">N일 이상 전 취소</th>
                <th className="px-4 py-2.5 text-left font-medium">환불율</th>
                <th className="px-4 py-2.5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policy.rules.map((rule, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        className="w-16 border border-slate-200 rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                        value={rule.daysBeforeStart}
                        onChange={(e) => updateRule(i, "daysBeforeStart", Number(e.target.value))}
                      />
                      <span className="text-slate-500 text-xs">일</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="w-16 border border-slate-200 rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                        value={rule.refundPct}
                        onChange={(e) => updateRule(i, "refundPct", Number(e.target.value))}
                      />
                      <span className="text-slate-500 text-xs">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRule(i)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={addRule}
              className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 transition-colors"
            >
              <Plus size={13} />
              규정 추가
            </button>
          </div>

          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.noRefundAfterStart}
                onChange={(e) => setPolicy({ ...policy, noRefundAfterStart: e.target.checked })}
                className="accent-violet-600"
              />
              <span className="text-xs text-slate-600">수강 시작 후 환불 없음</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <button
          onClick={handleSave}
          className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          저장
        </button>
      </div>
    </div>

    {showArchiveModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">과정을 폐강 처리하시겠습니까?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                폐강된 과정은 수강생에게 노출되지 않습니다.<br />
                ONGOING 상태의 차수가 있다면 먼저 종료해 주세요.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowArchiveModal(false)}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => { setCourseStatus("ARCHIVED"); setShowArchiveModal(false); }}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              폐강 처리
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
