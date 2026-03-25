// 강사 포털 mock 데이터
// 기존 admin mock 재사용 + 수강생·출결·채점 신규 추가

export {
  instructorProfiles,
  instructorCourses,
  instructorReviews,
  instructorBankAccounts,
  instructorRevenues,
  type InstructorCourseAssignment,
} from "@/features/(admin)/instructors/mockData";

// 현재 로그인한 강사 (mock)
export const CURRENT_INSTRUCTOR_ID = "u-inst-1";
export const CURRENT_INSTRUCTOR_NAME = "김민준";

// ── 수강생 목록 (Enrollment 기반) ───────────────────────────────────────

export interface EnrollmentMock {
  userId: string;
  name: string;
  email: string;
  progress: number;      // 0~100
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  enrolledAt: string;
  completedAt?: string;
}

export const enrollmentsBySession: Record<string, EnrollmentMock[]> = {
  se2: [
    { userId: "u-l1", name: "김지수", email: "jisu.kim@example.com",     progress: 72, status: "ACTIVE",    enrolledAt: "2025-03-03" },
    { userId: "u-l2", name: "이민아", email: "mina.lee@example.com",     progress: 55, status: "ACTIVE",    enrolledAt: "2025-03-03" },
    { userId: "u-l3", name: "박현우", email: "hyunwoo.park@example.com", progress: 90, status: "ACTIVE",    enrolledAt: "2025-03-03" },
    { userId: "u-l4", name: "최준혁", email: "junhyuk.choi@example.com", progress: 100, status: "COMPLETED", enrolledAt: "2025-03-03", completedAt: "2025-03-28" },
    { userId: "u-l5", name: "오서준", email: "seojun.oh@example.com",    progress: 38, status: "ACTIVE",    enrolledAt: "2025-03-05" },
    { userId: "u-l6", name: "한가은", email: "gaeun.han@example.com",    progress: 0,  status: "CANCELLED", enrolledAt: "2025-03-03" },
    { userId: "u-l7", name: "정유나", email: "yuna.jung@example.com",    progress: 61, status: "ACTIVE",    enrolledAt: "2025-03-04" },
    { userId: "u-l8", name: "강도현", email: "dohyun.kang@example.com",  progress: 83, status: "ACTIVE",    enrolledAt: "2025-03-03" },
  ],
  se5: [
    { userId: "u-l1", name: "김지수",  email: "jisu.kim@example.com",    progress: 45, status: "ACTIVE",    enrolledAt: "2025-02-10" },
    { userId: "u-l3", name: "박현우",  email: "hyunwoo.park@example.com", progress: 70, status: "ACTIVE",    enrolledAt: "2025-02-10" },
    { userId: "u-l9", name: "임수빈",  email: "subin.lim@example.com",   progress: 52, status: "ACTIVE",    enrolledAt: "2025-02-11" },
    { userId: "u-l10", name: "윤재원", email: "jaewon.yoon@example.com", progress: 88, status: "ACTIVE",    enrolledAt: "2025-02-10" },
    { userId: "u-l11", name: "송하늘", email: "haneul.song@example.com", progress: 20, status: "ACTIVE",    enrolledAt: "2025-02-14" },
    { userId: "u-l12", name: "백지연", email: "jiyeon.baek@example.com", progress: 64, status: "ACTIVE",    enrolledAt: "2025-02-10" },
  ],
};

// ── 오프라인 세션 ────────────────────────────────────────────────────────

export interface OfflineSessionMock {
  id: string;
  title: string;
  dayNum: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  location: string;
  startsAt: string;
  endsAt: string;
}

export const offlineSessionsBySession: Record<string, OfflineSessionMock[]> = {
  se2: [
    { id: "os1", title: "1일차 오리엔테이션",       dayNum: 1, status: "COMPLETED", location: "서울 강남 교육센터 3층 A강의실", startsAt: "2025-03-03T09:00", endsAt: "2025-03-03T18:00" },
    { id: "os2", title: "2일차 React 기초",         dayNum: 2, status: "COMPLETED", location: "서울 강남 교육센터 3층 A강의실", startsAt: "2025-03-10T09:00", endsAt: "2025-03-10T18:00" },
    { id: "os3", title: "3일차 실습 프로젝트",       dayNum: 3, status: "SCHEDULED", location: "서울 강남 교육센터 3층 A강의실", startsAt: "2025-03-17T09:00", endsAt: "2025-03-17T18:00" },
  ],
};

