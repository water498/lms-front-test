"use client";

import type { StoredPackage } from "../package-store";
import type { ScormVersion } from "../manifest-parser";

type PackageSummary = Omit<StoredPackage, "zip">;

interface Props {
  packages: PackageSummary[];
  selectedId: string | null;
  onSelect: (pkg: PackageSummary) => void;
  onDelete: (manifestId: string) => void;
}

const VERSION_BADGE: Record<ScormVersion, string> = {
  "1.2": "bg-blue-100 text-blue-600",
  "2004": "bg-violet-100 text-violet-600",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function CachedPackagesList({ packages, selectedId, onSelect, onDelete }: Props) {
  if (packages.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
        저장된 패키지 ({packages.length}개)
      </p>
      <div className="space-y-2">
        {packages.map((pkg) => (
          <div
            key={pkg.manifestId}
            className={`
              flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors
              ${selectedId === pkg.manifestId
                ? "border-blue-400 bg-blue-50"
                : "border-zinc-200 bg-white hover:border-zinc-300"
              }
            `}
            onClick={() => onSelect(pkg)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-zinc-800 text-sm truncate">{pkg.title}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${VERSION_BADGE[pkg.version]}`}>
                  SCORM {pkg.version}
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                {formatDate(pkg.savedAt)} · {formatBytes(pkg.sizeBytes)}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(pkg.manifestId); }}
              className="shrink-0 text-xs text-zinc-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
