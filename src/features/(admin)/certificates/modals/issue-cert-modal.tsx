"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CertificateTemplate } from "../mockData";
import { useCertStore } from "../store";
import { courses } from "@/features/(admin)/course-list/mockData";

interface Props {
  template: CertificateTemplate;
  onClose: () => void;
}

export default function IssueCertModal({ template, onClose }: Props) {
  const issueCert = useCertStore((s) => s.issueCert);

  const eligibleCourses = courses.filter((c) => c.certConfig?.templateId === template.id);

  const [recipient, setRecipient] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(eligibleCourses[0]?.id ?? "");
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().slice(0, 10));

  const selectedCourse = eligibleCourses.find((c) => c.id === selectedCourseId);

  function handleIssue() {
    if (!recipient.trim() || !selectedCourse) return;
    issueCert(template.id, recipient.trim(), selectedCourse.title);
    onClose();
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-800">수동 발급</h2>
            <p className="text-xs text-slate-400 mt-0.5">{template.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">수강자 이름</label>
            <input
              autoFocus
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="이름을 입력하세요"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleIssue(); }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">과정</label>
            {eligibleCourses.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                이 템플릿에 연결된 과정이 없습니다.
              </p>
            ) : (
              <select
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {eligibleCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )}
          </div>

          {/* CertConfig info for selected course */}
          {selectedCourse?.certConfig && (
            <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 flex flex-wrap gap-x-3 gap-y-1">
              <span>완료율 {selectedCourse.certConfig.completionRate}% 이상</span>
              <span>·</span>
              <span>자동발급 {selectedCourse.certConfig.autoIssue ? "ON" : "OFF"}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">발급일</label>
            <input
              type="date"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
            />
          </div>

          {template.validityYears ? (
            <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              유효기간 {template.validityYears}년 — 만료일은 발급일 기준으로 자동 계산됩니다.
            </p>
          ) : (
            <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              이 템플릿은 유효기간이 없습니다 (무기한).
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleIssue}
            disabled={!recipient.trim() || eligibleCourses.length === 0}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            발급
          </button>
        </div>
      </div>
    </div>
  );
}
