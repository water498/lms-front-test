"use client";

import { useState } from "react";
import { Megaphone, Plus, X, Trash2 } from "lucide-react";
import { ANNOUNCEMENTS } from "./mockData";
import type { PlatformAnnouncement, PlatformAnnouncementStatus } from "@/lib/models";

// ── 상수 ───────────────────────────────────────────────────

type PlatformSubtype = "MAINTENANCE" | "UPDATE" | "URGENT" | "GENERAL";

const TYPE_CFG: Record<PlatformSubtype, { label: string; cls: string }> = {
  MAINTENANCE: { label: "점검",    cls: "bg-amber-100 text-amber-700" },
  UPDATE:      { label: "업데이트", cls: "bg-blue-100 text-blue-700" },
  URGENT:      { label: "긴급",    cls: "bg-red-100 text-red-700" },
  GENERAL:     { label: "일반",    cls: "bg-slate-100 text-slate-600" },
};

const STATUS_CFG: Record<PlatformAnnouncementStatus, { label: string; cls: string }> = {
  PUBLISHED:   { label: "게시 중",  cls: "text-green-600 font-medium" },
  UNPUBLISHED: { label: "비게시",   cls: "text-slate-400" },
};

function dateLabel(ann: PlatformAnnouncement): string {
  if (ann.status === "PUBLISHED" && ann.sentAt)
    return new Date(ann.sentAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
  return new Date(ann.createdAt).toLocaleDateString("ko-KR");
}

// ── 작성 모달 ───────────────────────────────────────────────

function ComposeModal({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: PlatformAnnouncement;
}) {
  const [type, setType] = useState<PlatformSubtype>((initialData?.subtype as PlatformSubtype) ?? "GENERAL");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.content ?? "");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{initialData ? "공지 편집" : "새 공지 작성"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* 유형 */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">공지 유형</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(TYPE_CFG) as PlatformSubtype[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    type === t
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {TYPE_CFG[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">내용</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="공지 내용을 입력하세요"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 상세 드로어 ─────────────────────────────────────────────

function PlatformAnnouncementDetail({
  ann,
  effectiveStatus,
  onClose,
}: {
  ann: PlatformAnnouncement;
  effectiveStatus: PlatformAnnouncementStatus;
  onClose: () => void;
}) {
  const typeCfg = TYPE_CFG[(ann.subtype as PlatformSubtype) ?? "GENERAL"];
  const statusCfg = STATUS_CFG[effectiveStatus];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeCfg.cls}`}>
            {typeCfg.label}
          </span>
          <h3 className="text-sm font-semibold text-slate-800">{ann.title}</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-4 text-xs text-slate-500 mb-4 flex-wrap">
        <span>작성: {ann.createdBy}</span>
        <span className={statusCfg.cls}>{statusCfg.label}</span>
        {ann.sentAt && effectiveStatus === "PUBLISHED" && (
          <span>{dateLabel(ann)}</span>
        )}
      </div>
      <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 leading-relaxed">
        {ann.content}
      </pre>
    </div>
  );
}

// ── 메인 ───────────────────────────────────────────────────

export default function PlatformAnnouncementsFeature() {
  const [showCompose, setShowCompose] = useState(false);
  const [editTarget, setEditTarget] = useState<PlatformAnnouncement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, PlatformAnnouncementStatus>>({});
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const effectiveStatus = (ann: PlatformAnnouncement): PlatformAnnouncementStatus =>
    statusOverrides[ann.id] ?? ann.status;

  const visibleAnnouncements = ANNOUNCEMENTS.filter((a) => !deletedIds.includes(a.id));

  const publishedCount   = visibleAnnouncements.filter((a) => effectiveStatus(a) === "PUBLISHED").length;
  const unpublishedCount = visibleAnnouncements.filter((a) => effectiveStatus(a) === "UNPUBLISHED").length;

  const selectedAnn = selectedId
    ? visibleAnnouncements.find((a) => a.id === selectedId) ?? null
    : null;

  function deleteAnn(id: string) {
    setDeletedIds((prev) => [...prev, id]);
    if (selectedId === id) setSelectedId(null);
  }

  function togglePublish(ann: PlatformAnnouncement) {
    const current = effectiveStatus(ann);
    const next: PlatformAnnouncementStatus = current === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
    setStatusOverrides((prev) => ({ ...prev, [ann.id]: next }));
  }

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">플랫폼 공지</h2>
          <p className="text-sm text-slate-500">전체 테넌트 어드민에게 공지 게시</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          새 공지 작성
        </button>
      </div>

      {/* 통계 칩 */}
      <div className="flex gap-3">
        <StatChip label="전체"   value={visibleAnnouncements.length} cls="bg-slate-100 text-slate-700" />
        <StatChip label="게시 중" value={publishedCount}       cls="bg-green-100 text-green-700" />
        <StatChip label="비게시"  value={unpublishedCount}     cls="bg-slate-100 text-slate-500" />
      </div>

      {/* 상세 패널 */}
      {selectedAnn && (
        <PlatformAnnouncementDetail
          ann={selectedAnn}
          effectiveStatus={effectiveStatus(selectedAnn)}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* 목록 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["유형", "제목", "상태", "일시", ""].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleAnnouncements.map((ann) => {
              const typeCfg = TYPE_CFG[(ann.subtype as PlatformSubtype) ?? "GENERAL"];
              const es = effectiveStatus(ann);
              const statusCfg = STATUS_CFG[es];
              const isSelected = selectedId === ann.id;
              return (
                <tr
                  key={ann.id}
                  className={`border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedId(isSelected ? null : ann.id)}
                >
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeCfg.cls}`}>
                      {typeCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                    {ann.title}
                  </td>
                  <td className={`px-4 py-3 text-xs ${statusCfg.cls}`}>
                    {statusCfg.label}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {dateLabel(ann)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => { setEditTarget(ann); setShowCompose(true); }}
                        className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        편집
                      </button>
                      <button
                        onClick={() => deleteAnn(ann.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => togglePublish(ann)}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                          es === "PUBLISHED"
                            ? "text-slate-600 border-slate-200 hover:bg-slate-50"
                            : "text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        {es === "PUBLISHED" ? "내리기" : "게시"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCompose && (
        <ComposeModal
          onClose={() => { setShowCompose(false); setEditTarget(null); }}
          initialData={editTarget ?? undefined}
        />
      )}
    </div>
  );
}

function StatChip({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${cls}`}>
      {label} {value}
    </span>
  );
}
