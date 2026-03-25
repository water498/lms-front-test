// [B2C only] — B2B tenantType에서는 접근 불가
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, BookOpen, Home, Download } from "lucide-react";

export default function CheckoutSuccessFeature() {
  const params = useSearchParams();
  const orderNumber = params.get("order") ?? "OK-XXXXXXXX";
  const total = Number(params.get("total") ?? 0);
  const count = Number(params.get("count") ?? 1);

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Success card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-xl scale-150" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">결제 완료!</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {count}개 강의 수강이 등록되었습니다.<br />
            지금 바로 학습을 시작해보세요.
          </p>
        </div>

        {/* Order info */}
        <div className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-5 py-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">주문번호</span>
            <span className="text-zinc-200 font-mono text-xs tracking-wide">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">결제 금액</span>
            <span className="text-white font-bold">
              {total === 0 ? "무료" : `₩${total.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">결제 일시</span>
            <span className="text-zinc-200">
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Receipt download */}
        <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          <Download className="w-4 h-4" />
          영수증 다운로드
        </button>

        {/* CTA buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="/experiments/student/my"
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            내 강의 바로가기
          </Link>
          <Link
            href="/experiments/student"
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-zinc-600 text-center max-w-sm">
        수강 관련 문의는 마이페이지 &gt; 주문 내역에서 확인하거나<br />
        고객센터(support@openknock.com)로 연락해 주세요.
      </p>
    </div>
  );
}
