export type TenantPlan   = "STARTER" | "GROWTH" | "ENTERPRISE";
export type TenantStatus = "TRIAL" | "ACTIVE" | "SUSPENDED";

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: TenantPlan;
  status: TenantStatus;
  trialEndsAt?: string;
  maxUsers: number;       // 0 = unlimited
  currentUsers: number;
  adminEmail: string;
  contractStart: string;
  contractEnd: string;
  storageUsedGB: number;
  storageMaxGB: number;
}

export const TENANTS: Tenant[] = [
  {
    id: "t-001",
    name: "삼성전자",
    subdomain: "samsung",
    plan: "ENTERPRISE",
    status: "ACTIVE",
    maxUsers: 0,
    currentUsers: 4320,
    adminEmail: "lms-admin@samsung.com",
    contractStart: "2024-01-01",
    contractEnd: "2026-12-31",
    storageUsedGB: 412,
    storageMaxGB: 1000,
  },
  {
    id: "t-002",
    name: "LG전자",
    subdomain: "lge",
    plan: "GROWTH",
    status: "ACTIVE",
    maxUsers: 300,
    currentUsers: 241,
    adminEmail: "learning@lge.com",
    contractStart: "2024-03-01",
    contractEnd: "2026-02-28",
    storageUsedGB: 67,
    storageMaxGB: 100,
  },
  {
    id: "t-003",
    name: "현대자동차",
    subdomain: "hyundai",
    plan: "ENTERPRISE",
    status: "ACTIVE",
    maxUsers: 0,
    currentUsers: 8910,
    adminEmail: "lms@hyundai.com",
    contractStart: "2023-07-01",
    contractEnd: "2026-06-30",
    storageUsedGB: 731,
    storageMaxGB: 1000,
  },
  {
    id: "t-004",
    name: "카카오",
    subdomain: "kakao",
    plan: "GROWTH",
    status: "TRIAL",
    trialEndsAt: "2026-03-29",
    maxUsers: 300,
    currentUsers: 38,
    adminEmail: "admin@kakao.com",
    contractStart: "2026-03-17",
    contractEnd: "2027-03-16",
    storageUsedGB: 3,
    storageMaxGB: 100,
  },
  {
    id: "t-005",
    name: "네이버",
    subdomain: "naver",
    plan: "STARTER",
    status: "SUSPENDED",
    maxUsers: 50,
    currentUsers: 49,
    adminEmail: "lms-admin@naver.com",
    contractStart: "2024-06-01",
    contractEnd: "2025-05-31",
    storageUsedGB: 9,
    storageMaxGB: 10,
  },
];
