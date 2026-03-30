"use client";

import Link from "next/link";
import { Building2, Users, HardDrive, CheckCircle2, AlertCircle } from "lucide-react";
import { TENANTS } from "../tenants/mockData";

const TODAY = new Date("2026-03-18");

// 월별 학습자 수 (mock — 최근 6개월)
// 마지막 값은 TENANTS.currentUsers 합계와 일치
const MONTHLY_USERS = [
  { label: "10월", value: 9200 },
  { label: "11월", value: 10100 },
  { label: "12월", value: 10800 },
  { label: "1월",  value: 11500 },
  { label: "2월",  value: 12300 },
  { label: "3월",  value: 13558 },
];

// ── 헬퍼 컴포넌트 ──────────────────────────────────────────

function StatusBadge({
  status,
  trialEndsAt,
}: {
  status: string;
  trialEndsAt?: string;
}) {
  if (status === "TRIAL" && trialEndsAt) {
    const diff = Math.ceil(
      (new Date(trialEndsAt).getTime() - TODAY.getTime()) / 86400000,
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
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

/** 월별 학습자 추이 — SVG line chart */
function MonthlyUsersChart() {
  const W = 440, H = 148;
  const PAD = { l: 50, r: 16, t: 12, b: 32 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const values = MONTHLY_USERS.map((d) => d.value);
  const minVal = Math.min(...values) * 0.93;
  const maxVal = Math.max(...values) * 1.04;

  const xs = (i: number) => PAD.l + (i / (MONTHLY_USERS.length - 1)) * innerW;
  const ys = (v: number) =>
    PAD.t + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const linePts = MONTHLY_USERS.map((d, i) => `${xs(i)},${ys(d.value)}`).join(" ");
  const areaPts = `${xs(0)},${PAD.t + innerH} ${linePts} ${xs(MONTHLY_USERS.length - 1)},${PAD.t + innerH}`;

  const ticks = [0.3, 0.6, 0.9].map((r) => minVal + (maxVal - minVal) * r);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "148px" }}>
      <defs>
        <linearGradient id="ua-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 수평 격자선 */}
      {ticks.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.l} x2={W - PAD.r}
            y1={ys(v)}  y2={ys(v)}
            stroke="#f1f5f9" strokeWidth="1"
          />
          <text
            x={PAD.l - 6} y={ys(v) + 3.5}
            textAnchor="end" fill="#94a3b8" fontSize="9.5"
          >
            {Math.round(v / 1000)}k
          </text>
        </g>
      ))}

      {/* 면 채우기 */}
      <polygon points={areaPts} fill="url(#ua-grad)" />

      {/* 선 */}
      <polyline
        points={linePts}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 점 + 레이블 */}
      {MONTHLY_USERS.map((d, i) => (
        <g key={i}>
          <circle cx={xs(i)} cy={ys(d.value)} r="3.5" fill="#6366f1" />
          {/* 마지막 점에만 값 표시 */}
          {i === MONTHLY_USERS.length - 1 && (
            <text
              x={xs(i) - 5} y={ys(d.value) - 8}
              textAnchor="end" fill="#6366f1" fontSize="9.5" fontWeight="600"
            >
              {d.value.toLocaleString()}
            </text>
          )}
          {/* x 축 레이블 */}
          <text
            x={xs(i)} y={H - 5}
            textAnchor="middle" fill="#94a3b8" fontSize="9.5"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 테넌트별 스토리지 사용률 — horizontal bars */
function StorageChart() {
  const sorted = [...TENANTS].sort(
    (a, b) =>
      b.storageUsedGB / b.storageMaxGB - a.storageUsedGB / a.storageMaxGB,
  );
  return (
    <div className="flex flex-col gap-3.5">
      {sorted.map((t) => {
        const pct = Math.round((t.storageUsedGB / t.storageMaxGB) * 100);
        const bar =
          pct >= 90
            ? "bg-red-400"
            : pct >= 75
              ? "bg-amber-400"
              : "bg-teal-400";
        return (
          <div key={t.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium">{t.name}</span>
              <span className="text-slate-400">
                {t.storageUsedGB} / {t.storageMaxGB} GB{" "}
                <span className="font-semibold text-slate-600">{pct}%</span>
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 메인 ───────────────────────────────────────────────────

export default function PlatformAdminDashboard() {
  const totalUsers      = TENANTS.reduce((s, t) => s + t.currentUsers, 0);
  const prevMonthUsers  = MONTHLY_USERS[MONTHLY_USERS.length - 2].value;
  const userGrowth      = totalUsers - prevMonthUsers;
  const userGrowthPct   = ((userGrowth / prevMonthUsers) * 100).toFixed(1);

  const totalStorageUsed = TENANTS.reduce((s, t) => s + t.storageUsedGB, 0);
  const totalStorageMax  = TENANTS.reduce((s, t) => s + t.storageMaxGB, 0);
  const storagePct       = Math.round((totalStorageUsed / totalStorageMax) * 100);

  const activeCnt    = TENANTS.filter((t) => t.status === "ACTIVE").length;
  const trialCnt     = TENANTS.filter((t) => t.status === "TRIAL").length;
  const suspendedCnt = TENANTS.filter((t) => t.status === "SUSPENDED").length;

  // ── 조치 필요 항목 계산 ────────────────────────────────
  type ActionLevel = "error" | "warning" | "info";
  type ActionItem = {
    level: ActionLevel;
    label: string;
    tenants: { name: string; id: string; sub?: string }[];
  };
  const actionItems: ActionItem[] = [];

  // 인프라 이상
  const infraAlerts = TENANTS.filter(
    (t) =>
      t.infraStatus &&
      (t.infraStatus.ec2 !== "HEALTHY" ||
        t.infraStatus.rds !== "HEALTHY" ||
        t.infraStatus.s3 !== "HEALTHY"),
  );
  if (infraAlerts.length) {
    actionItems.push({
      level: "error",
      label: "인프라 이상",
      tenants: infraAlerts.map((t) => {
        const bad: string[] = [];
        if (t.infraStatus!.ec2 !== "HEALTHY") bad.push("EC2");
        if (t.infraStatus!.rds !== "HEALTHY") bad.push("RDS");
        if (t.infraStatus!.s3 !== "HEALTHY") bad.push("S3");
        return { name: t.name, id: t.id, sub: bad.join("·") };
      }),
    });
  }

  // SSO 미설정
  const ssoAlerts = TENANTS.filter(
    (t) =>
      (t.status === "ACTIVE" || t.status === "TRIAL") &&
      (!t.sso || !t.sso.enabled),
  );
  if (ssoAlerts.length) {
    actionItems.push({
      level: "warning",
      label: "SSO 미설정",
      tenants: ssoAlerts.map((t) => ({ name: t.name, id: t.id })),
    });
  }

  // 만료 임박
  const expiringTenants = TENANTS.filter((t) => {
    if (t.status === "TRIAL" && t.trialEndsAt) {
      return (
        Math.ceil(
          (new Date(t.trialEndsAt).getTime() - TODAY.getTime()) / 86400000,
        ) <= 7
      );
    }
    if (t.status === "ACTIVE") {
      return (
        Math.ceil(
          (new Date(t.contractEnd).getTime() - TODAY.getTime()) / 86400000,
        ) <= 30
      );
    }
    return false;
  });
  if (expiringTenants.length) {
    actionItems.push({
      level: "warning",
      label: "만료 임박",
      tenants: expiringTenants.map((t) => {
        const d =
          t.status === "TRIAL" && t.trialEndsAt
            ? Math.ceil(
                (new Date(t.trialEndsAt).getTime() - TODAY.getTime()) /
                  86400000,
              )
            : Math.ceil(
                (new Date(t.contractEnd).getTime() - TODAY.getTime()) /
                  86400000,
              );
        return { name: t.name, id: t.id, sub: `D-${d}` };
      }),
    });
  }

  // 온보딩 대기
  const pendingInvites = TENANTS.filter(
    (t) => t.adminInviteStatus === "PENDING",
  );
  if (pendingInvites.length) {
    actionItems.push({
      level: "info",
      label: "온보딩 대기",
      tenants: pendingInvites.map((t) => ({ name: t.name, id: t.id })),
    });
  }

  // 정지 중
  const suspendedList = TENANTS.filter((t) => t.status === "SUSPENDED");
  if (suspendedList.length) {
    actionItems.push({
      level: "info",
      label: "정지 중",
      tenants: suspendedList.map((t) => ({ name: t.name, id: t.id })),
    });
  }

  const levelCfg: Record<
    ActionLevel,
    { dot: string; label: string; chip: string }
  > = {
    error:   { dot: "bg-red-500",   label: "text-red-600",    chip: "bg-red-50 text-red-600 hover:bg-red-100" },
    warning: { dot: "bg-amber-500", label: "text-amber-700",  chip: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
    info:    { dot: "bg-slate-400", label: "text-slate-600",  chip: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
  };

  const cpServices = [
    { label: "API 서버", ok: true },
    { label: "DB Cluster", ok: true },
    { label: "스토리지", ok: true },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          플랫폼 현황
        </h2>
        <p className="text-sm text-slate-500">전체 기업 및 사용자 요약</p>
      </div>

      {/* Control Plane 헬스 위젯 */}
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-3.5 flex items-center gap-6">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Control Plane</span>
        <div className="flex items-center gap-5">
          {cpServices.map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-1.5">
              {ok
                ? <CheckCircle2 size={13} className="text-green-500" />
                : <AlertCircle size={13} className="text-red-500" />
              }
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-400">마지막 동기화: 2분 전</span>
      </div>

      {/* ── 핵심 지표 3장 ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* 테넌트 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Building2 size={15} className="text-white" />
            </div>
            <span className="text-xs text-slate-500">테넌트</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-1">
            {TENANTS.length}
            <span className="text-sm font-normal text-slate-400 ml-1">개</span>
          </p>
          <p className="text-xs text-slate-400 mb-2">
            B2B {TENANTS.filter((t) => t.tenantType === "B2B").length}개 · B2C {TENANTS.filter((t) => t.tenantType === "B2C").length}개
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
              ACTIVE {activeCnt}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
              TRIAL {trialCnt}
            </span>
            {suspendedCnt > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                정지 {suspendedCnt}
              </span>
            )}
          </div>
        </div>

        {/* 전체 학습자 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <Users size={15} className="text-white" />
            </div>
            <span className="text-xs text-slate-500">전체 학습자</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-2">
            {totalUsers.toLocaleString()}
            <span className="text-sm font-normal text-slate-400 ml-1">명</span>
          </p>
          <p className="text-xs text-green-600 font-medium">
            ↑ 전월 대비 +{userGrowth.toLocaleString()}명 (+{userGrowthPct}%)
          </p>
        </div>

        {/* 스토리지 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <HardDrive size={15} className="text-white" />
            </div>
            <span className="text-xs text-slate-500">스토리지</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 mb-2">
            {totalStorageUsed.toLocaleString()}
            <span className="text-sm font-normal text-slate-400 ml-1">GB</span>
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>총 할당 {totalStorageMax.toLocaleString()} GB</span>
              <span className="font-medium text-slate-600">{storagePct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  storagePct >= 90
                    ? "bg-red-400"
                    : storagePct >= 75
                      ? "bg-amber-400"
                      : "bg-teal-400"
                }`}
                style={{ width: `${storagePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 운영 현황 패널 ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">운영 현황</h3>
          {actionItems.length === 0 && (
            <span className="text-xs text-green-600 font-medium">
              ✓ 이상 없음
            </span>
          )}
        </div>
        {actionItems.length === 0 ? (
          <p className="text-sm text-slate-400">
            모든 기업이 정상 상태입니다.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            {actionItems.map((item, idx) => {
              const cfg = levelCfg[item.level];
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cfg.dot}`}
                  />
                  <span
                    className={`text-xs font-medium w-20 shrink-0 ${cfg.label}`}
                  >
                    {item.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tenants.map((t) => (
                      <Link
                        key={t.id}
                        href={`/experiments/platform-admin/tenants/${t.id}`}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs transition-colors ${cfg.chip}`}
                      >
                        {t.name}
                        {t.sub && (
                          <span className="opacity-60 text-[10px]">
                            ({t.sub})
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 차트 2열 ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              월별 학습자 추이
            </h3>
            <span className="text-xs text-slate-400">최근 6개월 (mock)</span>
          </div>
          <MonthlyUsersChart />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            기업별 스토리지 사용률
          </h3>
          <StorageChart />
        </div>
      </div>

      {/* ── 테넌트 현황 ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">테넌트 현황</h3>
        <div className="flex flex-col gap-3">
          {TENANTS.map((t) => {
            const hasInfraAlert =
              t.infraStatus &&
              (t.infraStatus.ec2 !== "HEALTHY" ||
                t.infraStatus.rds !== "HEALTHY" ||
                t.infraStatus.s3 !== "HEALTHY");
            return (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <Link
                  href={`/experiments/platform-admin/tenants/${t.id}`}
                  className="w-28 font-medium text-slate-800 truncate hover:text-blue-600 transition-colors"
                >
                  {t.name}
                </Link>
                <span className="w-16 text-slate-400 text-xs truncate">
                  {t.subdomain}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  t.tenantType === "B2B"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-violet-50 text-violet-600"
                }`}>
                  {t.tenantType}
                </span>
                <StatusBadge status={t.status} trialEndsAt={t.trialEndsAt} />
                <span className="text-xs text-slate-500">
                  {t.currentUsers.toLocaleString()} users
                </span>
                {t.adminInviteStatus === "PENDING" && (
                  <span className="px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-700">
                    초대 미수락
                  </span>
                )}
                {(t.status === "ACTIVE" || t.status === "TRIAL") &&
                  (!t.sso || !t.sso.enabled) && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-slate-100 text-slate-500">
                      SSO 꺼짐
                    </span>
                  )}
                {hasInfraAlert && (
                  <span className="px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-600">
                    인프라 이상
                  </span>
                )}
                <span className="ml-auto text-xs text-slate-400">
                  {t.contractEnd}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
