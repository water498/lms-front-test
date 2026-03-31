/**
 * src/lib/models.ts
 *
 * 모든 도메인 타입의 단일 출처(SoT).
 * 현 단계: flat optional 통합 (실험 속도 우선).
 * API 연동 시 data-model.dbml 기준으로 재정비 예정.
 */

// ── 멀티테넌시 ─────────────────────────────────────────────

export type TenantStatus = "TRIAL" | "ACTIVE" | "SUSPENDED";
export type AdminInviteStatus = "PENDING" | "ACCEPTED";
export type SsoProvider = "SAML" | "OIDC";

export interface TenantSsoConfig {
  enabled: boolean;
  provider: SsoProvider;
  // SAML
  idpEntityId?: string;
  idpSsoUrl?: string;
  idpCertificate?: string;
  // OIDC
  issuerUrl?: string;
  clientId?: string;
  clientSecret?: string;
}

export type InfraServiceStatus = "HEALTHY" | "WARNING" | "DOWN";

export interface TenantInfraStatus {
  ec2: InfraServiceStatus;
  rds: InfraServiceStatus;
  s3: InfraServiceStatus;
  checkedAt: string; // ISO 8601
}

export type PlatformAuditAction =
  | "TENANT_CREATED"
  | "TENANT_SUSPENDED"
  | "TENANT_RESUMED"
  | "SUBDOMAIN_CHANGED"
  | "PLAN_CHANGED"
  | "USER_LIMIT_CHANGED"
  | "SSO_CONFIGURED"
  | "SSO_ENABLED"
  | "SSO_DISABLED"
  | "ADMIN_INVITED"
  | "ADMIN_INVITE_RESENT"
  | "PLATFORM_SETTINGS_UPDATED"
  | "PLATFORM_PLAN_CHANGED";

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actor: string;
  action: PlatformAuditAction;
  targetType: "TENANT" | "PLATFORM";
  targetName: string;
  detail: string;
  ip: string;
}

export interface TenantInfra {
  awsRegion: string;
  dbHost: string;
  s3Bucket: string;
  ec2InstanceType: string;
  provisionedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  tenantType?: TenantType;
  /** 영업 계약 시 수동 입력. 예: 'STARTER' / 'ENTERPRISE' / 'CUSTOM' */
  planName?: string;
  status: TenantStatus;
  trialEndsAt?: string;
  maxUsers: number; // 0 = unlimited
  currentUsers: number;
  adminEmail: string;
  adminInviteStatus?: AdminInviteStatus;
  ownerUserId?: string; // 테넌트 소유자 User.id. NULL = 초대 수락 전
  contractStart: string;
  contractEnd: string;
  storageUsedGB: number;
  storageMaxGB: number;
  infra: TenantInfra;
  infraStatus?: TenantInfraStatus;
  sso?: TenantSsoConfig;
  ipWhitelist?: string[]; // IP 접근 제한 (CIDR 표기 허용, e.g. "1.2.3.4/24")
}

// ── 플랫폼 청구/결제 ────────────────────────────────────────

export type BillingPlan = "TRIAL" | "STARTER" | "BUSINESS" | "ENTERPRISE";
export type BillingPaymentStatus = "PAID" | "OVERDUE" | "PENDING" | "EXEMPT";

export interface TenantInvoice {
  id: string;
  issuedAt: string;
  periodStart: string;
  periodEnd: string;
  amountKRW: number;
  status: "PAID" | "OVERDUE" | "PENDING";
}

export interface TenantBilling {
  tenantId: string;
  tenantName: string;
  tenantType: "B2B" | "B2C";
  plan: BillingPlan;
  monthlyFeeKRW: number;
  paymentStatus: BillingPaymentStatus;
  lastPaidAt?: string;
  nextBillingAt?: string;
  invoices: TenantInvoice[];
}

// ── 공지 ──────────────────────────────────────────────────

export type PlatformAnnouncementStatus = "PUBLISHED" | "UNPUBLISHED";

