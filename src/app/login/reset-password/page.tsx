"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);

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
            <h1 className="text-lg font-bold text-white">비밀번호 재설정</h1>
            <p className="text-sm text-zinc-500 mt-1">새 비밀번호를 입력해주세요.</p>
          </div>

          {done ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-3">
              <p className="text-sm text-emerald-400">비밀번호가 성공적으로 변경되었습니다.</p>
              <Link href="/login" className="block text-center text-sm text-violet-400 hover:text-violet-300">
                로그인하기
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={() => setDone(true)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors text-sm"
              >
                비밀번호 변경
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
