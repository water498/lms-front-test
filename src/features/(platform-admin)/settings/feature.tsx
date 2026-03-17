"use client";

import { useState } from "react";
import GeneralTab from "./tabs/general-tab";
import PlansTab from "./tabs/plans-tab";
import SecurityTab from "./tabs/security-tab";
import NotificationsTab from "./tabs/notifications-tab";

const TABS = [
  { id: "general",       label: "일반" },
  { id: "plans",         label: "플랜 & 요금제" },
  { id: "security",      label: "보안" },
  { id: "notifications", label: "알림" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function PlatformSettingsFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {activeTab === "general"       && <GeneralTab />}
        {activeTab === "plans"         && <PlansTab />}
        {activeTab === "security"      && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>
    </div>
  );
}
