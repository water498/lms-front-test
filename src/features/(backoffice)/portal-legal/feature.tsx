"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { LegalDocument, LegalDocumentType } from "@/lib/models";
import { legalDocuments } from "./mockData";

type FilterTab = "ALL" | LegalDocumentType;

const TYPE_LABEL: Record<LegalDocumentType, string> = {
  TERMS: "이용약관",
  PRIVACY: "개인정보",
  MARKETING_EMAIL: "마케팅(이메일)",
  MARKETING_SMS: "마케팅(SMS)",
};

const TYPE_COLOR: Record<LegalDocumentType, string> = {
  TERMS: "bg-blue-100 text-blue-700",
  PRIVACY: "bg-violet-100 text-violet-700",
  MARKETING_EMAIL: "bg-amber-100 text-amber-700",
  MARKETING_SMS: "bg-green-100 text-green-700",
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "TERMS", label: "이용약관" },
  { key: "PRIVACY", label: "개인정보" },
  { key: "MARKETING_EMAIL", label: "마케팅(이메일)" },
  { key: "MARKETING_SMS", label: "마케팅(SMS)" },
];

/* ── Create Modal ──────────────────────────────────── */
function CreateModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<LegalDocumentType>("TERMS");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">새 문서</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">문서 유형</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as LegalDocumentType)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {(Object.keys(TYPE_LABEL) as LegalDocumentType[]).map((t) => (
                <option key={t} value={t}>{TYPE_LABEL[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">시행일</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">내용</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none leading-relaxed"
              rows={10}
              placeholder="HTML 또는 마크다운 문법을 사용할 수 있습니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              alert(`문서 생성 (시뮬레이션)\n유형: ${TYPE_LABEL[type]}\n시행일: ${effectiveDate}`);
              onClose();
            }}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Modal ──────────────────────────────────── */
function DetailModal({ doc, onClose }: { doc: LegalDocument; onClose: () => void }) {
  const [content, setContent] = useState(doc.content);
  const [effectiveDate, setEffectiveDate] = useState(doc.effectiveDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-800">{TYPE_LABEL[doc.type]}</h2>
            <span className="text-xs text-slate-400">v{doc.version}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-600 w-16 flex-shrink-0">시행일</label>
            <input
              type="date"
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="w-16 flex-shrink-0 font-medium text-slate-600">작성일</span>
            <span>{doc.createdAt}</span>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">내용</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none leading-relaxed"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => {
              alert(`문서 수정 (시뮬레이션)\n유형: ${TYPE_LABEL[doc.type]} v${doc.version}`);
              onClose();
            }}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Feature ──────────────────────────────────── */
export default function PortalLegalFeature() {
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  const filtered = filter === "ALL"
    ? legalDocuments
    : legalDocuments.filter((d) => d.type === filter);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-0.5">약관 · 개인정보</h2>
            <p className="text-xs text-slate-400">포털에 게시되는 법적 문서를 버전별로 관리합니다.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus size={14} />
            새 문서
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-medium">유형</th>
                <th className="text-left px-4 py-2.5 font-medium">버전</th>
                <th className="text-left px-4 py-2.5 font-medium">시행일</th>
                <th className="text-left px-4 py-2.5 font-medium">작성일</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                    등록된 문서가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_COLOR[doc.type]}`}>
                        {TYPE_LABEL[doc.type]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">v{doc.version}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{doc.effectiveDate}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">{doc.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-400">
              총 {filtered.length}건
            </div>
          )}
        </div>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
      {selectedDoc && <DetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </>
  );
}