/** PlatformAnnouncement — 플랫폼 어드민 → 테넌트 어드민 공지 */
export interface PlatformAnnouncement {
  id: string;
  title: string;
  content?: string;
  /** MAINTENANCE / UPDATE / URGENT / GENERAL 등 */
  subtype?: string;
  /** 향후 확장용. 현재는 항상 ALL_TENANTS */
  targetType: "ALL_TENANTS" | "SPECIFIC_TENANTS";
  status: PlatformAnnouncementStatus;
  sentAt?: string;
  views: number;
  createdBy?: string;
  createdAt: string;
}

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

// ── 학습 콘텐츠 ───────────────────────────────────────────

export type CourseType = "online" | "offline" | "blended";
export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type CourseMode = "ONLINE" | "OFFLINE" | "BLENDED";

export interface CertConfig {
  templateId: string;
  completionRate: number; // 진도율 기준 기본값 (0~100). 차수에서 override 가능
  autoIssue: boolean;
  // 시험/과제/설문 필수 여부는 CourseSession 레벨에서 관리 (postExamRequired 등)
}

export interface CancellationRule {
  daysBeforeStart: number; // N일 이상 전 취소
  refundPct: number; // 0~100
}

export interface CancellationPolicy {
  rules: CancellationRule[]; // daysBeforeStart 내림차순 정렬
  noRefundAfterStart: boolean;
}

/**
 * Course — B2C/B2B/admin flat optional 통합.
 * B2C/B2B 필드: categoryLabel, thumbnail, accentColor, rating, reviewCount,
 *               duration, level, price, isNew, isBestseller, type, isRequired,
 *               location, nextSessionDate, capacity, enrolledCount
 * Admin 필드:   status, mode, sessions, enrollees, createdAt,
 *               certConfig, description, cancellationPolicy
 */
export interface Course {
  id: string;
  tenantId?: string;
  title: string;
  instructor: string;
  category: string;
  tags: string[];
  // B2C/B2B 필드
  categoryLabel?: string;
  thumbnail?: string; // CSS gradient string
  accentColor?: string;
  rating?: number;
  reviewCount?: number;
  duration?: string;
  level?: "입문" | "초급" | "중급" | "고급";
  price?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  type?: CourseType;
  isRequired?: boolean; // B2B: 기업이 지정한 필수 수강 여부
  location?: string; // 오프라인 전용
  nextSessionDate?: string; // 오프라인 전용
  capacity?: number; // 오프라인 전용
  enrolledCount?: number; // 오프라인 전용
  // Admin 필드
  defaultMinEnrollment?: number | null; // 차수 생성 시 기본값 (null = 미설정)
  status?: CourseStatus;
  mode?: CourseMode;
  sessions?: number; // 세션 수
  enrollees?: number; // 수강자 수
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  certConfig?: CertConfig | null;
  description?: string;
  cancellationPolicy?: CancellationPolicy;
  instructorId?: string;   // FK → user.id. undefined/null = 강사 없는 자기주도형 과정
  qnaEnabled?: boolean;    // Q&A 기능 활성화 여부. 강사 없는 과정은 false 권장
}

export type EnrolledCourse = Course & {
  progress: number;
  lastAccessedAt: string;
  nextLessonTitle: string;
  sessionId?: string; // 수강 중인 차수 ID (CourseSession.id)
};

export type Category = { id: string; label: string };

export interface CoursePrerequisite {
  courseId: string;
  prerequisiteCourseId: string;
  requiredCompletion: boolean; // true = 수료 필수, false = 수강 이력만
}

export interface LearningPath {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number; // B2C
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
}

export interface LearningPathCourse {
  learningPathId: string;
  courseId: string;
  order: number;
}

// ── SCORM ─────────────────────────────────────────────────

export interface ScormSco {
  id: string;
  mediaAssetId: string; // SCORM MediaAsset
  identifier: string;
  title: string;
  launchHref: string;
  scormVersion: "1.2" | "2004";
  order: number;
}

export interface ScormRuntime {
  id: string;
  enrollmentId: string;
  scoId: string; // ScormSco.id
  learnerId: string;
  lessonStatus: "not attempted" | "incomplete" | "completed" | "passed" | "failed";
  suspendData?: string;
  scoreRaw?: number;
  scoreMin?: number;
  scoreMax?: number;
  sessionTime?: string; // HH:MM:SS
  totalTime?: string;
  updatedAt: string;
}

// ── 강사 ──────────────────────────────────────────────────

