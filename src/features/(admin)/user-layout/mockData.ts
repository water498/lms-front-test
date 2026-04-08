import { users } from "../users/mockData";
import type {
  UserEnrollment,
  ActivityLog,
  UserSession,
  OrgTransfer,
  InstructorReview,
  InstructorBankAccount,
  InstructorRevenue,
} from "@/lib/models";

export { users };
export type { UserEnrollment, ActivityLog, UserSession, OrgTransfer } from "@/lib/models";

// ── 강사 담당 차수 ───────────────────────────────────────────────────────

export interface InstructorCourseAssignment {
  sessionId: string;
  sessionName: string;
  courseTitle: string;
  role: "PRIMARY" | "ASSISTANT";
  enrolleeCount: number;
  startDate: string;
  endDate?: string;
}

export const userEnrollments: Record<string, UserEnrollment[]> = {
  u5: [
    { courseTitle: "React 기초",       session: "2025-01기", progress: 85, status: "ACTIVE", hasCertificate: false },
    { courseTitle: "TypeScript 심화",  session: "2025-02기", progress: 100, status: "COMPLETED",  hasCertificate: true },
    { courseTitle: "Next.js 마스터",   session: "2025-01기", progress: 30,  status: "ACTIVE", hasCertificate: false },
  ],
  u6: [
    { courseTitle: "CSS 레이아웃 심화", session: "2025-01기", progress: 100, status: "COMPLETED", hasCertificate: true },
    { courseTitle: "React 기초",        session: "2025-01기", progress: 60,  status: "ACTIVE", hasCertificate: false },
  ],
};

