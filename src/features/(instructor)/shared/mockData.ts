// 강사 포털 mock 데이터

import type {
  InstructorProfile,
  InstructorReview,
  InstructorBankAccount,
  InstructorRevenue,
} from "@/lib/models";

export interface InstructorCourseAssignment {
  sessionId: string;
  sessionName: string;
  courseTitle: string;
  role: "PRIMARY" | "ASSISTANT";
  enrolleeCount: number;
  startDate: string;
  endDate?: string;
}

export const instructorProfiles: Record<string, InstructorProfile> = {
  "u-inst-1": {
    userId: "u-inst-1",
    headline: "안전보건 전문가 · 前 한국산업안전보건공단",
    specialty: "안전보건관리체계, 법규해석, 안전문화",
    bio: "20년 이상의 산업안전 실무 경험을 바탕으로 현장에 바로 적용 가능한 안전 교육을 제공합니다. 한국산업안전보건공단 재직 시 중소기업 안전컨설팅 100여 건을 수행했습니다.",
    career: "2020–현재 안전보건 컨설턴트 (프리랜서)\n2008–2020 한국산업안전보건공단 수석연구원\n2003–2008 현대건설 안전팀장",
    affiliatedCompany: "안전경영연구소",
    isPublic: true,
    updatedAt: "2026-03-01T09:00:00Z",
  },
  "u-inst-2": {
    userId: "u-inst-2",
    headline: "건설안전기사 · 現장 안전관리 15년",
    specialty: "현장안전, 핵심안전수칙, 사고예방",
    bio: "건설 현장에서 15년간 안전관리자로 근무하며 실질적인 사고 예방 노하우를 전달합니다.",
    career: "2018–현재 롯데건설 안전관리팀 수석\n2012–2018 GS건설 현장 안전관리자\n2010–2012 한화건설 안전팀",
    isPublic: true,
    updatedAt: "2026-02-15T14:00:00Z",
  },
  "u-inst-3": {
    userId: "u-inst-3",
    headline: "산업안전지도사 · 위험성평가 전문",
    specialty: "위험관리, 재해통계, 리스크평가",
    bio: "위험성 평가와 재해 통계 분석 전문가로서 데이터 기반의 안전관리 방법론을 가르칩니다.",
    career: "2019–현재 리스크매니지먼트 컨설팅 대표\n2014–2019 안전보건공단 위험성평가 지도위원",
    isPublic: false,
    updatedAt: "2026-01-20T11:00:00Z",
  },
};

export const instructorCourses: Record<string, InstructorCourseAssignment[]> = {
  "u-inst-1": [
    { sessionId: "se1", sessionName: "2026-01기", courseTitle: "안전보건관리체계와 10대 필수 안전수칙 이해", role: "PRIMARY", enrolleeCount: 84, startDate: "2026-01-06", endDate: "2026-02-28" },
    { sessionId: "se2", sessionName: "2026-02기", courseTitle: "안전보건관리체계와 10대 필수 안전수칙 이해", role: "PRIMARY", enrolleeCount: 76, startDate: "2026-03-03" },
    { sessionId: "se5", sessionName: "2026-01기", courseTitle: "안전문화 주도 및 경영 역량", role: "PRIMARY", enrolleeCount: 51, startDate: "2026-02-10" },
  ],
  "u-inst-2": [
    { sessionId: "se3", sessionName: "2026-01기", courseTitle: "핵심안전수칙 이해", role: "PRIMARY", enrolleeCount: 62, startDate: "2026-01-13", endDate: "2026-03-07" },
    { sessionId: "se4", sessionName: "2026-01기", courseTitle: "사고 예방 기본 역량", role: "ASSISTANT", enrolleeCount: 40, startDate: "2026-02-17" },
  ],
  "u-inst-3": [
    { sessionId: "se6", sessionName: "2026-01기", courseTitle: "위험관리실무", role: "PRIMARY", enrolleeCount: 95, startDate: "2026-01-20" },
  ],
};

