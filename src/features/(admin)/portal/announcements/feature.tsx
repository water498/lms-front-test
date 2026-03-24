"use client";

import { useState } from "react";
import { announcements as initialAnnouncements } from "../../announcements/mockData";
import { X } from "lucide-react";
import RichEditor from "../../shared/rich-editor";

type OrgSubtype = "공지" | "시스템";

const TYPE_CONFIG: Record<OrgSubtype, { label: string; className: string }> = {
  "공지":   { label: "공지",   className: "bg-blue-100 text-blue-700" },
  "시스템": { label: "시스템", className: "bg-amber-100 text-amber-700" },
};

function NewAnnouncementForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("ALL");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">새 공지 작성</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">제목</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="공지 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">내용</label>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="공지 내용을 입력하세요"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">대상</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="ALL">전체 조직</option>
              <option value="React 기초">React 기초</option>
              <option value="TypeScript 심화">TypeScript 심화</option>
              <option value="AWS 클라우드 입문">AWS 클라우드 입문</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">취소</button>
          <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">발송</button>
        </div>
      </div>
    </div>
  );
}

export default function PortalAnnouncementsFeature() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="text-sm text-slate-500">{initialAnnouncements.length}건</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            + 새 공지
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">제목</th>
              <th className="text-left px-4 py-3 font-medium">유형</th>
              <th className="text-left px-4 py-3 font-medium">대상</th>
              <th className="text-left px-4 py-3 font-medium">발송일</th>
              <th className="text-left px-4 py-3 font-medium">조회 수</th>
            </tr>
          </thead>
          <tbody>
            {initialAnnouncements.map((a) => {
              const badge = TYPE_CONFIG[(a.subtype as OrgSubtype) ?? "공지"];
              return (
                <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {a.targetType === "ALL_MEMBERS" ? "전체" : "특정 과정"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{a.sentAt}</td>
                  <td className="px-4 py-3 text-slate-600">{a.views?.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && <NewAnnouncementForm onClose={() => setShowForm(false)} />}
    </>
  );
}