export interface CourseInstructor {
  name: string;
  role: "PRIMARY" | "ASSISTANT";
}

export interface InstructorProfile {
  // ── DB 기준 필드 (backend: instructor_profile) ──
  userId: string; // PK + FK → User (1:1). INSTRUCTOR role 사용자만 해당
  headline?: string; // 한 줄 소개. 예: "AI/ML 전문 강사 · 전 네이버 AI Lab"
  bio?: string;
  career?: string;
  specialty?: string; // 전문 분야. 예: '데이터 분석, Python'
  expertise?: string[];
  affiliatedCompany?: string;
  websiteUrl?: string;
  isPublic?: boolean; // false이면 수강생에게 숨김
  isExternal?: boolean; // 외부 강사 여부. false=내부 강사, true=외부 초빙 강사. default false
  updatedAt?: string;
  // ── UI 전용 (실험 단계, API 연동 시 별도 DTO로 분리) ──
  id?: string;
  profileImageUrl?: string;
}

// InstructorReview — 강사 평가 (backend: instructor_review). B2C 수강생 작성.
export interface InstructorReview {
  id: string;
  instructorId: string; // FK → User (role=INSTRUCTOR)
  courseId?: string;    // 리뷰 작성 시 수강한 과정 (맥락 참고용)
  learnerId: string;    // FK → User
  learnerName: string;  // 작성자 이름 스냅샷
  rating: number;       // 1~5
  body: string;
  createdAt: string;
  visible: boolean;
}

export interface InstructorBankAccount {
  id: string;
  instructorId: string; // FK → User (role=INSTRUCTOR)
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
  createdAt: string;
}

// InstructorRevenue — 강사 정산 내역 (backend: instructor_revenue)
export type InstructorRevenueType = "COURSE_SALE" | "FLAT_FEE" | "BONUS" | "ADJUSTMENT";
export type InstructorRevenueStatus = "PENDING" | "APPROVED" | "PAID";

export interface InstructorRevenue {
  id: string;
  tenantId: string;
  instructorId: string; // FK → User (role=INSTRUCTOR)
  courseId?: string; // FK → Course. null이면 과정 무관 정산
  orderItemId?: string; // [B2C] FK → OrderItem. B2B는 null
  revenueType: InstructorRevenueType;
  grossAmount: number; // 매출 총액 (KRW)
  commissionRate?: number; // 플랫폼 수수료율 (%). null이면 수수료 없음
  netAmount: number; // 실 정산액
  status: InstructorRevenueStatus;
  periodStart?: string;
  periodEnd?: string;
  paidAt?: string;
  note?: string;
  createdAt: string;
}

// ── 오프라인 수업 & 출결 ──────────────────────────────────

export type OfflineSessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

// OfflineSessionInstructor — 차시-강사 N:M pivot (backend: offline_session_instructor)
export interface OfflineSessionInstructor {
  offlineSessionId: string;
  instructorId: string;  // FK → User
  role: "PRIMARY" | "ASSISTANT";
  order: number;
  addedAt: string;
}

export interface OfflineSession {
  id: string;
  courseSessionId: string;
  dayNum: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructors: CourseInstructor[];
  maxCapacity: number;
  status: OfflineSessionStatus;
}

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type AttendanceMethod = "QR" | "MANUAL";

export interface OfflineAttendance {
  id: string;
  offlineSessionId: string;
  learnerId: string;
  learnerName: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  checkedAt?: string;
}

export interface OfflineAttendanceLog {
  id: string;
  offlineSessionId: string;
  userId: string;
  beforeStatus: AttendanceStatus;
  afterStatus: AttendanceStatus;
  modifiedBy: string;
  modifiedAt: string;
  note?: string;
}

// ── 커리큘럼 ──────────────────────────────────────────────

export type ActivityType = "VIDEO" | "SCORM" | "QUIZ" | "ASSIGNMENT" | "SURVEY";

export interface CourseActivity {
  id: string;
  title: string;
  type: ActivityType;
  duration?: number; // 분 (VIDEO일 때)
  questionCount?: number; // QUIZ/ASSIGNMENT
  mediaAssetId?: string; // 콘텐츠 라이브러리 ma* ID (VIDEO/SCORM)
  examTemplateId?: string; // QUIZ
  assignTemplateId?: string; // ASSIGNMENT
  surveyTemplateId?: string; // SURVEY
  passRequired?: boolean; // [QUIZ] true이면 합격해야 ActivityCompletion 생성. 기본 false (제출=완료)
}

