import { PLATFORM_DOMAIN } from "../tenants/mockData";
import type { PlanConfig } from "@/lib/models";
export type { PlanConfig } from "@/lib/models";

export interface PlatformSettings {
  general: {
    serviceName: string;
    opsEmail: string;
    supportEmail: string;
    rootDomain: string;
  };
  plans: {
    configs: PlanConfig[];
    trialDays: number;
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

export const INITIAL_SETTINGS: PlatformSettings = {
  general: {
    serviceName: "OpenKnock Learn",
    opsEmail: "ops@open-knock.com",
    supportEmail: "support@open-knock.com",
    rootDomain: PLATFORM_DOMAIN,
  },
  plans: {
    configs: [
      { id: "STARTER",    label: "스타터",    maxUsers: 50,   storageGB: 10,   monthlyKRW: 150000 },
      { id: "GROWTH",     label: "그로스",    maxUsers: 300,  storageGB: 100,  monthlyKRW: 490000 },
      { id: "ENTERPRISE", label: "엔터프라이즈", maxUsers: 0, storageGB: 0,    monthlyKRW: 0 },
    ],
    trialDays: 14,
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
