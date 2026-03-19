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
  | "PLATFORM_SETTINGS_UPDATED";

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
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
  status: TenantStatus;
  trialEndsAt?: string;
  maxUsers: number; // 0 = unlimited
  currentUsers: number;
  adminEmail: string;
  adminInviteStatus?: AdminInviteStatus;
  contractStart: string;
  contractEnd: string;
  storageUsedGB: number;
  storageMaxGB: number;
  infra: TenantInfra;
  infraStatus?: TenantInfraStatus;
  sso?: TenantSsoConfig;
}

// ── 사용자 ────────────────────────────────────────────────

export type UserRole = "LEARNER" | "INSTRUCTOR" | "ORG_ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  enrolledCourses: number;
  lastLogin: string;
  joinedAt: string;
  employeeId?: string; // 사번
  siteId?: string; // Site.id
  departmentId?: string; // DeptNode.id
  jobGradeId?: string; // JobGrade.id
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  type: "LOGIN" | "LOGOUT" | "SESSION_EXPIRED" | "AUTO_LOGIN";
  scope: "USER" | "ADMIN";
  date: string; // "YYYY-MM-DD HH:MM"
  ip: string;
  userAgent: string;
}

export interface UserEnrollment {
  courseTitle: string;
  session: string;
  progress: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  hasCertificate: boolean;
}

export interface ActivityLog {
  date: string;
  action: string;
  detail: string;
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
  completionRate: number; // 0~100
  requireExam: boolean;
  autoIssue: boolean;
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
  status?: CourseStatus;
  mode?: CourseMode;
  sessions?: number; // 세션 수
  enrollees?: number; // 수강자 수
  createdAt?: string;
  certConfig?: CertConfig | null;
  description?: string;
  cancellationPolicy?: CancellationPolicy;
}

export type EnrolledCourse = Course & {
  progress: number;
  lastAccessedAt: string;
  nextLessonTitle: string;
};

export type Category = { id: string; label: string };

// ── 오프라인 수업 & 출결 ──────────────────────────────────

export type OfflineSessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface OfflineSession {
  id: string;
  courseSessionId: string;
  dayNum: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructors: string[];
  maxCapacity: number;
  status: OfflineSessionStatus;
}

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type AttendanceMethod = "QR" | "MANUAL";

export interface AttendanceRecord {
  id: string;
  offlineSessionId: string;
  learnerId: string;
  learnerName: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  checkedAt?: string;
}

// ── 커리큘럼 ──────────────────────────────────────────────

export type ActivityType = "VIDEO" | "SCORM" | "QUIZ" | "ASSIGNMENT";

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  duration?: number; // 분 (VIDEO일 때)
  questionCount?: number; // QUIZ/ASSIGNMENT
  mediaAssetId?: string; // 콘텐츠 라이브러리 ma* ID (VIDEO/SCORM)
  examTemplateId?: string; // QUIZ
  assignTemplateId?: string; // ASSIGNMENT
}

export interface Subject {
  id: string;
  title: string;
  order: number;
  activities: Activity[];
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
  capacity: number; // 0 = 무제한
  enrolled: number;
  status: SessionStatus;
  visible: boolean;
  forSale: boolean;
  instructors: string[];
  location?: string;
  completionThreshold: number; // 수료 인정 최소 진도율 (%)
  targetAudience?: {
    departments?: string[];
    jobGrades?: string[];
    sites?: string[];
  };
  preExamTemplateId?: string; // 수강 전 시험 (진단)
  preAssignmentTemplateId?: string; // 수강 전 과제
  preSurveyTemplateId?: string; // 수강 시작 전 설문
  postSurveyTemplateId?: string; // 수료 후 설문
  finalExamTemplateId?: string; // 수료 조건 시험
  postAssignmentTemplateId?: string; // 수료 후 과제
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

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface Enrollment {
  id: string;
  learner: string;
  course: string;
  session: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  lastStudiedAt?: string;
}

// ── 평가 ──────────────────────────────────────────────────

export type BankQuestionKind = "EXAM" | "SURVEY";
export type QuestionType = "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT";
export type SurveyQuestionType = "LIKERT" | "SINGLE" | "MULTIPLE" | "TEXT";

export interface BankQuestion {
  id: string;
  kind: BankQuestionKind;
  type: QuestionType | SurveyQuestionType;
  text: string;
  options?: { id: string; text: string; correct?: boolean }[];
  answer?: string; // SHORT 모범답안
  scale?: number; // LIKERT 척도
  tags: string[];
  createdAt: string;
}

export interface CompositionRule {
  id: string;
  label: string;
  tagFilter: string[];
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
  rules: CompositionRule[];
  usageCount: number;
  createdAt: string;
}

export type SubmissionType = "FILE" | "TEXT" | "BOTH";

export interface RubricItem {
  id: string;
  criteria: string;
  points: number;
}

export interface AssignmentTemplate {
  id: string;
  title: string;
  instructions: string;
  submissionType: SubmissionType;
  rubric: RubricItem[];
  usageCount: number;
  createdAt: string;
}

export type SurveyTriggerType = "MANUAL" | "COURSE_COMPLETE";

export interface SurveyTemplate {
  id: string;
  title: string;
  anonymous: boolean;
  triggerType: SurveyTriggerType;
  rules: CompositionRule[];
  responseCount: number;
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
}

// ── 수료증 ────────────────────────────────────────────────

export type CertStatus = "VALID" | "REVOKED" | "EXPIRED";

export interface CertTemplate {
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

export interface IssuedCert {
  id: string;
  certNumber: string;
  publicToken: string;
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

export type PaymentStatus = "PAID" | "REFUNDED" | "CANCELLED";

export interface Payment {
  id: string;
  orderNumber: string;
  learner: string;
  course: string;
  amount: number; // KRW
  status: PaymentStatus;
  paidAt: string;
}

export type MessageChannel = "SMS" | "EMAIL" | "KAKAO";
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
  createdAt: string;
}

export interface VariableDef {
  key: string;
  label: string;
  source: string;
  channels: MessageChannel[] | "ALL";
}

export interface ChannelConfig {
  sms: { senderNumber: string; apiKey: string; connected: boolean };
  email: {
    senderEmail: string;
    smtpHost: string;
    smtpPort: string;
    connected: boolean;
  };
  kakao: { channelId: string; channelKey: string; connected: boolean };
}

export interface AutomationRule {
  id: string;
  trigger: AutomationTrigger;
  triggerLabel: string;
  triggerDesc: string;
  channel: MessageChannel;
  templateId: string;
  active: boolean;
}

export type AnnouncementTarget = "ALL" | "COURSE";
export type AnnouncementType = "ANNOUNCEMENT" | "SYSTEM_NOTICE";

/**
 * Announcement — B2C/B2B(learner-facing)와 admin(content entity) flat optional 통합.
 * Learner-facing 필드: type(한글), date, isNew
 * Admin 필드: type(AnnouncementType), target, targetCourse, sentAt, views
 */
export interface Announcement {
  id: string;
  title: string;
  type: AnnouncementType | "공지" | "이벤트" | "업데이트";
  // Admin 필드
  target?: AnnouncementTarget;
  targetCourse?: string;
  sentAt?: string;
  views?: number;
  // Learner-facing 필드
  date?: string;
  isNew?: boolean;
}
