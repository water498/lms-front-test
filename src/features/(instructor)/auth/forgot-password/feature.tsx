"use client";

import { useState } from "react";
import { Mail, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InstructorForgotPasswordFeature() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">강사 포털</h1>
          <p className="text-sm text-zinc-400 mt-1">OpenKnock Instructor</p>
        </div>

        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-violet-400" />
              </div>
              <h2 className="text-base font-semibold text-white mb-2">이메일을 확인해 주세요</h2>
              <p className="text-sm text-zinc-400 mb-6">
                <span className="text-zinc-200">{email}</span>으로<br />
                재설정 링크를 발송했습니다.
              </p>
              <Link href="/experiments/instructor/login" className="text-sm text-violet-400 hover:text-violet-300">
                로그인으로 돌아가기
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-white mb-2">비밀번호 찾기</h2>
              <p className="text-sm text-zinc-400 mb-6">이메일을 입력하면 재설정 링크를 보내드립니다.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="instructor@example.com"
                    className="w-full px-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-colors">
                  재설정 링크 발송
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/experiments/instructor/login" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  로그인으로 돌아가기
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
