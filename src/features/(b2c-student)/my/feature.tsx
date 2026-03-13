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
} from "lucide-react";
import { LearningTab, completedCourseMock } from "./sections/learning-tab";
import { CertificatesTab } from "./sections/certificates-tab";
import { OrdersTab } from "./sections/orders-tab";
import { WishlistTab } from "./sections/wishlist-tab";
import { ProfileTab } from "./sections/profile-tab";
import { inProgressCourses } from "../home/mockData";
import store from "../home/store";

function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/experiments/b2c-student" className="text-xl font-bold text-white shrink-0">
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

type TabId = "learning" | "certificates" | "orders" | "wishlist" | "profile";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "learning",     label: "내 학습",   icon: <BookOpen className="w-4 h-4" /> },
  { id: "certificates", label: "수료증",    icon: <Award className="w-4 h-4" /> },
  { id: "orders",       label: "주문 내역", icon: <CreditCard className="w-4 h-4" /> },
  { id: "wishlist",     label: "위시리스트", icon: <Heart className="w-4 h-4" /> },
  { id: "profile",      label: "내 정보",   icon: <Settings className="w-4 h-4" /> },
];

export default function MyFeature() {
  const [activeTab, setActiveTab] = useState<TabId>("learning");
  const [cart, setCartState] = useState<Set<string>>(store.cart);

  const addToCart = (id: string) => {
    store.cart = new Set([...store.cart, id]);
    setCartState(new Set(store.cart));
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