// ── 출결 기록 ────────────────────────────────────────────────────────────

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

export interface AttendanceMock {
  userId: string;
  name: string;
  status: AttendanceStatus;
  checkedAt?: string;
  note?: string;
}

export const attendanceByOfflineSession: Record<string, AttendanceMock[]> = {
  os1: [
    { userId: "u-l1", name: "김지수", status: "PRESENT", checkedAt: "2025-03-03T09:02" },
    { userId: "u-l2", name: "이민아", status: "LATE",    checkedAt: "2025-03-03T09:18", note: "지하철 지연" },
    { userId: "u-l3", name: "박현우", status: "PRESENT", checkedAt: "2025-03-03T08:58" },
    { userId: "u-l4", name: "최준혁", status: "PRESENT", checkedAt: "2025-03-03T09:00" },
    { userId: "u-l5", name: "오서준", status: "ABSENT"  },
    { userId: "u-l6", name: "한가은", status: "ABSENT"  },
    { userId: "u-l7", name: "정유나", status: "PRESENT", checkedAt: "2025-03-03T09:05" },
    { userId: "u-l8", name: "강도현", status: "EXCUSED", note: "병가" },
  ],
  os2: [
    { userId: "u-l1", name: "김지수", status: "PRESENT", checkedAt: "2025-03-10T09:01" },
    { userId: "u-l2", name: "이민아", status: "PRESENT", checkedAt: "2025-03-10T08:55" },
    { userId: "u-l3", name: "박현우", status: "PRESENT", checkedAt: "2025-03-10T09:00" },
    { userId: "u-l4", name: "최준혁", status: "PRESENT", checkedAt: "2025-03-10T08:59" },
    { userId: "u-l5", name: "오서준", status: "LATE",    checkedAt: "2025-03-10T09:25" },
    { userId: "u-l6", name: "한가은", status: "ABSENT"  },
    { userId: "u-l7", name: "정유나", status: "PRESENT", checkedAt: "2025-03-10T09:03" },
    { userId: "u-l8", name: "강도현", status: "PRESENT", checkedAt: "2025-03-10T09:00" },
  ],
  os3: [], // 예정 세션 — 출결 미등록
};

// ── 과제 제출물 ──────────────────────────────────────────────────────────

export interface SubmissionMock {
  id: string;
  userId: string;
  name: string;
  assignmentTitle: string;
  submittedAt: string;
  fileUrl?: string;
  grade: number | null;   // null = 미채점
  feedback: string | null;
  gradedAt?: string;
}

export const submissionsBySession: Record<string, SubmissionMock[]> = {
  se2: [
    { id: "sub1", userId: "u-l1", name: "김지수", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-08T22:10", fileUrl: "https://example.com/sub1.zip", grade: null,  feedback: null },
    { id: "sub2", userId: "u-l2", name: "이민아", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-09T14:30", fileUrl: "https://example.com/sub2.zip", grade: 88,    feedback: "컴포넌트 분리가 잘 됐어요. 타입 정의를 좀 더 명확하게 해보세요.", gradedAt: "2025-03-11T10:00" },
    { id: "sub3", userId: "u-l3", name: "박현우", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-07T20:00", fileUrl: "https://example.com/sub3.zip", grade: 95,    feedback: "완성도가 높습니다. 추가 기능 구현도 인상적이에요.", gradedAt: "2025-03-10T09:00" },
    { id: "sub4", userId: "u-l4", name: "최준혁", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-08T18:00", fileUrl: "https://example.com/sub4.zip", grade: 92,    feedback: "코드가 깔끔합니다. 에러 처리 부분을 보강해보세요.", gradedAt: "2025-03-10T11:00" },
    { id: "sub5", userId: "u-l5", name: "오서준", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-10T23:55", fileUrl: "https://example.com/sub5.zip", grade: null,  feedback: null },
    { id: "sub6", userId: "u-l7", name: "정유나", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-09T16:20", fileUrl: "https://example.com/sub6.zip", grade: null,  feedback: null },
    { id: "sub7", userId: "u-l8", name: "강도현", assignmentTitle: "Todo 앱 구현", submittedAt: "2025-03-08T21:00", fileUrl: "https://example.com/sub7.zip", grade: 79,    feedback: "기본 기능은 잘 구현됐어요. 상태 관리 패턴을 다시 살펴보세요.", gradedAt: "2025-03-11T14:00" },
  ],
};
