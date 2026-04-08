"use client";

import { Download, File, FileText, Presentation, FileSpreadsheet } from "lucide-react";
import type { StudentResource } from "../mockData";

const MIME_ICON_DARK: Record<string, React.ReactNode> = {
  "application/pdf": <FileText size={16} className="text-red-400" />,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": <Presentation size={16} className="text-orange-400" />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FileSpreadsheet size={16} className="text-green-400" />,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ResourcesTabProps {
  resources: StudentResource[];
}

export function ResourcesTab({ resources }: ResourcesTabProps) {
  if (resources.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500 text-sm">등록된 자료가 없습니다.</div>
    );
  }

  const categories = Array.from(new Set(resources.map((r) => r.category ?? "기타")));
  const grouped = categories.map((cat) => ({
    category: cat,
    items: resources.filter((r) => (r.category ?? "기타") === cat),
  }));

  return (
    <div className="flex flex-col gap-3">
      {grouped.map(({ category, items }) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 px-1">
            {category}
          </h3>
          <div className="flex flex-col gap-2">
            {items.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
              >
                <span className="shrink-0">
                  {MIME_ICON_DARK[r.mimeType] ?? <File size={16} className="text-zinc-500" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{r.title}</p>
                  {r.description && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{r.description}</p>
                  )}
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    {r.fileName} · {formatFileSize(r.fileSizeBytes)}
                  </p>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-400 border border-zinc-700 hover:border-violet-500 rounded-lg transition-colors">
                  <Download size={12} />
                  다운로드
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
