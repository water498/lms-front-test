import { PLATFORM_DOMAIN } from "../tenants/mockData";
import type { PlatformAuditLog } from "@/lib/models";

export interface PlatformSettings {
  general: {
    serviceName: string;
    opsEmail: string;
    supportEmail: string;
    rootDomain: string;
  };
  security: {
    sessionTimeoutMin: number;
    require2FAForPlatformAdmin: boolean;
    auditLogRetentionDays: number;
    dataDeletionGraceDays: number;
    ipWhitelist: string; // placeholder
  };
  notifications: {
    trialExpiryWarningDays: number;
    storageThresholdPct: number;
    userThresholdPct: number;
    emailAlertsEnabled: boolean;
    slackWebhookUrl: string;
  };
}

export const AUDIT_LOGS: PlatformAuditLog[] = [
  { id: "al-001", timestamp: "2026-03-18T10:23:00Z", actor: "ops@open-knock.com", action: "TENANT_CREATED",           targetType: "TENANT",   targetName: "카카오",     detail: "신규 기업 생성 (STARTER)",                      ip: "10.0.1.45" },
  { id: "al-002", timestamp: "2026-03-18T09:15:00Z", actor: "ops@open-knock.com", action: "ADMIN_INVITED",            targetType: "TENANT",   targetName: "카카오",     detail: "admin@kakao.com 초대 이메일 발송",              ip: "10.0.1.45" },
  { id: "al-003", timestamp: "2026-03-17T16:40:00Z", actor: "ops@open-knock.com", action: "SSO_CONFIGURED",           targetType: "TENANT",   targetName: "삼성전자",   detail: "SAML 설정 업데이트 (IdP: Azure AD)",           ip: "10.0.1.45" },
  { id: "al-004", timestamp: "2026-03-17T14:20:00Z", actor: "admin@open-knock.com", action: "PLATFORM_SETTINGS_UPDATED", targetType: "PLATFORM", targetName: "플랫폼",     detail: "보안 설정: 감사 로그 보존 기간 365일로 변경",   ip: "10.0.1.12" },
  { id: "al-005", timestamp: "2026-03-15T11:05:00Z", actor: "ops@open-knock.com", action: "TENANT_SUSPENDED",         targetType: "TENANT",   targetName: "네이버",     detail: "계약 만료로 인한 정지",                        ip: "10.0.1.45" },
  { id: "al-006", timestamp: "2026-03-12T09:30:00Z", actor: "ops@open-knock.com", action: "USER_LIMIT_CHANGED",       targetType: "TENANT",   targetName: "현대자동차", detail: "500명 → 무제한",                               ip: "10.0.1.45" },
  { id: "al-007", timestamp: "2026-03-10T15:55:00Z", actor: "ops@open-knock.com", action: "PLAN_CHANGED",             targetType: "TENANT",   targetName: "LG전자",     detail: "STARTER → BUSINESS",                          ip: "10.0.1.45" },
  { id: "al-008", timestamp: "2026-03-08T11:20:00Z", actor: "ops@open-knock.com", action: "SSO_ENABLED",              targetType: "TENANT",   targetName: "LG전자",     detail: "OIDC 연동 활성화 (Google Workspace)",          ip: "10.0.1.45" },
  { id: "al-009", timestamp: "2026-03-05T14:10:00Z", actor: "ops@open-knock.com", action: "SUBDOMAIN_CHANGED",        targetType: "TENANT",   targetName: "현대자동차", detail: "hmc → hyundai",                                ip: "10.0.1.45" },
  { id: "al-010", timestamp: "2026-03-01T09:00:00Z", actor: "admin@open-knock.com", action: "PLATFORM_SETTINGS_UPDATED", targetType: "PLATFORM", targetName: "플랫폼",     detail: "알림 설정: Slack 웹훅 등록",                   ip: "10.0.1.12" },
  { id: "al-011", timestamp: "2026-02-25T16:30:00Z", actor: "ops@open-knock.com", action: "SSO_CONFIGURED",           targetType: "TENANT",   targetName: "현대자동차", detail: "OIDC 설정 (Azure AD)",                        ip: "10.0.1.45" },
  { id: "al-012", timestamp: "2026-02-20T10:45:00Z", actor: "ops@open-knock.com", action: "ADMIN_INVITE_RESENT",      targetType: "TENANT",   targetName: "LG전자",     detail: "learning@lge.com 초대 재발송",                  ip: "10.0.1.45" },
  { id: "al-013", timestamp: "2026-02-15T13:20:00Z", actor: "ops@open-knock.com", action: "PLAN_CHANGED",             targetType: "TENANT",   targetName: "삼성전자",   detail: "BUSINESS → ENTERPRISE",                       ip: "10.0.1.45" },
  { id: "al-014", timestamp: "2026-02-10T09:15:00Z", actor: "ops@open-knock.com", action: "SSO_ENABLED",              targetType: "TENANT",   targetName: "삼성전자",   detail: "SAML 연동 활성화 (Azure AD)",                  ip: "10.0.1.45" },
  { id: "al-015", timestamp: "2026-01-15T11:00:00Z", actor: "ops@open-knock.com", action: "TENANT_CREATED",           targetType: "TENANT",   targetName: "현대자동차", detail: "신규 기업 생성 (ENTERPRISE)",                   ip: "10.0.1.45" },
];

export const INITIAL_SETTINGS: PlatformSettings = {
  general: {
    serviceName: "OpenKnock Learn",
    opsEmail: "ops@open-knock.com",
    supportEmail: "support@open-knock.com",
    rootDomain: PLATFORM_DOMAIN,
  },
  security: {
    sessionTimeoutMin: 60,
    require2FAForPlatformAdmin: true,
    auditLogRetentionDays: 365,
    dataDeletionGraceDays: 30,
    ipWhitelist: "",
  },
  notifications: {
    trialExpiryWarningDays: 7,
    storageThresholdPct: 85,
    userThresholdPct: 90,
    emailAlertsEnabled: true,
    slackWebhookUrl: "",
  },
};
