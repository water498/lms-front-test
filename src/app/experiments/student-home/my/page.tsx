"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  User,
  Search,
  ShoppingCart,
  BookOpen,
  Award,
  CreditCard,
  Heart,
  Settings,
  Play,
  CheckCircle,
  Download,
  Star,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { inProgressCourses, courseById, type Course, type EnrolledCourse } from "../mockData";
import store from "../store";

// ── Navbar ─────────────────────────────────────────────────────────────────

function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/experiments/student-home" className="text-xl font-bold text-white shrink-0">
          Open<span className="text-violet-400">Knock</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
          </button>
          <Link
            href="/experiments/student-home/cart"
            className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-zinc-800">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const completedCourseMock: EnrolledCourse[] = [
  {
    id: "c-1",
    title: "HTML/CSS 기초 완성",
    instructor: "최유진",
    category: "frontend",
    categoryLabel: "프론트엔드",
    thumbnail: "linear-gradient(135deg, #1a1a2e, #16213e)",
    accentColor: "#818cf8",
    rating: 4.7,
    reviewCount: 1200,
    duration: "10시간",
    level: "입문",
    tags: ["HTML", "CSS"],
    price: 0,
    isNew: false,
    isBestseller: false,
    type: "online",
    progress: 100,
    lastAccessedAt: "2026-01-15",
    nextLessonTitle: "",
  },
  {
    id: "c-2",
    title: "JavaScript 핵심 개념",
    instructor: "강현우",
    category: "frontend",
    categoryLabel: "프론트엔드",
    thumbnail: "linear-gradient(135deg, #1a1a00, #3d3d00)",
    accentColor: "#fbbf24",
    rating: 4.8,
    reviewCount: 980,
    duration: "15시간",
    level: "초급",
    tags: ["JavaScript", "ES6+"],
    price: 29000,
    isNew: false,
    isBestseller: true,
    type: "online",
    progress: 100,
    lastAccessedAt: "2026-02-20",
    nextLessonTitle: "",
  },
  {
    id: "c-3",
    title: "Git & GitHub 실무",
    instructor: "임도현",
    category: "etc",
    categoryLabel: "기타",
    thumbnail: "linear-gradient(135deg, #1a0a00, #3d1800)",
    accentColor: "#f97316",
    rating: 4.9,
    reviewCount: 2400,
    duration: "8시간",
    level: "입문",
    tags: ["Git", "GitHub"],
    price: 0,
    isNew: false,
    isBestseller: true,
    type: "online",
    progress: 100,
    lastAccessedAt: "2025-12-10",
    nextLessonTitle: "",
  },
];

const certificatesMock = [
  { id: "cert-1", courseTitle: "HTML/CSS 기초 완성", issuedAt: "2026-01-18", instructor: "최유진" },
  { id: "cert-2", courseTitle: "JavaScript 핵심 개념", issuedAt: "2026-02-22", instructor: "강현우" },
  { id: "cert-3", courseTitle: "Git & GitHub 실무", issuedAt: "2025-12-14", instructor: "임도현" },
  { id: "cert-4", courseTitle: "파이썬 기초", issuedAt: "2025-09-30", instructor: "윤하늘" },
  { id: "cert-5", courseTitle: "선형대수학 입문", issuedAt: "2025-07-12", instructor: "박지호" },
];

const ordersMock = [
  { id: "ord-1", courseTitle: "실무 중심 AI·머신러닝 완성 과정", amount: 89000, date: "2026-02-28", status: "완료" },
  { id: "ord-2", courseTitle: "React + TypeScript 실전 프로젝트", amount: 69000, date: "2026-01-10", status: "완료" },
  { id: "ord-3", courseTitle: "SQL 마스터: 데이터 분석 실무", amount: 49000, date: "2025-12-05", status: "완료" },
  { id: "ord-4", courseTitle: "JavaScript 핵심 개념", amount: 29000, date: "2025-11-01", status: "완료" },
  { id: "ord-5", courseTitle: "Docker & Kubernetes 실전", amount: 89000, date: "2025-09-15", status: "환불" },
];

// ── Tab IDs ─────────────────────────────────────────────────────────────────

