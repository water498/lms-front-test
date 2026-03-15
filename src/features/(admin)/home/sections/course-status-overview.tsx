import Link from "next/link";
import { courseStatusCounts } from "../mockData";

const STATUS_CONFIG = [
  { key: "PUBLISHED" as const, label: "게시됨",    color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "DRAFT"     as const, label: "임시저장",  color: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50" },
  { key: "ARCHIVED"  as const, label: "보관됨",    color: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-100" },
];

const total = Object.values(courseStatusCounts).reduce((a, b) => a + b, 0);

export default function CourseStatusOverview() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">코스 현황</h2>

      {/* Bar */}
      <div className="flex rounded-full overflow-hidden h-3 mb-4">
        {STATUS_CONFIG.map(({ key, color }) => (
          <div
            key={key}
            className={`${color} transition-all`}
            style={{ width: `${(courseStatusCounts[key] / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3">
        {STATUS_CONFIG.map(({ key, label, text, bg }) => (
          <Link
            key={key}
            href="/experiments/admin/courses"
            className={`flex-1 ${bg} rounded-lg px-3 py-2 text-center hover:opacity-80 transition-opacity`}
          >
            <p className={`text-lg font-bold ${text}`}>{courseStatusCounts[key]}</p>
            <p className={`text-xs ${text} opacity-80`}>{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
