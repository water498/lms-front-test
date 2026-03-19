"use client";

import { useState } from "react";
import { legalSettings } from "../../settings/mockData";

type Tab = "terms" | "privacy";

export default function PortalLegalFeature() {
  const [activeTab, setActiveTab] = useState<Tab>("terms");
  const [termsContent, setTermsContent] = useState(legalSettings.termsContent);
  const [privacyContent, setPrivacyContent] = useState(legalSettings.privacyContent);
  const [termsUpdatedAt, setTermsUpdatedAt] = useState(legalSettings.termsUpdatedAt);
  const [privacyUpdatedAt, setPrivacyUpdatedAt] = useState(legalSettings.privacyUpdatedAt);

  const isTerms = activeTab === "terms";
  const content = isTerms ? termsContent : privacyContent;
  const setContent = isTerms ? setTermsContent : setPrivacyContent;
  const updatedAt = isTerms ? termsUpdatedAt : privacyUpdatedAt;
  const setUpdatedAt = isTerms ? setTermsUpdatedAt : setPrivacyUpdatedAt;

  const handleSave = () => {
    alert(`${isTerms ? "이용약관" : "개인정보처리방침"} 저장 (실험 환경)\n시행일: ${updatedAt}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 mb-0.5">약관 · 개인정보</h2>
        <p className="text-xs text-slate-400">포털에 게시되는 이용약관과 개인정보처리방침을 관리합니다.</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {(["terms", "privacy"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === t
                ? "bg-white shadow-sm text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "terms" ? "이용약관" : "개인정보처리방침"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {/* 시행일 */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600 w-16 flex-shrink-0">시행일</label>
          <input
            type="date"
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={updatedAt}
            onChange={(e) => setUpdatedAt(e.target.value)}
          />
          <span className="text-xs text-slate-400">변경 시 학습자에게 동의 재요청이 발송됩니다.</span>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">내용</label>
          <textarea
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none leading-relaxed"
            rows={18}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-slate-400">마크다운 문법을 지원합니다.</p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
