"use client";

import { useState } from "react";
import HistoryTab from "./sections/history-tab";
import TemplatesTab from "./sections/templates-tab";
import AutomationTab from "./sections/automation-tab";
import ChannelSettingsTab from "./sections/channel-settings-tab";
import SendMessageModal from "./modals/send-message-modal";
import CreateTemplateModal from "./modals/create-template-modal";
import AutomationRuleModal from "./modals/automation-rule-modal";
import type { AutomationRule } from "./mockData";

type Tab = "history" | "templates" | "automation" | "channels";

const TABS: { id: Tab; label: string }[] = [
  { id: "history",    label: "발송 이력" },
  { id: "templates",  label: "템플릿" },
  { id: "automation", label: "자동화" },
  { id: "channels",   label: "채널 설정" },
];

type Modal = "send" | "createTemplate" | null;

export default function MessagingFeature() {
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const [modal, setModal] = useState<Modal>(null);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex gap-1 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "history"    && <HistoryTab onSendClick={() => setModal("send")} />}
        {activeTab === "templates"  && <TemplatesTab onCreateClick={() => setModal("createTemplate")} />}
        {activeTab === "automation" && <AutomationTab onEditRule={(rule) => setEditingRule(rule)} />}
        {activeTab === "channels"   && <ChannelSettingsTab />}
      </div>

      {modal === "send"           && <SendMessageModal onClose={() => setModal(null)} />}
      {modal === "createTemplate" && <CreateTemplateModal onClose={() => setModal(null)} />}
      {editingRule && (
        <AutomationRuleModal rule={editingRule} onClose={() => setEditingRule(null)} />
      )}
    </>
  );
}
