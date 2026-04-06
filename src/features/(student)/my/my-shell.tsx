"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  User,
  Search,
  ShoppingCart,
  BookOpen,
  Award,
  CreditCard,
  Heart,
  Star,
  Settings,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useStudentAuthStore } from "../shared/auth-store";
import { inProgressCourses } from "../home/mockData";
import { completedCourseMock } from "./sections/learning-tab";
import store from "../home/store";
import { useTenantContextStore } from "../shared/tenant-context-store";

// ── Navbar ───────────────────────────────────────────────────────────────────

function MyNavbar() {
  const { features } = useTenantContextStore((s) => s.tenant);
  const { isLoggedIn, logout } = useStudentAuthStore();
  const [cartCount] = useState(store.cart.size);
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/experiments/student" className="shrink-0">
          <Image
            src="/lotte.png"
            alt="롯데건설"
            width={100 * 1.3}
            height={28 * 1.3}
            className="object-contain"
          />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
          </button>
          {features.cart && (
            <Link
              href="/experiments/student/cart"
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
          {isLoggedIn ? (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-zinc-800">
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
              </div>
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
              href="/experiments/student/login"
              className="px-4 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-500 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Tabs config ───────────────────────────────────────────────────────────────

const ALL_TABS = [
  {
    id: "learning",
    label: "내 학습",
    icon: <BookOpen className="w-4 h-4" />,
    featureFlag: undefined,
  },
  {
    id: "certificates",
    label: "수료증",
    icon: <Award className="w-4 h-4" />,
    featureFlag: undefined,
  },
  {
    id: "orders",
    label: "주문 내역",
    icon: <CreditCard className="w-4 h-4" />,
    featureFlag: "payments" as const,
  },
  {
    id: "reviews",
    label: "내 리뷰",
    icon: <Star className="w-4 h-4" />,
    featureFlag: undefined,
  },
  {
    id: "notifications",
    label: "알림",
    icon: <Bell className="w-4 h-4" />,
    featureFlag: undefined,
  },
  {
    id: "profile",
    label: "내 정보",
    icon: <Settings className="w-4 h-4" />,
    featureFlag: undefined,
  },
] as const;

const BASE = "/experiments/student/my";

const CURRENT_USER_ROLES: string[] = ["STUDENT", "INSTRUCTOR"];

// ── Instructor apply modal ────────────────────────────────────────────────────

function InstructorApplyModal({ onClose }: { onClose: () => void }) {
  const [specialty, setSpecialty] = useState("");
  const [plan, setPlan] = useState("");
  const [career, setCareer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!specialty.trim() || !plan.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">강사 신청</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-sm font-semibold text-white">
              신청이 접수되었습니다!
            </p>
            <p className="text-xs text-zinc-400">
              검토 후 이메일로 결과를 안내드립니다.
              <br />
              보통 영업일 기준 3~5일 내 처리됩니다.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-400">
              강사로 활동하고 싶으신가요? 아래 정보를 작성해 주시면 검토 후
              연락드립니다.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  전문 분야 <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="예: React, 데이터 분석, 영어회화..."
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  강의 계획 <span className="text-violet-400">*</span>
                </label>
                <textarea
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  rows={3}
                  placeholder="어떤 강의를 만들고 싶으신지 간략하게 적어주세요."
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  관련 경력 (선택)
                </label>
                <textarea
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  rows={2}
                  placeholder="관련 직무 경험, 자격증, 포트폴리오 URL 등"
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!specialty.trim() || !plan.trim()}
                className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                신청하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function MyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { features } = useTenantContextStore((s) => s.tenant);
  const { isLoggedIn, logout } = useStudentAuthStore();

  const tabs = ALL_TABS.filter(
    (tab) => !tab.featureFlag || features[tab.featureFlag],
  );

  const totalLearning = inProgressCourses.length + completedCourseMock.length;

  // active tab: match current pathname
  const activeId =
    tabs.find((t) => pathname === `${BASE}/${t.id}`)?.id ?? "learning";
  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <>
      <div className="bg-zinc-950 text-white min-h-screen">
        <MyNavbar />

        {/* 비로그인 가드 모달 */}
        {!isLoggedIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center flex flex-col items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-violet-600/20 flex items-center justify-center">
                <User className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-2">로그인이 필요합니다</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  학습 현황, 수료증, 마이페이지 이용을 위해<br />
                  로그인해 주세요
                </p>
              </div>
              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={() => router.push("/experiments/student/login")}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-500 transition-colors"
                >
                  로그인하기
                </button>
                <Link
                  href="/experiments/student/register"
                  className="w-full py-2.5 border border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors text-center"
                >
                  회원가입
                </Link>
                <button
                  onClick={() => router.push("/experiments/student")}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
                >
                  나중에 하기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-screen-xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 items-start">
          {/* Left sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
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
                  <p className="text-base font-bold text-white">
                    {totalLearning}
                  </p>
                  <p className="text-[10px] text-zinc-500">강의</p>
                </div>
                <div>
                  <p className="text-base font-bold text-white">5</p>
                  <p className="text-[10px] text-zinc-500">수료증</p>
                </div>
                <div>
                  <p className="text-base font-bold text-white">
                    {store.wishlist.size}
                  </p>
                  <p className="text-[10px] text-zinc-500">위시</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`${BASE}/${tab.id}`}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeId === tab.id
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              ))}
            </nav>

            {!CURRENT_USER_ROLES.includes("INSTRUCTOR") && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="mt-3 w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-violet-500/40 text-violet-400 hover:border-violet-400 hover:text-violet-300 hover:bg-violet-500/5 transition-colors text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                강사로 활동하기
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => { logout(); router.push("/experiments/student"); }}
                className="mt-2 w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                로그아웃
              </button>
            )}
          </aside>

          {/* Right content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-violet-400">{activeTab?.icon}</span>
                {activeTab?.label}
              </h1>
            </div>
            {children}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <InstructorApplyModal onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
}
