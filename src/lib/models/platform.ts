// Domain: platform — 멀티테넌시, 플랫폼 설정, 공지

import type { TenantType } from "./common";

export type TenantStatus = "TRIAL" | "ACTIVE" | "SUSPENDED";
export type AdminInviteStatus = "PENDING" | "ACCEPTED";
export type SsoProvider = "SAML" | "OIDC";

export interface TenantSsoConfig {
  enabled: boolean;
  provider: SsoProvider;
  // SAML
  idpEntityId?: string;
  idpSsoUrl?: string;
  idpCertificate?: string;
  // OIDC
  issuerUrl?: string;
  clientId?: string;
  clientSecret?: string;
}

export type InfraServiceStatus = "HEALTHY" | "WARNING" | "DOWN";

export interface TenantInfraStatus {
  ec2: InfraServiceStatus;
  rds: InfraServiceStatus;
  s3: InfraServiceStatus;
  checkedAt: string; // ISO 8601
}

export type PlatformAuditAction =
  | "TENANT_CREATED"
  | "TENANT_SUSPENDED"
  | "TENANT_RESUMED"
  | "SUBDOMAIN_CHANGED"
  | "PLAN_CHANGED"
  | "USER_LIMIT_CHANGED"
  | "SSO_CONFIGURED"
  | "SSO_ENABLED"
  | "SSO_DISABLED"
  | "ADMIN_INVITED"
  | "ADMIN_INVITE_RESENT"
  | "PLATFORM_SETTINGS_UPDATED"
  | "PLATFORM_PLAN_CHANGED";

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actor: string;
  action: PlatformAuditAction;
  targetType: "TENANT" | "PLATFORM";
  targetName: string;
  detail: string;
  ip: string;
}

export interface TenantInfra {
  awsRegion: string;
  dbHost: string;
  s3Bucket: string;
  ec2InstanceType: string;
  provisionedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  tenantType?: TenantType;
  /** 영업 계약 시 수동 입력. 예: 'STARTER' / 'ENTERPRISE' / 'CUSTOM' */
  planName?: string;
  status: TenantStatus;
  trialEndsAt?: string;
  maxUsers: number; // 0 = unlimited
  currentUsers: number;
  adminEmail: string;
  adminInviteStatus?: AdminInviteStatus;
  ownerUserId?: string; // 테넌트 소유자 User.id. NULL = 초대 수락 전
  contractStart: string;
  contractEnd: string;
  storageUsedGB: number;
  storageMaxGB: number;
  infra: TenantInfra;
  infraStatus?: TenantInfraStatus;
  sso?: TenantSsoConfig;
  ipWhitelist?: string[]; // IP 접근 제한 (CIDR 표기 허용, e.g. "1.2.3.4/24")
}

// ── 테넌트 기능 제어 ────────────────────────────────────────

/** TenantFeature — 테넌트별 기능 활성화/제한. control_plane에서 관리. */
export interface TenantFeature {
  id: string;
  tenantId: string;
  /** 기능 식별 코드. 예: 'sso', 'payments', 'orgStructure', 'report.export' */
  featureCode: string;
  /** True = 기능 활성화, False = 완전 차단 (UI 숨김 + API 거부) */
  enabled: boolean;
  /** True = 조회만 허용, 수정 차단. Demo 테넌트용 */
  readonly: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ── 플랫폼 청구/결제 ────────────────────────────────────────

export type BillingPlan = "TRIAL" | "STARTER" | "BUSINESS" | "ENTERPRISE";
export type BillingPaymentStatus = "PAID" | "OVERDUE" | "PENDING" | "EXEMPT";

export interface TenantInvoice {
  id: string;
  issuedAt: string;
  periodStart: string;
  periodEnd: string;
  amountKRW: number;
  status: "PAID" | "OVERDUE" | "PENDING";
}

export interface TenantBilling {
  tenantId: string;
  tenantName: string;
  tenantType: "B2B" | "B2C";
  plan: BillingPlan;
  monthlyFeeKRW: number;
  paymentStatus: BillingPaymentStatus;
  lastPaidAt?: string;
  nextBillingAt?: string;
  invoices: TenantInvoice[];
}

// ── 공지 ──────────────────────────────────────────────────

export type PlatformAnnouncementStatus = "PUBLISHED" | "UNPUBLISHED";

/** PlatformAnnouncement — 플랫폼 어드민 → 테넌트 어드민 공지 */
export interface PlatformAnnouncement {
  id: string;
  title: string;
  content?: string;
  /** MAINTENANCE / UPDATE / URGENT / GENERAL 등 */
  subtype?: string;
  /** 향후 확장용. 현재는 항상 ALL_TENANTS */
  targetType: "ALL_TENANTS" | "SPECIFIC_TENANTS";
  status: PlatformAnnouncementStatus;
  sentAt?: string;
  views: number;
  createdBy?: string;
  createdAt: string;
}
