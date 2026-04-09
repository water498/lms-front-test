"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, KeyRound, User } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState<"form" | "verify">("form");

  function handleRegister() {
    setStep("verify");
  }

  function handleVerifyAndLogin() {
    login("LEARNER", "B2C");
    router.push("/student");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={14} />
          로그인으로 돌아가기
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <h1 className="text-lg font-bold text-white">회원가입</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {step === "form"
                ? "OpenKnock Learn에 가입하고 학습을 시작하세요."
                : "이메일로 인증 코드를 발송했습니다."}
            </p>
          </div>

          {step === "form" ? (
            <div className="space-y-3">
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="이름"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={handleRegister}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors text-sm"
              >
                가입하기
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-zinc-800" />
                <span className="text-[11px] text-zinc-600">또는</span>
                <div className="flex-1 border-t border-zinc-800" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleVerifyAndLogin}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white text-zinc-900 font-medium rounded-lg text-sm hover:bg-zinc-100 transition-colors"
                >
                  Google
                </button>
                <button
                  onClick={handleVerifyAndLogin}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#FEE500] text-[#191919] font-medium rounded-lg text-sm hover:bg-[#FDD800] transition-colors"
                >
                  카카오
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
                <p className="text-sm text-violet-300">
                  인증 코드가 이메일로 발송되었습니다. 코드를 입력해주세요.
                </p>
              </div>
              <input
                type="text"
                placeholder="인증 코드 6자리"
                maxLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white text-center tracking-[0.3em] placeholder:text-zinc-500 placeholder:tracking-normal focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button
                onClick={handleVerifyAndLogin}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors text-sm"
              >
                인증 완료 및 로그인
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-600 text-center">
          B2C 수강생 전용. B2B 기업 소속이라면 SSO로 로그인하세요.
        </p>
      </div>
    </div>
  );
}
