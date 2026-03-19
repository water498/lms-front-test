"use client";

import { useState } from "react";
import { Pencil, Trash2, FileVideo, FileText, Package, Image, LayoutGrid, List, X, AlertTriangle, Ban } from "lucide-react";
import { mediaAssets, type MediaAsset, type AssetType, type UploadStatus } from "../mockData";
import { getAllSessions } from "../../course-detail/mockData";

const TYPE_ICON: Record<AssetType, React.ElementType> = {
  VIDEO: FileVideo,
  PDF:   FileText,
  SCORM: Package,
  IMAGE: Image,
};

const TYPE_CONFIG: Record<AssetType, { label: string; className: string }> = {
  VIDEO: { label: "동영상", className: "bg-blue-100 text-blue-700" },
  PDF:   { label: "PDF",    className: "bg-amber-100 text-amber-700" },
  SCORM: { label: "SCORM",  className: "bg-violet-100 text-violet-700" },
  IMAGE: { label: "이미지", className: "bg-emerald-100 text-emerald-700" },
};

const STATUS_CONFIG: Record<UploadStatus, { label: string; className: string; pulse?: boolean }> = {
  PENDING:    { label: "대기",    className: "bg-zinc-100 text-zinc-500" },
  VALIDATING: { label: "검증 중", className: "bg-amber-100 text-amber-700" },
  PROCESSING: { label: "처리 중", className: "bg-blue-100 text-blue-700", pulse: true },
  ACTIVE:     { label: "활성",    className: "bg-green-100 text-green-700" },
  ERROR:      { label: "오류",    className: "bg-red-100 text-red-600" },
};

const ROW_BG: Partial<Record<UploadStatus, string>> = {
  PROCESSING: "bg-blue-50/40",
  ERROR:      "bg-red-50/40",
};

type ViewMode = "grid" | "list";

type DeleteModal =
  | { type: "none" }
  | { type: "safe"; assetId: string; assetName: string }
  | { type: "warn"; assetId: string; assetName: string; courseNames: string[] }
  | { type: "block"; assetName: string; courseNames: string[] };

interface RenameModalProps {
  asset: MediaAsset;
  onSave: (id: string, displayName: string) => void;
  onClose: () => void;
}

function RenameModal({ asset, onSave, onClose }: RenameModalProps) {
  const [value, setValue] = useState(asset.displayName);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">이름 변경</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-3">{asset.originalName}</p>
        <input
          autoFocus
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onSave(asset.id, value.trim()); }}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => value.trim() && onSave(asset.id, value.trim())}
            disabled={!value.trim()}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

const ACTIVE_SESSION_STATUSES = new Set(["OPEN", "ONGOING", "CLOSED"]);

interface Props {
  onUploadClick: () => void;
}

