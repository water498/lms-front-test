"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2 } from "lucide-react";
import Link from "next/link";
import { useTenantContextStore } from "@/features/(student)/shared/tenant-context-store";
import { useStudentAuthStore } from "@/features/(student)/shared/auth-store";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function StudentLoginFeature() {
  const router = useRouter();
  const { login } = useStudentAuthStore();
  const { tenant, switchTenant } = useTenantContextStore();
  const isB2B = tenant.tenantType === "B2B";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login();
    router.push("/student");
  }

  function handleSso() {
    login();
    router.push("/student");
  }

  if (isB2B) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Building2 className="w-6 h-6 text-slate-600" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1">
              {tenant.tenantName} 러닝 포털
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              회사 계정으로 로그인하세요
            </p>
            <button onClick={handleSso} className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" />
              {tenant.tenantName} 계정으로 로그인 (SSO)
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => switchTenant("B2C")}
              className="text-xs text-slate-300 hover:text-slate-500 transition-colors"
            >
              [DEV] B2C 모드로 전환
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-sm">OK</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">로그인</h1>
            <p className="text-sm text-slate-500 mt-1">롯데건설 LMS에 오신 걸 환영합니다</p>
          </div>

          {/* Social login */}
          <div className="space-y-2.5 mb-5">
            <button className="w-full py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5">
              <GoogleIcon />
              Google로 계속하기
            </button>
            <button className="w-full py-2.5 bg-yellow-400 rounded-lg text-sm font-semibold text-slate-900 hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2">
              <span className="text-base leading-none">💬</span>
              카카오로 계속하기
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">또는 이메일로</span>
            </div>
          </div>

          {/* Email form */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">비밀번호</label>
                <Link href="/student/forgot-password" className="text-xs text-violet-600 hover:text-violet-700 transition-colors">
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
              로그인
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            계정이 없으신가요?{" "}
            <Link href="/student/register" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
              회원가입
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => switchTenant("B2B")}
            className="text-xs text-slate-300 hover:text-slate-500 transition-colors"
          >
            [DEV] B2B 모드로 전환
          </button>
        </div>
      </div>
    </div>
  );
}
