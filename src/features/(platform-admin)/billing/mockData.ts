import type { TenantBilling } from "@/lib/models";

// 플랜별 기준 단가 (KRW/월)
// STARTER: 50명·10GB·기본 기능
// BUSINESS: 300명·100GB·SSO
// ENTERPRISE: 무제한·1TB+·전용 인프라·커스텀 SLA
export const PLAN_PRICES: Record<string, number> = {
  TRIAL:      0,
  STARTER:    1_000_000,
  BUSINESS:   5_000_000,
  ENTERPRISE: 0, // 커스텀 — 개별 계약
};

export const BILLING: TenantBilling[] = [
  {
    tenantId: "t-001",
    tenantName: "삼성전자",
    tenantType: "B2B",
    plan: "ENTERPRISE",
    monthlyFeeKRW: 30_000_000,
    paymentStatus: "PAID",
    lastPaidAt: "2026-03-01",
    nextBillingAt: "2026-04-01",
    invoices: [
      { id: "inv-001-06", issuedAt: "2026-03-01", periodStart: "2026-03-01", periodEnd: "2026-03-31", amountKRW: 30_000_000, status: "PAID" },
      { id: "inv-001-05", issuedAt: "2026-02-01", periodStart: "2026-02-01", periodEnd: "2026-02-28", amountKRW: 30_000_000, status: "PAID" },
      { id: "inv-001-04", issuedAt: "2026-01-01", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountKRW: 30_000_000, status: "PAID" },
      { id: "inv-001-03", issuedAt: "2025-12-01", periodStart: "2025-12-01", periodEnd: "2025-12-31", amountKRW: 30_000_000, status: "PAID" },
      { id: "inv-001-02", issuedAt: "2025-11-01", periodStart: "2025-11-01", periodEnd: "2025-11-30", amountKRW: 30_000_000, status: "PAID" },
      { id: "inv-001-01", issuedAt: "2025-10-01", periodStart: "2025-10-01", periodEnd: "2025-10-31", amountKRW: 30_000_000, status: "PAID" },
    ],
  },
  {
    tenantId: "t-002",
    tenantName: "LG전자",
    tenantType: "B2B",
    plan: "BUSINESS",
    monthlyFeeKRW: 5_000_000,
    paymentStatus: "PAID",
    lastPaidAt: "2026-03-01",
    nextBillingAt: "2026-04-01",
    invoices: [
      { id: "inv-002-06", issuedAt: "2026-03-01", periodStart: "2026-03-01", periodEnd: "2026-03-31", amountKRW: 5_000_000, status: "PAID" },
      { id: "inv-002-05", issuedAt: "2026-02-01", periodStart: "2026-02-01", periodEnd: "2026-02-28", amountKRW: 5_000_000, status: "PAID" },
      { id: "inv-002-04", issuedAt: "2026-01-01", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountKRW: 5_000_000, status: "PAID" },
      { id: "inv-002-03", issuedAt: "2025-12-01", periodStart: "2025-12-01", periodEnd: "2025-12-31", amountKRW: 5_000_000, status: "PAID" },
      { id: "inv-002-02", issuedAt: "2025-11-01", periodStart: "2025-11-01", periodEnd: "2025-11-30", amountKRW: 5_000_000, status: "PAID" },
      { id: "inv-002-01", issuedAt: "2025-10-01", periodStart: "2025-10-01", periodEnd: "2025-10-31", amountKRW: 1_000_000, status: "PAID" }, // STARTER → BUSINESS 전환 전
    ],
  },
  {
    tenantId: "t-003",
    tenantName: "현대자동차",
    tenantType: "B2B",
    plan: "ENTERPRISE",
    monthlyFeeKRW: 50_000_000,
    paymentStatus: "PAID",
    lastPaidAt: "2026-03-01",
    nextBillingAt: "2026-04-01",
    invoices: [
      { id: "inv-003-06", issuedAt: "2026-03-01", periodStart: "2026-03-01", periodEnd: "2026-03-31", amountKRW: 50_000_000, status: "PAID" },
      { id: "inv-003-05", issuedAt: "2026-02-01", periodStart: "2026-02-01", periodEnd: "2026-02-28", amountKRW: 50_000_000, status: "PAID" },
      { id: "inv-003-04", issuedAt: "2026-01-01", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountKRW: 50_000_000, status: "PAID" },
      { id: "inv-003-03", issuedAt: "2025-12-01", periodStart: "2025-12-01", periodEnd: "2025-12-31", amountKRW: 50_000_000, status: "PAID" },
      { id: "inv-003-02", issuedAt: "2025-11-01", periodStart: "2025-11-01", periodEnd: "2025-11-30", amountKRW: 50_000_000, status: "PAID" },
      { id: "inv-003-01", issuedAt: "2025-10-01", periodStart: "2025-10-01", periodEnd: "2025-10-31", amountKRW: 50_000_000, status: "PAID" },
    ],
  },
  {
    tenantId: "t-004",
    tenantName: "카카오",
    tenantType: "B2B",
    plan: "TRIAL",
    monthlyFeeKRW: 0,
    paymentStatus: "EXEMPT",
    nextBillingAt: "2026-03-29", // 트라이얼 종료일
    invoices: [],
  },
  {
    tenantId: "t-005",
    tenantName: "네이버",
    tenantType: "B2B",
    plan: "STARTER",
    monthlyFeeKRW: 1_000_000,
    paymentStatus: "OVERDUE",
    lastPaidAt: "2025-04-01",
    invoices: [
      { id: "inv-005-03", issuedAt: "2025-06-01", periodStart: "2025-06-01", periodEnd: "2025-06-30", amountKRW: 1_000_000, status: "OVERDUE" },
      { id: "inv-005-02", issuedAt: "2025-05-01", periodStart: "2025-05-01", periodEnd: "2025-05-31", amountKRW: 1_000_000, status: "OVERDUE" },
      { id: "inv-005-01", issuedAt: "2025-04-01", periodStart: "2025-04-01", periodEnd: "2025-04-30", amountKRW: 1_000_000, status: "PAID" },
    ],
  },
  {
    tenantId: "t-006",
    tenantName: "OpenKnock (B2C)",
    tenantType: "B2C",
    plan: "ENTERPRISE",
    monthlyFeeKRW: 0,
    paymentStatus: "EXEMPT", // 자체 운영 플랫폼
    invoices: [],
  },
];
