// [B2C only] — B2B tenantType에서는 접근 불가
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Bell,
  User,
  Search,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Building2,
  Tag,
  Lock,
  ChevronDown,
  MapPin,
  Calendar,
} from "lucide-react";
import { courseById } from "../student-dashboard/mockData";
import store from "../student-dashboard/store";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/student" className="text-xl font-bold text-white shrink-0">
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
            href="/student/cart"
            className="relative p-2 text-zinc-400 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <Link
            href="/student/my"
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

type PaymentMethod = "CARD" | "KAKAO_PAY" | "NAVER_PAY" | "BANK_TRANSFER";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "CARD", label: "신용/체크카드", icon: <CreditCard className="w-5 h-5" /> },
  { id: "KAKAO_PAY", label: "카카오페이", icon: <Smartphone className="w-5 h-5" />, badge: "간편" },
  { id: "NAVER_PAY", label: "네이버페이", icon: <Smartphone className="w-5 h-5" />, badge: "간편" },
  { id: "BANK_TRANSFER", label: "계좌이체", icon: <Building2 className="w-5 h-5" /> },
];

const MOCK_BUYER = {
  name: "홍길동",
  email: "hong@example.com",
  phone: "010-1234-5678",
};

export default function CheckoutFeature() {
  const router = useRouter();
  const cartItems = [...store.cart]
    .map((id) => courseById[id])
    .filter(Boolean);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("현대카드");

  const CARDS = ["현대카드", "신한카드", "국민카드", "우리카드", "하나카드", "삼성카드"];

  const subtotal = cartItems.reduce((sum, c) => sum + (c.price ?? 0), 0);
  const couponDiscount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal - couponDiscount;

  const handleAgreeAll = (v: boolean) => {
    setAgreeAll(v);
    setAgreeTerms(v);
    setAgreePrivacy(v);
  };

  const handleTerms = (v: boolean) => {
    setAgreeTerms(v);
    if (!v) setAgreeAll(false);
    else if (agreePrivacy) setAgreeAll(true);
  };

  const handlePrivacy = (v: boolean) => {
    setAgreePrivacy(v);
    if (!v) setAgreeAll(false);
    else if (agreeTerms) setAgreeAll(true);
  };

  const canSubmit = agreeTerms && agreePrivacy && cartItems.length > 0;

  const handlePay = () => {
    if (!canSubmit || processing) return;
    setProcessing(true);
    // Simulate PG processing delay
    setTimeout(() => {
      store.cart = new Set();
      const orderNumber = `OK-${Date.now().toString(36).toUpperCase()}`;
      router.push(
        `/student/checkout/success?order=${orderNumber}&total=${total}&count=${cartItems.length}`
      );
    }, 1400);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <ShoppingCart className="w-14 h-14 text-zinc-700" />
            <p className="text-zinc-400 text-lg font-medium">장바구니가 비어있습니다</p>
            <Link
              href="/student"
              className="mt-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              강의 탐색하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
          <Link href="/student" className="hover:text-zinc-300 transition-colors">홈</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/student/cart" className="hover:text-zinc-300 transition-colors">장바구니</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-300">결제</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-8">주문/결제</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Order items */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">주문 강의 ({cartItems.length}개)</h2>
              <div className="flex flex-col gap-3">
                {cartItems.map((course) => (
                  <div key={course.id} className="flex gap-3 items-start">
                    <div
                      className="w-16 h-11 rounded-lg shrink-0"
                      style={{ background: course.thumbnail }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white leading-snug line-clamp-2">{course.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{course.instructor}</p>
                      {course.type !== "online" && course.location && (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <MapPin className="w-3 h-3" />{course.location}
                          </div>
                          {course.nextSessionDate && (
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                              <Calendar className="w-3 h-3" />{course.nextSessionDate} 개강
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-white shrink-0">
                      {(course.price ?? 0) === 0 ? "무료" : `₩${(course.price ?? 0).toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Buyer info */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">구매자 정보</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: "이름", value: MOCK_BUYER.name },
                  { label: "이메일", value: MOCK_BUYER.email },
                  { label: "연락처", value: MOCK_BUYER.phone },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="text-xs text-zinc-500 w-14 shrink-0">{label}</span>
                    <input
                      type="text"
                      defaultValue={value}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Payment method */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">결제 수단</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`relative flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all ${
                      paymentMethod === m.id
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {m.badge && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                        {m.badge}
                      </span>
                    )}
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Card selector */}
              {paymentMethod === "CARD" && (
                <div className="mt-4 relative">
                  <button
                    onClick={() => setCardOpen(!cardOpen)}
                    className="w-full flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white hover:border-zinc-600 transition-colors"
                  >
                    <span>{selectedCard}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${cardOpen ? "rotate-180" : ""}`} />
                  </button>
                  {cardOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-10 shadow-xl">
                      {CARDS.map((card) => (
                        <button
                          key={card}
                          onClick={() => { setSelectedCard(card); setCardOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-zinc-700 ${
                            selectedCard === card ? "text-violet-400 font-medium" : "text-zinc-300"
                          }`}
                        >
                          {card}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Kakao/Naver info */}
              {(paymentMethod === "KAKAO_PAY" || paymentMethod === "NAVER_PAY") && (
                <div className="mt-4 flex items-start gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
                  <Smartphone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-500">
                    {paymentMethod === "KAKAO_PAY" ? "카카오페이" : "네이버페이"} 앱이 연동되어 있으면
                    간편하게 결제할 수 있습니다. 실제 연동은 PG사 SDK 통합이 필요합니다.
                  </p>
                </div>
              )}

              {/* Bank transfer info */}
              {paymentMethod === "BANK_TRANSFER" && (
                <div className="mt-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-xs text-zinc-500">
                  <p className="font-medium text-zinc-400 mb-1">입금 계좌 안내</p>
                  <p>국민은행 123-456-789012 · OpenKnock Inc.</p>
                  <p className="mt-1 text-zinc-600">입금 확인 후 수강 등록이 완료됩니다 (영업일 기준 1일 내)</p>
                </div>
              )}
            </section>

            {/* Terms */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">약관 동의</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={(e) => handleAgreeAll(e.target.checked)}
                    className="w-4 h-4 accent-violet-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-white">전체 동의</span>
                </label>
                <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2.5">
                  {[
                    { label: "이용약관 동의 (필수)", checked: agreeTerms, onChange: handleTerms },
                    { label: "개인정보 수집·이용 동의 (필수)", checked: agreePrivacy, onChange: handlePrivacy },
                  ].map(({ label, checked, onChange }) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-4 h-4 accent-violet-500 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-400">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right sidebar — order summary */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 sticky top-24">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white">결제 금액</h2>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>강의 금액</span>
                  <span>₩{subtotal.toLocaleString()}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>쿠폰 할인 (10%)</span>
                    <span>-₩{couponDiscount.toLocaleString()}</span>
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
                    onClick={() => {
                      if (coupon.trim().toUpperCase() === "OPEN10") setCouponApplied(true);
                    }}
                    disabled={couponApplied || !coupon.trim()}
                    className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-sm text-white rounded-lg transition-colors shrink-0"
                  >
                    적용
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-emerald-400">✓ OPEN10 쿠폰 적용 (10% 할인)</p>
                )}
                {!couponApplied && (
                  <p className="text-xs text-zinc-600">힌트: OPEN10</p>
                )}
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={!canSubmit || processing}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    결제 처리 중...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {total === 0 ? "무료 수강 신청" : `₩${total.toLocaleString()} 결제하기`}
                  </>
                )}
              </button>

              {!agreeTerms || !agreePrivacy ? (
                <p className="text-xs text-zinc-600 text-center">약관에 동의하면 결제할 수 있습니다</p>
              ) : (
                <p className="text-xs text-zinc-600 text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  SSL 암호화로 안전하게 보호됩니다
                </p>
              )}
            </div>

            <Link
              href="/student/cart"
              className="text-xs text-zinc-500 hover:text-zinc-300 text-center transition-colors"
            >
              ← 장바구니로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
