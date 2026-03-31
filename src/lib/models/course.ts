// Course domain models — split from lib/models.ts

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

export interface CourseInstructor {
  name: string;
  role: "PRIMARY" | "ASSISTANT";
}

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

export interface CourseSessionInstructor {
  id: string;
  courseSessionId: string;
  userId: string;        // FK → User (강사 계정)
  role: "PRIMARY" | "ASSISTANT";
  order: number;         // 차수 내 표시 순서
  addedAt: string;
}

export interface CourseCategory {
  id: string;
  tenantId: string | null;   // null = 전체 공통
  label: string;
  slug: string;
  parentId: string | null;   // 계층 구조
  order: number;
}