export interface CourseSubject {
  id: string;
  title: string;
  order: number;
  activities: CourseActivity[];
}

export type SessionType = "SELF_PACED" | "COHORT";
export type SessionStatus = "DRAFT" | "OPEN" | "ONGOING" | "CLOSED";

export interface CourseSession {
  id: string;
  courseId: string;
  name: string;
  type: SessionType;
  cohortNumber?: number;
  startDate?: string;
  endDate?: string;
  enrollmentStartDate?: string; // 수강신청 시작일. 없으면 OPEN 즉시 허용
  enrollmentEndDate?: string;   // 수강신청 마감일. 없으면 startDate 전까지 허용
  capacity: number; // 0 = 무제한
  enrolled: number;
  status: SessionStatus;
  visible: boolean;
  forSale: boolean;
  instructors: CourseInstructor[];
  location?: string;
  completionThreshold: number; // 수료 인정 최소 진도율 (%)
  offlineAttendanceThreshold?: number | null; // 오프라인 출석 기준 (%). null = 미적용. OFFLINE/BLENDED 전용
  minEnrollment?: number | null; // 최소 수강 인원 (null = 이번 차수는 체크 없음)
  targetAudience?: {
    departments?: string[];
    jobGrades?: string[];
    sites?: string[];
  };
  // 사전 평가 (수강 전, 진단 목적 — 수료 조건 아님)
  preExamTemplateId?: string;
  preAssignmentTemplateId?: string;
  preSurveyTemplateId?: string;
  // 사후 평가 (수료 관문 — *Required=true이면 해당 평가 통과 없이 수료 불가)
  postExamTemplateId?: string;
  postExamRequired?: boolean;
  postAssignmentTemplateId?: string;
  postAssignmentRequired?: boolean;
  postSurveyTemplateId?: string;
  postSurveyRequired?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseEnrollee {
  id: string;
  learnerId: string;
  learner: string;
  sessionId: string;
  session: string;
  progress: number;
  enrolledAt: string;
}

// ── 수강 ──────────────────────────────────────────────────

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED";
export type EnrollmentSource = "SELF" | "ADMIN_ASSIGNED" | "PAYMENT";

export interface Enrollment {
  id: string;
  tenantId?: string;
  learnerId: string;
  courseId: string;
  courseSessionId: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  lastStudiedAt?: string;
  orderId?: string; // Order.id
  expiresAt?: string;
  completedAt?: string;
  source?: EnrollmentSource;
}

export interface WaitApply {
  id: string;
  courseSessionId: string;
  userId: string;
  userName: string;
  requestedAt: string;
  status: "WAITING" | "APPROVED" | "CANCELLED";
}

// ── 학습 이력 ──────────────────────────────────────────────

// 액티비티별 완료 기록
export interface ActivityCompletion {
  id: string;
  learnerId: string;
  learnerName: string;
  activityId: string;
  activityTitle: string;
  courseSessionId: string;
  completedAt: string;
  durationSec: number;
}

// 시험 응시 기록
export interface ExamAttempt {
  id: string;
  learnerId: string;
  learnerName: string;
  examTemplateId: string;
  examTitle: string;
  courseSessionId: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  durationSec?: number;
}

// 과제 제출 기록
export interface AssignmentSubmission {
  id: string;
  learnerId: string;
  learnerName: string;
  assignmentTemplateId: string;
  courseSessionId: string;
  submittedAt: string;
  fileUrl?: string;
  textContent?: string;
  grade?: number;
  passed?: boolean | null; // null=미채점, true=통과, false=미통과
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

// 설문 응답 기록
export interface SurveyResponse {
  id: string;
  learnerId: string;
  surveyTemplateId: string;
  courseSessionId: string;
  submittedAt: string;
  anonymous: boolean;
}

// 동영상 시청 진행 기록
export interface VideoProgress {
  id: string;
  enrollmentId: string;
  activityId: string;
  learnerId: string;
  watchedSec: number;
  totalSec: number;
  lastPosition: number; // 마지막 재생 위치 (초)
  completed: boolean;
  updatedAt: string;
}

// ── 평가 ──────────────────────────────────────────────────

export type QuestionKind = "EXAM" | "SURVEY";
export type QuestionType = "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT";
export type SurveyQuestionType = "LIKERT" | "SINGLE" | "MULTIPLE" | "TEXT";

export interface QuestionGroup {
  id: string;
  title: string;
  kind: QuestionKind;
  type: QuestionType | SurveyQuestionType; // 그룹 고정 타입. 소속 문항은 반드시 이 타입이어야 함
  description?: string;
  isArchived: boolean;
  questionCount?: number; // 소속 문항 수 (캐시)
  createdAt: string;
}

export interface Question {
  id: string;
  kind: QuestionKind;
  type: QuestionType | SurveyQuestionType;
  groupId?: string;        // 소속 문항 그룹. undefined = 미배정
  text: string;
  options?: QuestionOption[];
  answer?: string; // SHORT 모범답안
  scale?: number; // LIKERT 척도
  tags: string[];  // 검색 보조용. 출제 기준은 groupId 사용
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  correct?: boolean; // EXAM 전용. SURVEY는 undefined
  order: number;
}

export interface AssessmentSection {
  id: string;
  label: string;
  groupId: string; // 출제에 사용할 문항 그룹 ID
  count: number;
  shuffle: boolean;
}

export type ExamSubType = "SHORT" | "FINAL";

export interface ExamTemplate {
  id: string;
  title: string;
  subType: ExamSubType;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number | null; // null = 무제한
  rules: AssessmentSection[];
  usageCount: number;
  isArchived?: boolean;
  createdAt: string;
}

export type SubmissionType = "FILE" | "TEXT" | "BOTH";

export interface AssignmentRubricItem {
  id: string;
  criteria: string;
  points: number;
  order: number;
}

export interface AssignmentTemplate {
  id: string;
  title: string;
  instructions: string;
  submissionType: SubmissionType;
  passingScore?: number | null; // null이면 제출만으로 통과. 설정 시 grade >= passingScore 필요
  rubric: AssignmentRubricItem[];
  usageCount: number;
  isArchived?: boolean;
  createdAt: string;
}

export type SurveyTriggerType = "MANUAL" | "COURSE_COMPLETE";

export interface SurveyTemplate {
  id: string;
  title: string;
  anonymous: boolean;
  triggerType: SurveyTriggerType;
  rules: AssessmentSection[];
  responseCount: number;
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
}

// ── 수료증 ────────────────────────────────────────────────

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

// ── 미디어 ────────────────────────────────────────────────

export type UploadStatus =
  | "PENDING"
  | "VALIDATING"
  | "PROCESSING"
  | "ACTIVE"
  | "ERROR";
export type AssetType = "VIDEO" | "PDF" | "IMAGE" | "SCORM";

export interface MediaAsset {
  id: string;
  displayName: string;
  originalName: string;
  mimeType: string;
  assetType: AssetType;
  size: string;
  uploadedAt: string;
  status: UploadStatus;
  cdnBaseUrl: string | null;
  launchHref: string | null;
  scormVersion: "1.2" | "2004" | null;
  errorMessage: string | null;
  linkedCourses: string[];
  tags: string[];
}

// ── 운영 ──────────────────────────────────────────────────

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

export interface Order {
  id: string;
  orderNumber: string;        // 사람이 읽는 주문번호 (e.g. OK-20260320-A4F2)
  userId: string;             // FK → User
  couponId?: string;          // FK → Coupon (적용된 쿠폰)
  subtotalAmount: number;     // 할인 전 금액
  discountAmount: number;     // 쿠폰 등 할인액
  totalAmount: number;        // 실 결제 금액
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;            // FK → Order
  courseId: string;           // FK → Course
  unitPrice: number;          // 결제 시점 가격 (이후 가격 변경 불영향)
  discountAmount: number;     // 해당 아이템 할인액
  finalPrice: number;         // unitPrice - discountAmount
}

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "CANCELLED";
export type PgProvider = "TOSS" | "IAMPORT" | "KCP" | "NICEPAY";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "KAKAO_PAY" | "NAVER_PAY";

export interface Payment {
  id: string;
  orderId: string;            // FK → Order
  amount: number; // KRW
  status: PaymentStatus;
  paidAt: string;
  pgProvider?: PgProvider;
  pgTid?: string; // PG사 거래번호
  paymentMethod?: PaymentMethod;
  receiptUrl?: string;
}

export type RefundStatus = "REQUESTED" | "APPROVED" | "REJECTED";

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  refundedAt?: string;
  refundedBy?: string;
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  discountType: "AMOUNT" | "PERCENT";
  discountValue: number;
  maxUses: number | null; // null = 무제한
  usedCount: number;
  expiresAt: string | null;
  applicableCourseIds: string[]; // 빈 배열 = 전체 적용
  createdAt: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number; // 1~5
  body: string;
  createdAt: string;
  visible: boolean;
}

export type MessageChannel = "SMS" | "EMAIL" | "KAKAO";
export type CreditTransactionType = "TOPUP" | "GRANT" | "USAGE";
export type CreditServiceType = "MESSAGING" | "AI";

export interface CreditServiceRate {
  id: string;
  serviceType: CreditServiceType;
  subType: string;        // MESSAGING: "SMS"|"EMAIL"|"KAKAO" / AI: 모델 ID (e.g. "claude-sonnet-4-6")
  direction?: "INPUT" | "OUTPUT"; // AI 토큰 방향 (MESSAGING은 undefined)
  creditsPerUnit: number; // 크레딧 / unitSize
  unitSize: number;       // 1 (메시지 1건) | 1000 (1K 토큰)
  unitLabel: string;      // "메시지" | "1K 토큰"
  effectiveFrom: string;  // ISO date — 요율 이력 관리
}

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  serviceType?: CreditServiceType; // USAGE일 때만 의미 있음
  channel?: MessageChannel;        // serviceType === "MESSAGING"일 때
  aiUsage?: {                      // serviceType === "AI"일 때
    model: string;
    inputTokens: number;
    outputTokens: number;
  };
  amount: number;      // 양수=충전/지급, 음수=사용 (크레딧 단위)
  description: string;
  createdAt: string;
}

