import { activityFeed, type ActivityItem } from "../mockData";
import { BookOpen, UserPlus, XCircle, Send } from "lucide-react";

const ICON_MAP: Record<ActivityItem["type"], React.ReactNode> = {
  publish: <BookOpen size={14} className="text-violet-600" />,
  enroll:  <Send size={14} className="text-emerald-600" />,
  cancel:  <XCircle size={14} className="text-red-500" />,
  invite:  <UserPlus size={14} className="text-blue-500" />,
};

const BG_MAP: Record<ActivityItem["type"], string> = {
  publish: "bg-violet-50",
  enroll:  "bg-emerald-50",
  cancel:  "bg-red-50",
  invite:  "bg-blue-50",
};

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">최근 활동</h2>
      <ul className="flex flex-col gap-3">
        {activityFeed.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-full ${BG_MAP[item.type]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {ICON_MAP[item.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{item.message}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
