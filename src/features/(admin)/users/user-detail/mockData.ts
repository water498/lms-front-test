import { users } from "../mockData";
import type { UserEnrollment, ActivityLog, UserSession, OrgTransfer } from "@/lib/models";

export { users };
export type { UserEnrollment, ActivityLog, UserSession, OrgTransfer } from "@/lib/models";

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
