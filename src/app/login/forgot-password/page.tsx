"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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
            <h1 className="text-lg font-bold text-white">비밀번호 찾기</h1>
            <p className="text-sm text-zinc-500 mt-1">
              가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
            </p>
          </div>

          {sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-sm text-emerald-400">
                <strong>{email}</strong>으로 재설정 링크를 발송했습니다. 이메일을 확인해주세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={() => setSent(true)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors text-sm"
              >
                재설정 링크 발송
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-600 text-center">
          B2C 사용자 전용. B2B(SSO) 사용자는 회사 IT 관리자에게 문의하세요.
        </p>
      </div>
    </div>
  );
}
