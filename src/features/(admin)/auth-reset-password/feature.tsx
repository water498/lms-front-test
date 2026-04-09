"use client";

import { useState } from "react";
import { Eye, EyeOff, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminResetPasswordFeature() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirm) setDone(true);
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
          {done ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-2">비밀번호가 재설정되었습니다</h2>
              <p className="text-sm text-slate-500 mb-6">새 비밀번호로 로그인하세요.</p>
              <Link
                href="/backoffice/login"
                className="inline-block w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors text-center"
              >
                로그인하러 가기
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-slate-900 mb-2">새 비밀번호 설정</h2>
              <p className="text-sm text-slate-500 mb-6">사용할 새 비밀번호를 입력하세요.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">새 비밀번호</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8자 이상 입력"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">비밀번호 확인</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="비밀번호 재입력"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10 ${mismatch ? "border-red-400" : "border-slate-300"}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mismatch && <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>}
                </div>

                <button
                  type="submit"
                  disabled={mismatch || !password || !confirm}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  비밀번호 재설정
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
