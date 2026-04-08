"use client";

import { useState } from "react";
import { RefreshCw, Trash2, HeartPulse } from "lucide-react";
import type { Tenant, InfraServiceStatus } from "@/lib/models";
import { useTenantDetail } from "@/features/(platform-admin)/tenant-layout/context";

function InfraServiceBadge({
  label,
  status,
}: {
  label: string;
  status: InfraServiceStatus;
}) {
  const cls =
    status === "HEALTHY"
      ? "bg-green-100 text-green-700"
      : status === "WARNING"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-mono font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function Page() {
  const { tenant } = useTenantDetail();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<string>("7분 전");

  const handleAction = (action: string, label: string) => {
    setLoadingAction(action);
    setTimeout(() => {
      setLoadingAction(null);
      if (action === "sync") setSyncedAt("방금 전");
      alert(`${label} 완료 (실험 환경)`);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">인프라 정보</h3>
          {tenant.infraStatus && (
            <div className="flex items-center gap-2">
              <InfraServiceBadge label="EC2" status={tenant.infraStatus.ec2} />
              <InfraServiceBadge label="RDS" status={tenant.infraStatus.rds} />
              <InfraServiceBadge label="S3"  status={tenant.infraStatus.s3} />
              <span className="text-xs text-slate-400 ml-1">
                {new Date(tenant.infraStatus.checkedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 기준
              </span>
            </div>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">AWS 리전</dt>
            <dd className="font-mono text-xs text-slate-700">{tenant.infra.awsRegion}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">EC2 인스턴스</dt>
            <dd className="font-mono text-xs text-slate-700">{tenant.infra.ec2InstanceType}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-slate-400 mb-0.5">DB 호스트</dt>
            <dd className="font-mono text-xs text-slate-700 break-all">{tenant.infra.dbHost}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-slate-400 mb-0.5">S3 버킷</dt>
            <dd className="font-mono text-xs text-slate-700">{tenant.infra.s3Bucket}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">프로비저닝 일시</dt>
            <dd className="font-mono text-xs text-slate-700">
              {new Date(tenant.infra.provisionedAt).toLocaleString("ko-KR")}
            </dd>
          </div>
        </dl>
      </div>

      {/* Control Plane */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Control Plane</h3>
          <span className="text-xs text-slate-400">마지막 동기화: {syncedAt} (주기: 15분)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "sync",   label: "설정 재동기화", icon: RefreshCw },
            { id: "cache",  label: "캐시 초기화",   icon: Trash2 },
            { id: "health", label: "헬스체크 실행",  icon: HeartPulse },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleAction(id, label)}
              disabled={loadingAction !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon
                size={12}
                className={loadingAction === id ? "animate-spin" : ""}
              />
              {loadingAction === id ? "처리 중..." : label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
