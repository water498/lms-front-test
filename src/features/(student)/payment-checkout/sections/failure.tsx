// [B2C only] — B2B tenantType에서는 접근 불가
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RotateCcw, Home, MessageCircle } from "lucide-react";

export default function CheckoutFailureFeature() {
  const params = useSearchParams();
  const errorCode = params.get("code") ?? "UNKNOWN";
  const orderNumber = params.get("order") ?? "";

  const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
    CARD_DECLINED: { title: "카드 결제가 거부되었습니다", desc: "카드 한도를 확인하거나 다른 결제 수단을 이용해주세요." },
    TIMEOUT: { title: "결제 시간이 초과되었습니다", desc: "네트워크 상태를 확인하고 다시 시도해주세요." },
    INSUFFICIENT_FUNDS: { title: "잔액이 부족합니다", desc: "계좌 잔액을 확인하거나 다른 결제 수단을 이용해주세요." },
    UNKNOWN: { title: "결제에 실패했습니다", desc: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
  };

  const error = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.UNKNOWN;

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-rose-400" />
          </div>
          <div className="absolute inset-0 rounded-full bg-rose-500/5 blur-xl scale-150" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{error.title}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">{error.desc}</p>
        </div>

        {/* Error info */}
        {orderNumber && (
          <div className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-5 py-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">주문번호</span>
              <span className="text-zinc-200 font-mono text-xs tracking-wide">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">오류 코드</span>
              <span className="text-rose-400 font-mono text-xs">{errorCode}</span>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="/experiments/student/checkout"
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            다시 결제하기
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

      <p className="mt-6 text-xs text-zinc-600 text-center max-w-sm flex items-center gap-1 justify-center">
        <MessageCircle className="w-3 h-3" />
        문제가 지속되면 고객센터(support@openknock.com)로 문의해주세요.
      </p>
    </div>
  );
}
