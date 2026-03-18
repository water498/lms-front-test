"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Tag,
  ChevronRight,
  Bell,
  User,
  Search,
  MapPin,
  Calendar,
} from "lucide-react";
import { courseById } from "../home/mockData";
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
            className="relative p-2 text-violet-400 rounded-lg bg-zinc-800"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/experiments/b2c-student/my"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function CartFeature() {
  const [cart, setCartState] = useState<Set<string>>(store.cart);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const removeFromCart = (id: string) => {
    const next = new Set(store.cart);
    next.delete(id);
    store.cart = next;
    setCartState(new Set(store.cart));
  };

  const cartItems = [...cart]
    .map((id) => courseById[id])
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, c) => sum + (c.price ?? 0), 0);
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "OPEN10") {
      setCouponApplied(true);
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar cartCount={cart.size} />

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
          <Link href="/experiments/b2c-student" className="hover:text-zinc-300 transition-colors">홈</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-300">장바구니</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-violet-400" />
          장바구니
          {cart.size > 0 && (
            <span className="text-base font-normal text-zinc-500">({cart.size}개 강의)</span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingCart className="w-16 h-16 text-zinc-700" />
            <p className="text-zinc-400 text-lg font-medium">장바구니가 비어있습니다</p>
            <p className="text-zinc-600 text-sm">관심 있는 강의를 담아보세요.</p>
            <Link
              href="/experiments/b2c-student"
              className="mt-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              강의 탐색하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart items */}
            <div className="flex-1 flex flex-col gap-3">
              {cartItems.map((course) => (
                <div
                  key={course.id}
                  className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 items-start"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-24 h-16 rounded-xl shrink-0"
                    style={{ background: course.thumbnail }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">
                      {course.title}
                    </p>
                    <p className="text-xs text-zinc-500 mb-1">{course.instructor} · {course.level}</p>

                    {/* Offline details */}
                    {course.type !== "online" && course.location && (
                      <div className="flex flex-col gap-0.5 mb-1">
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <MapPin className="w-3 h-3" />
                          <span>{course.location}</span>
                        </div>
                        {course.nextSessionDate && (
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Calendar className="w-3 h-3" />
                            <span>{course.nextSessionDate} 개강</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                        course.type === "online"
                          ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                          : course.type === "offline"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-violet-500/20 text-violet-300 border-violet-500/40"
                      }`}>
                        {course.type === "online" ? "온라인" : course.type === "offline" ? "오프라인" : "혼합"}
                      </span>
                      <span className="text-sm font-bold text-white">
                        ₩{(course.price ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(course.id)}
                    className="shrink-0 p-2 text-zinc-600 hover:text-rose-400 rounded-lg hover:bg-rose-400/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary sidebar */}
            <div className="w-full lg:w-80 shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-base font-bold text-white">주문 요약</h2>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>강의 금액</span>
                  <span>₩{subtotal.toLocaleString()}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>쿠폰 할인 (10%)</span>
                    <span>-₩{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-zinc-700 pt-2 flex justify-between font-bold text-white text-base">
                  <span>총 결제 금액</span>
                  <span>₩{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  쿠폰 코드
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="쿠폰 코드 입력"
                    disabled={couponApplied}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 disabled:opacity-50"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied || !coupon.trim()}
                    className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-sm text-white rounded-lg transition-colors shrink-0"
                  >
                    적용
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-emerald-400">✓ OPEN10 쿠폰이 적용되었습니다 (10% 할인)</p>
                )}
                {!couponApplied && (
                  <p className="text-xs text-zinc-600">힌트: OPEN10</p>
                )}
              </div>

              {/* Checkout button */}
              <button className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors text-sm">
                결제하기 (₩{total.toLocaleString()})
              </button>

              <p className="text-xs text-zinc-600 text-center">
                결제 버튼은 UI 데모용입니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