type TabId = "learning" | "certificates" | "orders" | "wishlist" | "profile";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "learning",     label: "내 학습",   icon: <BookOpen className="w-4 h-4" /> },
  { id: "certificates", label: "수료증",    icon: <Award className="w-4 h-4" /> },
  { id: "orders",       label: "주문 내역", icon: <CreditCard className="w-4 h-4" /> },
  { id: "wishlist",     label: "위시리스트", icon: <Heart className="w-4 h-4" /> },
  { id: "profile",      label: "내 정보",   icon: <Settings className="w-4 h-4" /> },
];

// ── Tab Content Components ─────────────────────────────────────────────────

function LearningTab() {
  return (
    <div className="flex flex-col gap-8">
      {/* In Progress */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">수강 중</h3>
        <div className="flex flex-col gap-3">
          {inProgressCourses.map((course) => (
            <div key={course.id} className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 items-center">
              <div
                className="w-20 h-14 rounded-xl shrink-0"
                style={{ background: course.thumbnail }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight line-clamp-1 mb-0.5">{course.title}</p>
                <p className="text-xs text-zinc-500 mb-2">{course.instructor} · {course.level}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">{course.progress}%</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">다음: {course.nextLessonTitle}</p>
              </div>
              <button className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors">
                <Play className="w-3 h-3 fill-white" />
                이어 학습
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">완료</h3>
        <div className="flex flex-col gap-3">
          {completedCourseMock.map((course) => (
            <div key={course.id} className="flex gap-4 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-4 items-center">
              <div
                className="w-20 h-14 rounded-xl shrink-0 relative"
                style={{ background: course.thumbnail }}
              >
                <div className="absolute inset-0 rounded-xl bg-black/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-300 line-clamp-1 mb-0.5">{course.title}</p>
                <p className="text-xs text-zinc-500">{course.instructor}</p>
                <p className="text-xs text-emerald-500 mt-1">✓ 완료 · {course.lastAccessedAt}</p>
              </div>
              <button className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 px-3 py-2 border border-zinc-700 rounded-lg transition-colors">
                다시 보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificatesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certificatesMock.map((cert) => (
        <div
          key={cert.id}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
        >
          {/* Certificate visual */}
          <div className="w-full h-28 rounded-xl bg-gradient-to-br from-violet-900/40 to-zinc-900 border border-violet-800/30 flex flex-col items-center justify-center gap-1">
            <Award className="w-8 h-8 text-violet-400" />
            <span className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase">Certificate</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-white leading-tight">{cert.courseTitle}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{cert.instructor} 강사 · 발급일: {cert.issuedAt}</p>
          </div>

          <button className="flex items-center justify-center gap-1.5 w-full py-2 border border-zinc-700 hover:border-violet-500 text-zinc-400 hover:text-violet-400 text-xs font-medium rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" />
            PDF 다운로드
          </button>
        </div>
      ))}
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">강의</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">금액</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">날짜</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">상태</th>
          </tr>
        </thead>
        <tbody>
          {ordersMock.map((order, i) => (
            <tr
              key={order.id}
              className={`border-b border-zinc-800/60 ${i === ordersMock.length - 1 ? "border-b-0" : ""}`}
            >
              <td className="px-5 py-4 text-zinc-200 font-medium">{order.courseTitle}</td>
              <td className="px-5 py-4 text-right text-zinc-300 whitespace-nowrap">
                ₩{order.amount.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-right text-zinc-500 whitespace-nowrap text-xs">{order.date}</td>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  order.status === "완료"
                    ? "bg-emerald-900/40 text-emerald-400"
                    : "bg-rose-900/40 text-rose-400"
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WishlistTab({ cart, onAddToCart }: { cart: Set<string>; onAddToCart: (id: string) => void }) {
  const [wishlist, setWishlistState] = useState<Set<string>>(store.wishlist);

  const removeFromWishlist = (id: string) => {
    const next = new Set(store.wishlist);
    next.delete(id);
    store.wishlist = next;
    setWishlistState(new Set(store.wishlist));
  };

  const wishlistItems = [...wishlist]
    .map((id) => courseById[id])
    .filter(Boolean);

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Heart className="w-14 h-14 text-zinc-700" />
        <p className="text-zinc-400 text-base font-medium">위시리스트가 비어있습니다</p>
        <p className="text-zinc-600 text-sm">관심 강의에 하트를 눌러 저장하세요.</p>
        <Link
          href="/experiments/student-home"
          className="mt-2 px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-xl transition-colors text-sm"
        >
          강의 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {wishlistItems.map((course) => {
        const isInCart = cart.has(course.id);
        return (
          <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3">
            {/* Thumbnail */}
            <div
              className="w-20 h-14 rounded-xl shrink-0 relative"
              style={{ background: course.thumbnail }}
            >
              <div className={`absolute bottom-1 left-1 text-[9px] font-semibold px-1 py-0.5 rounded-full border ${
                course.type === "online" ? "bg-sky-500/25 text-sky-300 border-sky-500/40"
                : course.type === "offline" ? "bg-amber-500/25 text-amber-300 border-amber-500/40"
                : "bg-violet-500/25 text-violet-300 border-violet-500/40"
              }`}>
                {course.type === "online" ? "온라인" : course.type === "offline" ? "오프라인" : "혼합"}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">{course.title}</p>
              <p className="text-xs text-zinc-500">{course.instructor}</p>

              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-amber-400 font-medium">{course.rating}</span>
              </div>

              {course.type !== "online" && course.location && (
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{course.location}</span>
                  </div>
                  {course.nextSessionDate && (
                    <div className="flex items-center gap-1 text-xs text-zinc-600">
                      <Calendar className="w-3 h-3" />
                      <span>{course.nextSessionDate}</span>
                    </div>
                  )}
                  {course.capacity !== undefined && course.enrolledCount !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-zinc-600">
                      <Users className="w-3 h-3" />
                      <span>{course.enrolledCount}/{course.capacity}명</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs font-bold text-zinc-300">
                {course.price === 0 ? "무료" : `₩${course.price.toLocaleString()}`}
              </p>

              {/* Buttons */}
              <div className="flex gap-1.5 mt-1">
                {course.price > 0 && (
                  <button
                    onClick={() => { if (!isInCart) onAddToCart(course.id); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isInCart
                        ? "bg-zinc-700 text-zinc-500 cursor-default"
                        : "bg-violet-600 hover:bg-violet-500 text-white"
                    }`}
                  >
                    {isInCart ? "담김" : "장바구니"}
                  </button>
                )}
                <button
                  onClick={() => removeFromWishlist(course.id)}
                  className="px-2 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 border border-zinc-700 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab() {
  const [name, setName] = useState("홍길동");
  const [email, setEmail] = useState("hong@example.com");
  const [bio, setBio] = useState("풀스택 개발자를 목표로 열심히 공부 중입니다.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          홍
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-zinc-500">{email}</p>
          <button className="mt-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            프로필 사진 변경
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">비밀번호 변경</label>
          <input
            type="password"
            placeholder="새 비밀번호"
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          className={`py-3 rounded-xl font-semibold text-sm transition-colors ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {saved ? "✓ 저장되었습니다" : "저장하기"}
        </button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("learning");
  const [cart, setCartState] = useState<Set<string>>(store.cart);

  const addToCart = (id: string) => {
    store.cart = new Set([...store.cart, id]);
    setCartState(new Set(store.cart));  // store.cart is a plain property, reassignment is fine
  };

  const totalLearning = inProgressCourses.length + completedCourseMock.length;

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar cartCount={cart.size} />

      <div className="max-w-screen-xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          {/* Profile summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-xl font-bold text-white">
              홍
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">홍길동</p>
              <p className="text-xs text-zinc-500">hong@example.com</p>
            </div>
            <div className="w-full grid grid-cols-3 gap-2 text-center border-t border-zinc-800 pt-3">
              <div>
                <p className="text-base font-bold text-white">{totalLearning}</p>
                <p className="text-[10px] text-zinc-500">강의</p>
              </div>
              <div>
                <p className="text-base font-bold text-white">5</p>
                <p className="text-[10px] text-zinc-500">수료증</p>
              </div>
              <div>
                <p className="text-base font-bold text-white">{store.wishlist.size}</p>
                <p className="text-[10px] text-zinc-500">위시</p>
              </div>
            </div>
          </div>

          {/* Tab menu */}
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {/* Tab header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-violet-400">
                {TABS.find((t) => t.id === activeTab)?.icon}
              </span>
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          {/* Tab content */}
          {activeTab === "learning"     && <LearningTab />}
          {activeTab === "certificates" && <CertificatesTab />}
          {activeTab === "orders"       && <OrdersTab />}
          {activeTab === "wishlist"     && <WishlistTab cart={cart} onAddToCart={addToCart} />}
          {activeTab === "profile"      && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}
