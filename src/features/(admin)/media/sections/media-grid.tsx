"use client";

import { useState } from "react";
import { Copy, Trash2, FileVideo, FileText, Package, File, LayoutGrid, List } from "lucide-react";
import { mediaFiles, type MediaType } from "../mockData";

const TYPE_ICON: Record<MediaType, React.ElementType> = {
  VIDEO:    FileVideo,
  DOCUMENT: FileText,
  SCORM:    Package,
  OTHER:    File,
};

const TYPE_CONFIG: Record<MediaType, { label: string; className: string }> = {
  VIDEO:    { label: "동영상",   className: "bg-blue-100 text-blue-700" },
  DOCUMENT: { label: "문서",     className: "bg-amber-100 text-amber-700" },
  SCORM:    { label: "SCORM",    className: "bg-violet-100 text-violet-700" },
  OTHER:    { label: "기타",     className: "bg-slate-100 text-slate-600" },
};

type ViewMode = "grid" | "list";

interface Props {
  onUploadClick: () => void;
}

export default function MediaGrid({ onUploadClick }: Props) {
  const [typeFilter, setTypeFilter] = useState<MediaType | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filtered = mediaFiles.filter((f) => {
    const matchType = typeFilter === "ALL" || f.type === typeFilter;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 w-52"
          placeholder="파일명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {(["ALL", "VIDEO", "DOCUMENT", "SCORM", "OTHER"] as (MediaType | "ALL")[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                typeFilter === t
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t === "ALL" ? "전체" : TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("list")}
            className={`px-2.5 py-1.5 transition-colors ${viewMode === "list" ? "bg-violet-50 text-violet-600" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-2.5 py-1.5 transition-colors ${viewMode === "grid" ? "bg-violet-50 text-violet-600" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
        <button
          onClick={onUploadClick}
          className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          + 업로드
        </button>
      </div>

      {viewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">파일명</th>
                <th className="text-left px-4 py-3 font-medium">유형</th>
                <th className="text-left px-4 py-3 font-medium">크기</th>
                <th className="text-left px-4 py-3 font-medium">업로드일</th>
                <th className="text-left px-4 py-3 font-medium">연결 코스</th>
                <th className="text-left px-4 py-3 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const Icon = TYPE_ICON[f.type];
                const t = TYPE_CONFIG[f.type];
                return (
                  <tr key={f.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className="text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-800 truncate max-w-48">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.className}`}>
                        {t.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 tabular-nums">{f.size}</td>
                    <td className="px-4 py-3 text-slate-400">{f.uploadedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {f.linkedCourses.map((c) => (
                          <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          title={`cdn: ${f.url}`}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                    파일이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((f) => {
            const Icon = TYPE_ICON[f.type];
            const t = TYPE_CONFIG[f.type];
            return (
              <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 hover:border-violet-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.className}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-600"><Copy size={13} /></button>
                    <button className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{f.size} · {f.uploadedAt}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {f.linkedCourses.map((c) => (
                    <span key={c} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400 text-sm">
              파일이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
