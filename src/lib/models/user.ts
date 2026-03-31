// Domain: user — 사용자, 인증, RBAC, 감사 로그

// ── RBAC ───────────────────────────────────────────────────

/** 시스템 역할명 (시드값). 커스텀 역할은 자유 문자열. */
export type SystemRoleName = "SUPER_ADMIN" | "ORG_ADMIN" | "INSTRUCTOR" | "LEARNER";

export interface Role {
  id: string;
  tenantId?: string; // NULL = 플랫폼 공통 시스템 역할
  name: string;      // SystemRoleName 또는 커스텀 역할명
  description?: string;
  isSystem: boolean; // True = 삭제 불가
  createdAt: string;
}

export interface Permission {
  code: string;       // 'course.manage', 'user.view' 등
  name: string;
  description?: string;
  module: string;     // 'course' | 'user' | 'org' | 'report' | ...
}

export interface RolePermission {
  roleId: string;
  permissionCode: string;
}

// ── 사용자 ────────────────────────────────────────────────

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type AuthProvider = "LOCAL" | "SOCIAL" | "SSO";
export type SocialProvider = "GOOGLE" | "KAKAO" | "NAVER" | "APPLE";
export type MfaMethod = "TOTP" | "SMS" | "EMAIL";
/** 시스템 역할명. 커스텀 역할은 string. */
export type UserRole = SystemRoleName;

export interface User {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  /** role 테이블 FK UUID */
  roleId: string;
  /** UI 편의용 — role.name 값. 조회 시 JOIN 또는 별도 필드로 제공 */
  role: UserRole;
  status: UserStatus;
  enrolledCourses: number;
  completedCourses: number;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastLoginUa?: string;
  mustChangePassword: boolean;
  joinedAt: string;
  createdAt?: string;
  updatedAt?: string;
  employeeId?: string; // 사번
  orgSiteId?: string;
  orgTeamId?: string;
  orgPositionId?: string;
  // 인증
  authProvider: AuthProvider;
  socialProvider?: SocialProvider; // auth_provider=SOCIAL일 때
  socialProviderId?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  // 비밀번호 재설정
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: string;
  // 계정 잠금
  failedLoginAttempts: number;
  lockedUntil?: string;
  lastFailedLoginAt?: string;
  // 차단
  blockedAt?: string;
  blockedReason?: string;
  // 소프트 삭제
  deletedAt?: string;
  // 마케팅 수신 동의
  marketingEmailAgreed: boolean;
  marketingSmsAgreed: boolean;
  marketingAgreedAt?: string;
  // MFA (미구현, 구조만 예약)
  mfaEnabled: boolean;
  mfaMethod?: MfaMethod;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberIds?: string[]; // 편의용 캐시. 정규 원천은 UserGroupMember junction.
  createdAt: string;
}

export interface UserAccessLog {
  id: string;
  userId: string;
  userName: string;
  type: "LOGIN" | "LOGOUT" | "SESSION_EXPIRED" | "AUTO_LOGIN" | "PASSWORD_RESET";
  scope: "USER" | "ADMIN";
  date: string; // "YYYY-MM-DD HH:MM"
  ip: string;
  userAgent: string;
}

export interface UserSession {
  id: string;
  userId: string;
  tenantId: string;
  /** SHA-256 해시. 원문(refresh token)은 클라이언트에만 존재 */
  tokenHash: string;
  ip: string;
  userAgent: string;
  deviceName?: string; // "Chrome / macOS" 등 파싱된 표시명
  createdAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
  revokedReason?: "LOGOUT" | "NEW_LOGIN" | "ADMIN_REVOKE" | "EXPIRED";
}

export interface UserInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
  invitedBy: string; // actor name
  invitedAt: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "ENROLLMENT" | "CERT_ISSUED" | "EXAM_RESULT" | "ANNOUNCEMENT" | "QNA_ANSWERED" | "SYSTEM";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}

// 테넌트 admin 감사 로그 (Layer 2 — 관리자 작업 이력)
export type TenantAuditAction =
  | "ENROLLMENT_CANCEL"
  | "ENROLLMENT_CREATE"
  | "COURSE_CREATE"
  | "COURSE_UPDATE"
  | "USER_ROLE_CHANGE"
  | "ORG_STRUCTURE_UPDATE"
  | "SETTINGS_UPDATE"
  | "CERT_ISSUE";

export interface TenantAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actor: string;
  action: TenantAuditAction;
  target: string;
  detail: string;
}

export interface UserEnrollment {
  courseTitle: string;
  session: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED";
  hasCertificate: boolean;
}

// 학습 이벤트 로그 (Layer 3 — append-only, xAPI verb 기반)
export type ActivityVerb =
  | "ENROLLED"
  | "ACTIVITY_STARTED"
  | "ACTIVITY_COMPLETED"
  | "VIDEO_WATCHED"
  | "EXAM_SUBMITTED"
  | "ASSIGNMENT_SUBMITTED"
  | "SURVEY_SUBMITTED"
  | "COURSE_COMPLETED"
  | "CERTIFICATE_ISSUED";

export interface ActivityLog {
  id: string;
  learnerId: string;
  verb: ActivityVerb;
  objectType: "ACTIVITY" | "EXAM" | "ASSIGNMENT" | "COURSE" | "SESSION";
  objectId: string;
  objectTitle?: string;
  result?: {
    score?: number;
    passed?: boolean;
    durationSec?: number;
    progress?: number;
  };
  timestamp: string;
  sessionId?: string;
  courseId?: string;
}

export type UserStats = {
  completedCourses: number;
  inProgressCourses: number;
  totalLearningMinutes: number;
  certificates: number;
};

// ── 그룹 멤버 (junction) ──────────────────────────────────

export interface UserGroupMember {
  id: string;
  groupId: string;       // FK → UserGroup
  userId: string;        // FK → User
  role: "MEMBER" | "MANAGER";
  joinedAt: string;
  addedBy: string;
}
