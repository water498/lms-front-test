"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function SsoCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 size={32} className="text-violet-400 animate-spin" /></div>}>
      <SsoCallbackContent />
    </Suspense>
  );
}

function SsoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState(false);

  const hasError = searchParams.get("error") === "true";

  useEffect(() => {
    if (hasError) {
      setError(true);
      return;
    }
    // Mock: 1초 후 로그인 처리 (실제로는 SAML/OIDC 응답 검증)
    const timer = setTimeout(() => {
      login("ORG_ADMIN", "B2B");
      router.replace("/admin");
    }, 1000);
    return () => clearTimeout(timer);
  }, [hasError, login, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle size={40} className="text-red-400 mx-auto" />
          <h1 className="text-lg font-bold text-white">SSO 인증 실패</h1>
          <p className="text-sm text-zinc-400">
            기업 SSO 인증 과정에서 문제가 발생했습니다. 다시 시도하거나 IT 관리자에게 문의하세요.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <Loader2 size={32} className="text-violet-400 animate-spin mx-auto" />
        <p className="text-sm text-zinc-400">SSO 인증 처리 중...</p>
      </div>
    </div>
  );
}
