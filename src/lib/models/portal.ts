// Domain: portal — 사용자 동의, 포털 배너, 법적 문서

export interface UserAgreement {
  id: string;
  userId: string;
  legalDocumentId: string;
  version: number; // 스냅샷
  agreedAt: string;
  ip?: string;
}

export type LegalDocumentType = "TERMS" | "PRIVACY" | "MARKETING_EMAIL" | "MARKETING_SMS";

export interface LegalDocument {
  id: string;
  tenantId: string;
  type: LegalDocumentType;
  content: string;          // HTML or Markdown
  version: number;          // sequential
  effectiveDate: string;    // ISO date
  createdAt: string;
}

export interface PortalBanner {
  id: string;
  tenantId: string;
  title: string;
  imageUrl?: string;        // CDN URL
  linkUrl?: string;
  active: boolean;
  startDate?: string;       // ISO date. null = 즉시
  endDate?: string | null;  // ISO date. null = 무기한
  order: number;            // 낮은 값 = 앞
  target?: "B2C" | "B2B" | "ALL"; // [UI-only] backend에 없음
}
