"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Globe,
  Lock,
  Mail,
  KeyRound,
  ChevronDown,
  FlaskConical,
} from "lucide-react";
import {
  useAuthStore,
  ROLE_REDIRECT,
  type UserRole,
  type TenantType,
} from "@/lib/stores/auth-store";

/* ── DEV 역할 카드 ── */
const ROLES: {
  value: UserRole;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { value: "ORG_ADMIN", label: "관리자", desc: "조직 관리 + 과정 설계/운영", icon: Users },
  { value: "INSTRUCTOR", label: "강사", desc: "과정 운영 + 채점/출석/Q&A", icon: BookOpen },
  { value: "LEARNER", label: "수강생", desc: "과정 탐색 + 학습", icon: GraduationCap },
  { value: "SUPER_ADMIN", label: "플랫폼 관리자", desc: "전체 테넌트 관리 (내부)", icon: Shield },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // DEV state
  const [devOpen, setDevOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("ORG_ADMIN");
  const [tenantType, setTenantType] = useState<TenantType>("B2B");

  const effectiveTenant = selectedRole === "SUPER_ADMIN" ? "B2B" : tenantType;

  function handleLogin() {
    login(selectedRole, effectiveTenant);
    router.push(ROLE_REDIRECT[selectedRole]);
  }

  function handleSsoLogin() {
    login(selectedRole === "LEARNER" ? "LEARNER" : selectedRole, "B2B");
    router.push(ROLE_REDIRECT[selectedRole === "LEARNER" ? "LEARNER" : selectedRole]);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5">

        {/* ═══ DEV PANEL (프로토타입 전용) ═══ */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setDevOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2">
              <FlaskConical size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                DEV — 프로토타입 전용
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-amber-400 transition-transform ${devOpen ? "rotate-180" : ""}`}
            />
          </button>

          {devOpen && (
            <div className="px-4 pb-4 space-y-4">
              {/* 역할 선택 */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-amber-400/60 uppercase tracking-wider">역할</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ROLES.map(({ value, label, desc, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedRole(value)}
                      className={`flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all ${
                        selectedRole === value
                          ? "border-amber-500/50 bg-amber-500/10"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <Icon size={14} className={selectedRole === value ? "text-amber-400 mt-0.5" : "text-zinc-600 mt-0.5"} />
                      <div>
                        <p className={`text-xs font-medium ${selectedRole === value ? "text-amber-300" : "text-zinc-400"}`}>
                          {label}
                        </p>
                        <p className="text-[10px] text-zinc-600 leading-tight">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* B2B / B2C 토글 */}
              {selectedRole !== "SUPER_ADMIN" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-amber-400/60 uppercase tracking-wider">테넌트</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setTenantType("B2B")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                        tenantType === "B2B"
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      }`}
                    >
                      <Building2 size={13} /> B2B
                    </button>
                    <button
                      onClick={() => setTenantType("B2C")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                        tenantType === "B2C"
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      }`}
                    >
                      <Globe size={13} /> B2C
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-600">
                    {tenantType === "B2B" ? "SSO · 조직구조 · 수강배정" : "소셜 로그인 · 결제 · 카탈로그"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ 실제 로그인 UI ═══ */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">OpenKnock Learn</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {effectiveTenant === "B2B" ? "삼성전자 학습 포털" : "학습을 시작하세요"}
            </p>
          </div>

          {/* 인증 UI — B2B SSO */}
          {effectiveTenant === "B2B" && selectedRole !== "SUPER_ADMIN" && (
            <div className="space-y-3">
              <button
                onClick={handleSsoLogin}
                className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors text-sm"
              >
                <Lock size={16} />
                SSO 로그인
              </button>
              <p className="text-[11px] text-zinc-600 text-center">
                기업 계정(SAML/OIDC)으로 로그인합니다
              </p>
            </div>
          )}

          {/* 인증 UI — B2C 소셜 + 이메일 */}
          {effectiveTenant === "B2C" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white text-zinc-900 font-medium rounded-lg text-sm hover:bg-zinc-100 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#FEE500] text-[#191919] font-medium rounded-lg text-sm hover:bg-[#FDD800] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#191919"><path d="M12 3C6.5 3 2 6.58 2 11c0 2.84 1.87 5.33 4.68 6.72l-1.2 4.38c-.05.2.17.36.34.24L10.5 19h1.5c5.5 0 10-3.58 10-8s-4.5-8-10-8z"/></svg>
                  카카오
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-zinc-800" />
                <span className="text-[11px] text-zinc-600">또는</span>
                <div className="flex-1 border-t border-zinc-800" />
              </div>

              <div className="space-y-2">
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
                  onClick={handleLogin}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  로그인
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <Link href="/login/forgot-password" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  비밀번호 찾기
                </Link>
                <Link href="/login/register" className="text-violet-400 hover:text-violet-300 transition-colors">
                  회원가입
                </Link>
              </div>
            </div>
          )}

          {/* 인증 UI — SUPER_ADMIN 이메일 */}
          {selectedRole === "SUPER_ADMIN" && (
            <div className="space-y-2">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors text-sm"
              >
                플랫폼 관리자 로그인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
