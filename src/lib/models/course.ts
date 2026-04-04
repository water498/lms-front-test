// Course domain models — split from lib/models.ts

export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type CourseMode = "ONLINE" | "OFFLINE" | "BLENDED";
export type CourseLevel = "BEGINNER" | "ELEMENTARY" | "INTERMEDIATE" | "ADVANCED";
export type CourseType = "online" | "offline" | "blended"; // [UI-only] mode의 소문자 버전

// [UI-only] backend는 Course에 flat 필드로 통합 (certTemplateId, defaultCompletionThreshold, isCertAutoIssue)
export interface CertConfig {
  templateId: string;
  completionRate: number;
  autoIssue: boolean;
}

export interface CancellationRule {
  id: string;
  courseId: string;
  daysBeforeStart: number; // N일 이상 전 취소
  refundPct: number; // 0~100
}

// [UI-only] backend에서 CancellationPolicy 테이블 삭제됨. CancellationRule은 course 1:N으로 직접 참조
export interface CancellationPolicy {
  rules: CancellationRule[]; // daysBeforeStart 내림차순 정렬
  noRefundAfterStart: boolean;
}

/**
 * Course — B2C/B2B/admin flat optional 통합.
 */
export interface Course {
  id: string;
  tenantId?: string;
  title: string;
  instructorId?: string;   // FK → user.id. null = 강사 없는 자기주도형 과정
  categoryId: string;      // FK → CourseCategory
  tags: string[];          // [UI convenience] backend는 String(500) comma-separated
  status?: CourseStatus;
  mode?: CourseMode;
  price?: number;          // KRW, B2C only
  description?: string;
  thumbnail?: string;
  level?: CourseLevel;
  duration?: string;       // 예: "20시간"
  defaultMinLearners?: number | null; // 차수 생성 시 기본값 (null = 미설정)
  isQnaEnabled?: boolean;
  // 수료증 설정 (backend flat 필드)
  certTemplateId?: string;          // FK → CertificateTemplate
  defaultCompletionThreshold?: number; // 0-100%
  isCertAutoIssue?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  // ── [UI-only] 필드 ──
  instructor?: string;      // [UI-only] JOIN 결과 강사명
  category?: string;        // [UI-only] JOIN 결과 카테고리명
  categoryLabel?: string;   // [UI-only]
  accentColor?: string;     // [UI-only]
  rating?: number;          // [UI-only] CourseReview 집계
  reviewCount?: number;     // [UI-only] CourseReview 집계
  isNew?: boolean;          // [UI-only]
  isBestseller?: boolean;   // [UI-only]
  type?: "online" | "offline" | "blended"; // [UI-only] mode의 소문자 버전
  isRequired?: boolean;     // [UI-only] B2B: 기업이 지정한 필수 수강 여부
  location?: string;        // [UI-only] 오프라인 전용
  nextSessionDate?: string; // [UI-only] 오프라인 전용
  capacity?: number;        // [UI-only] 오프라인 전용
  enrolledCount?: number;   // [UI-only] 오프라인 전용
  sessions?: number;        // [UI-only] 세션 수
  enrollees?: number;       // [UI-only] 수강자 수
  certConfig?: CertConfig | null; // [UI-only] certTemplateId 등을 묶은 편의 객체
  cancellationPolicy?: CancellationPolicy; // [UI-only]
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
  prerequisiteCourseId: string; // backend: prerequisite_id
  requiredCompletion: boolean; // backend: is_completion_required
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
  subjectId: string;       // FK → CourseSubject
  title: string;
  type: ActivityType;
  order: number;
  videoDurationMin?: number; // VIDEO일 때 (분)
  isDeleted: boolean;        // soft delete
  questionCount?: number;    // QUIZ/ASSIGNMENT
  mediaAssetId?: string;     // VIDEO/SCORM
  examTemplateId?: string;   // QUIZ
  assignTemplateId?: string; // ASSIGNMENT
  surveyTemplateId?: string; // SURVEY
  passRequired?: boolean;    // QUIZ: true이면 합격해야 완료 처리
}

export type SubjectPhase = "PRE" | "LEARNING" | "POST";

export interface CourseSubject {
  id: string;
  courseId: string;
  title: string;
  phase: SubjectPhase;
  order: number;
  activities: CourseActivity[]; // [UI convenience] JOIN 결과
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
  startDate?: string;        // backend: starts_at
  endDate?: string;          // backend: ends_at
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  capacity: number;          // backend: max_learners. 0 = 무제한
  enrolled: number;          // backend: enrolled_count (cache)
  status: SessionStatus;
  visible: boolean;
  forSale: boolean;          // backend: is_for_sale. B2C only
  location?: string;
  completionThreshold: number; // 수료 인정 최소 진도율 (%)
  offlineAttendanceThreshold?: number | null; // OFFLINE/BLENDED 전용
  minEnrollment?: number | null; // backend: min_learners
  targetAudience?: {         // [UI convenience] backend는 target_department_ids/target_job_grade_ids/target_site_ids JSON
    departments?: string[];
    jobGrades?: string[];
    sites?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  // ── [UI-only] 필드 — 실제로는 CourseSubject.phase + CourseActivity 구조로 관리 ──
  instructors: CourseInstructor[]; // [UI-only] CourseSessionInstructor JOIN
  preExamTemplateId?: string;
  preAssignmentTemplateId?: string;
  preSurveyTemplateId?: string;
  postExamTemplateId?: string;
  postExamRequired?: boolean;
  postAssignmentTemplateId?: string;
  postAssignmentRequired?: boolean;
  postSurveyTemplateId?: string;
  postSurveyRequired?: boolean;
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
  sessionId: string;       // composite PK
  instructorId: string;    // composite PK, FK → User
  role: "PRIMARY" | "ASSISTANT";
  order: number;
  addedAt: string;
}

export interface CourseCategory {
  id: string;
  tenantId: string;
  label: string;
  parentId?: string; // null = 최상위. 대/중/소 계층 구조 (3단계)
  order: number;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string; // 스냅샷
  rating: number;   // 1~5
  body: string;
  createdAt: string;
  visible: boolean;
}
