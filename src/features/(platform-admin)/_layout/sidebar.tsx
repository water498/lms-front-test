"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const BASE = "/experiments/platform-admin";

type NavLink = {
  kind: "link";
  href: string;
  label: string;
  icon: React.ElementType;
};
type NavPlaceholder = {
  kind: "placeholder";
  label: string;
  icon: React.ElementType;
};
type NavItem = NavLink | NavPlaceholder;
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      { kind: "link", href: BASE, label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    label: "B2B 기업 관리",
    items: [
      {
        kind: "link",
        href: `${BASE}/tenants`,
        label: "기업 목록",
        icon: Building2,
      },
    ],
  },
  {
    label: "B2C 운영",
    items: [{ kind: "placeholder", label: "B2C 운영", icon: Users }],
  },
  {
    label: "플랫폼 설정",
    items: [
      { kind: "link", href: `${BASE}/settings`, label: "플랫폼 설정", icon: Settings },
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
              {group.items.map((item) =>
                item.kind === "placeholder" ? (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed select-none"
                    title="준비중"
                  >
                    <item.icon size={16} />
                    {item.label}
                    <span className="ml-auto text-xs bg-slate-100 text-slate-400 rounded px-1.5 py-0.5">
                      준비중
                    </span>
                  </div>
                ) : (
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
                ),
              )}
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
