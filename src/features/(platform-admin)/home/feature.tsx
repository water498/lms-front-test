"use client";

import { TENANTS } from "../tenants/mockData";
import { Building2, Users, TrendingUp, AlertTriangle } from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function PlatformAdminDashboard() {
  const activeTenants   = TENANTS.filter((t) => t.status === "ACTIVE").length;
  const trialTenants    = TENANTS.filter((t) => t.status === "TRIAL").length;
  const suspended       = TENANTS.filter((t) => t.status === "SUSPENDED").length;
  const totalUsers      = TENANTS.reduce((s, t) => s + t.currentUsers, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">플랫폼 현황</h2>
        <p className="text-sm text-slate-500">전체 테넌트 및 사용자 요약</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="전체 테넌트"
          value={TENANTS.length}
          sub={`활성 ${activeTenants}개`}
          icon={Building2}
          color="bg-blue-500"
        />
        <StatCard
          label="총 사용자"
          value={totalUsers.toLocaleString()}
          sub="모든 테넌트 합산"
          icon={Users}
          color="bg-violet-500"
        />
        <StatCard
          label="트라이얼"
          value={trialTenants}
          sub="전환 대기 중"
          icon={TrendingUp}
          color="bg-amber-500"
        />
        <StatCard
          label="정지됨"
          value={suspended}
          sub="조치 필요"
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">테넌트 현황 요약</h3>
        <div className="flex flex-col gap-3">
          {TENANTS.map((t) => (
            <div key={t.id} className="flex items-center gap-3 text-sm">
              <span className="w-32 font-medium text-slate-800 truncate">{t.name}</span>
              <span className="w-20 text-slate-400 text-xs">{t.subdomain}</span>
              <PlanBadge plan={t.plan} />
              <StatusBadge status={t.status} trialEndsAt={t.trialEndsAt} />
              <span className="ml-auto text-slate-500 text-xs">
                {t.currentUsers.toLocaleString()} users
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const cls =
    plan === "ENTERPRISE"
      ? "bg-violet-100 text-violet-700"
      : plan === "GROWTH"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{plan}</span>
  );
}

function StatusBadge({ status, trialEndsAt }: { status: string; trialEndsAt?: string }) {
  if (status === "TRIAL" && trialEndsAt) {
    const diff = Math.ceil(
      (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        D-{diff}
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
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>
  );
}
