"use client";

import { useState } from "react";
import { Award, Settings, Link as LinkIcon, CheckCircle2, Info, ExternalLink } from "lucide-react";
import { certTemplates } from "../certificates/mockData";

// 조직의 수료증 템플릿 (active만 선택 가능, inactive는 비활성 표시)
const TEMPLATES = certTemplates.map((t) => ({
  id: t.id,
  name: t.name,
  active: t.active,
  hasExpiry: t.validityYears !== null,
  validityYears: t.validityYears,
}));

export default function CourseCertificateFeature() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [completionThreshold, setCompletionThreshold] = useState(80);
  const [attendanceThreshold, setAttendanceThreshold] = useState<number | null>(null);
  const [autoIssue, setAutoIssue] = useState(true);

  // 진행 중 차수가 있는지 (mock)
  const hasOngoingSessions = false;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* 안내 배너 */}
      {hasOngoingSessions && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            진행 중인 차수가 있습니다. 여기서 변경한 설정은 <strong>새로 열리는 차수부터</strong> 적용됩니다.
            진행 중 차수의 수료 기준은 차수 상세에서 별도로 관리합니다.
          </p>
        </div>
      )}

      {/* 수료증 템플릿 연결 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-violet-600" />
            <h2 className="text-base font-semibold text-slate-900">수료증 템플릿</h2>
          </div>
          <a
            href="/backoffice/org/certificates"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 transition-colors"
          >
            템플릿 관리
            <ExternalLink size={10} />
          </a>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          수료 시 발급할 수료증을 선택합니다. 선택하지 않으면 수료증이 발급되지 않습니다.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 미사용 옵션 */}
          <button
            onClick={() => setSelectedTemplate(null)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              selectedTemplate === null
                ? "border-slate-400 bg-slate-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="text-2xl text-slate-300">—</span>
            <span className="text-xs font-medium text-slate-500">미사용</span>
            {selectedTemplate === null && (
              <CheckCircle2 size={14} className="absolute top-2 left-2 text-slate-500" />
            )}
          </button>

          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => tpl.active && setSelectedTemplate(tpl.id)}
              disabled={!tpl.active}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                !tpl.active
                  ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                  : selectedTemplate === tpl.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-2xl">{tpl.id === "t1" ? "📜" : tpl.id === "t2" ? "🏆" : "📋"}</span>
              <span className="text-xs font-medium text-slate-700">{tpl.name}</span>
              {tpl.hasExpiry && (
                <span className="text-[10px] text-slate-400">유효 {tpl.validityYears}년</span>
              )}
              {!tpl.active && (
                <span className="absolute top-2 right-2 text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                  비활성
                </span>
              )}
              {selectedTemplate === tpl.id && tpl.active && (
                <CheckCircle2 size={14} className="absolute top-2 left-2 text-violet-600" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 수료 기준 */}
      {selectedTemplate && (
        <>
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-violet-600" />
              <h2 className="text-base font-semibold text-slate-900">수료 기준</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              과정의 기본 수료 기준입니다. 차수 생성 시 이 값이 기본값으로 적용되며, 차수별로 개별 조정 가능합니다.
            </p>

            <div className="flex flex-col gap-4">
              {/* 진도율 (필수) */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-violet-200 bg-violet-50/50">
                <div>
                  <p className="text-sm font-medium text-slate-900">학습 진도율</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    전체 활동(영상, 시험, 과제, 설문 등) 완료 비율. 시험 통과, 과제 제출도 진도에 포함됩니다.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={completionThreshold}
                    onChange={(e) => setCompletionThreshold(Number(e.target.value))}
                    className="w-16 text-center text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <span className="text-sm text-slate-500">% 이상</span>
                </div>
              </div>

              {/* 출석률 (선택 — 오프라인/블렌디드 전용) */}
              <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                attendanceThreshold !== null ? "border-violet-200 bg-violet-50/50" : "border-slate-200"
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAttendanceThreshold(attendanceThreshold !== null ? null : 75)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                      attendanceThreshold !== null
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {attendanceThreshold !== null && <CheckCircle2 size={12} />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${attendanceThreshold !== null ? "text-slate-900" : "text-slate-400"}`}>
                      오프라인 출석률
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      오프라인/블렌디드 과정에서만 적용. 온라인 과정에서는 무시됩니다.
                    </p>
                  </div>
                </div>
                {attendanceThreshold !== null && (
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={attendanceThreshold}
                      onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                      className="w-16 text-center text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <span className="text-sm text-slate-500">% 이상</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 발급 설정 */}
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
        </>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button className="px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
