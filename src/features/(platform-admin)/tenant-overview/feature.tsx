"use client";

import { useState, useMemo } from "react";
import {
  PauseCircle,
  Pencil,
  CheckCircle2,
  XCircle,
  Check,
  X,
} from "lucide-react";
import {
  TENANTS,
  PLATFORM_DOMAIN,
  validateSubdomain,
  type TenantStatus,
  type SubdomainStatus,
} from "@/features/(platform-admin)/tenant-list/mockData";
import { useTenantDetail } from "@/features/(platform-admin)/tenant-layout/context";

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

const SUBDOMAIN_STATUS_MSG: Record<SubdomainStatus, string> = {
  empty: "",
  format: "소문자·영숫자·하이픈만 허용 (최소 2자)",
  reserved: "예약어로 사용 불가",
  taken: "이미 사용 중인 서브도메인",
  valid: "사용 가능",
};

export default function TenantOverview() {
  const {
    tenant,
    localStatus,
    setLocalStatus,
    localSubdomain,
    setLocalSubdomain,
    existingSubdomains,
    platformDomain,
  } = useTenantDetail();

  // Subdomain inline edit state
  const [editingSubdomain, setEditingSubdomain] = useState(false);
  const [subdomainInput, setSubdomainInput] = useState(tenant.subdomain ?? "");

  const subdomainStatus = useMemo(
    () =>
      validateSubdomain(subdomainInput, existingSubdomains, tenant.subdomain),
    [subdomainInput, existingSubdomains, tenant.subdomain],
  );

  const maxUsersLabel =
    tenant.maxUsers === 0 ? "무제한" : tenant.maxUsers.toLocaleString();
  const userPct =
    tenant.maxUsers === 0 ? 50 : (tenant.currentUsers / tenant.maxUsers) * 100;
  const storagePct = (tenant.storageUsedGB / tenant.storageMaxGB) * 100;

  const handleToggleSuspend = () => {
    if (localStatus === "SUSPENDED") {
      setLocalStatus("ACTIVE");
    } else {
      if (confirm(`${tenant.name} 기업을 정지하시겠습니까?`)) {
        setLocalStatus("SUSPENDED");
      }
    }
  };

  const startEditSubdomain = () => {
    setSubdomainInput(localSubdomain);
    setEditingSubdomain(true);
  };

  const saveSubdomain = () => {
    if (subdomainStatus !== "valid") return;
    setLocalSubdomain(subdomainInput);
    setEditingSubdomain(false);
  };

  const cancelSubdomain = () => {
    setSubdomainInput(localSubdomain);
    setEditingSubdomain(false);
  };

  return (
    <>
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">기본 정보</h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">담당자 이메일</dt>
            <dd className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-700">{tenant.adminEmail}</span>
              {tenant.adminInviteStatus === "PENDING" ? (
                <>
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                    초대 발송됨
                  </span>
                  <button
                    onClick={() =>
                      alert(
                        `${tenant.adminEmail}에 초대 이메일을 재발송합니다. (실험 환경)`,
                      )
                    }
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    재발송
                  </button>
                </>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                  활성
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 mb-0.5">계약 기간</dt>
            <dd className="text-slate-700">
              {tenant.contractStart} ~ {tenant.contractEnd}
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
          <div className="col-span-2">
            <dt className="text-xs text-slate-400 mb-0.5">서브도메인</dt>
            <dd>
              {editingSubdomain ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center border rounded-lg overflow-hidden ${
                        subdomainStatus === "valid"
                          ? "border-green-400"
                          : subdomainStatus !== "empty"
                            ? "border-red-400"
                            : "border-slate-200"
                      }`}
                    >
                      <input
                        autoFocus
                        className="px-3 py-1.5 text-sm font-mono focus:outline-none w-40"
                        value={subdomainInput}
                        onChange={(e) =>
                          setSubdomainInput(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ""),
                          )
                        }
                      />
                      {subdomainInput && (
                        <span className="px-1.5">
                          {subdomainStatus === "valid" ? (
                            <CheckCircle2
                              size={13}
                              className="text-green-500"
                            />
                          ) : (
                            <XCircle size={13} className="text-red-500" />
                          )}
                        </span>
                      )}
                      <span className="bg-slate-50 border-l border-slate-200 px-2 py-1.5 text-xs text-slate-400">
                        .{platformDomain}
                      </span>
                    </div>
                    <button
                      onClick={saveSubdomain}
                      disabled={subdomainStatus !== "valid"}
                      className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={cancelSubdomain}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  {subdomainInput && subdomainStatus !== "empty" && (
                    <p
                      className={`text-xs ${
                        subdomainStatus === "valid"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {SUBDOMAIN_STATUS_MSG[subdomainStatus]}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-700">
                    {localSubdomain}.{platformDomain}
                  </span>
                  <button
                    onClick={startEditSubdomain}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mt-4">
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
      <div className="bg-white rounded-xl border border-slate-200 p-5 mt-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">관리 액션</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleToggleSuspend}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              localStatus === "SUSPENDED"
                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            }`}
          >
            <PauseCircle size={15} />
            {localStatus === "SUSPENDED" ? "정지 해제" : "기업 정지"}
          </button>
        </div>
      </div>
    </>
  );
}