export interface CreditBalance {
  tenantId: string;
  balance: number;
  autoTopUp: boolean;
  autoTopUpThreshold?: number;
  autoTopUpAmount?: number;
}

export type MessageStatus = "SENT" | "FAILED" | "SCHEDULED";
export type KakaoApprovalStatus = "APPROVED" | "PENDING" | "REJECTED";
export type AutomationTrigger =
  | "ENROLLMENT_CREATED"
  | "COURSE_COMPLETED"
  | "ASSIGNMENT_DUE_D3"
  | "SESSION_REMINDER_1H"
  | "CERTIFICATE_ISSUED"
  | "ACCOUNT_INVITED";

export interface AutomationTriggerDef {
  trigger: AutomationTrigger;
  label: string;
  desc: string;
}

export interface MessageHistory {
  id: string;
  sentAt: string;
  recipient: string;
  recipientCount: number;
  channel: MessageChannel;
  subject?: string;
  preview: string;
  status: MessageStatus;
  templateId?: string;
}

export type SessionNotifyContext = "SESSION_OPEN" | "SESSION_CLOSE" | "SESSION_ENCOURAGE";

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string; // EMAIL
  content: string;
  variables: string[];
  charCount?: number; // SMS
  kakaoCode?: string;
  kakaoApproval?: KakaoApprovalStatus;
  kakaoButtons?: { text: string; url: string }[];
  tags?: string[];
  isSystemDefault?: boolean;           // 시스템 기본 템플릿 (삭제/채널변경 불가)
  defaultFor?: SessionNotifyContext;   // 라이프사이클 단계별 자동 선택 컨텍스트
  createdAt: string;
}

