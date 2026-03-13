import { announcements } from "../mockData";

const ANNOUNCEMENT_TYPE_STYLES: Record<string, string> = {
  "공지":     "bg-zinc-700/50 text-zinc-300",
  "이벤트":   "bg-rose-900/40 text-rose-300",
  "업데이트": "bg-sky-900/40 text-sky-300",
};

export function AnnouncementGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">공지 · 이벤트</h3>
        <button className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">전체 보기 →</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-3.5 cursor-pointer transition-colors group"
          >
            <span
              className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                ANNOUNCEMENT_TYPE_STYLES[ann.type]
              }`}
            >
              {ann.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                  {ann.title}
                </p>
                {ann.isNew && (
                  <span className="shrink-0 text-[10px] font-bold text-violet-400">NEW</span>
                )}
              </div>
              <p className="text-xs text-zinc-600 mt-1">{ann.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
