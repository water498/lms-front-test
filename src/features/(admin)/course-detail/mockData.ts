import { courses } from "../courses/mockData";
import type {
  Course,
  OfflineSessionStatus,
  AttendanceStatus,
  CheckInMethod,
  ActivityType,
  SessionType,
  SessionStatus,
  OfflineSession,
  OfflineAttendance,
  CourseActivity,
  CourseSubject,
  CourseSession,
  CourseEnrollee,
  CoursePrerequisite,
  CourseInstructor,
  CourseReview,
} from "@/lib/models";
export type {
  OfflineSessionStatus,
  AttendanceStatus,
  CheckInMethod,
  ActivityType,
  SessionType,
  SessionStatus,
  OfflineSession,
  OfflineAttendance,
  CourseActivity,
  CourseSubject,
  CourseSession,
  CourseEnrollee,
  CoursePrerequisite,
  CourseInstructor,
  CourseReview,
} from "@/lib/models";

const curricula: Record<string, CourseSubject[]> = {
  c4: [
    {
      id: "s4-0", courseId: "c4", title: "위험성평가 사전 테스트", phase: "PRE" as const, order: 0, requiredDayNum: 1,
      activities: [
        { id: "a4-0", subjectId: "s4-0", title: "위험성평가 사전 진단", type: "QUIZ", questionCount: 15, order: 1, isDeleted: false },
      ],
    },
    {
      id: "s4-1", courseId: "c4", title: "위험 식별 이론", phase: "LEARNING" as const, order: 1, requiredDayNum: 1,
      activities: [
        { id: "a4-1", subjectId: "s4-1", title: "위험 식별 개론 강의", type: "OFFLINE", order: 1, isDeleted: false },
        { id: "a4-2", subjectId: "s4-1", title: "위험 유형 분류 영상", type: "VIDEO", videoDurationMin: 20, mediaAssetId: "ma1", order: 2, isDeleted: false },
      ],
    },
    {
      id: "s4-2", courseId: "c4", title: "위험성 분석·평가 실습", phase: "LEARNING" as const, order: 2, requiredDayNum: 2,
      activities: [
        { id: "a4-3", subjectId: "s4-2", title: "현장 위험성 분석 실습", type: "OFFLINE", order: 1, isDeleted: false },
        { id: "a4-4", subjectId: "s4-2", title: "분석 결과 보고서 과제", type: "ASSIGNMENT", questionCount: 1, order: 2, isDeleted: false },
      ],
    },
    {
      id: "s4-3", courseId: "c4", title: "종합 평가", phase: "POST" as const, order: 3, requiredDayNum: 3,
      activities: [
        { id: "a4-5", subjectId: "s4-3", title: "위험관리 종합 시험", type: "QUIZ", questionCount: 25, order: 1, isDeleted: false },
        { id: "a4-6", subjectId: "s4-3", title: "교육 만족도 설문", type: "SURVEY", order: 2, isDeleted: false },
      ],
    },
  ],
  c1: [
    {
      id: "s0", courseId: "c1", title: "사전 진단 평가", phase: "PRE" as const, order: 0, requiredDayNum: 1,
      activities: [
        { id: "a0", subjectId: "s0", title: "안전 지식 사전 테스트", type: "QUIZ", questionCount: 10, order: 1, isDeleted: false },
        { id: "a0b", subjectId: "s0", title: "1일차 안전교육", type: "OFFLINE", order: 2, isDeleted: false },
      ],
    },
    {
      id: "s1", courseId: "c1", title: "안전수칙의 이해", phase: "LEARNING" as const, order: 1, requiredDayNum: 2,
      activities: [
        { id: "a1", subjectId: "s1", title: "안전수칙이란 무엇인가",          type: "VIDEO",      videoDurationMin: 12,  mediaAssetId: "ma1", order: 1, isDeleted: false },
        { id: "a2", subjectId: "s1", title: "개인보호장구 착용 방법",          type: "SCORM",                             mediaAssetId: "ma6", order: 2, isDeleted: false },
        { id: "a3", subjectId: "s1", title: "개념 확인 퀴즈",                 type: "QUIZ",       questionCount: 5,                            order: 3, isDeleted: false },
        { id: "a3b", subjectId: "s1", title: "2일차 현장 실습", type: "OFFLINE", order: 4, isDeleted: false },
      ],
    },
    {
      id: "s2", courseId: "c1", title: "위험구역 식별 및 대응", phase: "LEARNING" as const, order: 2,
      activities: [
        { id: "a4", subjectId: "s2", title: "위험구역 표시 및 통제 방법",      type: "VIDEO",      videoDurationMin: 18,  mediaAssetId: "ma2", order: 1, isDeleted: false },
        { id: "a5", subjectId: "s2", title: "위험 유형별 대응 절차",           type: "VIDEO",      videoDurationMin: 14,                        order: 2, isDeleted: false },
        { id: "a6", subjectId: "s2", title: "현장 적용 실습 과제",             type: "ASSIGNMENT", questionCount: 1,                            order: 3, isDeleted: false },
      ],
    },
    {
      id: "s3", courseId: "c1", title: "비상대응 절차", phase: "LEARNING" as const, order: 3,
      activities: [
        { id: "a7", subjectId: "s3", title: "비상상황 유형과 초기 대응",        type: "VIDEO",      videoDurationMin: 10,  mediaAssetId: "ma2", order: 1, isDeleted: false },
        { id: "a8", subjectId: "s3", title: "비상대응 시뮬레이션 과제",         type: "ASSIGNMENT", questionCount: 1,                            order: 2, isDeleted: false },
      ],
    },
    {
      id: "s4", courseId: "c1", title: "사후 종합 평가", phase: "POST" as const, order: 4, requiredDayNum: 3,
      activities: [
        { id: "a9",  subjectId: "s4", title: "종합 평가 시험",     type: "QUIZ",   questionCount: 20, order: 1, isDeleted: false },
        { id: "a10", subjectId: "s4", title: "교육 만족도 설문",   type: "SURVEY",                    order: 2, isDeleted: false },
      ],
    },
  ],
};

