"use client";

import { useState } from "react";
import { issuedCerts } from "../mockData";
import { Download } from "lucide-react";

export default function IssuedTable() {
  const [courseFilter, setCourseFilter] = useState("ALL");
  const courses = Array.from(new Set(issuedCerts.map((c) => c.course)));

  const filtered = issuedCerts.filter(
    (c) => courseFilter === "ALL" || c.course === courseFilter
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <select
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="ALL">전체 과정</option>
          {courses.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-slate-500">{filtered.length}건</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-100">
            <th className="text-left px-5 py-3 font-medium">수료증 번호</th>
            <th className="text-left px-4 py-3 font-medium">수령인</th>
            <th className="text-left px-4 py-3 font-medium">과정</th>
            <th className="text-left px-4 py-3 font-medium">발급일</th>
            <th className="text-left px-4 py-3 font-medium">다운로드</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.certNumber}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{c.recipient}</td>
              <td className="px-4 py-3 text-slate-600">{c.course}</td>
              <td className="px-4 py-3 text-slate-400">{c.issuedAt}</td>
              <td className="px-4 py-3">
                <button className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 transition-colors">
                  <Download size={13} />
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