export default function MediaGrid({ onUploadClick }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>(mediaAssets);
  const [typeFilter, setTypeFilter] = useState<AssetType | "ALL">("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [renamingAsset, setRenamingAsset] = useState<MediaAsset | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ type: "none" });

  // Derive unique tags from all assets (sorted)
  const allTags = Array.from(new Set(assets.flatMap((a) => a.tags))).sort();

  const filtered = assets.filter((a) => {
    const matchType = typeFilter === "ALL" || a.assetType === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = a.displayName.toLowerCase().includes(q) || a.originalName.toLowerCase().includes(q);
    const matchTag = selectedTags.length === 0 || selectedTags.some((t) => a.tags.includes(t));
    return matchType && matchSearch && matchTag;
  });

  function handleRename(id: string, displayName: string) {
    setAssets((prev) => prev.map((a) => a.id === id ? { ...a, displayName } : a));
    setRenamingAsset(null);
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleDeleteClick(asset: MediaAsset) {
    if (asset.linkedCourses.length === 0) {
      setDeleteModal({ type: "safe", assetId: asset.id, assetName: asset.displayName });
      return;
    }

    // Check session statuses for linked courses
    const allSessions = getAllSessions();
    const activeCourseNames: string[] = [];
    const draftCourseNames: string[] = [];

    for (const courseName of asset.linkedCourses) {
      const courseSessions = allSessions.filter((s) => s.courseTitle === courseName);
      const hasActive = courseSessions.some((s) => ACTIVE_SESSION_STATUSES.has(s.status));
      if (hasActive) {
        activeCourseNames.push(courseName);
      } else {
        draftCourseNames.push(courseName);
      }
    }

    if (activeCourseNames.length > 0) {
      setDeleteModal({ type: "block", assetName: asset.displayName, courseNames: activeCourseNames });
    } else {
      setDeleteModal({ type: "warn", assetId: asset.id, assetName: asset.displayName, courseNames: draftCourseNames });
    }
  }

  function confirmDelete(assetId: string) {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    setDeleteModal({ type: "none" });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 w-52"
          placeholder="이름 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {(["ALL", "VIDEO", "PDF", "SCORM", "IMAGE"] as (AssetType | "ALL")[]).map((t) => (
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

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-400 mr-1">태그</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-slate-400 hover:text-slate-600 ml-1 underline"
            >
              초기화
            </button>
          )}
        </div>
      )}

      {viewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">이름</th>
                <th className="text-left px-4 py-3 font-medium">유형</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
                <th className="text-left px-4 py-3 font-medium">크기</th>
                <th className="text-left px-4 py-3 font-medium">업로드일</th>
                <th className="text-left px-4 py-3 font-medium">연결 과정 / 태그</th>
                <th className="text-left px-4 py-3 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const Icon = TYPE_ICON[a.assetType];
                const typeCfg = TYPE_CONFIG[a.assetType];
                const statusCfg = STATUS_CONFIG[a.status];
                const rowBg = ROW_BG[a.status] ?? "";
                const visibleTags = a.tags.slice(0, 2);
                const hiddenTagCount = a.tags.length - visibleTags.length;
                return (
                  <tr
                    key={a.id}
                    className={`border-b border-slate-50 last:border-0 transition-colors ${rowBg || "hover:bg-slate-50/50"}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className="text-slate-400 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-slate-800 truncate max-w-56 block">{a.displayName}</span>
                          <span className="text-xs text-slate-400 font-mono">{a.originalName}</span>
                          {a.status === "ERROR" && a.errorMessage && (
                            <span className="text-xs text-red-400 block">{a.errorMessage}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeCfg.className}`}>
                        {typeCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className} ${statusCfg.pulse ? "animate-pulse" : ""}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 tabular-nums">{a.size}</td>
                    <td className="px-4 py-3 text-slate-400">{a.uploadedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {a.linkedCourses.map((c) => (
                          <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {c}
                          </span>
                        ))}
                        {visibleTags.map((tag) => (
                          <span key={tag} className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {hiddenTagCount > 0 && (
                          <span className="text-xs text-slate-400 px-1">+{hiddenTagCount}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          title="이름 변경"
                          onClick={() => setRenamingAsset(a)}
                          className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          title="삭제"
                          onClick={() => handleDeleteClick(a)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                    파일이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((a) => {
            const Icon = TYPE_ICON[a.assetType];
            const typeCfg = TYPE_CONFIG[a.assetType];
            const statusCfg = STATUS_CONFIG[a.status];
            return (
              <div
                key={a.id}
                className={`bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 hover:border-violet-300 transition-colors ${
                  a.status === "PROCESSING" ? "border-blue-200 bg-blue-50/40" :
                  a.status === "ERROR"      ? "border-red-200 bg-red-50/40" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeCfg.className}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className} ${statusCfg.pulse ? "animate-pulse" : ""}`}>
                      {statusCfg.label}
                    </span>
                    <button
                      title="이름 변경"
                      onClick={() => setRenamingAsset(a)}
                      className="p-1 text-slate-400 hover:text-violet-600 rounded transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      title="삭제"
                      onClick={() => handleDeleteClick(a)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 truncate">{a.displayName}</p>
                  <p className="text-xs text-slate-400 font-mono truncate">{a.originalName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.size} · {a.uploadedAt}</p>
                  {a.status === "ERROR" && a.errorMessage && (
                    <p className="text-xs text-red-400 mt-0.5">{a.errorMessage}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {a.linkedCourses.map((c) => (
                    <span key={c} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                  {a.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                      {tag}
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

      {renamingAsset && (
        <RenameModal
          asset={renamingAsset}
          onSave={handleRename}
          onClose={() => setRenamingAsset(null)}
        />
      )}

      {/* Delete modals */}
      {deleteModal.type === "safe" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800">자산 삭제</h2>
              <button onClick={() => setDeleteModal({ type: "none" })} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-medium text-slate-800">{deleteModal.assetName}</span>을(를) 삭제하시겠습니까?
            </p>
            <p className="text-xs text-slate-400">이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteModal({ type: "none" })}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => confirmDelete(deleteModal.assetId)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.type === "warn" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
              <h2 className="text-base font-semibold text-slate-800">연결된 과정이 있습니다</h2>
              <button onClick={() => setDeleteModal({ type: "none" })} className="ml-auto text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              아래 <span className="font-medium">{deleteModal.courseNames.length}개</span> 과정 활동에서 미디어 연결이 해제됩니다. 계속하시겠습니까?
            </p>
            <ul className="text-xs text-slate-500 space-y-1 mb-4 bg-amber-50 rounded-lg p-3">
              {deleteModal.courseNames.map((name) => (
                <li key={name} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                  {name}
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal({ type: "none" })}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => confirmDelete(deleteModal.assetId)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.type === "block" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ban size={18} className="text-red-500 flex-shrink-0" />
              <h2 className="text-base font-semibold text-slate-800">삭제 불가</h2>
              <button onClick={() => setDeleteModal({ type: "none" })} className="ml-auto text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              진행 중이거나 종료된 과정에서 사용 중입니다. 삭제할 수 없습니다.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 mb-4 bg-red-50 rounded-lg p-3">
              {deleteModal.courseNames.map((name) => (
                <li key={name} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                  {name}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteModal({ type: "none" })}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
