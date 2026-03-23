"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Megaphone,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const BASE = "/experiments/platform-admin";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      { href: BASE, label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    label: "테넌트 관리",
    items: [
      { href: `${BASE}/tenants`,  label: "테넌트 목록", icon: Building2 },
      { href: `${BASE}/billing`,  label: "청구/결제",   icon: CreditCard },
    ],
  },
  {
    label: "플랫폼",
    items: [
      { href: `${BASE}/announcements`, label: "플랫폼 공지", icon: Megaphone },
      { href: `${BASE}/settings`,      label: "플랫폼 설정", icon: Settings },
    ],
  },
];

export default function PlatformAdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === BASE) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-30 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-sm">OpenKnock</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label || "_root"}>
            {group.label && (
              <p className="px-3 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
          운
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-800 truncate">운영팀</p>
          <p className="text-xs text-slate-400 truncate">ops@open-knock.com</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
