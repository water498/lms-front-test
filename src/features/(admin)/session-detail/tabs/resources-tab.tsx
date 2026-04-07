"use client";

import { useState } from "react";
import {
  Plus,
  FileText,
  Presentation,
  FileSpreadsheet,
  File,
  Download,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Upload,
} from "lucide-react";
import type { SessionResource } from "@/lib/models";

const MIME_ICON: Record<string, React.ReactNode> = {
  "application/pdf": <FileText size={16} className="text-red-400" />,
  "application/vnd.ms-powerpoint": <Presentation size={16} className="text-orange-400" />,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": <Presentation size={16} className="text-orange-400" />,
  "application/vnd.ms-excel": <FileSpreadsheet size={16} className="text-green-400" />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FileSpreadsheet size={16} className="text-green-400" />,
};

function getFileIcon(mimeType: string) {
  return MIME_ICON[mimeType] ?? <File size={16} className="text-slate-400" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Mock 데이터 ──────────────────────────────────────────────
const mockResources: Record<string, SessionResource[]> = {
  se2: [
    { id: "sr1", courseSessionId: "se2", title: "안전수칙 교재 (전체)", category: "강의자료", description: "과정 전체를 다루는 교재 PDF입니다.", fileName: "안전수칙_교재_2025_v3.pdf", fileUrl: "/files/sr1.pdf", fileSizeBytes: 5242880, mimeType: "application/pdf", order: 0, isVisible: true, uploadedBy: "u2", createdAt: "2025-02-01", uploaderName: "이정민" },
    { id: "sr2", courseSessionId: "se2", subjectId: "s1", subjectTitle: "안전수칙의 이해", title: "1장 보충 슬라이드", category: "강의자료", description: "안전수칙의 이해 파트 보충 슬라이드입니다.", fileName: "1장_보충슬라이드.pptx", fileUrl: "/files/sr2.pptx", fileSizeBytes: 3145728, mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", order: 1, isVisible: true, uploadedBy: "u2", createdAt: "2025-02-03", uploaderName: "이정민" },
    { id: "sr3", courseSessionId: "se2", title: "위험성 평가 체크리스트", category: "서식", description: "현장에서 사용할 수 있는 위험성 평가 체크리스트 양식입니다.", fileName: "위험성평가_체크리스트.xlsx", fileUrl: "/files/sr3.xlsx", fileSizeBytes: 102400, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", order: 0, isVisible: true, uploadedBy: "u2", createdAt: "2025-02-05", uploaderName: "이정민" },
    { id: "sr4", courseSessionId: "se2", title: "참고 법령 모음 (비공개)", category: "참고문헌", description: "관련 법령 원문 모음입니다. 공개 전 검수 중.", fileName: "참고법령_모음.pdf", fileUrl: "/files/sr4.pdf", fileSizeBytes: 8388608, mimeType: "application/pdf", order: 0, isVisible: false, uploadedBy: "u2", createdAt: "2025-02-08", uploaderName: "이정민" },
  ],
};

function getResources(sessionId: string): SessionResource[] {
  return mockResources[sessionId] ?? [];
}

// ── 컴포넌트 ──────────────────────────────────────────────────

interface Props {
  sessionId: string;
}

export default function ResourcesTab({ sessionId }: Props) {
  const [resources, setResources] = useState(() => getResources(sessionId));

  // Group by category
  const categories = Array.from(new Set(resources.map((r) => r.category ?? "미분류")));
  const grouped = categories.map((cat) => ({
    category: cat,
    items: resources.filter((r) => (r.category ?? "미분류") === cat),
  }));

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  function handleToggleVisibility(id: string) {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r))
    );
  }

  function handleDelete(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">자료실</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            수강생이 다운로드할 수 있는 문서 자료를 관리합니다.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">
          <Upload size={14} />
          자료 등록
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <FileText size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-400 mb-3">등록된 자료가 없습니다.</p>
          <button className="flex items-center gap-1.5 mx-auto px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
            <Plus size={14} />
            첫 자료 등록하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {grouped.map(({ category, items }) => (
            <div key={category} className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {collapsed.has(category) ? (
                    <ChevronRight size={14} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400" />
                  )}
                  <span className="text-sm font-semibold text-slate-600">
                    {category}
                  </span>
                  <span className="text-xs text-slate-400">{items.length}건</span>
                </div>
              </button>

              {/* Resource rows */}
              {!collapsed.has(category) && (
                <div className="divide-y divide-slate-100">
                  {items.map((r) => (
                    <div
                      key={r.id}
                      className={`flex items-center gap-3 px-4 py-3 group ${
                        r.isVisible ? "" : "bg-slate-50/50"
                      }`}
                    >
                      <span className="shrink-0">{getFileIcon(r.mimeType)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700 font-medium truncate">
                            {r.title}
                          </span>
                          {!r.isVisible && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-full">
                              비공개
                            </span>
                          )}
                          {r.subjectTitle && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded-full">
                              {r.subjectTitle}
                            </span>
                          )}
                        </div>
                        {r.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {r.description}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {r.fileName} · {formatFileSize(r.fileSizeBytes)} · {r.uploaderName}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleVisibility(r.id)}
                          className="p-1.5 text-slate-400 hover:text-violet-600 rounded"
                          title={r.isVisible ? "비공개로 전환" : "공개로 전환"}
                        >
                          {r.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-violet-600 rounded">
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
