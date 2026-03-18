export type { TenantPlan, TenantStatus, TenantInfra, Tenant } from "@/lib/models";
import type { Tenant } from "@/lib/models";

export const PLATFORM_DOMAIN = "open-knock.com";

export const SUBDOMAIN_RESERVED = [
  "admin", "api", "www", "app", "mail", "ftp", "platform",
  "root", "system", "open-knock", "support", "status", "docs", "billing",
];

export type SubdomainStatus = "valid" | "taken" | "reserved" | "format" | "empty";

export function validateSubdomain(
  value: string,
  existingSubdomains: string[],
  currentSubdomain?: string,
): SubdomainStatus {
  if (!value) return "empty";
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value)) return "format";
  if (SUBDOMAIN_RESERVED.includes(value)) return "reserved";
  const others = existingSubdomains.filter((s) => s !== currentSubdomain);
  if (others.includes(value)) return "taken";
  return "valid";
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
    infra: {
      awsRegion: "ap-northeast-2",
      dbHost: "t-001.cluster.rds.open-knock.internal",
      s3Bucket: "ok-tenant-samsung-prod",
      ec2InstanceType: "c6i.4xlarge",
      provisionedAt: "2024-01-01T09:00:00Z",
    },
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
    infra: {
      awsRegion: "ap-northeast-2",
      dbHost: "t-002.cluster.rds.open-knock.internal",
      s3Bucket: "ok-tenant-lge-prod",
      ec2InstanceType: "t3.large",
      provisionedAt: "2024-03-01T11:30:00Z",
    },
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
    infra: {
      awsRegion: "ap-northeast-2",
      dbHost: "t-003.cluster.rds.open-knock.internal",
      s3Bucket: "ok-tenant-hyundai-prod",
      ec2InstanceType: "c6i.8xlarge",
      provisionedAt: "2023-07-01T08:00:00Z",
    },
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
    infra: {
      awsRegion: "ap-northeast-2",
      dbHost: "t-004.cluster.rds.open-knock.internal",
      s3Bucket: "ok-tenant-kakao-trial",
      ec2InstanceType: "t3.medium",
      provisionedAt: "2026-03-17T14:00:00Z",
    },
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
    infra: {
      awsRegion: "ap-northeast-2",
      dbHost: "t-005.cluster.rds.open-knock.internal",
      s3Bucket: "ok-tenant-naver-prod",
      ec2InstanceType: "t3.small",
      provisionedAt: "2024-06-01T10:00:00Z",
    },
  },
];
