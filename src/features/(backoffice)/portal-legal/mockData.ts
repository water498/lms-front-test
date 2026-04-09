import type { LegalDocument } from "@/lib/models";

export const legalDocuments: LegalDocument[] = [
  { id: "ld1", tenantId: "t1", type: "TERMS", content: "<h2>서비스 이용약관</h2><p>제1조 (목적)...</p>", version: 3, effectiveDate: "2026-01-01", createdAt: "2025-12-15" },
  { id: "ld2", tenantId: "t1", type: "PRIVACY", content: "<h2>개인정보 처리방침</h2><p>제1조 (개인정보의 수집 및 이용 목적)...</p>", version: 2, effectiveDate: "2026-01-01", createdAt: "2025-12-15" },
  { id: "ld3", tenantId: "t1", type: "MARKETING_EMAIL", content: "이메일 수신에 동의합니다. 광고성 정보 수신에 동의하시면 프로모션, 이벤트, 할인 정보 등을 이메일로 받아보실 수 있습니다.", version: 1, effectiveDate: "2026-01-01", createdAt: "2025-12-15" },
  { id: "ld4", tenantId: "t1", type: "MARKETING_SMS", content: "SMS 수신에 동의합니다. 광고성 정보 수신에 동의하시면 프로모션, 이벤트, 할인 정보 등을 SMS로 받아보실 수 있습니다.", version: 1, effectiveDate: "2026-01-01", createdAt: "2025-12-15" },
  { id: "ld5", tenantId: "t1", type: "TERMS", content: "<h2>서비스 이용약관 v2</h2><p>제1조 (목적) 이전 버전...</p>", version: 2, effectiveDate: "2025-07-01", createdAt: "2025-06-20" },
  { id: "ld6", tenantId: "t1", type: "PRIVACY", content: "<h2>개인정보 처리방침 v1</h2><p>이전 버전...</p>", version: 1, effectiveDate: "2025-07-01", createdAt: "2025-06-20" },
  { id: "ld7", tenantId: "t1", type: "TERMS", content: "<h2>서비스 이용약관 v1</h2><p>최초 버전...</p>", version: 1, effectiveDate: "2025-01-01", createdAt: "2024-12-20" },
];
