"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenantContextStore } from "../../shared/tenant-context-store";
import { useStudentAuthStore } from "../../shared/auth-store";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Search,
  ShoppingCart,
  Heart,
  User,
  CheckCheck,
  GraduationCap,
  LogOut,
} from "lucide-react";
import {
  type NotifItem,
  MOCK_NOTIFS,
  NOTIF_ICON,
} from "../../shared/notification-data";

// Mock: 현재 사용자 역할
const CURRENT_USER_ROLES = ["STUDENT", "INSTRUCTOR"];

export interface CardActions {
  cart: Set<string>;
  wishlist: Set<string>;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
}

export function Navbar({ cartCount }: { cartCount: number }) {
  const router = useRouter();
  const { tenant, switchTenant } = useTenantContextStore();
  const { features } = tenant;
  const { isLoggedIn, logout } = useStudentAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotifItem[]>(MOCK_NOTIFS);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifs.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const handleNotifClick = (notif: NotifItem) => {
    markRead(notif.id);
    if (notif.linkUrl) {
      setNotifOpen(false);
      router.push(notif.linkUrl);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/student" className="shrink-0">
          <Image
            src="/lotte.png"
            alt="롯데건설"
            width={100 * 1.3}
            height={28 * 1.3}
            className="object-contain"
          />
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center">
            {searchOpen ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchValue.trim()) {
                    router.push(
                      `/student/search?q=${encodeURIComponent(searchValue.trim())}`,
                    );
                    setSearchOpen(false);
                    setSearchValue("");
                  }
                }}
                className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden"
              >
                <Search className="w-4 h-4 text-zinc-500 ml-3 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => {
                    if (!searchValue) setSearchOpen(false);
                  }}
                  placeholder="강의 검색..."
                  className="bg-transparent px-2 py-2 text-sm text-white placeholder-zinc-600 w-48 focus:outline-none"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-violet-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                {/* Dropdown header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-semibold text-white">
                      알림
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded-full font-medium">
                        {unreadCount}개
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="max-h-80 overflow-y-auto">
                  {notifs.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-zinc-800/60 last:border-0 transition-colors hover:bg-zinc-800/50 ${
                        !notif.read ? "bg-violet-500/5" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          !notif.read ? "bg-zinc-800" : "bg-zinc-800/50"
                        }`}
                      >
                        {NOTIF_ICON[notif.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-semibold leading-none mb-1 ${!notif.read ? "text-white" : "text-zinc-400"}`}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mb-1" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 leading-snug line-clamp-2">
                          {notif.body}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 전체보기 link */}
                <Link
                  href="/student/my/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="block text-center px-4 py-2.5 text-xs text-violet-400 hover:text-violet-300 border-t border-zinc-800 transition-colors"
                >
                  전체보기
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist — [B2C only] */}
          {features.cart && (
            <Link
              href="/student/wishlist"
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>
          )}

          {/* Cart — [B2C only] */}
          {features.cart && (
            <Link
              href="/student/cart"
              className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* 강사 포털 — [INSTRUCTOR only] */}
          {CURRENT_USER_ROLES.includes("INSTRUCTOR") && (
            <Link
              href="/instructor"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden md:block">강사 포털</span>
            </Link>
          )}

          {/* My page / Login */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1">
              <Link
                href="/student/my"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/student/login"
              className="px-4 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-colors"
            >
              로그인
            </Link>
          )}

          {/* DEV: Tenant Switcher */}
          <div className="hidden md:flex items-center gap-1 ml-2 px-2 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
            <button
              onClick={() => switchTenant("B2C")}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                tenant.tenantType === "B2C"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              B2C
            </button>
            <button
              onClick={() => switchTenant("B2B")}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                tenant.tenantType === "B2B"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              B2B
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
