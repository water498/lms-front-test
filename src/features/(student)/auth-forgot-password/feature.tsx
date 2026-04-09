"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudentForgotPasswordFeature() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">이메일을 확인해 주세요</h2>
              <p className="text-sm text-slate-500 mb-1">비밀번호 재설정 링크를 발송했습니다.</p>
              <p className="text-sm font-medium text-slate-800 mb-7">{email}</p>
              <Link href="/student/login" className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors">
                로그인으로 돌아가기
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-7">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-sm">OK</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">비밀번호 찾기</h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  이메일을 입력하면 재설정 링크를 보내드립니다.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  재설정 링크 발송
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/student/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
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
