"use client";

import { useState } from "react";
import QuizTable from "./sections/quiz-table";
import SurveyTable from "./sections/survey-table";

const TABS = [
  { id: "quiz",   label: "퀴즈 · 시험" },
  { id: "survey", label: "설문" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AssessmentsFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("quiz");

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
      {activeTab === "quiz"   && <QuizTable />}
      {activeTab === "survey" && <SurveyTable />}
    </div>
  );
}