export const instructorReviews: Record<string, InstructorReview[]> = {
  "u-inst-1": [
    { id: "ir1", instructorId: "u-inst-1", courseId: "c2", learnerId: "u5", learnerName: "김지수", rating: 5, body: "법규 내용을 현장 사례와 연결해 설명해주셔서 이해하기 쉬웠습니다.", createdAt: "2026-03-10T10:00:00Z", visible: true },
    { id: "ir2", instructorId: "u-inst-1", courseId: "c3", learnerId: "u6", learnerName: "박현우", rating: 5, body: "안전 경영 관점을 체계적으로 배울 수 있어서 관리자로서 큰 도움이 됐습니다.", createdAt: "2026-03-08T14:00:00Z", visible: true },
    { id: "ir3", instructorId: "u-inst-1", courseId: "c2", learnerId: "u7", learnerName: "이민아", rating: 4, body: "내용이 풍부하고 강사님 경험이 느껴지는 강의입니다.", createdAt: "2026-02-28T09:00:00Z", visible: true },
    { id: "ir4", instructorId: "u-inst-1", courseId: "c2", learnerId: "u8", learnerName: "최준혁", rating: 5, body: "실제 현장 적용 사례가 많아서 바로 활용할 수 있었어요.", createdAt: "2026-02-20T11:00:00Z", visible: false },
  ],
  "u-inst-2": [
    { id: "ir5", instructorId: "u-inst-2", courseId: "c1", learnerId: "u5", learnerName: "김지수", rating: 4, body: "안전수칙을 체계적으로 정리할 수 있었습니다.", createdAt: "2026-03-05T15:00:00Z", visible: true },
    { id: "ir6", instructorId: "u-inst-2", courseId: "c5", learnerId: "u9", learnerName: "오서준", rating: 5, body: "사고 예방 원리를 실습 위주로 배울 수 있어서 좋았어요.", createdAt: "2026-02-25T10:00:00Z", visible: true },
    { id: "ir7", instructorId: "u-inst-2", courseId: "c1", learnerId: "u10", learnerName: "한가은", rating: 4, body: "현장 경험이 풍부한 강사님이라 신뢰가 갑니다.", createdAt: "2026-02-18T16:00:00Z", visible: true },
  ],
  "u-inst-3": [
    { id: "ir8", instructorId: "u-inst-3", courseId: "c4", learnerId: "u5", learnerName: "김지수", rating: 4, body: "위험성 평가 방법을 단계적으로 설명해줘서 도움이 됐습니다.", createdAt: "2026-03-01T13:00:00Z", visible: true },
    { id: "ir9", instructorId: "u-inst-3", courseId: "c4", learnerId: "u6", learnerName: "박현우", rating: 4, body: "실습 과제가 현장 상황과 유사해서 실질적으로 도움이 됐어요.", createdAt: "2026-02-22T09:30:00Z", visible: true },
  ],
};

export const instructorBankAccounts: Record<string, InstructorBankAccount[]> = {
  "u-inst-1": [
    { id: "ba1", instructorId: "u-inst-1", bankName: "카카오뱅크", accountNumber: "3333012345678", accountHolder: "김민준", isPrimary: true, createdAt: "2025-01-05T09:00:00Z" },
  ],
  "u-inst-2": [
    { id: "ba2", instructorId: "u-inst-2", bankName: "신한은행", accountNumber: "11012345678901", accountHolder: "이서연", isPrimary: true, createdAt: "2024-12-10T10:00:00Z" },
  ],
  "u-inst-3": [],
};

