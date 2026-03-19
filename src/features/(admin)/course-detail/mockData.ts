import { courses } from "../courses/mockData";
import type {
  Course,
  OfflineSessionStatus,
  AttendanceStatus,
  AttendanceMethod,
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
} from "@/lib/models";
export type {
  OfflineSessionStatus,
  AttendanceStatus,
  AttendanceMethod,
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
} from "@/lib/models";

const curricula: Record<string, CourseSubject[]> = {
  c1: [
    {
      id: "s1", title: "React 기초 개념", order: 1,
      activities: [
        { id: "a1", title: "React란 무엇인가",    type: "VIDEO",      duration: 12,  mediaAssetId: "ma1" },
        { id: "a2", title: "컴포넌트 개념",        type: "SCORM",                     mediaAssetId: "ma6" },
        { id: "a3", title: "개념 확인 퀴즈",       type: "QUIZ",       questionCount: 5 },
      ],
    },
    {
      id: "s2", title: "State와 Props", order: 2,
      activities: [
        { id: "a4", title: "useState 사용법",      type: "VIDEO",      duration: 18,  mediaAssetId: "ma2" },
        { id: "a5", title: "Props 전달과 타입",    type: "VIDEO",      duration: 14 },
        { id: "a6", title: "실습 과제",             type: "ASSIGNMENT", questionCount: 1 },
      ],
    },
    {
      id: "s3", title: "이벤트와 폼 처리", order: 3,
      activities: [
        { id: "a7", title: "이벤트 핸들링",        type: "VIDEO",      duration: 10,  mediaAssetId: "ma2" },
        { id: "a8", title: "폼 제출 실습 과제",    type: "ASSIGNMENT", questionCount: 1 },
      ],
    },
  ],
};

const sessions: Record<string, CourseSession[]> = {
  c1: [
    { id: "se1", courseId: "c1", name: "1기 (2025 1분기)", type: "COHORT",     cohortNumber: 1, startDate: "2025-01-06", endDate: "2025-02-28", capacity: 50, enrolled: 48, status: "CLOSED",  visible: true,  forSale: true,  instructors: ["이준혁"], completionThreshold: 80, targetAudience: { departments: ["개발팀", "기획팀"], jobGrades: ["사원", "대리"] }, finalExamTemplateId: "ex1", postSurveyTemplateId: "sv1", postAssignmentTemplateId: "as1" },
    { id: "se2", courseId: "c1", name: "2기 (2025 2분기)", type: "COHORT",     cohortNumber: 2, startDate: "2025-02-03", endDate: "2025-03-28", capacity: 50, enrolled: 50, status: "ONGOING", visible: true,  forSale: true,  instructors: ["이준혁"], completionThreshold: 80, preSurveyTemplateId: "sv2", postSurveyTemplateId: "sv1", preAssignmentTemplateId: "as2" },
    { id: "se3", courseId: "c1", name: "3기 (2025 3분기)", type: "COHORT",     cohortNumber: 3, startDate: "2025-03-31", endDate: "2025-05-23", capacity: 60, enrolled: 12, status: "OPEN",    visible: true,  forSale: true,  instructors: ["이준혁"], completionThreshold: 80, minEnrollment: 20, targetAudience: { departments: ["개발팀"] } },
    { id: "se6", courseId: "c1", name: "자유수강",          type: "SELF_PACED",                                                                  capacity: 0,  enrolled: 87, status: "OPEN",    visible: true,  forSale: true,  instructors: ["이준혁"], completionThreshold: 80 },
  ],
  c4: [
    { id: "se4", courseId: "c4", name: "2기",               type: "COHORT",     cohortNumber: 2, startDate: "2025-02-10", endDate: "2025-03-21", capacity: 30, enrolled: 30, status: "ONGOING", visible: true,  forSale: false, instructors: ["김태호"], location: "강남교육센터 3F", completionThreshold: 80 },
    { id: "se5", courseId: "c4", name: "4기",               type: "COHORT",     cohortNumber: 4, startDate: "2025-04-07", endDate: "2025-04-25", capacity: 30, enrolled: 8,  status: "OPEN",    visible: true,  forSale: false, instructors: ["김태호"], location: "강남교육센터 3F", completionThreshold: 80 },
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
    { id: "os1", courseSessionId: "se4", dayNum: 1, date: "2025-02-10", startTime: "10:00", endTime: "18:00", location: "강남교육센터 3F", instructors: ["김태호"], maxCapacity: 30, status: "COMPLETED" },
    { id: "os2", courseSessionId: "se4", dayNum: 2, date: "2025-02-17", startTime: "10:00", endTime: "18:00", location: "강남교육센터 3F", instructors: ["김태호"], maxCapacity: 30, status: "COMPLETED" },
    { id: "os3", courseSessionId: "se4", dayNum: 3, date: "2025-02-24", startTime: "10:00", endTime: "18:00", location: "강남교육센터 3F", instructors: ["김태호"], maxCapacity: 30, status: "SCHEDULED" },
  ],
};

