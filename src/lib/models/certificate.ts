// Domain: certificate — 수료증 템플릿, 발급

export type CertStatus = "VALID" | "REVOKED" | "EXPIRED";

export interface CertificateTemplate {
  id: string;
  name: string;
  active: boolean;
  validityYears: number | null; // null = 무기한
  backgroundImageUrl: string | null;
  htmlTemplate: string;
}

export interface CertVariableDef {
  key: string;
  label: string;
  source: string;
}

export interface IssuedCertificate {
  id: string;
  certNumber: string;
  publicToken: string;
  recipientId?: string;
  recipient: string;
  course: string;
  templateId: string;
  status: CertStatus;
  issuedAt: string;
  expiredAt: string | null;
  reissuedAt: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
  revokedBy: string | null;
  completionContext?: string | null; // 수료 당시 조건·결과 스냅샷 JSON
}
