// Domain: org — 조직 구조, 공지, 설정, 감사 로그

export type AnnouncementStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";
export type AnnouncementSubtype = "NOTICE" | "EVENT" | "UPDATE" | "URGENT";

/** OrgAnnouncement — 테넌트 어드민 → 수강생 공지 */
export type OrgAnnouncementTargetType = "ALL_MEMBERS" | "SPECIFIC_COURSE";

export interface OrgAnnouncement {
  id: string;
  tenantId: string;
  title: string;
  content?: string;
  subtype?: AnnouncementSubtype;
  targetType: OrgAnnouncementTargetType;
  targetCourseId?: string; // SPECIFIC_COURSE일 때 (soft ref)
  status: AnnouncementStatus;
  scheduledAt?: string;
  sentAt?: string;
  views: number; // cache
  createdBy?: string; // FK → User. SET NULL
  createdAt: string;
}

// ── 조직 구조 ─────────────────────────────────────────────

export interface OrgSite {
  id: string;
  tenantId: string;
  name: string;
}

export interface OrgTeam {
  id: string;
  tenantId: string;
  name: string;
  siteId?: string;   // FK → OrgSite. NULL = 전사 공통 부서
  parentId?: string; // self-ref. NULL = 최상위
  order: number;
}

export type OrgPositionRoleType = "EXECUTIVE" | "LEADER" | "MEMBER";

export interface OrgPosition {
  id: string;
  tenantId: string;
  name: string;
  order: number;       // 낮은 값 = 하위 직급
  roleType: OrgPositionRoleType;
}

export interface OrgTransfer {
  id: string;
  tenantId: string;
  userId: string;
  changedBy?: string;  // FK → User. SET NULL
  changedAt: string;
  note?: string;
  siteFrom?: string; siteTo?: string;
  teamFrom?: string; teamTo?: string;
  positionFrom?: string; positionTo?: string;
}

export interface OrgSetting {
  tenantId: string;
  name: string;
  contactEmail: string;
  brandColor: string; // HEX e.g. "#1E40AF"
  logoUrl?: string;
  faviconUrl?: string;
}

// ── 감사 로그 (Layer 2 — 관리자 작업 이력) ──────────────────

export type OrgAuditAction =
  | "ENROLLMENT_CANCEL"
  | "ENROLLMENT_CREATE"
  | "COURSE_CREATE"
  | "COURSE_UPDATE"
  | "USER_ROLE_CHANGE"
  | "ORG_STRUCTURE_UPDATE"
  | "SETTINGS_UPDATE"
  | "CERT_ISSUE";

export interface OrgAuditLog {
  id: string;
  tenantId: string;
  timestamp: string;
  actorId?: string;    // FK → User. SET NULL
  actor: string;       // 스냅샷
  action: OrgAuditAction;
  target: string;
  detail: string;
}
