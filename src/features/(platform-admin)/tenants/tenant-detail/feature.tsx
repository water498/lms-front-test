"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  UserCog,
  PauseCircle,
  TrendingUp,
} from "lucide-react";
import { TENANTS, type TenantPlan, type TenantStatus } from "../mockData";

function ProgressBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function PlanBadge({ plan }: { plan: TenantPlan }) {
  const cls =
    plan === "ENTERPRISE"
      ? "bg-violet-100 text-violet-700"
      : plan === "GROWTH"
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {plan}
    </span>
  );
}

function StatusBadge({
  status,
  trialEndsAt,
}: {
  status: TenantStatus;
  trialEndsAt?: string;
}) {
  if (status === "TRIAL" && trialEndsAt) {
    const diff = Math.ceil(
      (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        TRIAL · D-{diff}
      </span>
    );
  }
  const cls =
    status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : status === "SUSPENDED"
        ? "bg-red-100 text-red-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

interface Props {
  tenantId: string;
}

export default function TenantDetailFeature({ tenantId }: Props) {
  const router = useRouter();
  const tenant = TENANTS.find((t) => t.id === tenantId);

  const [localPlan, setLocalPlan] = useState<TenantPlan>(
    tenant?.plan ?? "STARTER",
  );
  const [localStatus, setLocalStatus] = useState<TenantStatus>(
    tenant?.status ?? "ACTIVE",
  );

  if (!tenant) {
    return (
      <div className="text-center py-20 text-slate-400">
        테넌트를 찾을 수 없습니다. (id: {tenantId})
      </div>
    );
  }

  const maxUsersLabel =
    tenant.maxUsers === 0 ? "무제한" : tenant.maxUsers.toLocaleString();
  const userPct =
    tenant.maxUsers === 0 ? 50 : (tenant.currentUsers / tenant.maxUsers) * 100;
  const storagePct = (tenant.storageUsedGB / tenant.storageMaxGB) * 100;

  const handlePlanChange = (plan: TenantPlan) => {
    setLocalPlan(plan);
    alert(
      `플랜 변경 요청: ${tenant.name} → ${plan}\n(실험 환경 — store 반영 없음)`,
    );
  };

  const handleToggleSuspend = () => {
    if (localStatus === "SUSPENDED") {
      setLocalStatus("ACTIVE");
    } else {
      if (confirm(`${tenant.name} 테넌트를 정지하시겠습니까?`)) {
        setLocalStatus("SUSPENDED");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.push("/experiments/platform-admin/tenants")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={15} />
        기업 목록으로
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{tenant.name}</h2>
          <p className="text-sm text-slate-400 font-mono mt-0.5">
            {tenant.subdomain}.open-knock.com
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PlanBadge plan={localPlan} />
          <StatusBadge status={localStatus} trialEndsAt={tenant.trialEndsAt} />
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">기본 정보</h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">담당자 이메일</dt>
            <dd className="text-slate-700">{tenant.adminEmail}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">계약 기간</dt>
            <dd className="text-slate-700">
              {tenant.contractStart} ~ {tenant.contractEnd}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">플랜</dt>
            <dd>
              <PlanBadge plan={localPlan} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">상태</dt>
            <dd>
              <StatusBadge
                status={localStatus}
                trialEndsAt={tenant.trialEndsAt}
              />
            </dd>
          </div>
        </dl>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">사용 현황</h3>
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>사용자</span>
              <span>
                {tenant.currentUsers.toLocaleString()} / {maxUsersLabel}
                {tenant.maxUsers > 0 && ` (${Math.round(userPct)}%)`}
              </span>
            </div>
            <ProgressBar
              value={tenant.currentUsers}
              max={
                tenant.maxUsers === 0
                  ? tenant.currentUsers * 2
                  : tenant.maxUsers
              }
              color={userPct > 90 ? "bg-red-400" : "bg-blue-400"}
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>저장 용량</span>
              <span>
                {tenant.storageUsedGB}GB / {tenant.storageMaxGB}GB (
                {Math.round(storagePct)}%)
              </span>
            </div>
            <ProgressBar
              value={tenant.storageUsedGB}
              max={tenant.storageMaxGB}
              color={storagePct > 90 ? "bg-red-400" : "bg-violet-400"}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">관리 액션</h3>
        <div className="flex flex-wrap gap-3">
          {/* Impersonate */}
          <Link
            href="/experiments/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <UserCog size={15} />
            Impersonate (Tenant Admin)
            <ExternalLink size={13} className="opacity-70" />
          </Link>

          {/* Plan change */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
            <TrendingUp size={15} className="text-slate-400" />
            <span className="text-sm text-slate-600 mr-1">플랜 변경:</span>
            {(["STARTER", "GROWTH", "ENTERPRISE"] as TenantPlan[]).map((p) => (
              <button
                key={p}
                disabled={p === localPlan}
                onClick={() => handlePlanChange(p)}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                  p === localPlan
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Suspend */}
          <button
            onClick={handleToggleSuspend}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              localStatus === "SUSPENDED"
                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            }`}
          >
            <PauseCircle size={15} />
            {localStatus === "SUSPENDED" ? "정지 해제" : "테넌트 정지"}
          </button>
        </div>
      </div>
    </div>
  );
}
