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
  GraduationCap,
  X,
  Sparkles,
} from "lucide-react";
import { LearningTab, completedCourseMock } from "./sections/learning-tab";
import { CertificatesTab } from "./sections/certificates-tab";
import { OrdersTab } from "./sections/orders-tab";
import { WishlistTab } from "./sections/wishlist-tab";
import { ProfileTab } from "./sections/profile-tab";
import { InstructorTab } from "./sections/instructor-tab";
import { InstructorCoursesTab } from "./sections/instructor-courses-tab";
import { inProgressCourses } from "../home/mockData";
import store from "../home/store";
import { useTenantContextStore } from "../shared/tenant-context-store";

function MyNavbar({ cartCount }: { cartCount: number }) {
  const { features } = useTenantContextStore((s) => s.tenant);
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link
          href="/experiments/b2c-student"
          className="text-xl font-bold text-white shrink-0"
        >
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
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-zinc-800">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">
              홍길동
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

type TabId =
  | "learning"
  | "certificates"
  | "orders"
  | "wishlist"
  | "profile"
  | "instructor"
  | "instructor-courses";

const ALL_TABS: {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  featureFlag?: "payments";
  roleFlag?: "INSTRUCTOR";
}[] = [
  { id: "learning", label: "내 학습", icon: <BookOpen className="w-4 h-4" /> },
  { id: "certificates", label: "수료증", icon: <Award className="w-4 h-4" /> },
  {
    id: "orders",
    label: "주문 내역",
    icon: <CreditCard className="w-4 h-4" />,
    featureFlag: "payments",
  }, // [B2C only]
  { id: "wishlist", label: "위시리스트", icon: <Heart className="w-4 h-4" /> },
  { id: "profile", label: "내 정보", icon: <Settings className="w-4 h-4" /> },
  {
    id: "instructor",
    label: "강사 프로필",
    icon: <GraduationCap className="w-4 h-4" />,
    roleFlag: "INSTRUCTOR",
  }, // [INSTRUCTOR only]
  {
    id: "instructor-courses",
    label: "내 과정 관리",
    icon: <BookOpen className="w-4 h-4" />,
    roleFlag: "INSTRUCTOR",
  }, // [INSTRUCTOR only]
];

// Mock: 현재 사용자의 roles
const CURRENT_USER_ROLES: string[] = ["STUDENT", "INSTRUCTOR"];

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

export default function MyFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("learning");
  const [cart, setCartState] = useState<Set<string>>(store.cart);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { features } = useTenantContextStore((s) => s.tenant);

  const TABS = ALL_TABS.filter((tab) => {
    if (tab.featureFlag && !features[tab.featureFlag]) return false;
    if (tab.roleFlag && !CURRENT_USER_ROLES.includes(tab.roleFlag))
      return false;
    return true;
  });

  const addToCart = (id: string) => {
    store.cart = new Set([...store.cart, id]);
    setCartState(new Set(store.cart));
  };

  const totalLearning = inProgressCourses.length + completedCourseMock.length;

  return (
    <>
      <div className="bg-zinc-950 text-white min-h-screen">
        <MyNavbar cartCount={cart.size} />

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

            {/* [B2C only] 강사 신청 CTA — INSTRUCTOR 아닌 사용자에게만 노출 */}
            {!CURRENT_USER_ROLES.includes("INSTRUCTOR") && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="mt-3 w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-violet-500/40 text-violet-400 hover:border-violet-400 hover:text-violet-300 hover:bg-violet-500/5 transition-colors text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                강사로 활동하기
              </button>
            )}
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
            {activeTab === "learning" && <LearningTab />}
            {activeTab === "certificates" && <CertificatesTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "wishlist" && (
              <WishlistTab cart={cart} onAddToCart={addToCart} />
            )}
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "instructor" && <InstructorTab />}
            {activeTab === "instructor-courses" && <InstructorCoursesTab />}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <InstructorApplyModal onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
}
