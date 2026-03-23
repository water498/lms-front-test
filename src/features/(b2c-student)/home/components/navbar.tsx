"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenantContextStore } from "../../shared/tenant-context-store";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  BookOpen,
  Award,
  Megaphone,
  MessageCircle,
  Settings,
  CheckCheck,
} from "lucide-react";

interface NotifItem {
  id: string;
  type: "ENROLLMENT" | "CERT_ISSUED" | "QNA_ANSWERED" | "ANNOUNCEMENT" | "SYSTEM";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFS: NotifItem[] = [
  { id: "n1", type: "QNA_ANSWERED", title: "Q&A 답변 도착", body: "\"랜덤 포레스트 n_estimators 파라미터\" 질문에 강사님이 답변했습니다.", time: "2분 전", read: false },
  { id: "n2", type: "CERT_ISSUED", title: "수료증 발급 완료", body: "JavaScript 핵심 개념 과정의 수료증이 발급되었습니다.", time: "1시간 전", read: false },
  { id: "n3", type: "ANNOUNCEMENT", title: "봄맞이 전 강의 30% 할인", body: "3월 31일까지 모든 강의를 30% 할인된 가격으로 수강하세요.", time: "2일 전", read: true },
  { id: "n4", type: "ENROLLMENT", title: "수강 등록 완료", body: "React + TypeScript 실전 프로젝트 강의 수강 등록이 완료되었습니다.", time: "3일 전", read: true },
  { id: "n5", type: "SYSTEM", title: "프로필 정보 업데이트 안내", body: "2026년 4월 1일부터 프로필 사진 형식 정책이 변경됩니다.", time: "1주 전", read: true },
];

const NOTIF_ICON: Record<NotifItem["type"], React.ReactNode> = {
  ENROLLMENT: <BookOpen className="w-4 h-4 text-violet-400" />,
  CERT_ISSUED: <Award className="w-4 h-4 text-amber-400" />,
  QNA_ANSWERED: <MessageCircle className="w-4 h-4 text-sky-400" />,
  ANNOUNCEMENT: <Megaphone className="w-4 h-4 text-emerald-400" />,
  SYSTEM: <Settings className="w-4 h-4 text-zinc-400" />,
};

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
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

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const navCategories = ["프론트엔드", "백엔드", "데이터", "AI/ML", "모바일", "디자인", "DevOps"];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/experiments/b2c-student" className="text-xl font-bold text-white shrink-0">
          Open<span className="text-violet-400">Knock</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/experiments/b2c-student/search" className="px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            강의 탐색
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
              카테고리
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-xl shadow-black/40 py-1 z-50">
                {navCategories.map((cat) => (
                  <button
                    key={cat}
                    className="block w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            로드맵
          </button>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center">
            {searchOpen ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchValue.trim()) {
                    router.push(`/experiments/b2c-student/search?q=${encodeURIComponent(searchValue.trim())}`);
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
                  onBlur={() => { if (!searchValue) setSearchOpen(false); }}
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
                    <span className="text-sm font-semibold text-white">알림</span>
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
                      onClick={() => markRead(notif.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-zinc-800/60 last:border-0 transition-colors hover:bg-zinc-800/50 ${
                        !notif.read ? "bg-violet-500/5" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        !notif.read ? "bg-zinc-800" : "bg-zinc-800/50"
                      }`}>
                        {NOTIF_ICON[notif.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-semibold leading-none mb-1 ${!notif.read ? "text-white" : "text-zinc-400"}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mb-1" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 leading-snug line-clamp-2">{notif.body}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">{notif.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart — [B2C only] */}
          {features.cart && (
            <Link
              href="/experiments/b2c-student/cart"
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

          {/* My page */}
          <Link
            href="/experiments/b2c-student/my"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
          </Link>

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
