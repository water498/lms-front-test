"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { GraduationCap, LogOut, User, ChevronDown } from "lucide-react";

export default function TopHeader() {
  const { user, role, tenantType, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleLabel = role === "ORG_ADMIN" ? "관리자" : role === "INSTRUCTOR" ? "강사" : role ?? "";
  const tenantLabel = tenantType === "B2B" ? "B2B" : "B2C";

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/backoffice" className="text-sm font-bold text-slate-900 hover:text-violet-600 transition-colors">
          Backoffice
        </Link>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 font-medium">
          {roleLabel} · {tenantLabel}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Portal switch */}
        <Link
          href="/student"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
        >
          <GraduationCap size={14} />
          학습 포털
        </Link>

        {/* Account dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
              {user?.name?.[0] ?? "?"}
            </div>
            <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate hidden sm:inline">
              {user?.name ?? "사용자"}
            </span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">{user?.name ?? "사용자"}</p>
                <p className="text-xs text-slate-400">{user?.email ?? ""}</p>
              </div>
              <Link
                href="/backoffice/account"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <User size={14} />
                내 계정
              </Link>
              <button
                onClick={() => { logout(); window.location.href = "/login"; }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
