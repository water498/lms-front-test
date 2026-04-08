"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "general", label: "일반",      slug: "general" },
  { id: "org",     label: "조직 구조",  slug: "org" },
  { id: "access",  label: "접근 관리",  slug: "access" },
  { id: "audit",   label: "감사로그",   slug: "audit" },
];

const BASE = "/experiments/admin/settings";

export default function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {TABS.map((tab) => {
          const tabHref = `${BASE}/${tab.slug}`;
          const isActive = pathname === tabHref || pathname.startsWith(tabHref + "/");
          return (
            <Link
              key={tab.id}
              href={tabHref}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {children}
      </div>
    </div>
  );
}
