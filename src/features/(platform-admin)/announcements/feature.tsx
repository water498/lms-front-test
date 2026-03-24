"use client";

import { useState } from "react";
import { Megaphone, Plus, X } from "lucide-react";
import { ANNOUNCEMENTS } from "./mockData";
import { TENANTS } from "../tenants/mockData";
import type { Announcement, AnnouncementStatus } from "@/lib/models";

// ── 상수 ───────────────────────────────────────────────────

type PlatformSubtype = "MAINTENANCE" | "UPDATE" | "URGENT" | "GENERAL";

const TYPE_CFG: Record<PlatformSubtype, { label: string; cls: string }> = {
  MAINTENANCE: { label: "점검",   cls: "bg-amber-100 text-amber-700" },
  UPDATE:      { label: "업데이트", cls: "bg-blue-100 text-blue-700" },
  URGENT:      { label: "긴급",   cls: "bg-red-100 text-red-700" },
  GENERAL:     { label: "일반",   cls: "bg-slate-100 text-slate-600" },
};

const STATUS_CFG: Record<"DRAFT" | "SCHEDULED" | "PUBLISHED", { label: string; cls: string }> = {
  DRAFT:     { label: "초안",    cls: "text-slate-400" },
  SCHEDULED: { label: "예약 게시", cls: "text-amber-600 font-medium" },
  PUBLISHED: { label: "게시 중",  cls: "text-green-600 font-medium" },
};

function targetLabel(ann: Announcement): string {
  if (ann.targetType === "ALL_TENANTS") return "전체 테넌트";
  if (ann.targetIds) return `${ann.targetIds.length}개 테넌트`;
  return "—";
}

function dateLabel(ann: Announcement, effectiveStatus: AnnouncementStatus): string {
  if (effectiveStatus === "PUBLISHED" && ann.sentAt)
    return new Date(ann.sentAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
  if (effectiveStatus === "SCHEDULED" && ann.scheduledAt)
    return `예약: ${new Date(ann.scheduledAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}`;
  return new Date(ann.createdAt).toLocaleDateString("ko-KR");
}

// ── 작성 모달 ───────────────────────────────────────────────

function ComposeModal({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: Announcement;
}) {
  const [type, setType] = useState<PlatformSubtype>((initialData?.subtype as PlatformSubtype) ?? "GENERAL");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.content ?? "");
  const [targetAll, setTargetAll] = useState(initialData ? initialData.targetType === "ALL_TENANTS" : true);
  const [selectedTenants, setSelectedTenants] = useState<string[]>(
    initialData?.targetIds ?? [],
  );
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  function toggleTenant(id: string) {
    setSelectedTenants((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

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

          {/* 게시 대상 */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">게시 대상</label>
            <div className="flex gap-3 mb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={targetAll}
                  onChange={() => setTargetAll(true)}
                  className="accent-blue-600"
                />
                전체 테넌트
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={!targetAll}
                  onChange={() => setTargetAll(false)}
                  className="accent-blue-600"
                />
                테넌트 선택
              </label>
            </div>
            {!targetAll && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg">
                {TENANTS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTenant(t.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                      selectedTenants.includes(t.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 게시 시점 */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">게시 시점</label>
            <div className="flex gap-3 mb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={!scheduleMode}
                  onChange={() => setScheduleMode(false)}
                  className="accent-blue-600"
                />
                즉시 게시
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={scheduleMode}
                  onChange={() => setScheduleMode(true)}
                  className="accent-blue-600"
                />
                예약 게시
              </label>
            </div>
            {scheduleMode && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
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
            className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            초안 저장
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {scheduleMode ? "예약 게시" : "게시"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 상세 드로어 ─────────────────────────────────────────────

function AnnouncementDetail({
  ann,
  effectiveStatus,
  onClose,
}: {
  ann: Announcement;
  effectiveStatus: AnnouncementStatus;
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
        <span>대상: {targetLabel(ann)}</span>
        <span className={statusCfg.cls}>{statusCfg.label}</span>
        {ann.sentAt && effectiveStatus === "PUBLISHED" && <span>{dateLabel(ann, effectiveStatus)}</span>}
        {ann.scheduledAt && effectiveStatus === "SCHEDULED" && <span>{dateLabel(ann, effectiveStatus)}</span>}
      </div>
      <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 leading-relaxed">
        {ann.content}
      </pre>
    </div>
  );
}

// ── 메인 ───────────────────────────────────────────────────

export default function AnnouncementsFeature() {
  const [showCompose, setShowCompose] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AnnouncementStatus>>({});

  const effectiveStatus = (ann: Announcement): AnnouncementStatus =>
    statusOverrides[ann.id] ?? ann.status;

  const publishedCount = ANNOUNCEMENTS.filter((a) => effectiveStatus(a) === "PUBLISHED").length;
  const scheduledCount = ANNOUNCEMENTS.filter((a) => effectiveStatus(a) === "SCHEDULED").length;
  const draftCount = ANNOUNCEMENTS.filter((a) => effectiveStatus(a) === "DRAFT").length;

  const selectedAnn = selectedId
    ? ANNOUNCEMENTS.find((a) => a.id === selectedId) ?? null
    : null;

  function togglePublish(ann: Announcement) {
    const current = effectiveStatus(ann);
    const next: AnnouncementStatus = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setStatusOverrides((prev) => ({ ...prev, [ann.id]: next }));
  }

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">플랫폼 공지</h2>
          <p className="text-sm text-slate-500">전체 또는 특정 테넌트 어드민에게 공지 게시</p>
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
        <StatChip label="전체" value={ANNOUNCEMENTS.length} cls="bg-slate-100 text-slate-700" />
        <StatChip label="게시 중" value={publishedCount} cls="bg-green-100 text-green-700" />
        <StatChip label="예약 게시" value={scheduledCount} cls="bg-amber-100 text-amber-700" />
        <StatChip label="초안" value={draftCount} cls="bg-slate-100 text-slate-500" />
      </div>

      {/* 상세 패널 */}
      {selectedAnn && (
        <AnnouncementDetail
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
              {["유형", "제목", "게시 대상", "상태", "일시", ""].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANNOUNCEMENTS.map((ann) => {
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
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {targetLabel(ann)}
                  </td>
                  <td className={`px-4 py-3 text-xs ${statusCfg.cls}`}>
                    {statusCfg.label}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {dateLabel(ann, es)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 justify-end">
                      {(es === "DRAFT" || es === "PUBLISHED") && (
                        <button
                          onClick={() => { setEditTarget(ann); setShowCompose(true); }}
                          className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                        >
                          편집
                        </button>
                      )}
                      {(es === "DRAFT" || es === "PUBLISHED") && (
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
                      )}
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
