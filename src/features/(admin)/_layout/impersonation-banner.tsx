"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface Props {
  tenantId: string;
  tenantName: string;
}

export default function ImpersonationBanner({ tenantId, tenantName }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-9 z-50 bg-amber-50 border-b border-amber-200 flex items-center px-4 gap-3">
      <ShieldCheck size={14} className="text-amber-600 flex-shrink-0" />
      <span className="text-xs text-amber-800 font-medium">
        플랫폼 관리자 모드
      </span>
      <span className="text-amber-300 select-none">|</span>
      <span className="text-xs text-amber-700">
        {tenantName} ({tenantId}) 테넌트로 접속 중
      </span>
      <div className="ml-auto">
        <Link
          href={`/platform-admin/tenants/${tenantId}`}
          className="text-xs text-amber-700 font-medium hover:text-amber-900 underline underline-offset-2 transition-colors"
        >
          돌아가기 →
        </Link>
      </div>
    </div>
  );
}
