// Domain: certificate — 수료증 템플릿, 발급

export type CertStatus = "VALID" | "REVOKED" | "EXPIRED";

export interface CertificateTemplate {
  id: string;
  tenantId: string;
  name: string;
  active: boolean;
  validityYears: number | null; // null = 무기한
  backgroundImageUrl: string | null;
  htmlTemplate: string; // {{recipientName}}, {{courseName}}, {{completionDate}}, {{certNumber}}
}

export interface CertVariableDef {
  key: string;
  label: string;
  source: string;
}

export interface IssuedCertificate {
  id: string;
  tenantId: string;
  certNumber: string;        // UNIQUE. 사람이 읽는 수료번호
  publicToken: string;       // UNIQUE. 외부 검증용
  userId: string;            // FK → User
  courseId: string;          // soft ref
  sessionId: string;        // soft ref
  templateId: string;       // FK → CertificateTemplate
  status: CertStatus;
  issuedAt: string;
  expiredAt: string | null;
  reissuedAt: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
  revokedBy: string | null;  // FK → User. SET NULL
  certSnapshot?: string;     // 발급 시점 렌더링된 HTML
  completionContext?: string | null; // 수료 당시 조건·결과 스냅샷 JSON
  // [UI-only]
  recipient?: string;        // [UI-only] user.name JOIN 결과
  course?: string;           // [UI-only] course.title JOIN 결과
}
