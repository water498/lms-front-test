"use client";

import { useState } from "react";
import { Plus, Settings, Trash2 } from "lucide-react";
import { automationRules, messageTemplates, type MessageEventRule, type MessageChannel } from "../mockData";

const CHANNEL_BADGE: Record<MessageChannel, { label: string; className: string }> = {
  SMS:   { label: "SMS",    className: "bg-blue-100 text-blue-700" },
  EMAIL: { label: "이메일", className: "bg-violet-100 text-violet-700" },
  KAKAO: { label: "알림톡", className: "bg-amber-100 text-amber-700" },
};

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
        active ? "bg-violet-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
          active ? "left-5.5 translate-x-0.5" : "left-0.5"
        }`}
        style={{ left: active ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}

interface Props {
  channel: MessageChannel;
  onEditRule: (rule: MessageEventRule) => void;
  onAddRule: () => void;
}

export default function AutomationTab({ channel, onEditRule, onAddRule }: Props) {
  const [rules, setRules] = useState(automationRules);

  const toggleRule = (id: string, value: boolean) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: value } : r)));
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const getTemplateName = (templateId: string) =>
    messageTemplates.find((t) => t.id === templateId)?.name ?? "—";

  const channelRules = rules.filter((r) => r.channel === channel);
  const activeCount = channelRules.filter((r) => r.active).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-violet-800">자동화 규칙</p>
          <p className="text-xs text-violet-600 mt-0.5">이벤트 발생 시 자동으로 메시지를 발송합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-violet-700">
            {activeCount} / {channelRules.length} 활성
          </span>
          <button
            onClick={onAddRule}
            className="flex items-center gap-1 text-xs text-white bg-violet-600 hover:bg-violet-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={12} /> 규칙 추가
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">트리거 이벤트</th>
              <th className="text-left px-4 py-3 font-medium">채널</th>
              <th className="text-left px-4 py-3 font-medium">연결 템플릿</th>
              <th className="text-left px-4 py-3 font-medium">활성</th>
              <th className="text-left px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {channelRules.map((rule) => {
              const ch = CHANNEL_BADGE[rule.channel];
              return (
                <tr
                  key={rule.id}
                  className={`border-b border-slate-50 last:border-0 transition-colors ${
                    rule.active ? "hover:bg-slate-50/50" : "opacity-50 hover:bg-slate-50/30"
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800">{rule.triggerLabel ?? ""}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{rule.triggerDesc ?? ""}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ch.className}`}>
                      {ch.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">
                    {getTemplateName(rule.templateId ?? "")}
                  </td>
                  <td className="px-4 py-3.5">
                    <Toggle active={rule.active} onChange={(v) => toggleRule(rule.id, v)} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditRule(rule)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                      >
                        <Settings size={12} /> 설정
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {channelRules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                  이 채널에 등록된 자동화 규칙이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
