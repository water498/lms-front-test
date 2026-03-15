"use client";

import { useState } from "react";
import ExamTable from "./sections/exam-table";
import AssignmentTable from "./sections/assignment-table";
import SurveyTable from "./sections/survey-table";

const TABS = [
  { id: "exam",       label: "시험" },
  { id: "assignment", label: "과제" },
  { id: "survey",     label: "설문" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AssessmentsFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("exam");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1 border-b border-slate-200">
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
      {activeTab === "exam"       && <ExamTable />}
      {activeTab === "assignment" && <AssignmentTable />}
      {activeTab === "survey"     && <SurveyTable />}
    </div>
  );
}
