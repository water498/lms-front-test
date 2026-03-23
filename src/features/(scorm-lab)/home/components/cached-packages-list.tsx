"use client";

import { useState } from "react";
import type { StoredPackage } from "../package-store";
import type { ScormVersion } from "../manifest-parser";
import { loadSession, formatSavedTime } from "../session-store";

type PackageSummary = Omit<StoredPackage, "zip">;

interface Props {
  packages: PackageSummary[];
  selectedId: string | null;
  learnerId: string;
  onSelect: (pkg: PackageSummary) => void;
  onDelete: (manifestId: string) => void;
}

const VERSION_BADGE: Record<ScormVersion, string> = {
  "1.2": "bg-blue-100 text-blue-600",
  "2004": "bg-violet-100 text-violet-600",
};

const STATUS_LABELS: Record<string, string> = {
  "not attempted": "미시작", incomplete: "진행중", completed: "완료",
  passed: "통과", failed: "실패", unknown: "—", browsed: "열람",
};
const STATUS_COLORS: Record<string, string> = {
  "not attempted": "text-zinc-400", incomplete: "text-amber-500",
  completed: "text-emerald-600", passed: "text-emerald-600",
  failed: "text-red-500", unknown: "text-zinc-400", browsed: "text-blue-500",
};

function getStatus(version: ScormVersion, data: Record<string, string>): string {
  if (version === "1.2") return data["cmi.core.lesson_status"] ?? "not attempted";
  const s = data["cmi.success_status"] ?? "unknown";
  if (s === "passed") return "passed";
  if (s === "failed") return "failed";
  return data["cmi.completion_status"] ?? "not attempted";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CachedPackagesList({ packages, selectedId, learnerId, onSelect, onDelete }: Props) {
  const [expandedSuspend, setExpandedSuspend] = useState<Set<string>>(new Set());

  if (packages.length === 0) return null;

  const toggleSuspend = (manifestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSuspend((prev) => {
      const next = new Set(prev);
      next.has(manifestId) ? next.delete(manifestId) : next.add(manifestId);
      return next;
    });
  };

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
        저장된 패키지 ({packages.length}개)
      </p>
      <div className="space-y-2">
        {packages.map((pkg) => {
          const session = loadSession(pkg.manifestId, learnerId);
          const status = session ? getStatus(pkg.version, session.data) : null;
          const score = session
            ? (pkg.version === "1.2" ? session.data["cmi.core.score.raw"] : session.data["cmi.score.raw"])
            : null;
          const scoreMax = session
            ? (pkg.version === "1.2" ? session.data["cmi.core.score.max"] : session.data["cmi.score.max"])
            : null;
          const suspendData = session?.data["cmi.suspend_data"] ?? "";
          const location = session
            ? (pkg.version === "1.2" ? session.data["cmi.core.lesson_location"] : session.data["cmi.location"])
            : "";
          const isExpanded = expandedSuspend.has(pkg.manifestId);

          return (
            <div
              key={pkg.manifestId}
              className={`
                rounded-xl border cursor-pointer transition-colors
                ${selectedId === pkg.manifestId
                  ? "border-blue-400 bg-blue-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
                }
              `}
              onClick={() => onSelect(pkg)}
            >
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  {/* 타이틀 행 */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-zinc-800 text-sm truncate">{pkg.title}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${VERSION_BADGE[pkg.version]}`}>
                      SCORM {pkg.version}
                    </span>
                    {status !== null && status !== "not attempted" && (
                      <span className={`text-xs font-semibold shrink-0 ${STATUS_COLORS[status] ?? "text-zinc-400"}`}>
                        ● {STATUS_LABELS[status] ?? status}
                      </span>
                    )}
                  </div>

                  {/* 메타 행 */}
                  <div className="text-xs text-zinc-400">
                    {formatBytes(pkg.sizeBytes)}
                    {session && <span> · 저장: {formatSavedTime(session.lastSaved)}</span>}
                  </div>

                  {/* 진행 정보 행 */}
                  {session && (score || location) && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                      {score && <span>점수 {score}{scoreMax ? ` / ${scoreMax}` : ""}</span>}
                      {score && location && <span className="text-zinc-300">·</span>}
                      {location && <span>위치: <span className="font-mono">{location}</span></span>}
                    </div>
                  )}

                  {/* suspend_data 토글 */}
                  {suspendData && (
                    <button
                      onClick={(e) => toggleSuspend(pkg.manifestId, e)}
                      className="mt-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      suspend_data · {suspendData.length.toLocaleString()}자 {isExpanded ? "▾" : "▸"}
                    </button>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(pkg.manifestId); }}
                  className="shrink-0 text-xs text-zinc-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </div>

              {/* suspend_data 펼침 */}
              {isExpanded && suspendData && (
                <div
                  className="mx-3 mb-3 rounded-lg bg-zinc-900 p-3 overflow-auto max-h-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap break-all leading-5">
                    {suspendData}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
