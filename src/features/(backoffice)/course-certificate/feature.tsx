"use client";

import { useState } from "react";
import { Award, Link as LinkIcon, Settings, CheckCircle2 } from "lucide-react";

/* ── Mock data ── */
const TEMPLATES = [
  { id: "tpl1", name: "기본 수료증", thumbnail: "📜", isDefault: true },
  { id: "tpl2", name: "우수 수료증 (골드)", thumbnail: "🏆", isDefault: false },
  { id: "tpl3", name: "참여 확인서", thumbnail: "📋", isDefault: false },
];

type CriteriaType = "PROGRESS" | "EXAM_SCORE" | "ATTENDANCE" | "ASSIGNMENT";

interface CompletionCriteria {
  type: CriteriaType;
  label: string;
  enabled: boolean;
  threshold: number;
}

const INITIAL_CRITERIA: CompletionCriteria[] = [
  { type: "PROGRESS", label: "학습 진도율", enabled: true, threshold: 80 },
  { type: "EXAM_SCORE", label: "시험 점수", enabled: false, threshold: 60 },
  { type: "ATTENDANCE", label: "출석률", enabled: false, threshold: 80 },
  { type: "ASSIGNMENT", label: "과제 제출", enabled: false, threshold: 100 },
];

export default function CourseCertificateFeature() {
  const [selectedTemplate, setSelectedTemplate] = useState("tpl1");
  const [autoIssue, setAutoIssue] = useState(true);
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);

  const toggleCriteria = (type: CriteriaType) => {
    setCriteria((prev) =>
      prev.map((c) => (c.type === type ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const updateThreshold = (type: CriteriaType, value: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.type === type ? { ...c, threshold: value } : c))
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* 수료증 템플릿 연결 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} className="text-violet-600" />
          <h2 className="text-base font-semibold text-slate-900">수료증 템플릿</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          이 과정의 수료 시 발급할 수료증 템플릿을 선택합니다. 템플릿은 조직 &gt; 수료증 관리에서 생성할 수 있습니다.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                selectedTemplate === tpl.id
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-3xl">{tpl.thumbnail}</span>
              <span className="text-sm font-medium text-slate-700">{tpl.name}</span>
              {tpl.isDefault && (
                <span className="absolute top-2 right-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  기본
                </span>
              )}
              {selectedTemplate === tpl.id && (
                <CheckCircle2 size={16} className="absolute top-2 left-2 text-violet-600" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 수료 기준 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-violet-600" />
          <h2 className="text-base font-semibold text-slate-900">수료 기준</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          활성화된 기준을 모두 충족해야 수료로 인정됩니다.
        </p>
        <div className="flex flex-col gap-3">
          {criteria.map((c) => (
            <div
              key={c.type}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                c.enabled ? "border-violet-200 bg-violet-50/50" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCriteria(c.type)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    c.enabled
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {c.enabled && <CheckCircle2 size={12} />}
                </button>
                <span className={`text-sm font-medium ${c.enabled ? "text-slate-900" : "text-slate-400"}`}>
                  {c.label}
                </span>
              </div>
              {c.enabled && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={c.threshold}
                    onChange={(e) => updateThreshold(c.type, Number(e.target.value))}
                    className="w-16 text-center text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <span className="text-sm text-slate-500">% 이상</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 자동 발급 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon size={18} className="text-violet-600" />
          <h2 className="text-base font-semibold text-slate-900">발급 설정</h2>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            onClick={() => setAutoIssue(!autoIssue)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              autoIssue ? "bg-violet-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                autoIssue ? "translate-x-5" : ""
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-medium text-slate-900">수료 기준 충족 시 자동 발급</p>
            <p className="text-xs text-slate-500">비활성화 시 관리자가 수동으로 발급해야 합니다.</p>
          </div>
        </label>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button className="px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
