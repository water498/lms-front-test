"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { TENANTS, type Tenant } from "./mockData";
import CreateTenantModal from "./modals/create-tenant-modal";

function PlanBadge({ plan }: { plan: string }) {
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
  status: string;
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

function UserUsage({ tenant }: { tenant: Tenant }) {
  const max =
    tenant.maxUsers === 0 ? "무제한" : tenant.maxUsers.toLocaleString();
  return (
    <span className="text-sm text-slate-700">
      {tenant.currentUsers.toLocaleString()} / {max}
    </span>
  );
}

export default function TenantsFeature() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">기업 목록</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            총 {TENANTS.length}개 테넌트
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          신규 기업
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                기업명
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                서브도메인
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                플랜
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                상태
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                사용자
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                계약 기간
              </th>
            </tr>
          </thead>
          <tbody>
            {TENANTS.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() =>
                  router.push(`/experiments/platform-admin/tenants/${t.id}`)
                }
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {t.name}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                  {t.subdomain}.openk-nock.com
                </td>
                <td className="px-4 py-3">
                  <PlanBadge plan={t.plan} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} trialEndsAt={t.trialEndsAt} />
                </td>
                <td className="px-4 py-3">
                  <UserUsage tenant={t} />
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {t.contractStart} ~ {t.contractEnd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && <CreateTenantModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
