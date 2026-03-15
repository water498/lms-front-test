"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { messageTemplates, type AutomationRule, type MessageChannel } from "../mockData";

interface Props {
  rule: AutomationRule;
  onClose: () => void;
}

const CHANNELS: { id: MessageChannel; label: string }[] = [
  { id: "SMS",   label: "SMS" },
  { id: "EMAIL", label: "이메일" },
  { id: "KAKAO", label: "알림톡" },
];

export default function AutomationRuleModal({ rule, onClose }: Props) {
  const [channel, setChannel] = useState<MessageChannel>(rule.channel);
  const [templateId, setTemplateId] = useState(rule.templateId);

  const availableTemplates = messageTemplates.filter((t) => t.channel === channel);
  const selectedTemplate = messageTemplates.find((t) => t.id === templateId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-800">자동화 규칙 설정</h2>
            <p className="text-xs text-slate-400 mt-0.5">{rule.triggerLabel}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-slate-500 mb-0.5">트리거 이벤트</p>
          <p className="text-sm font-medium text-slate-700">{rule.triggerLabel}</p>
          <p className="text-xs text-slate-400 mt-0.5">{rule.triggerDesc}</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* 채널 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">발송 채널</label>
            <div className="flex gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setChannel(c.id); setTemplateId(""); }}
                  className={`flex-1 border rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    channel === c.id
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

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
              {selectedTemplate.subject && (
                <p className="text-xs font-medium text-slate-700 mb-1">{selectedTemplate.subject}</p>
              )}
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedTemplate.content}
              </p>
              {selectedTemplate.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTemplate.variables.map((v) => (
                    <span key={v} className="text-xs bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      {`{{${v}}}`}
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
            disabled={!templateId}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
