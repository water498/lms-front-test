"use client";

import { useState } from "react";
import { INITIAL_SETTINGS } from "../mockData";

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

const TIMEZONE_OPTIONS = [
  "Asia/Seoul",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "UTC",
  "America/New_York",
  "Europe/London",
];

export default function GeneralTab() {
  const init = INITIAL_SETTINGS.general;
  const [serviceName, setServiceName] = useState(init.serviceName);
  const [opsEmail, setOpsEmail] = useState(init.opsEmail);
  const [supportEmail, setSupportEmail] = useState(init.supportEmail);
  const [language, setLanguage] = useState(init.language);
  const [timezone, setTimezone] = useState(init.timezone);

  const handleSave = () => {
    alert(
      `일반 설정 저장\n서비스명: ${serviceName}\n운영 이메일: ${opsEmail}\n지원 이메일: ${supportEmail}\n언어: ${language}\n타임존: ${timezone}`,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">서비스명</label>
          <input
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">루트 도메인</label>
          <input
            readOnly
            className="border border-slate-100 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            value={init.rootDomain}
          />
          <p className="text-xs text-slate-400">플랫폼 루트 도메인은 변경 불가</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">운영 이메일</label>
          <input
            type="email"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={opsEmail}
            onChange={(e) => setOpsEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">지원 이메일</label>
          <input
            type="email"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">기본 언어</label>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">타임존</label>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          저장
        </button>
      </div>
    </div>
  );
}
