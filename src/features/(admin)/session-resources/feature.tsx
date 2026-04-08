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
  X,
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

// ── 자료 등록 모달 ──────────────────────────────────────────────

const CATEGORY_SUGGESTIONS = ["강의자료", "참고문헌", "서식", "기타"];
const FILE_ACCEPT = ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.hwp,.hwpx,.zip";

const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  hwp: "application/x-hwp",
};

interface AddResourceModalProps {
  onAdd: (resource: SessionResource) => void;
  onClose: () => void;
  sessionId: string;
}

function AddResourceModal({ onAdd, onClose, sessionId }: AddResourceModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<{ name: string; size: number; ext: string } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    setFile({ name: f.name, size: f.size, ext });
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  function handleSubmit() {
    if (!title.trim() || !file) return;
    const newResource: SessionResource = {
      id: `sr-${Date.now()}`,
      courseSessionId: sessionId,
      title: title.trim(),
      category: category || undefined,
      description: description || undefined,
      fileName: file.name,
      fileUrl: `/files/${file.name}`,
      fileSizeBytes: file.size,
      mimeType: EXT_MIME[file.ext] ?? "application/octet-stream",
      order: 0,
      isVisible: true,
      createdAt: new Date().toISOString(),
      uploaderName: "관리자",
    };
    onAdd(newResource);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">자료 등록</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* File upload */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">파일 선택</label>
            {file ? (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-violet-50 border border-violet-200 rounded-lg">
                <span className="shrink-0">{getFileIcon(EXT_MIME[file.ext] ?? "")}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={() => setFile(null)} className="text-xs text-slate-400 hover:text-red-500">변경</button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
                <Upload size={20} className="text-slate-400" />
                <span className="text-sm text-slate-500">파일을 선택하거나 드래그하세요</span>
                <span className="text-[11px] text-slate-400">PDF, PPT, DOC, XLS, HWP, ZIP</span>
                <input type="file" accept={FILE_ACCEPT} onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">자료명</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="자료 제목을 입력하세요"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">분류</label>
            <div className="flex gap-1.5 mb-2">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    category === cat ? "bg-violet-100 text-violet-700 border-violet-300" : "text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder="직접 입력 또는 위에서 선택"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">설명 <span className="text-slate-300">(선택)</span></label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="수강생에게 표시될 자료 설명"
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !file}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 컴포넌트 ──────────────────────────────────────────────────

interface Props {
  sessionId: string;
}

export default function ResourcesTab({ sessionId }: Props) {
  const [resources, setResources] = useState(() => getResources(sessionId));
  const [showAddModal, setShowAddModal] = useState(false);

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
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">
          <Upload size={14} />
          자료 등록
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <FileText size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-400 mb-3">등록된 자료가 없습니다.</p>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 mx-auto px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
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

      {showAddModal && (
        <AddResourceModal
          sessionId={sessionId}
          onAdd={(resource) => setResources((prev) => [...prev, resource])}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
