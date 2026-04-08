"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { automationRules, automationTriggerDefs, messageTemplates, type MessageEventRule, type AutomationTrigger, type MessageChannel } from "../mockData";

interface Props {
  channel: MessageChannel;
  initialRule?: MessageEventRule;
  onClose: () => void;
}

const CHANNEL_BADGE: Record<MessageChannel, { label: string; className: string }> = {
  SMS:   { label: "SMS",    className: "bg-blue-100 text-blue-700" },
  EMAIL: { label: "이메일", className: "bg-violet-100 text-violet-700" },
  KAKAO: { label: "알림톡", className: "bg-amber-100 text-amber-700" },
};

export default function MessageEventRuleModal({ channel, initialRule, onClose }: Props) {
  const isCreate = !initialRule;
  const [templateId, setTemplateId] = useState(initialRule?.templateId ?? "" as string);
  const [selectedTrigger, setSelectedTrigger] = useState<AutomationTrigger | "">(
    initialRule?.trigger ?? ""
  );

  const availableTemplates = messageTemplates.filter((t) => t.channel === channel);
  const selectedTemplate = availableTemplates.find((t) => t.id === templateId);

  // triggers already used by this channel (disabled in create mode)
  const usedTriggers = new Set(
    automationRules.filter((r) => r.channel === channel).map((r) => r.trigger)
  );

  const triggerDef = isCreate ? automationTriggerDefs : [];

  const saveDisabled = isCreate
    ? !selectedTrigger || !templateId
    : !templateId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-800">
              {isCreate ? "자동화 규칙 추가" : "자동화 규칙 설정"}
            </h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CHANNEL_BADGE[channel].className}`}>
              {CHANNEL_BADGE[channel].label}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        {/* 트리거 블록 */}
        {isCreate ? (
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-600 mb-1 block">트리거 이벤트</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={selectedTrigger}
              onChange={(e) => setSelectedTrigger(e.target.value as AutomationTrigger)}
            >
              <option value="">트리거 선택</option>
              {triggerDef.map((def) => (
                <option key={def.trigger} value={def.trigger} disabled={usedTriggers.has(def.trigger)}>
                  {def.label}{usedTriggers.has(def.trigger) ? " (사용 중)" : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-slate-500 mb-0.5">트리거 이벤트</p>
            <p className="text-sm font-medium text-slate-700">{initialRule.triggerLabel ?? ""}</p>
            <p className="text-xs text-slate-400 mt-0.5">{initialRule.triggerDesc ?? ""}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* 템플릿 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">연결 템플릿</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              <option value="">템플릿 선택</option>
              {availableTemplates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* 선택된 템플릿 미리보기 */}
          {selectedTemplate && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 mb-1.5">템플릿 미리보기</p>
              {selectedTemplate.emailSubject && (
                <p className="text-xs font-medium text-slate-700 mb-1">{selectedTemplate.emailSubject}</p>
              )}
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedTemplate.content}
              </p>
              {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTemplate.variables.split(",").map((v) => (
                    <span key={v} className="text-xs bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      {`{{${v.trim()}}}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {availableTemplates.length === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              이 채널에 등록된 템플릿이 없습니다. 먼저 템플릿을 추가해 주세요.
            </p>
          )}
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
            disabled={saveDisabled}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
