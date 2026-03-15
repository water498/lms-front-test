"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const PAGE_TITLE_MAP: { prefix: string; label: string }[] = [
  { prefix: "/experiments/admin/courses/",      label: "과정 상세" },
  { prefix: "/experiments/admin/courses",       label: "과정 관리" },
  { prefix: "/experiments/admin/users/",        label: "유저 상세" },
  { prefix: "/experiments/admin/users",         label: "유저 관리" },
  { prefix: "/experiments/admin/enrollments",   label: "수강 관리" },
  { prefix: "/experiments/admin/assessments",   label: "평가 관리" },
  { prefix: "/experiments/admin/certificates",  label: "수료증" },
  { prefix: "/experiments/admin/announcements", label: "공지·메시지" },
  { prefix: "/experiments/admin/messaging",     label: "메시지 발송" },
  { prefix: "/experiments/admin/media",         label: "미디어 라이브러리" },
  { prefix: "/experiments/admin/payments",      label: "결제 내역" },
  { prefix: "/experiments/admin/settings",      label: "설정" },
  { prefix: "/experiments/admin",               label: "대시보드" },
];

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLE_MAP.find((m) => pathname.startsWith(m.prefix))?.label ?? "관리자";

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20">
      <h1 className="flex-1 text-sm font-semibold text-slate-700">{title}</h1>
      <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
        <Bell size={18} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
          관
        </div>
        <span className="text-sm text-slate-700 font-medium">관리자</span>
      </div>
    </header>
  );
}
