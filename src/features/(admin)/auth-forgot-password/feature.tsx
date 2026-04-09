"use client";

import { useState } from "react";
import { Mail, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminForgotPasswordFeature() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">관리자 로그인</h1>
          <p className="text-sm text-slate-500 mt-1">테넌트 관리 콘솔</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-2">이메일을 확인해 주세요</h2>
              <p className="text-sm text-slate-500 mb-6">
                <span className="text-slate-800 font-medium">{email}</span>으로<br />
                재설정 링크를 발송했습니다.
              </p>
              <Link
                href="/backoffice/login"
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-slate-900 mb-2">비밀번호 찾기</h2>
              <p className="text-sm text-slate-500 mb-6">
                이메일을 입력하면 재설정 링크를 보내드립니다.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
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
                <Link
                  href="/backoffice/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
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