export const instructorRevenues: Record<string, InstructorRevenue[]> = {
  "u-inst-1": [
    { id: "p1", tenantId: "tenant-1", instructorId: "u-inst-1", revenueType: "COURSE_SALE", grossAmount: 2400000, commissionRate: 20, netAmount: 1920000, status: "PENDING", periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p3", tenantId: "tenant-1", instructorId: "u-inst-1", revenueType: "COURSE_SALE", grossAmount: 2100000, commissionRate: 20, netAmount: 1680000, status: "PAID", periodStart: "2025-02-01", periodEnd: "2025-02-28", paidAt: "2025-03-05", createdAt: "2025-03-01T00:00:00Z" },
  ],
  "u-inst-2": [
    { id: "p2", tenantId: "tenant-1", instructorId: "u-inst-2", revenueType: "COURSE_SALE", grossAmount: 1800000, commissionRate: 20, netAmount: 1440000, status: "APPROVED", periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p5", tenantId: "tenant-1", instructorId: "u-inst-2", revenueType: "COURSE_SALE", grossAmount: 1600000, commissionRate: 20, netAmount: 1280000, status: "PAID", periodStart: "2025-02-01", periodEnd: "2025-02-28", paidAt: "2025-03-05", createdAt: "2025-03-01T00:00:00Z" },
  ],
  "u-inst-3": [
    { id: "p4", tenantId: "tenant-1", instructorId: "u-inst-3", revenueType: "COURSE_SALE", grossAmount: 950000, commissionRate: 20, netAmount: 760000, status: "PENDING", periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p6", tenantId: "tenant-1", instructorId: "u-inst-3", revenueType: "COURSE_SALE", grossAmount: 720000, commissionRate: 20, netAmount: 576000, status: "APPROVED", periodStart: "2025-02-01", periodEnd: "2025-02-28", createdAt: "2025-03-01T00:00:00Z" },
  ],
};

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
  instructors?: { name: string; role: "PRIMARY" | "ASSISTANT" }[];
}

export const offlineSessionsBySession: Record<string, OfflineSessionMock[]> = {
  se2: [
    {
      id: "os1", title: "1일차 오리엔테이션", dayNum: 1, status: "COMPLETED",
      location: "서울 강남 교육센터 3층 A강의실", startsAt: "2025-03-03T09:00", endsAt: "2025-03-03T18:00",
      instructors: [{ name: "김민준", role: "PRIMARY" }],
    },
    {
      id: "os2", title: "2일차 TypeScript 심화", dayNum: 2, status: "COMPLETED",
      location: "서울 강남 교육센터 3층 A강의실", startsAt: "2025-03-10T09:00", endsAt: "2025-03-10T18:00",
      // 외부 초빙 강사가 담당하는 차시 — 차시별 강사가 다른 케이스
      instructors: [
        { name: "이수진 (외부)", role: "PRIMARY" },
        { name: "김민준", role: "ASSISTANT" },
      ],
    },
    {
      id: "os3", title: "3일차 실습 프로젝트", dayNum: 3, status: "SCHEDULED",
      location: "서울 강남 교육센터 3층 A강의실", startsAt: "2025-03-17T09:00", endsAt: "2025-03-17T18:00",
      instructors: [{ name: "김민준", role: "PRIMARY" }],
    },
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

import type { QnaPost } from "@/lib/models";

export const qnaPostsBySession: Record<string, QnaPost[]> = {
  se2: [
    {
      id: "q1",
      courseSessionId: "se2",
      learnerId: "u-l1",
      learnerName: "김지수",
      title: "3주차 실습 환경 설정이 계속 실패합니다",
      body: "Node 버전을 18로 올렸는데 pnpm install 중에 계속 에러가 납니다. 에러 메시지는 'EACCES: permission denied' 인데 어떻게 해결하면 될까요?",
      isHidden: false,
      createdAt: "2025-03-10T14:23",
      replies: [],
    },
    {
      id: "q2",
      courseSessionId: "se2",
      learnerId: "u-l2",
      learnerName: "이민아",
      title: "TypeScript 제네릭 개념이 헷갈려요",
      body: "강의에서 `T extends object` 부분이 이해가 안 돼요. 왜 그냥 `T`가 아니라 `extends object`를 붙이는 건가요?",
      isHidden: false,
      createdAt: "2025-03-09T11:05",
      replies: [
        {
          id: "r1",
          postId: "q2",
          instructorId: "u-inst-1",
          instructorName: "박민준",
          body: "`T extends object`는 T가 반드시 객체 타입이어야 함을 제약하는 거예요. 원시값(string, number 등)은 들어올 수 없게 막아줍니다. 예를 들어 `T`만 쓰면 `T = string`도 허용되는데, 그러면 `T['key']` 같은 객체 접근이 불가능해서 타입 에러가 생기죠.",
          createdAt: "2025-03-09T16:30",
        },
      ],
    },
    {
      id: "q3",
      courseSessionId: "se2",
      learnerId: "u-l3",
      learnerName: "박현우",
      title: "과제 제출 기한 연장 가능한가요?",
      body: "이번 주 업무가 많아서 과제 제출을 이틀 정도 늦게 해도 될까요? 기능 구현은 거의 다 됐는데 테스트 코드 작성이 남아있어요.",
      isHidden: false,
      createdAt: "2025-03-07T22:50",
      replies: [
        {
          id: "r2",
          postId: "q3",
          instructorId: "u-inst-1",
          instructorName: "박민준",
          body: "네, 이틀 연장 허용합니다. 3월 10일 자정까지 제출해 주세요. 테스트 코드는 최소 주요 기능 2개 이상 커버해주시면 됩니다.",
          createdAt: "2025-03-08T09:15",
        },
      ],
    },
    {
      id: "q4",
      courseSessionId: "se2",
      learnerId: "u-l5",
      learnerName: "오서준",
      title: "useEffect 의존성 배열 관련 질문",
      body: "ESLint에서 계속 'React Hook useEffect has a missing dependency' 경고가 뜨는데, 의존성 배열에 함수를 넣으면 무한루프가 생겨요. useCallback으로 감싸야 하는 건가요?",
      isHidden: false,
      createdAt: "2025-03-11T10:40",
      replies: [],
    },
  ],
};

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
