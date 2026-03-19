import { users } from "../mockData";
import type { UserEnrollment, ActivityLog } from "@/lib/models";

export { users };
export type { UserEnrollment, ActivityLog } from "@/lib/models";

export const userEnrollments: Record<string, UserEnrollment[]> = {
  u5: [
    { courseTitle: "React 기초",       session: "2025-01기", progress: 85, status: "IN_PROGRESS", hasCertificate: false },
    { courseTitle: "TypeScript 심화",  session: "2025-02기", progress: 100, status: "COMPLETED",  hasCertificate: true },
    { courseTitle: "Next.js 마스터",   session: "2025-01기", progress: 30,  status: "IN_PROGRESS", hasCertificate: false },
  ],
  u6: [
    { courseTitle: "CSS 레이아웃 심화", session: "2025-01기", progress: 100, status: "COMPLETED", hasCertificate: true },
    { courseTitle: "React 기초",        session: "2025-01기", progress: 60,  status: "IN_PROGRESS", hasCertificate: false },
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