export interface VariableDef {
  key: string;
  label: string;
  source: string;
  channels: MessageChannel[] | "ALL";
}

export interface MessageConfig {
  sms: { senderNumber: string; apiKey: string; connected: boolean };
  email: {
    senderEmail: string;
    smtpHost: string;
    smtpPort: string;
    connected: boolean;
  };
  kakao: { channelId: string; channelKey: string; connected: boolean };
}

export interface MessageEventRule {
  id: string;
  trigger: AutomationTrigger;
  triggerLabel: string;
  triggerDesc: string;
  channel: MessageChannel;
  templateId: string;
  active: boolean;
}

// (OrgAnnouncement, PortalAnnouncement → Announcement 로 통합. 위 // ── 공지 섹션 참조)

// ── 장바구니 / 위시리스트 ─────────────────────────────────

export interface CartItem {
  id: string;
  userId: string;
  courseId: string;
  addedAt: string;
}

export interface WishItem {
  id: string;
  userId: string;
  courseId: string;
  addedAt: string;
}

// ── Q&A ───────────────────────────────────────────────────

export interface CourseQnA {
  id: string;
  courseSessionId: string;  // FK → CourseSession
  activityId?: string;      // FK → CourseActivity (특정 영상/퀴즈에 대한 질문)
  authorId: string;         // FK → User (수강생)
  parentId?: string;        // FK → CourseQnA (답글)
  body: string;
  isAnswered: boolean;
  isPinned: boolean;        // 강사 고정 Q&A
  createdAt: string;
}

