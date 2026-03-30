"use client";

import { useState } from "react";
import { Shield, UserCog, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Tenant } from "@/lib/models";

interface Props {
  tenant: Tenant;
}

export default function SsoSection({ tenant }: Props) {
  const sso = tenant.sso;
  const isEnabled = sso?.enabled ?? false;
  const [forceDisabled, setForceDisabled] = useState(false);

  const effectivelyEnabled = isEnabled && !forceDisabled;

  const handleBreakGlass = () => {
    if (forceDisabled) {
      if (confirm(`${tenant.name}의 SSO 강제 비활성화를 해제하시겠습니까?\n기업 관리자가 설정한 SSO가 다시 활성화됩니다.`)) {
        setForceDisabled(false);
      }
    } else {
      if (confirm(`${tenant.name}의 SSO를 강제 비활성화하시겠습니까?\n모든 사용자가 이메일/비밀번호로만 로그인하게 됩니다.`)) {
        setForceDisabled(true);
      }
    }
  };

  const idpHost = sso?.idpSsoUrl
    ? (() => { try { return new URL(sso.idpSsoUrl).hostname; } catch { return sso.idpSsoUrl; } })()
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Shield size={15} className="text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">SSO 상태</h3>
      </div>

      {/* 활성화 상태 + break-glass */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              effectivelyEnabled ? "bg-green-500" : "bg-slate-300"
            }`}
          />
          <span className="text-sm text-slate-700">
            {effectivelyEnabled
              ? "활성"
              : isEnabled && forceDisabled
                ? "강제 비활성화 (override)"
                : "비활성"}
          </span>
          {tenant.planName && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-slate-100 text-slate-500">
              {tenant.planName}
            </span>
          )}
        </div>
        <button
          onClick={handleBreakGlass}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            forceDisabled
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
          }`}
        >
          <AlertTriangle size={12} />
          {forceDisabled ? "비활성화 해제" : "강제 비활성화"}
        </button>
      </div>

      {/* 연결 상태 요약 */}
      {sso && (
        <div className="bg-slate-50 rounded-lg px-4 py-3 text-xs text-slate-500 flex items-center gap-4">
          <span>
            연결 상태:{" "}
            <span className={`font-medium ${effectivelyEnabled ? "text-green-600" : "text-slate-400"}`}>
              {effectivelyEnabled ? "● 정상" : "○ 꺼짐"}
            </span>
          </span>
          {idpHost && <span>IdP: <span className="font-mono text-slate-700">{idpHost}</span></span>}
          <span>마지막 확인: 5분 전</span>
        </div>
      )}

      {!sso && (
        <p className="text-xs text-slate-400">
          SSO 미설정 — 기업 관리자가 접근 관리 탭에서 설정할 수 있습니다.
        </p>
      )}

      {/* Impersonation 버튼 */}
      <div className="pt-1 border-t border-slate-100">
        <Link
          href={`/experiments/admin?impersonateTenantId=${tenant.id}&impersonateTenantName=${encodeURIComponent(tenant.name)}`}
          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <UserCog size={13} />
          {tenant.name} 관리자로 전환 — SSO 세부 설정은 여기서 변경
          <ExternalLink size={11} className="opacity-60" />
        </Link>
      </div>
    </div>
  );
}
