"use client";

import { useState } from "react";
import GeneralTab from "./sections/general-tab";
import OrgStructureTab from "./sections/org-structure-tab";
import AuditLogTab from "./sections/audit-log-tab";

const TABS = [
  { id: "general", label: "일반" },
  { id: "org",     label: "조직 구조" },
  { id: "audit",   label: "감사로그" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {activeTab === "general" && <GeneralTab />}
        {activeTab === "org"     && <OrgStructureTab />}
        {activeTab === "audit"   && <AuditLogTab />}
      </div>
    </div>
  );
}