// ── 포털 / 동의 ───────────────────────────────────────────

export interface UserAgreement {
  id: string;
  userId: string;
  legalDocumentId: string;
  version: number;
  agreedAt: string;
  ip?: string;
}

// ── 플랫폼 설정 ───────────────────────────────────────────

export interface PlatformSetting {
  id: string;
  key: string;           // e.g. "maintenance_mode", "default_lang"
  value: string;         // JSON-serialized
  description?: string;
  updatedAt: string;
  updatedBy: string;     // admin userId
}

// ── 그룹 멤버 (junction) ──────────────────────────────────

export interface UserGroupMember {
  id: string;
  groupId: string;       // FK → UserGroup
  userId: string;        // FK → User
  role: "MEMBER" | "MANAGER";
  joinedAt: string;
  addedBy: string;
}

// ── 차수별 강사 (junction) ────────────────────────────────

export interface CourseSessionInstructor {
  id: string;
  courseSessionId: string;
  userId: string;        // FK → User (강사 계정)
  role: "PRIMARY" | "ASSISTANT";
  order: number;         // 차수 내 표시 순서
  addedAt: string;
}

// ── 과정 카테고리 ─────────────────────────────────────────

export interface CourseCategory {
  id: string;
  tenantId: string | null;   // null = 전체 공통
  label: string;
  slug: string;
  parentId: string | null;   // 계층 구조
  order: number;
}

// ── 설문 개별 답변 ────────────────────────────────────────

export interface SurveyAnswer {
  id: string;
  surveyResponseId: string;
  questionId: string;
  value: string;
  numericValue?: number;     // 집계용 (rating, scale)
}

// ── 포털 배너 ─────────────────────────────────────────────

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

// ── 테넌트 컨텍스트 (feature flag 기반 UI 분기) ────────────

export type TenantType = "B2C" | "B2B";

export interface TenantContext {
  tenantId: string;
  tenantType: TenantType;         // 메타 정보용 (직접 분기에 쓰지 않음)
  tenantName: string;
  features: {
    payments: boolean;            // [B2C only] 결제
    cart: boolean;                // [B2C only] 장바구니
    orgStructure: boolean;        // [B2B only] 조직 구조
    sso: boolean;                 // [B2B only] SSO 설정
    mandatoryCourses: boolean;    // [B2B only] 필수 수강
  };
  /** 현재 로그인한 학습자의 조직 속성 — B2B only. B2C에서는 undefined */
  currentLearner?: {
    orgTeamId?: string;
    orgPositionId?: string;
    orgSiteId?: string;
  };
}

// ── 법적 문서 ─────────────────────────────────────────────

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

// ─── Q&A ───────────────────────────────────────────────────────────────────────

export interface QnaReply {
  id: string;
  postId: string;
  instructorId: string;
  instructorName: string; // UI 전용 스냅샷
  body: string;
  createdAt: string;
}

export interface QnaPost {
  id: string;
  courseSessionId: string;
  learnerId: string;
  learnerName: string; // UI 전용 스냅샷
  title: string;
  body: string;
  isHidden: boolean;
  createdAt: string;
  replies: QnaReply[];
}
