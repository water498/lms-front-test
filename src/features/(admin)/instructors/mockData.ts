import type {
  InstructorProfile,
  InstructorReview,
  InstructorBankAccount,
  InstructorRevenue,
  CourseSessionInstructor,
} from "@/lib/models";

// ── 강사 기본 정보 (User 모델 필드 일부 + InstructorProfile) ──────────

export interface InstructorSummary {
  id: string;         // User.id
  name: string;
  email: string;
  headline?: string;
  specialty?: string;
  isPublic: boolean;
  reviewCount: number;
  avgRating: number;  // 0이면 리뷰 없음
  courseCount: number; // 담당 차수 수
}

export const instructors: InstructorSummary[] = [
  {
    id: "u-inst-1",
    name: "김현수",
    email: "hyunsu.kim@example.com",
    headline: "안전보건 전문가 · 前 한국산업안전보건공단",
    specialty: "안전보건관리체계, 법규해석, 안전문화",
    isPublic: true,
    reviewCount: 34,
    avgRating: 4.7,
    courseCount: 3,
  },
  {
    id: "u-inst-2",
    name: "이정민",
    email: "jungmin.lee@example.com",
    headline: "건설안전기사 · 現장 안전관리 15년",
    specialty: "현장안전, 핵심안전수칙, 사고예방",
    isPublic: true,
    reviewCount: 21,
    avgRating: 4.5,
    courseCount: 2,
  },
  {
    id: "u-inst-3",
    name: "박성훈",
    email: "sunghun.park@example.com",
    headline: "산업안전지도사 · 위험성평가 전문",
    specialty: "위험관리, 재해통계, 리스크평가",
    isPublic: false,
    reviewCount: 8,
    avgRating: 4.2,
    courseCount: 1,
  },
];

// ── InstructorProfile ──────────────────────────────────────────────────

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
    bio: "건설 현장에서 15년간 안전관리자로 근무하며 실질적인 사고 예방 노하우를 전달합니다. 수강생이 현장에서 바로 활용할 수 있는 실습 중심 교육을 지향합니다.",
    career: "2018–현재 롯데건설 안전관리팀 수석\n2012–2018 GS건설 현장 안전관리자\n2010–2012 한화건설 안전팀",
    isPublic: true,
    updatedAt: "2026-02-15T14:00:00Z",
  },
  "u-inst-3": {
    userId: "u-inst-3",
    headline: "산업안전지도사 · 위험성평가 전문",
    specialty: "위험관리, 재해통계, 리스크평가",
    bio: "위험성 평가와 재해 통계 분석 전문가로서 데이터 기반의 안전관리 방법론을 가르칩니다. 중대재해처벌법 대응 컨설팅 경험 다수 보유.",
    career: "2019–현재 리스크매니지먼트 컨설팅 대표\n2014–2019 안전보건공단 위험성평가 지도위원",
    isPublic: false,
    updatedAt: "2026-01-20T11:00:00Z",
  },
};

// ── CourseSessionInstructor (담당 차수) ────────────────────────────────

export interface InstructorCourseAssignment {
  sessionId: string;
  sessionName: string;
  courseTitle: string;
  role: "PRIMARY" | "ASSISTANT";
  enrolleeCount: number;
  startDate: string;
  endDate?: string;
}

export const instructorCourses: Record<string, InstructorCourseAssignment[]> = {
  "u-inst-1": [
    { sessionId: "se1", sessionName: "2026-01기", courseTitle: "안전보건관리체계와 10대 필수 안전수칙 이해", role: "PRIMARY",   enrolleeCount: 84, startDate: "2026-01-06", endDate: "2026-02-28" },
    { sessionId: "se2", sessionName: "2026-02기", courseTitle: "안전보건관리체계와 10대 필수 안전수칙 이해", role: "PRIMARY",   enrolleeCount: 76, startDate: "2026-03-03" },
    { sessionId: "se5", sessionName: "2026-01기", courseTitle: "안전문화 주도 및 경영 역량",               role: "PRIMARY",   enrolleeCount: 51, startDate: "2026-02-10" },
  ],
  "u-inst-2": [
    { sessionId: "se3", sessionName: "2026-01기", courseTitle: "핵심안전수칙 이해",  role: "PRIMARY",   enrolleeCount: 62, startDate: "2026-01-13", endDate: "2026-03-07" },
    { sessionId: "se4", sessionName: "2026-01기", courseTitle: "사고 예방 기본 역량", role: "ASSISTANT", enrolleeCount: 40, startDate: "2026-02-17" },
  ],
  "u-inst-3": [
    { sessionId: "se6", sessionName: "2026-01기", courseTitle: "위험관리실무", role: "PRIMARY", enrolleeCount: 95, startDate: "2026-01-20" },
  ],
};

// ── InstructorReview ───────────────────────────────────────────────────

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

// ── InstructorBankAccount ──────────────────────────────────────────────

export const instructorBankAccounts: Record<string, InstructorBankAccount[]> = {
  "u-inst-1": [
    { id: "ba1", instructorId: "u-inst-1", bankName: "카카오뱅크", accountNumber: "3333012345678", accountHolder: "김민준", isPrimary: true, createdAt: "2025-01-05T09:00:00Z" },
  ],
  "u-inst-2": [
    { id: "ba2", instructorId: "u-inst-2", bankName: "신한은행", accountNumber: "11012345678901", accountHolder: "이서연", isPrimary: true, createdAt: "2024-12-10T10:00:00Z" },
  ],
  "u-inst-3": [],
};

// ── InstructorRevenue (정산) ───────────────────────────────────────────
// payouts/mockData.ts와 동일한 데이터 참조용으로 일부만 포함

export const instructorRevenues: Record<string, InstructorRevenue[]> = {
  "u-inst-1": [
    { id: "p1", tenantId: "tenant-1", instructorId: "u-inst-1", revenueType: "COURSE_SALE", grossAmount: 2400000, commissionRate: 20, netAmount: 1920000, status: "PENDING",  periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p3", tenantId: "tenant-1", instructorId: "u-inst-1", revenueType: "COURSE_SALE", grossAmount: 2100000, commissionRate: 20, netAmount: 1680000, status: "PAID",     periodStart: "2025-02-01", periodEnd: "2025-02-28", paidAt: "2025-03-05", createdAt: "2025-03-01T00:00:00Z" },
  ],
  "u-inst-2": [
    { id: "p2", tenantId: "tenant-1", instructorId: "u-inst-2", revenueType: "COURSE_SALE", grossAmount: 1800000, commissionRate: 20, netAmount: 1440000, status: "APPROVED", periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p5", tenantId: "tenant-1", instructorId: "u-inst-2", revenueType: "COURSE_SALE", grossAmount: 1600000, commissionRate: 20, netAmount: 1280000, status: "PAID",     periodStart: "2025-02-01", periodEnd: "2025-02-28", paidAt: "2025-03-05", createdAt: "2025-03-01T00:00:00Z" },
  ],
  "u-inst-3": [
    { id: "p4", tenantId: "tenant-1", instructorId: "u-inst-3", revenueType: "COURSE_SALE", grossAmount: 950000, commissionRate: 20, netAmount: 760000, status: "PENDING",  periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p6", tenantId: "tenant-1", instructorId: "u-inst-3", revenueType: "COURSE_SALE", grossAmount: 720000, commissionRate: 20, netAmount: 576000, status: "APPROVED", periodStart: "2025-02-01", periodEnd: "2025-02-28", createdAt: "2025-03-01T00:00:00Z" },
  ],
};
