"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
  Upload,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { SessionResource } from "@/lib/models";

const MIME_ICON: Record<string, React.ReactNode> = {
  "application/pdf": <FileText size={16} className="text-red-400" />,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": <Presentation size={16} className="text-orange-400" />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FileSpreadsheet size={16} className="text-green-400" />,
};

function getFileIcon(mimeType: string) {
  return MIME_ICON[mimeType] ?? <File size={16} className="text-zinc-500" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Mock 데이터 ──
const mockResources: Record<string, SessionResource[]> = {
  se2: [
    { id: "sr1", courseSessionId: "se2", title: "안전수칙 교재 (전체)", category: "강의자료", description: "과정 전체를 다루는 교재 PDF입니다.", fileName: "안전수칙_교재_2025_v3.pdf", fileUrl: "/files/sr1.pdf", fileSizeBytes: 5242880, mimeType: "application/pdf", order: 0, isVisible: true, uploadedBy: "u-inst-1", createdAt: "2025-02-01", uploaderName: "김민준" },
    { id: "sr2", courseSessionId: "se2", subjectId: "s1", subjectTitle: "안전수칙의 이해", title: "1장 보충 슬라이드", category: "강의자료", fileName: "1장_보충슬라이드.pptx", fileUrl: "/files/sr2.pptx", fileSizeBytes: 3145728, mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", order: 1, isVisible: true, uploadedBy: "u-inst-1", createdAt: "2025-02-03", uploaderName: "김민준" },
    { id: "sr3", courseSessionId: "se2", title: "위험성 평가 체크리스트", category: "서식", description: "현장 위험성 평가 체크리스트 양식", fileName: "위험성평가_체크리스트.xlsx", fileUrl: "/files/sr3.xlsx", fileSizeBytes: 102400, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", order: 0, isVisible: true, uploadedBy: "u-inst-1", createdAt: "2025-02-05", uploaderName: "김민준" },
  ],
};

export default function InstructorResourcesTab() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const [resources, setResources] = useState<SessionResource[]>(mockResources[sessionId] ?? []);

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
    <div className="p-6 flex flex-col gap-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">자료실</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            수강생이 다운로드할 수 있는 문서 자료를 관리합니다.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">
          <Upload size={14} />
          자료 등록
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-zinc-700 rounded-xl">
          <FileText size={32} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-500 mb-3">등록된 자료가 없습니다.</p>
          <button className="flex items-center gap-1.5 mx-auto px-4 py-2 text-sm text-violet-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
            <Plus size={14} />
            첫 자료 등록하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {grouped.map(({ category, items }) => (
            <div key={category} className="border border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {collapsed.has(category) ? (
                    <ChevronRight size={14} className="text-zinc-500" />
                  ) : (
                    <ChevronDown size={14} className="text-zinc-500" />
                  )}
                  <span className="text-sm font-semibold text-zinc-300">{category}</span>
                  <span className="text-xs text-zinc-500">{items.length}건</span>
                </div>
              </button>

              {!collapsed.has(category) && (
                <div className="divide-y divide-zinc-800">
                  {items.map((r) => (
                    <div
                      key={r.id}
                      className={`flex items-center gap-3 px-4 py-3 group ${
                        r.isVisible ? "" : "opacity-50"
                      }`}
                    >
                      <span className="shrink-0">{getFileIcon(r.mimeType)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-200 font-medium truncate">{r.title}</span>
                          {!r.isVisible && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded-full">비공개</span>
                          )}
                          {r.subjectTitle && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-violet-900/50 text-violet-400 rounded-full">{r.subjectTitle}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5">
                          {r.fileName} · {formatFileSize(r.fileSizeBytes)}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleVisibility(r.id)}
                          className="p-1.5 text-zinc-500 hover:text-violet-400 rounded"
                        >
                          {r.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button className="p-1.5 text-zinc-500 hover:text-violet-400 rounded">
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded"
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
