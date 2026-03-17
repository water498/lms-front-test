"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const PAGE_TITLE_MAP: { prefix: string; label: string }[] = [
  { prefix: "/experiments/platform-admin/tenants/", label: "기업 상세" },
  { prefix: "/experiments/platform-admin/tenants",  label: "기업 목록" },
  { prefix: "/experiments/platform-admin/settings", label: "플랫폼 설정" },
  { prefix: "/experiments/platform-admin",          label: "대시보드" },
];

export default function PlatformAdminTopbar() {
  const pathname = usePathname();
  const title =
    PAGE_TITLE_MAP.find((m) => pathname.startsWith(m.prefix))?.label ?? "Platform Admin";

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20">
      <h1 className="flex-1 text-sm font-semibold text-slate-700">{title}</h1>
      <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
        <Bell size={18} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
          운
        </div>
        <span className="text-sm text-slate-700 font-medium">운영팀</span>
      </div>
    </header>
  );
}
