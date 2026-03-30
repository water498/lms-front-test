"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useInstructorAuthStore } from "../shared/auth-store";
import {
  LayoutDashboard,
  BookOpen,
  Wallet,
  CreditCard,
  Star,
  User,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { CURRENT_INSTRUCTOR_NAME } from "../shared/mockData";

const BASE = "/experiments/instructor";

const NAV_ITEMS = [
  { href: BASE, label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: `${BASE}/sessions`, label: "내 과정", icon: BookOpen },
  { href: `${BASE}/payouts`, label: "정산 내역", icon: Wallet },
  { href: `${BASE}/bank`, label: "계좌 정보", icon: CreditCard },
  { href: `${BASE}/reviews`, label: "내 리뷰", icon: Star },
  { href: `${BASE}/profile`, label: "프로필", icon: User },
];

export default function InstructorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useInstructorAuthStore();

  function handleLogout() {
    logout();
    router.push("/experiments/instructor/login");
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center px-5 h-14 border-b border-zinc-800 shrink-0">
        <Image
          src="/lotte.png"
          alt="롯데건설"
          width={100 * 1.3}
          height={28 * 1.3}
          className="object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-800 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
          {CURRENT_INSTRUCTOR_NAME[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">
            {CURRENT_INSTRUCTOR_NAME}
          </p>
          <Link
            href="/experiments/student"
            className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← 수강생 웹으로
          </Link>
        </div>
        <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
