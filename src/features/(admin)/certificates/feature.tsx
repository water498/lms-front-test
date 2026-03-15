"use client";

import { useState } from "react";
import TemplateGrid from "./sections/template-grid";
import IssuedTable from "./sections/issued-table";

const TABS = [
  { id: "templates", label: "템플릿" },
  { id: "issued",    label: "발급 내역" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CertificatesFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("templates");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1 border-b border-slate-200">
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
      {activeTab === "templates" && <TemplateGrid />}
      {activeTab === "issued"    && <IssuedTable />}
    </div>
  );
}
