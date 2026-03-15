"use client";

import { useState } from "react";
import GeneralTab from "./sections/general-tab";
import BrandingTab from "./sections/branding-tab";
import MembersTab from "./sections/members-tab";

const TABS = [
  { id: "general",  label: "일반" },
  { id: "branding", label: "브랜딩" },
  { id: "members",  label: "관리자" },
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
        {activeTab === "general"  && <GeneralTab />}
        {activeTab === "branding" && <BrandingTab />}
        {activeTab === "members"  && <MembersTab />}
      </div>
    </div>
  );
}
