"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, FileVideo, FileText, Package, Image, LayoutGrid, List, X, AlertTriangle, Ban, Eye, ChevronRight, ChevronDown, FolderIcon, FolderOpen, Plus, MoreHorizontal, FolderX } from "lucide-react";
import { mediaAssets, mediaFolders as initialFolders, type MediaAsset, type AssetType, type UploadStatus, type MediaFolder } from "../mockData";
import { getAllSessions } from "../../course-layout/mockData";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
}

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

type FolderFilter = "ALL" | "UNCATEGORIZED" | string; // string = folder id

/* ─── Folder tree helpers ─── */

function buildTree(folders: MediaFolder[]): Map<string | undefined, MediaFolder[]> {
  const map = new Map<string | undefined, MediaFolder[]>();
  for (const f of folders) {
    const key = f.parentId ?? undefined;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  // sort children by order
  for (const children of map.values()) {
    children.sort((a, b) => a.order - b.order);
  }
  return map;
}

function getDescendantIds(folderId: string, tree: Map<string | undefined, MediaFolder[]>): string[] {
  const ids: string[] = [folderId];
  const children = tree.get(folderId) ?? [];
  for (const child of children) {
    ids.push(...getDescendantIds(child.id, tree));
  }
  return ids;
}

/* ─── Folder context menu ─── */

interface FolderMenuProps {
  folder: MediaFolder;
  position: { x: number; y: number };
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function FolderContextMenu({ position, onRename, onDelete, onClose }: FolderMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[120px]"
      style={{ top: position.y, left: position.x }}
    >
      <button
        onClick={onRename}
        className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <Pencil size={13} /> 이름 변경
      </button>
      <button
        onClick={onDelete}
        className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 size={13} /> 삭제
      </button>
    </div>
  );
}

/* ─── Folder tree node ─── */

interface FolderNodeProps {
  folder: MediaFolder;
  tree: Map<string | undefined, MediaFolder[]>;
  depth: number;
  selectedFolder: FolderFilter;
  onSelect: (id: string) => void;
  onMenuOpen: (folder: MediaFolder, pos: { x: number; y: number }) => void;
  expandedSet: Set<string>;
  toggleExpand: (id: string) => void;
}

function FolderNode({ folder, tree, depth, selectedFolder, onSelect, onMenuOpen, expandedSet, toggleExpand }: FolderNodeProps) {
  const children = tree.get(folder.id) ?? [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedSet.has(folder.id);
  const isSelected = selectedFolder === folder.id;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
          isSelected ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-600 hover:bg-slate-50"
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(folder.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); toggleExpand(folder.id); }}
            className="p-0.5 text-slate-400 hover:text-slate-600"
          >
            {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        ) : (
          <span className="w-[18px]" />
        )}
        {isExpanded ? (
          <FolderOpen size={15} className={isSelected ? "text-violet-500" : "text-slate-400"} />
        ) : (
          <FolderIcon size={15} className={isSelected ? "text-violet-500" : "text-slate-400"} />
        )}
        <span className="truncate flex-1">{folder.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            onMenuOpen(folder, { x: rect.right, y: rect.bottom });
          }}
          className="p-0.5 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>
      {isExpanded && children.map((child) => (
        <FolderNode
          key={child.id}
          folder={child}
          tree={tree}
          depth={depth + 1}
          selectedFolder={selectedFolder}
          onSelect={onSelect}
          onMenuOpen={onMenuOpen}
          expandedSet={expandedSet}
          toggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
}

/* ─── Folder sidebar ─── */

interface FolderSidebarProps {
  folders: MediaFolder[];
  selectedFolder: FolderFilter;
  onSelect: (filter: FolderFilter) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
}

function FolderSidebar({ folders, selectedFolder, onSelect, onCreateFolder, onRenameFolder, onDeleteFolder }: FolderSidebarProps) {
  const tree = buildTree(folders);
  const rootFolders = tree.get(undefined) ?? [];

  const [expandedSet, setExpandedSet] = useState<Set<string>>(() => {
    // expand top-level by default
    return new Set(rootFolders.map((f) => f.id));
  });
  const [contextMenu, setContextMenu] = useState<{ folder: MediaFolder; pos: { x: number; y: number } } | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const newFolderRef = useRef<HTMLInputElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingFolder && newFolderRef.current) newFolderRef.current.focus();
  }, [creatingFolder]);

  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  function toggleExpand(id: string) {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleCreateSubmit() {
    const name = newFolderName.trim();
    if (name) onCreateFolder(name);
    setCreatingFolder(false);
    setNewFolderName("");
  }

  function handleRenameSubmit() {
    if (renamingId && renameValue.trim()) {
      onRenameFolder(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  }

  function handleMenuOpen(folder: MediaFolder, pos: { x: number; y: number }) {
    setContextMenu({ folder, pos });
  }

  return (
    <div className="w-60 shrink-0 bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-1 h-fit max-h-[calc(100vh-180px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">폴더</span>
        <button
          onClick={() => setCreatingFolder(true)}
          className="p-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
          title="새 폴더"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* All media */}
      <button
        onClick={() => onSelect("ALL")}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
          selectedFolder === "ALL" ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <FolderIcon size={15} className={selectedFolder === "ALL" ? "text-violet-500" : "text-slate-400"} />
        전체 미디어
      </button>

      {/* Folder tree */}
      {rootFolders.map((folder) =>
        renamingId === folder.id ? (
          <div key={folder.id} className="flex items-center gap-1 px-2 py-1">
            <FolderIcon size={15} className="text-slate-400 shrink-0" />
            <input
              ref={renameRef}
              className="flex-1 text-sm border border-violet-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") { setRenamingId(null); setRenameValue(""); }
              }}
              onBlur={handleRenameSubmit}
            />
          </div>
        ) : (
          <FolderNode
            key={folder.id}
            folder={folder}
            tree={tree}
            depth={0}
            selectedFolder={selectedFolder}
            onSelect={onSelect}
            onMenuOpen={handleMenuOpen}
            expandedSet={expandedSet}
            toggleExpand={toggleExpand}
          />
        )
      )}

      {/* Inline new folder input */}
      {creatingFolder && (
        <div className="flex items-center gap-1 px-2 py-1">
          <FolderIcon size={15} className="text-slate-400 shrink-0" />
          <input
            ref={newFolderRef}
            className="flex-1 text-sm border border-violet-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
            placeholder="폴더 이름..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateSubmit();
              if (e.key === "Escape") { setCreatingFolder(false); setNewFolderName(""); }
            }}
            onBlur={handleCreateSubmit}
          />
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-100 my-1" />

      {/* Uncategorized */}
      <button
        onClick={() => onSelect("UNCATEGORIZED")}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
          selectedFolder === "UNCATEGORIZED" ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <FolderX size={15} className={selectedFolder === "UNCATEGORIZED" ? "text-violet-500" : "text-slate-400"} />
        미분류
      </button>

      {/* Context menu */}
      {contextMenu && (
        <FolderContextMenu
          folder={contextMenu.folder}
          position={contextMenu.pos}
          onRename={() => {
            setRenamingId(contextMenu.folder.id);
            setRenameValue(contextMenu.folder.name);
            setContextMenu(null);
          }}
          onDelete={() => {
            onDeleteFolder(contextMenu.folder.id);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

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

function PreviewModal({ asset, onClose }: { asset: MediaAsset; onClose: () => void }) {
  const typeCfg = TYPE_CONFIG[asset.assetType];
  const src = asset.assetType === "SCORM"
    ? `https://${asset.launchHref}`
    : `https://${asset.cdnBaseUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-slate-900 border-b border-slate-700 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeCfg.className}`}>
          {typeCfg.label}
        </span>
        <span className="text-sm font-medium text-white flex-1 truncate">{asset.displayName}</span>
        <span className="text-xs text-slate-400 font-mono mr-2 hidden sm:block">{asset.originalName}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* SCORM notice */}
      {asset.assetType === "SCORM" && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-5 py-2 text-xs text-amber-300 text-center shrink-0">
          콘텐츠 확인용 미리보기 — 진도 및 점수가 기록되지 않습니다
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-0">
        {asset.assetType === "VIDEO" && (
          <video
            controls
            autoPlay
            className="max-h-full max-w-full rounded-lg shadow-2xl"
            src={src}
          >
            미리보기를 지원하지 않는 형식입니다.
          </video>
        )}
        {asset.assetType === "IMAGE" && (
          <img
            src={src}
            alt={asset.displayName}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        )}
        {(asset.assetType === "PDF" || asset.assetType === "SCORM") && (
          <iframe
            src={src}
            className="w-full h-full rounded-lg shadow-2xl bg-white"
            title={asset.displayName}
          />
        )}
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
  const [folders, setFolders] = useState<MediaFolder[]>(initialFolders);
  const [folderFilter, setFolderFilter] = useState<FolderFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<AssetType | "ALL">("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [renamingAsset, setRenamingAsset] = useState<MediaAsset | null>(null);
  const [previewingAsset, setPreviewingAsset] = useState<MediaAsset | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ type: "none" });

  // Derive unique tags from all assets (sorted)
  const allTags = Array.from(new Set(assets.flatMap((a) => a.tags))).sort();

  // Folder tree for descendant lookup
  const folderTree = buildTree(folders);

  const filtered = assets.filter((a) => {
    // Folder filter
    if (folderFilter === "UNCATEGORIZED" && a.folderId) return false;
    if (folderFilter !== "ALL" && folderFilter !== "UNCATEGORIZED") {
      const visibleIds = new Set(getDescendantIds(folderFilter, folderTree));
      if (!a.folderId || !visibleIds.has(a.folderId)) return false;
    }
    const matchType = typeFilter === "ALL" || a.assetType === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = a.displayName.toLowerCase().includes(q) || a.originalName.toLowerCase().includes(q);
    const matchTag = selectedTags.length === 0 || selectedTags.some((t) => a.tags.includes(t));
    return matchType && matchSearch && matchTag;
  });

  /* ─── Folder CRUD ─── */
  function handleCreateFolder(name: string) {
    const newFolder: MediaFolder = {
      id: `f${Date.now()}`,
      tenantId: "t1",
      name,
      parentId: undefined,
      order: folders.filter((f) => !f.parentId).length,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setFolders((prev) => [...prev, newFolder]);
  }

  function handleRenameFolder(id: string, name: string) {
    setFolders((prev) => prev.map((f) => f.id === id ? { ...f, name } : f));
  }

  function handleDeleteFolder(id: string) {
    // Remove folder and all descendants, uncategorize their assets
    const descendantIds = new Set(getDescendantIds(id, folderTree));
    setFolders((prev) => prev.filter((f) => !descendantIds.has(f.id)));
    setAssets((prev) => prev.map((a) => a.folderId && descendantIds.has(a.folderId) ? { ...a, folderId: undefined } : a));
    if (descendantIds.has(folderFilter)) setFolderFilter("ALL");
  }

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
    <div className="flex gap-4">
      {/* Folder sidebar */}
      <FolderSidebar
        folders={folders}
        selectedFolder={folderFilter}
        onSelect={setFolderFilter}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
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
                    <td className="px-4 py-3 text-slate-500 tabular-nums">{formatBytes(a.sizeBytes)}</td>
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
                        {a.status === "ACTIVE" && (
                          <button
                            title="미리보기"
                            onClick={() => setPreviewingAsset(a)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                        )}
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
                    {a.status === "ACTIVE" && (
                      <button
                        title="미리보기"
                        onClick={() => setPreviewingAsset(a)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                    )}
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
                  <p className="text-xs text-slate-400 mt-0.5">{formatBytes(a.sizeBytes)} · {a.uploadedAt}</p>
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

      {previewingAsset && (
        <PreviewModal
          asset={previewingAsset}
          onClose={() => setPreviewingAsset(null)}
        />
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
      </div>{/* end main content */}
    </div>
  );
}