const sessions: Record<string, CourseSession[]> = {
  c1: [
    { id: "se1", courseId: "c1", name: "1기 (2025 1분기)", type: "COHORT",     cohortNumber: 1, startDate: "2025-01-06", endDate: "2025-02-28", capacity: 50, enrolled: 48, status: "CLOSED",  visible: true,  forSale: true,  instructors: [{ name: "이정민", role: "PRIMARY" }, { name: "김현수", role: "ASSISTANT" }], completionThreshold: 80, targetAudience: { departments: ["현장관리팀", "안전팀"], jobGrades: ["사원", "대리"] }, postExamTemplateId: "ex1", postSurveyTemplateId: "sv1", postAssignmentTemplateId: "as1" },
    { id: "se2", courseId: "c1", name: "2기 (2025 2분기)", type: "COHORT",     cohortNumber: 2, startDate: "2025-02-03", endDate: "2025-03-28", capacity: 50, enrolled: 50, status: "ONGOING", visible: true,  forSale: true,  instructors: [{ name: "이정민", role: "PRIMARY" }, { name: "김현수", role: "ASSISTANT" }], completionThreshold: 80, preSurveyTemplateId: "sv2", postSurveyTemplateId: "sv1", preAssignmentTemplateId: "as2" },
    { id: "se3", courseId: "c1", name: "3기 (2025 3분기)", type: "COHORT",     cohortNumber: 3, startDate: "2025-03-31", endDate: "2025-05-23", capacity: 60, enrolled: 12, status: "OPEN",    visible: true,  forSale: true,  instructors: [{ name: "이정민", role: "PRIMARY" }], completionThreshold: 80, minEnrollment: 20, enrollmentStartDate: "2025-03-10", enrollmentEndDate: "2025-03-28", targetAudience: { departments: ["현장관리팀"] } },
    { id: "se6", courseId: "c1", name: "자유수강",          type: "SELF_PACED",                                                                  capacity: 0,  enrolled: 87, status: "OPEN",    visible: true,  forSale: true,  instructors: [{ name: "이정민", role: "PRIMARY" }], completionThreshold: 80 },
  ],
  c4: [
    { id: "se4", courseId: "c4", name: "2기",               type: "COHORT",     cohortNumber: 2, startDate: "2025-02-10", endDate: "2025-03-21", capacity: 30, enrolled: 30, status: "ONGOING", visible: true,  forSale: false, instructors: [{ name: "박성훈", role: "PRIMARY" }], location: "강남교육센터 3F", completionThreshold: 80, offlineAttendanceThreshold: 75 },
    { id: "se5", courseId: "c4", name: "4기",               type: "COHORT",     cohortNumber: 4, startDate: "2025-04-07", endDate: "2025-04-25", capacity: 30, enrolled: 8,  status: "OPEN",    visible: true,  forSale: false, instructors: [{ name: "박성훈", role: "PRIMARY" }], location: "강남교육센터 3F", completionThreshold: 80, offlineAttendanceThreshold: 75 },
    { id: "se7", courseId: "c4", name: "5기",               type: "COHORT",     cohortNumber: 5, startDate: "2025-05-12", endDate: "2025-05-30", capacity: 30, enrolled: 0,  status: "DRAFT",   visible: false, forSale: false, instructors: [],                                    location: "강남교육센터 3F", completionThreshold: 80, offlineAttendanceThreshold: 75 },
    { id: "se8", courseId: "c4", name: "1기",               type: "COHORT",     cohortNumber: 1, startDate: "2024-11-04", endDate: "2024-11-22", capacity: 30, enrolled: 5,  status: "CANCELLED", visible: false, forSale: false, instructors: [{ name: "박성훈", role: "PRIMARY" }], location: "강남교육센터 3F", completionThreshold: 80, offlineAttendanceThreshold: 75, cancelledAt: "2024-10-28", cancellationReason: "수강 인원 미달 (최소 인원 15명)" },
  ],
};

