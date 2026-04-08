"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function InstructorResetPasswordFeature() {
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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">강사 포털</h1>
          <p className="text-sm text-zinc-400 mt-1">롯데건설 LMS 강사</p>
        </div>

        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-8">
          {done ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold text-white mb-2">비밀번호가 재설정되었습니다</h2>
              <p className="text-sm text-zinc-400 mb-6">새 비밀번호로 로그인하세요.</p>
              <Link href="/experiments/instructor/login" className="inline-block w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-colors text-center">
                로그인하러 가기
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-white mb-2">새 비밀번호 설정</h2>
              <p className="text-sm text-zinc-400 mb-6">사용할 새 비밀번호를 입력하세요.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">새 비밀번호</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8자 이상 입력"
                      className="w-full px-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">비밀번호 확인</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="비밀번호 재입력"
                      className={`w-full px-3 py-2.5 bg-zinc-700 border rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10 ${mismatch ? "border-red-500" : "border-zinc-600"}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mismatch && <p className="text-xs text-red-400 mt-1">비밀번호가 일치하지 않습니다.</p>}
                </div>

                <button
                  type="submit"
                  disabled={mismatch || !password || !confirm}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
