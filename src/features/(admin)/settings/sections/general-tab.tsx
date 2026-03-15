"use client";

import { useState } from "react";
import { orgSettings } from "../mockData";

export default function GeneralTab() {
  const [name, setName] = useState(orgSettings.name);
  const [description, setDescription] = useState(orgSettings.description);
  const [contactEmail, setContactEmail] = useState(orgSettings.contactEmail);
  const [language, setLanguage] = useState(orgSettings.language);

  return (
    <div className="max-w-lg flex flex-col gap-5">
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">조직명</label>
        <input
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">설명</label>
        <textarea
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">연락처 이메일</label>
        <input
          type="email"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">언어</label>
        <select
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </div>
      <div className="pt-2">
        <button className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}
