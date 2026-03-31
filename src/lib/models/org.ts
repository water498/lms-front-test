// Domain: org — 조직 구조, 공지, 설정

export type AnnouncementStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

/** OrgAnnouncement — 테넌트 어드민 → 수강생 공지 */
export type OrgAnnouncementTargetType = "ALL_MEMBERS" | "SPECIFIC_COURSE";

export interface OrgAnnouncement {
  id: string;
  tenantId: string;
  title: string;
  content?: string;
  /** 공지 / 이벤트 / 업데이트 / 긴급 등 자유 분류 */
  subtype?: string;
  targetType: OrgAnnouncementTargetType;
  /** SPECIFIC_COURSE일 때 대상 과정 ID */
  targetCourseId?: string;
  status: AnnouncementStatus;
  scheduledAt?: string;
  sentAt?: string;
  views: number;
  createdBy?: string;
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
  siteId?: string;   // NULL = 전사 공통 부서
  parentId?: string; // NULL = 최상위
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
  changedBy?: string;  // HR 담당자 User ID
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
  brandColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  subdomain?: string;
}
