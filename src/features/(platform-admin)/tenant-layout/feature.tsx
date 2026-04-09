"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  UserCog,
} from "lucide-react";
import { TENANTS, type TenantStatus } from "../tenant-list/mockData";
import { TenantDetailProvider, useTenantDetail } from "./context";

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
        TRIAL &middot; D-{diff}
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

const TABS = [
  { id: "overview", label: "개요",     href: (base: string) => `${base}/overview` },
  { id: "sso",      label: "SSO",      href: (base: string) => `${base}/sso` },
  { id: "credits",  label: "크레딧",   href: (base: string) => `${base}/credits` },
  { id: "infra",    label: "인프라",   href: (base: string) => `${base}/infra` },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tenant, localStatus, localSubdomain, platformDomain } = useTenantDetail();
  const base = `/platform-admin/tenants/${tenant.id}`;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Link
        href="/platform-admin/tenants"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={15} />
        기업 목록으로
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{tenant.name}</h2>
          <p className="text-sm text-slate-400 font-mono mt-0.5">
            {localSubdomain}.{platformDomain}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin?impersonateTenantId=${tenant.id}&impersonateTenantName=${encodeURIComponent(tenant.name)}`}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <UserCog size={13} />
            관리자 접속
            <ExternalLink size={11} className="opacity-70" />
          </Link>
          <StatusBadge status={localStatus} trialEndsAt={tenant.trialEndsAt} />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => {
          const tabHref = tab.href(base);
          const isActive = pathname === tabHref || pathname.startsWith(tabHref + "/");
          return (
            <Link
              key={tab.id}
              href={tabHref}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab content */}
      <div>{children}</div>
    </div>
  );
}

export default function TenantDetailShell({ children }: { children: React.ReactNode }) {
  const params = useParams<{ tenantId: string }>();
  const tenantId = params.tenantId;

  const tenant = TENANTS.find((t) => t.id === tenantId);
  if (!tenant) {
    return (
      <div className="text-center py-20 text-slate-400">
        기업을 찾을 수 없습니다. (id: {tenantId})
      </div>
    );
  }

  return (
    <TenantDetailProvider tenantId={tenantId}>
      <ShellInner>{children}</ShellInner>
    </TenantDetailProvider>
  );
}
