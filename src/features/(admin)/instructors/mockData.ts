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
    name: "김민준",
    email: "minjun.kim@example.com",
    headline: "풀스택 개발자 · 7년 경력",
    specialty: "React, Node.js, TypeScript",
    isPublic: true,
    reviewCount: 34,
    avgRating: 4.7,
    courseCount: 3,
  },
  {
    id: "u-inst-2",
    name: "이서연",
    email: "seoyeon.lee@example.com",
    headline: "데이터 엔지니어 · 전 카카오",
    specialty: "Python, SQL, 데이터 분석",
    isPublic: true,
    reviewCount: 21,
    avgRating: 4.5,
    courseCount: 2,
  },
  {
    id: "u-inst-3",
    name: "박지호",
    email: "jiho.park@example.com",
    headline: "AWS 공인 솔루션즈 아키텍트",
    specialty: "AWS, Docker, Kubernetes",
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
    headline: "풀스택 개발자 · 7년 경력",
    specialty: "React, Node.js, TypeScript",
    bio: "실무 중심의 강의를 통해 수강생들이 현업에서 바로 활용할 수 있는 기술을 전달합니다. 스타트업 CTO 경험을 바탕으로 실전 프로젝트 위주로 가르칩니다.",
    career: "2019–현재 스타트업 CTO\n2016–2019 네이버 소프트웨어 엔지니어\n2014–2016 카카오 프론트엔드 개발자",
    affiliatedCompany: "오픈이노베이션",
    websiteUrl: "https://minjun.dev",
    isPublic: true,
    updatedAt: "2025-03-01T09:00:00Z",
  },
  "u-inst-2": {
    userId: "u-inst-2",
    headline: "데이터 엔지니어 · 전 카카오",
    specialty: "Python, SQL, 데이터 분석",
    bio: "데이터로 비즈니스 문제를 해결하는 방법을 가르칩니다. 실제 기업 데이터 파이프라인 구축 경험을 바탕으로 실용적인 내용을 다룹니다.",
    career: "2020–현재 프리랜서 데이터 컨설턴트\n2017–2020 카카오 데이터 엔지니어",
    websiteUrl: "https://seoyeon-data.io",
    isPublic: true,
    updatedAt: "2025-02-15T14:00:00Z",
  },
  "u-inst-3": {
    userId: "u-inst-3",
    headline: "AWS 공인 솔루션즈 아키텍트",
    specialty: "AWS, Docker, Kubernetes",
    bio: "클라우드 인프라 설계와 DevOps 실무를 가르칩니다. AWS 자격증 취득부터 실무 아키텍처 설계까지 단계적으로 안내합니다.",
    career: "2021–현재 클라우드 아키텍트 (프리랜서)\n2018–2021 삼성SDS 인프라 엔지니어",
    isPublic: false,
    updatedAt: "2025-01-20T11:00:00Z",
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
    { sessionId: "se1", sessionName: "2025-01기", courseTitle: "React 기초",     role: "PRIMARY",   enrolleeCount: 84, startDate: "2025-01-06", endDate: "2025-02-28" },
    { sessionId: "se2", sessionName: "2025-02기", courseTitle: "React 기초",     role: "PRIMARY",   enrolleeCount: 76, startDate: "2025-03-03" },
    { sessionId: "se5", sessionName: "2025-01기", courseTitle: "Next.js 마스터", role: "PRIMARY",   enrolleeCount: 51, startDate: "2025-02-10" },
  ],
  "u-inst-2": [
    { sessionId: "se3", sessionName: "2025-01기", courseTitle: "Python 데이터 분석", role: "PRIMARY",   enrolleeCount: 62, startDate: "2025-01-13", endDate: "2025-03-07" },
    { sessionId: "se4", sessionName: "2025-01기", courseTitle: "SQL 마스터",         role: "ASSISTANT", enrolleeCount: 40, startDate: "2025-02-17" },
  ],
  "u-inst-3": [
    { sessionId: "se6", sessionName: "2025-01기", courseTitle: "AWS 클라우드 입문", role: "PRIMARY", enrolleeCount: 95, startDate: "2025-01-20" },
  ],
};

// ── InstructorReview ───────────────────────────────────────────────────

export const instructorReviews: Record<string, InstructorReview[]> = {
  "u-inst-1": [
    { id: "ir1", instructorId: "u-inst-1", courseId: "c1", learnerId: "u5", learnerName: "김지수", rating: 5, body: "설명이 정말 명확하고 실습 예제가 현업에 바로 쓸 수 있어요.", createdAt: "2025-03-10T10:00:00Z", visible: true },
    { id: "ir2", instructorId: "u-inst-1", courseId: "c3", learnerId: "u6", learnerName: "박현우", rating: 5, body: "질문에 항상 친절하게 답해주셔서 좋았습니다.", createdAt: "2025-03-08T14:00:00Z", visible: true },
    { id: "ir3", instructorId: "u-inst-1", courseId: "c1", learnerId: "u7", learnerName: "이민아", rating: 4, body: "강의 속도가 조금 빠른 편이지만 내용은 탄탄합니다.", createdAt: "2025-02-28T09:00:00Z", visible: true },
    { id: "ir4", instructorId: "u-inst-1", courseId: "c1", learnerId: "u8", learnerName: "최준혁", rating: 5, body: "실무 예제가 많아서 바로 적용할 수 있어 좋아요.", createdAt: "2025-02-20T11:00:00Z", visible: false },
  ],
  "u-inst-2": [
    { id: "ir5", instructorId: "u-inst-2", courseId: "c6", learnerId: "u5", learnerName: "김지수", rating: 4, body: "데이터 분석 기초를 탄탄히 쌓을 수 있었습니다.", createdAt: "2025-03-05T15:00:00Z", visible: true },
    { id: "ir6", instructorId: "u-inst-2", courseId: "c7", learnerId: "u9", learnerName: "오서준", rating: 5, body: "SQL 개념을 정말 쉽게 설명해주셔서 이해가 잘 됐어요.", createdAt: "2025-02-25T10:00:00Z", visible: true },
    { id: "ir7", instructorId: "u-inst-2", courseId: "c6", learnerId: "u10", learnerName: "한가은", rating: 4, body: "실습 위주라서 좋았습니다.", createdAt: "2025-02-18T16:00:00Z", visible: true },
  ],
  "u-inst-3": [
    { id: "ir8", instructorId: "u-inst-3", courseId: "c4", learnerId: "u5", learnerName: "김지수", rating: 4, body: "AWS 개념을 단계적으로 설명해줘서 도움이 됐습니다.", createdAt: "2025-03-01T13:00:00Z", visible: true },
    { id: "ir9", instructorId: "u-inst-3", courseId: "c4", learnerId: "u6", learnerName: "박현우", rating: 4, body: "실습 환경 세팅이 조금 복잡했지만 강사분이 잘 도와주셨어요.", createdAt: "2025-02-22T09:30:00Z", visible: true },
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