export const userSessions: Record<string, UserSession[]> = {
  u5: [
    { id: "ses-u5-1", userId: "u5", tenantId: "t1", tokenHash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2", ip: "192.0.2.55",   userAgent: "Mozilla/5.0 (Android 14; Mobile) Chrome/122", deviceName: "Chrome / Android",  createdAt: "2025-03-14T09:20:00Z", expiresAt: "2025-04-13T09:20:00Z", lastUsedAt: "2025-03-15T08:30:00Z" },
    { id: "ses-u5-2", userId: "u5", tenantId: "t1", tokenHash: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3", ip: "192.0.2.20",   userAgent: "Mozilla/5.0 (Windows NT 10.0) Chrome/122",    deviceName: "Chrome / Windows",  createdAt: "2025-03-10T14:00:00Z", expiresAt: "2025-04-09T14:00:00Z", lastUsedAt: "2025-03-12T11:00:00Z", revokedAt: "2025-03-12T11:05:00Z", revokedReason: "NEW_LOGIN" },
  ],
  u6: [
    { id: "ses-u6-1", userId: "u6", tenantId: "t1", tokenHash: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4", ip: "10.0.0.22",    userAgent: "Mozilla/5.0 (Macintosh) Safari/17",           deviceName: "Safari / macOS",    createdAt: "2025-03-13T08:00:00Z", expiresAt: "2025-04-12T08:00:00Z", lastUsedAt: "2025-03-13T17:00:00Z" },
    { id: "ses-u6-2", userId: "u6", tenantId: "t1", tokenHash: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5", ip: "10.0.0.100",   userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17) Safari", deviceName: "Safari / iPhone",  createdAt: "2025-03-01T10:00:00Z", expiresAt: "2025-03-31T10:00:00Z", lastUsedAt: "2025-03-05T09:00:00Z", revokedAt: "2025-03-10T00:00:00Z", revokedReason: "EXPIRED" },
  ],
};

export const orgTransfers: Record<string, OrgTransfer[]> = {
  u5: [
    { id: "tr-u5-1", tenantId: "t1", userId: "u5", changedBy: "u2", changedAt: "2025-02-01T10:00:00Z", teamFrom: "dept-3", teamTo: "dept-2", positionFrom: "grade-1", positionTo: "grade-2", note: "팀 이동 및 직급 조정" },
  ],
  u6: [
    { id: "tr-u6-1", tenantId: "t1", userId: "u6", changedBy: "u2", changedAt: "2025-01-20T10:00:00Z", siteFrom: "site-2", siteTo: "site-1", teamFrom: "dept-5", teamTo: "dept-7" },
  ],
};

export const learningEvents: Record<string, ActivityLog[]> = {
  u5: [
    { id: "le1", learnerId: "u5", verb: "VIDEO_WATCHED",      objectType: "ACTIVITY", objectId: "a4",  objectTitle: "React 기초 > useState 기초",        result: { progress: 100, durationSec: 660 }, timestamp: "2025-03-14 09:15", courseId: "c1", sessionId: "se2" },
    { id: "le2", learnerId: "u5", verb: "VIDEO_WATCHED",      objectType: "ACTIVITY", objectId: "a7",  objectTitle: "React 기초 > useEffect 활용",       result: { progress: 100, durationSec: 580 }, timestamp: "2025-03-14 09:48", courseId: "c1", sessionId: "se2" },
    { id: "le3", learnerId: "u5", verb: "EXAM_SUBMITTED",     objectType: "EXAM",     objectId: "ex2", objectTitle: "TypeScript 심화 > 제네릭 퀴즈",     result: { score: 92, passed: true },          timestamp: "2025-03-13 14:22", courseId: "c2" },
    { id: "le4", learnerId: "u5", verb: "VIDEO_WATCHED",      objectType: "ACTIVITY", objectId: "a1",  objectTitle: "Next.js 마스터 > App Router 개요",  result: { progress: 100, durationSec: 490 }, timestamp: "2025-03-12 10:08" },
    { id: "le5", learnerId: "u5", verb: "CERTIFICATE_ISSUED", objectType: "COURSE",   objectId: "c2",  objectTitle: "TypeScript 심화",                   timestamp: "2025-03-10 16:30" },
  ],
};

// ── 강사 담당 차수 ───────────────────────────────────────────────────────

export const instructorCourses: Record<string, InstructorCourseAssignment[]> = {
  u3: [
    { sessionId: "se1", sessionName: "2026-01기", courseTitle: "안전보건관리체계와 10대 필수 안전수칙 이해", role: "PRIMARY",   enrolleeCount: 84, startDate: "2026-01-06", endDate: "2026-02-28" },
    { sessionId: "se2", sessionName: "2026-02기", courseTitle: "안전보건관리체계와 10대 필수 안전수칙 이해", role: "PRIMARY",   enrolleeCount: 76, startDate: "2026-03-03" },
    { sessionId: "se5", sessionName: "2026-01기", courseTitle: "안전문화 주도 및 경영 역량",               role: "PRIMARY",   enrolleeCount: 51, startDate: "2026-02-10" },
  ],
  u4: [
    { sessionId: "se3", sessionName: "2026-01기", courseTitle: "핵심안전수칙 이해",  role: "PRIMARY",   enrolleeCount: 62, startDate: "2026-01-13", endDate: "2026-03-07" },
    { sessionId: "se4", sessionName: "2026-01기", courseTitle: "사고 예방 기본 역량", role: "ASSISTANT", enrolleeCount: 40, startDate: "2026-02-17" },
  ],
};

// ── 강사 평가 ────────────────────────────────────────────────────────────

export const instructorReviews: Record<string, InstructorReview[]> = {
  u3: [
    { id: "ir1", instructorId: "u3", courseId: "c2", learnerId: "u5", learnerName: "김지수", rating: 5, body: "법규 내용을 현장 사례와 연결해 설명해주셔서 이해하기 쉬웠습니다.", createdAt: "2026-03-10T10:00:00Z", visible: true },
    { id: "ir2", instructorId: "u3", courseId: "c3", learnerId: "u6", learnerName: "박현우", rating: 5, body: "안전 경영 관점을 체계적으로 배울 수 있어서 관리자로서 큰 도움이 됐습니다.", createdAt: "2026-03-08T14:00:00Z", visible: true },
    { id: "ir3", instructorId: "u3", courseId: "c2", learnerId: "u7", learnerName: "이민아", rating: 4, body: "내용이 풍부하고 강사님 경험이 느껴지는 강의입니다.", createdAt: "2026-02-28T09:00:00Z", visible: true },
    { id: "ir4", instructorId: "u3", courseId: "c2", learnerId: "u8", learnerName: "최준혁", rating: 5, body: "실제 현장 적용 사례가 많아서 바로 활용할 수 있었어요.", createdAt: "2026-02-20T11:00:00Z", visible: false },
  ],
  u4: [
    { id: "ir5", instructorId: "u4", courseId: "c1", learnerId: "u5", learnerName: "김지수", rating: 4, body: "안전수칙을 체계적으로 정리할 수 있었습니다.", createdAt: "2026-03-05T15:00:00Z", visible: true },
    { id: "ir6", instructorId: "u4", courseId: "c5", learnerId: "u9", learnerName: "오서준", rating: 5, body: "사고 예방 원리를 실습 위주로 배울 수 있어서 좋았어요.", createdAt: "2026-02-25T10:00:00Z", visible: true },
    { id: "ir7", instructorId: "u4", courseId: "c1", learnerId: "u10", learnerName: "한가은", rating: 4, body: "현장 경험이 풍부한 강사님이라 신뢰가 갑니다.", createdAt: "2026-02-18T16:00:00Z", visible: true },
  ],
};

// ── 강사 계좌 ────────────────────────────────────────────────────────────

export const instructorBankAccounts: Record<string, InstructorBankAccount[]> = {
  u3: [
    { id: "ba1", instructorId: "u3", bankName: "카카오뱅크", accountNumber: "3333012345678", accountHolder: "이준혁", isPrimary: true, createdAt: "2025-01-05T09:00:00Z" },
  ],
  u4: [
    { id: "ba2", instructorId: "u4", bankName: "신한은행", accountNumber: "11012345678901", accountHolder: "박소연", isPrimary: true, createdAt: "2024-12-10T10:00:00Z" },
  ],
};

// ── 강사 정산 ────────────────────────────────────────────────────────────

export const instructorRevenues: Record<string, InstructorRevenue[]> = {
  u3: [
    { id: "p1", tenantId: "tenant-1", instructorId: "u3", revenueType: "COURSE_SALE", grossAmount: 2400000, commissionRate: 20, netAmount: 1920000, status: "PENDING",  periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p3", tenantId: "tenant-1", instructorId: "u3", revenueType: "COURSE_SALE", grossAmount: 2100000, commissionRate: 20, netAmount: 1680000, status: "PAID",     periodStart: "2025-02-01", periodEnd: "2025-02-28", paidAt: "2025-03-05", createdAt: "2025-03-01T00:00:00Z" },
  ],
  u4: [
    { id: "p2", tenantId: "tenant-1", instructorId: "u4", revenueType: "COURSE_SALE", grossAmount: 1800000, commissionRate: 20, netAmount: 1440000, status: "APPROVED", periodStart: "2025-03-01", periodEnd: "2025-03-31", createdAt: "2025-04-01T00:00:00Z" },
    { id: "p5", tenantId: "tenant-1", instructorId: "u4", revenueType: "COURSE_SALE", grossAmount: 1600000, commissionRate: 20, netAmount: 1280000, status: "PAID",     periodStart: "2025-02-01", periodEnd: "2025-02-28", paidAt: "2025-03-05", createdAt: "2025-03-01T00:00:00Z" },
  ],
};
