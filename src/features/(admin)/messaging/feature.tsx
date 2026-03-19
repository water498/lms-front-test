"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import HistoryTab from "./sections/history-tab";
import TemplatesTab from "./sections/templates-tab";
import AutomationTab from "./sections/automation-tab";
import ChannelSettingsTab from "./sections/channel-settings-tab";
import SendMessageModal from "./modals/send-message-modal";
import CreateTemplateModal from "./modals/create-template-modal";
import AutomationRuleModal from "./modals/automation-rule-modal";
import { channelCredits, type MessageChannel, type MessageTemplate, type AutomationRule } from "./mockData";

type SubTab = "history" | "templates" | "automation" | "settings";

const CHANNEL_TABS: { id: MessageChannel; label: string }[] = [
  { id: "SMS",   label: "SMS" },
  { id: "KAKAO", label: "알림톡" },
  { id: "EMAIL", label: "이메일" },
];

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "history",    label: "발송 이력" },
  { id: "templates",  label: "템플릿" },
  { id: "automation", label: "자동화" },
  { id: "settings",   label: "설정" },
];

const CHANNEL_CREDIT_STYLE: Record<MessageChannel, { bg: string; text: string; badge: string }> = {
  SMS:   { bg: "bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700" },
  KAKAO: { bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700" },
  EMAIL: { bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
};

const CHANNEL_LABEL: Record<MessageChannel, string> = {
  SMS: "SMS", KAKAO: "알림톡", EMAIL: "이메일",
};

type Modal = "send" | "createTemplate" | null;

function CreditBar({ channel }: { channel: MessageChannel }) {
  const credit = channelCredits[channel];
  const style = CHANNEL_CREDIT_STYLE[channel];
  const low = credit.balance < credit.costPerMessage * 100;
  return (
    <div className="max-w-xs">
      <div className={`${style.bg} rounded-xl p-4 flex flex-col gap-1.5`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {CHANNEL_LABEL[channel]}
          </span>
          {low && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertTriangle size={11} /> 잔액 부족
            </span>
          )}
        </div>
        <p className={`text-lg font-bold tabular-nums ${style.text}`}>
          {credit.balance.toLocaleString()}원
        </p>
        <p className="text-xs text-slate-500">건당 {credit.costPerMessage}원</p>
      </div>
    </div>
  );
}

export default function MessagingFeature({ channel }: { channel: MessageChannel }) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("history");
  const [modal, setModal] = useState<Modal>(null);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [addingRule, setAddingRule] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* 크레딧 잔액 바 */}
        <CreditBar channel={channel} />

        {/* 서브탭 */}
        <div className="flex flex-col gap-0">
          <div className="flex gap-0.5">
            {SUB_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeSubTab === tab.id
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 서브탭 콘텐츠 */}
        {activeSubTab === "history"    && <HistoryTab    channel={channel} onSendClick={() => setModal("send")} />}
        {activeSubTab === "templates"  && <TemplatesTab  channel={channel} onCreateClick={() => setModal("createTemplate")} onEditClick={(t) => setEditingTemplate(t)} />}
        {activeSubTab === "automation" && <AutomationTab channel={channel} onEditRule={(rule) => setEditingRule(rule)} onAddRule={() => setAddingRule(true)} />}
        {activeSubTab === "settings"   && <ChannelSettingsTab channel={channel} />}
      </div>

      {modal === "send" && <SendMessageModal channel={channel} onClose={() => setModal(null)} />}
      {(modal === "createTemplate" || editingTemplate !== null) && (
        <CreateTemplateModal
          channel={channel}
          initialTemplate={editingTemplate ?? undefined}
          onClose={() => { setModal(null); setEditingTemplate(null); }}
        />
      )}
      {(addingRule || editingRule) && (
        <AutomationRuleModal
          channel={channel}
          initialRule={editingRule ?? undefined}
          onClose={() => { setEditingRule(null); setAddingRule(false); }}
        />
      )}
    </>
  );
}
