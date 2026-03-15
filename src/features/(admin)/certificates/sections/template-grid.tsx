"use client";

import { certTemplates } from "../mockData";
import { Award } from "lucide-react";

export default function TemplateGrid() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          + 새 템플릿
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {certTemplates.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
            {/* Thumbnail placeholder */}
            <div className="w-full h-28 bg-gradient-to-br from-violet-50 to-slate-100 rounded-lg flex items-center justify-center">
              <Award size={32} className="text-violet-300" />
            </div>
            <div>
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-800 text-sm">{t.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${t.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {t.active ? "활성" : "비활성"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">연결 코스 {t.linkedCourses}개</p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 flex flex-col gap-1">
              <span>완료율 {t.completionRate}% 이상</span>
              {t.requireExam && <span>시험 통과 필수</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