const enrollees: Record<string, CourseEnrollee[]> = {
  c1: [
    { id: "e1",  learnerId: "u5",  learner: "김민준", sessionId: "se3", session: "3기 (2025 3분기)", progress: 45,  enrolledAt: "2025-03-14" },
    { id: "e2",  learnerId: "u6",  learner: "이서연", sessionId: "se3", session: "3기 (2025 3분기)", progress: 30,  enrolledAt: "2025-03-13" },
    { id: "e3",  learnerId: "u7",  learner: "박지호", sessionId: "se2", session: "2기 (2025 2분기)", progress: 100, enrolledAt: "2025-02-20" },
    { id: "e4",  learnerId: "u8",  learner: "최유진", sessionId: "se2", session: "2기 (2025 2분기)", progress: 72,  enrolledAt: "2025-02-03" },
    // se1 수강생 10명 (진도율 골고루 분포)
    { id: "e10", learnerId: "u10", learner: "강지원", sessionId: "se1", session: "1기 (2025 1분기)", progress: 10,  enrolledAt: "2025-01-07" },
    { id: "e11", learnerId: "u11", learner: "윤서준", sessionId: "se1", session: "1기 (2025 1분기)", progress: 25,  enrolledAt: "2025-01-07" },
    { id: "e12", learnerId: "u12", learner: "임채원", sessionId: "se1", session: "1기 (2025 1분기)", progress: 40,  enrolledAt: "2025-01-08" },
    { id: "e13", learnerId: "u13", learner: "오민서", sessionId: "se1", session: "1기 (2025 1분기)", progress: 55,  enrolledAt: "2025-01-08" },
    { id: "e14", learnerId: "u14", learner: "한예린", sessionId: "se1", session: "1기 (2025 1분기)", progress: 65,  enrolledAt: "2025-01-09" },
    { id: "e15", learnerId: "u15", learner: "송현우", sessionId: "se1", session: "1기 (2025 1분기)", progress: 75,  enrolledAt: "2025-01-09" },
    { id: "e16", learnerId: "u16", learner: "배수아", sessionId: "se1", session: "1기 (2025 1분기)", progress: 82,  enrolledAt: "2025-01-10" },
    { id: "e17", learnerId: "u17", learner: "장도윤", sessionId: "se1", session: "1기 (2025 1분기)", progress: 90,  enrolledAt: "2025-01-10" },
    { id: "e18", learnerId: "u18", learner: "권나연", sessionId: "se1", session: "1기 (2025 1분기)", progress: 95,  enrolledAt: "2025-01-11" },
    { id: "e19", learnerId: "u19", learner: "신재호", sessionId: "se1", session: "1기 (2025 1분기)", progress: 100, enrolledAt: "2025-01-11" },
  ],
};

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId) ?? courses[0];
}

