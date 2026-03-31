// Domain: portal — 사용자 동의, 포털 배너, 법적 문서

export interface UserAgreement {
  id: string;
  userId: string;
  legalDocumentId: string;
  version: number;
  agreedAt: string;
  ip?: string;
}

export type PortalBannerTarget = "B2C" | "B2B" | "ALL";

export interface PortalBanner {
  id: string;
  tenantId: string | null;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  target: PortalBannerTarget;
  startsAt: string;
  endsAt: string | null;
  order: number;
  isActive: boolean;
}

export type LegalDocumentType = "TERMS" | "PRIVACY" | "MARKETING" | "REFUND";

export interface LegalDocument {
  id: string;
  tenantId: string | null;
  type: LegalDocumentType;
  version: number;
  title: string;
  body: string;
  effectiveAt: string;
  isActive: boolean;
  createdAt: string;
}