const attendanceRecords: Record<string, OfflineAttendance[]> = {
  os1: [
    { id: "at1",  offlineSessionId: "os1", learnerId: "u1", learnerName: "김민준", status: "PRESENT", method: "QR",     checkedAt: "2025-02-10T10:03:00Z" },
    { id: "at2",  offlineSessionId: "os1", learnerId: "u2", learnerName: "이서연", status: "LATE",    method: "QR",     checkedAt: "2025-02-10T10:22:00Z" },
    { id: "at3",  offlineSessionId: "os1", learnerId: "u3", learnerName: "박지호", status: "PRESENT", method: "QR",     checkedAt: "2025-02-10T09:58:00Z" },
    { id: "at4",  offlineSessionId: "os1", learnerId: "u4", learnerName: "최유진", status: "PRESENT", method: "MANUAL"  },
    { id: "at5",  offlineSessionId: "os1", learnerId: "u5", learnerName: "정다은", status: "ABSENT",  method: "MANUAL"  },
  ],
  os2: [
    { id: "at6",  offlineSessionId: "os2", learnerId: "u1", learnerName: "김민준", status: "PRESENT", method: "QR",     checkedAt: "2025-02-17T10:01:00Z" },
    { id: "at7",  offlineSessionId: "os2", learnerId: "u2", learnerName: "이서연", status: "PRESENT", method: "QR",     checkedAt: "2025-02-17T09:55:00Z" },
    { id: "at8",  offlineSessionId: "os2", learnerId: "u3", learnerName: "박지호", status: "ABSENT",  method: "MANUAL"  },
    { id: "at9",  offlineSessionId: "os2", learnerId: "u4", learnerName: "최유진", status: "EXCUSED", method: "MANUAL"  },
    { id: "at10", offlineSessionId: "os2", learnerId: "u5", learnerName: "정다은", status: "PRESENT", method: "QR",     checkedAt: "2025-02-17T10:05:00Z" },
  ],
  os3: [
    { id: "at11", offlineSessionId: "os3", learnerId: "u1", learnerName: "김민준", status: "ABSENT",  method: "MANUAL"  },
    { id: "at12", offlineSessionId: "os3", learnerId: "u2", learnerName: "이서연", status: "ABSENT",  method: "MANUAL"  },
    { id: "at13", offlineSessionId: "os3", learnerId: "u3", learnerName: "박지호", status: "ABSENT",  method: "MANUAL"  },
    { id: "at14", offlineSessionId: "os3", learnerId: "u4", learnerName: "최유진", status: "ABSENT",  method: "MANUAL"  },
    { id: "at15", offlineSessionId: "os3", learnerId: "u5", learnerName: "정다은", status: "ABSENT",  method: "MANUAL"  },
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