export function getCurriculum(courseId: string): CourseSubject[] {
  return curricula[courseId] ?? curricula["c1"];
}

export function getSessions(courseId: string): CourseSession[] {
  return sessions[courseId] ?? sessions["c1"];
}

export function getEnrollees(courseId: string): CourseEnrollee[] {
  return enrollees[courseId] ?? enrollees["c1"];
}

export function getEnrolleesBySession(sessionId: string): CourseEnrollee[] {
  return Object.values(enrollees).flat().filter((e) => e.sessionId === sessionId);
}

export function getAllSessions(): (CourseSession & { courseTitle: string })[] {
  return Object.entries(sessions).flatMap(([courseId, sessList]) => {
    const course = courses.find((c) => c.id === courseId);
    return sessList.map((s) => ({ ...s, courseTitle: course?.title ?? courseId }));
  });
}

// ── 오프라인 회차 Mock 데이터 ──────────────────────────────────
const offlineSessions: Record<string, OfflineSession[]> = {
  se4: [
    { id: "os1", courseSessionId: "se4", title: "Day 1", dayNum: 1, startsAt: "2025-02-10T10:00:00", endsAt: "2025-02-10T18:00:00", location: "강남교육센터 3F", locationAddress: "서울시 강남구 테헤란로 152", locationLat: "37.5005", locationLng: "127.0365", instructors: [{ name: "김태호", role: "PRIMARY" }], maxAttendees: 30, status: "COMPLETED" },
    { id: "os2", courseSessionId: "se4", title: "Day 2", dayNum: 2, startsAt: "2025-02-17T10:00:00", endsAt: "2025-02-17T18:00:00", location: "강남교육센터 3F", locationAddress: "서울시 강남구 테헤란로 152", instructors: [{ name: "김태호", role: "PRIMARY" }, { name: "박소연", role: "ASSISTANT" }], maxAttendees: 30, status: "COMPLETED" },
    { id: "os3", courseSessionId: "se4", title: "Day 3", dayNum: 3, startsAt: "2025-02-24T10:00:00", endsAt: "2025-02-24T18:00:00", location: "강남교육센터 3F", locationAddress: "서울시 강남구 테헤란로 152", instructors: [{ name: "김태호", role: "PRIMARY" }], maxAttendees: 30, status: "SCHEDULED" },
  ],
};

const attendanceRecords: Record<string, OfflineAttendance[]> = {
  os1: [
    { offlineSessionId: "os1", userId: "u1", learnerName: "김민준", status: "PRESENT", checkInMethod: "QR",     checkedAt: "2025-02-10T10:03:00Z" },
    { offlineSessionId: "os1", userId: "u2", learnerName: "이서연", status: "LATE",    checkInMethod: "QR",     checkedAt: "2025-02-10T10:22:00Z" },
    { offlineSessionId: "os1", userId: "u3", learnerName: "박지호", status: "PRESENT", checkInMethod: "QR",     checkedAt: "2025-02-10T09:58:00Z" },
    { offlineSessionId: "os1", userId: "u4", learnerName: "최유진", status: "PRESENT", checkInMethod: "MANUAL"  },
    { offlineSessionId: "os1", userId: "u5", learnerName: "정다은", status: "ABSENT",  checkInMethod: "MANUAL"  },
  ],
  os2: [
    { offlineSessionId: "os2", userId: "u1", learnerName: "김민준", status: "PRESENT", checkInMethod: "QR",     checkedAt: "2025-02-17T10:01:00Z" },
    { offlineSessionId: "os2", userId: "u2", learnerName: "이서연", status: "PRESENT", checkInMethod: "QR",     checkedAt: "2025-02-17T09:55:00Z" },
    { offlineSessionId: "os2", userId: "u3", learnerName: "박지호", status: "ABSENT",  checkInMethod: "MANUAL"  },
    { offlineSessionId: "os2", userId: "u4", learnerName: "최유진", status: "EXCUSED", checkInMethod: "MANUAL"  },
    { offlineSessionId: "os2", userId: "u5", learnerName: "정다은", status: "PRESENT", checkInMethod: "QR",     checkedAt: "2025-02-17T10:05:00Z" },
  ],
  os3: [
    { offlineSessionId: "os3", userId: "u1", learnerName: "김민준", status: "ABSENT",  checkInMethod: "MANUAL"  },
    { offlineSessionId: "os3", userId: "u2", learnerName: "이서연", status: "ABSENT",  checkInMethod: "MANUAL"  },
    { offlineSessionId: "os3", userId: "u3", learnerName: "박지호", status: "ABSENT",  checkInMethod: "MANUAL"  },
    { offlineSessionId: "os3", userId: "u4", learnerName: "최유진", status: "ABSENT",  checkInMethod: "MANUAL"  },
    { offlineSessionId: "os3", userId: "u5", learnerName: "정다은", status: "ABSENT",  checkInMethod: "MANUAL"  },
  ],
};

