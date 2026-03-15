"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Building2,
  ClipboardList,
  Award,
  Megaphone,
  CreditCard,
  HardDrive,
  MessageSquare,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      { href: "/experiments/admin",             label: "대시보드",       icon: LayoutDashboard },
    ],
  },
  {
    label: "학습 관리",
    items: [
      { href: "/experiments/admin/courses",     label: "과정 관리",      icon: BookOpen },
      { href: "/experiments/admin/enrollments", label: "수강 관리",      icon: GraduationCap },
      { href: "/experiments/admin/assessments", label: "평가 관리",      icon: ClipboardList },
      { href: "/experiments/admin/certificates",label: "수료증",         icon: Award },
      { href: "/experiments/admin/media",       label: "미디어 라이브러리", icon: HardDrive },
    ],
  },
  {
    label: "사용자",
    items: [
      { href: "/experiments/admin/users",       label: "유저 관리",      icon: Users },
    ],
  },
  {
    label: "커뮤니케이션",
    items: [
      { href: "/experiments/admin/announcements", label: "공지·메시지",  icon: Megaphone },
      { href: "/experiments/admin/messaging",     label: "메시지 발송",  icon: MessageSquare },
    ],
  },
  {
    label: "운영",
    items: [
      { href: "/experiments/admin/payments",    label: "결제 내역",      icon: CreditCard },
      { href: "/experiments/admin/settings",    label: "설정",           icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/experiments/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-30 overflow-y-auto">
      {/* Org logo + name */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <Building2 size={16} className="text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-sm">ACME Corp</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {group.label && (
              <p className="px-3 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-violet-50 text-violet-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user info */}
      <div className="border-t border-slate-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
          관
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-800 truncate">관리자</p>
          <p className="text-xs text-slate-400 truncate">admin@acme.com</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