export function getOfflineSessions(courseSessionId: string): OfflineSession[] {
  return offlineSessions[courseSessionId] ?? [];
}

export function getOfflineAttendances(offlineSessionId: string): OfflineAttendance[] {
  return attendanceRecords[offlineSessionId] ?? [];
}

// ── 선수과정 Mock 데이터 ──────────────────────────────────
const prerequisites: Record<string, CoursePrerequisite[]> = {
  c1: [
    { courseId: "c1", prerequisiteCourseId: "c2", requiredCompletion: false },
  ],
  c3: [
    { courseId: "c3", prerequisiteCourseId: "c1", requiredCompletion: true  },
    { courseId: "c3", prerequisiteCourseId: "c2", requiredCompletion: true  },
  ],
};

export function getPrerequisites(courseId: string): CoursePrerequisite[] {
  return prerequisites[courseId] ?? [];
}

// ── 수강 리뷰 Mock 데이터 ──────────────────────────────────
const reviews: Record<string, CourseReview[]> = {
  c1: [
    { id: "rv1", courseId: "c1", userId: "u5",  userName: "김민준", rating: 5, body: "현장에서 바로 적용할 수 있는 실용적인 안전 교육이었습니다. 강의 내용이 체계적이고 사례 중심이라 이해가 쉬웠습니다.", createdAt: "2025-03-10", visible: true },
    { id: "rv2", courseId: "c1", userId: "u6",  userName: "이서연", rating: 4, body: "전반적으로 좋았으나 일부 영상의 화질이 아쉬웠습니다. 퀴즈가 복습에 도움이 되었어요.", createdAt: "2025-03-08", visible: true },
    { id: "rv3", courseId: "c1", userId: "u7",  userName: "박지호", rating: 5, body: "비상대응 절차 파트가 특히 유익했습니다. 시뮬레이션 과제도 재미있었어요.", createdAt: "2025-03-05", visible: true },
    { id: "rv4", courseId: "c1", userId: "u8",  userName: "최유진", rating: 3, body: "내용은 괜찮았지만 분량이 좀 많았습니다. 핵심 위주로 압축하면 더 좋을 것 같아요.", createdAt: "2025-03-03", visible: true },
    { id: "rv5", courseId: "c1", userId: "u10", userName: "강지원", rating: 2, body: "이미 알고 있는 내용이 대부분이었습니다. 고급 과정이 별도로 있었으면 합니다.", createdAt: "2025-02-28", visible: false },
    { id: "rv6", courseId: "c1", userId: "u11", userName: "윤서준", rating: 4, body: "강사님 설명이 명쾌하고 현장 경험 기반이라 신뢰가 갔습니다.", createdAt: "2025-02-25", visible: true },
    { id: "rv7", courseId: "c1", userId: "u12", userName: "임채원", rating: 5, body: "우리 회사 상황에 맞는 사례가 많아 실무에 바로 활용할 수 있었습니다.", createdAt: "2025-02-20", visible: true },
    { id: "rv8", courseId: "c1", userId: "u13", userName: "오민서", rating: 1, body: "스팸 리뷰 테스트입니다 ㅋㅋㅋ", createdAt: "2025-02-18", visible: false },
  ],
};

export function getReviews(courseId: string): CourseReview[] {
  return reviews[courseId] ?? [];
}
