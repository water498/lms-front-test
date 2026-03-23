export type { EnrollmentStatus, Enrollment } from "@/lib/models";
import type { Enrollment } from "@/lib/models";

export const enrollments: Enrollment[] = [
  { id: "en1",  learnerId: "u5",  courseId: "c1", courseSessionId: "se3", status: "ACTIVE",    progress: 45,  enrolledAt: "2025-03-14", lastStudiedAt: "2025-03-16" },
  { id: "en2",  learnerId: "u6",  courseId: "c2", courseSessionId: "se7", status: "ACTIVE",    progress: 30,  enrolledAt: "2025-03-13", lastStudiedAt: "2025-03-15" },
  { id: "en3",  learnerId: "u7",  courseId: "c3", courseSessionId: "se8", status: "COMPLETED", progress: 100, enrolledAt: "2025-02-20", lastStudiedAt: "2025-03-10" },
  { id: "en4",  learnerId: "u8",  courseId: "c4", courseSessionId: "se5", status: "ACTIVE",    progress: 20,  enrolledAt: "2025-03-12", lastStudiedAt: "2025-03-14" },
  { id: "en5",  learnerId: "u9",  courseId: "c1", courseSessionId: "se3", status: "CANCELLED", progress: 10,  enrolledAt: "2025-03-10" },
  { id: "en6",  learnerId: "u5",  courseId: "c4", courseSessionId: "se4", status: "COMPLETED", progress: 100, enrolledAt: "2025-02-01", lastStudiedAt: "2025-02-28" },
  { id: "en7",  learnerId: "u6",  courseId: "c1", courseSessionId: "se2", status: "COMPLETED", progress: 100, enrolledAt: "2025-02-03", lastStudiedAt: "2025-02-27" },
  { id: "en8",  learnerId: "u8",  courseId: "c3", courseSessionId: "se8", status: "EXPIRED",   progress: 60,  enrolledAt: "2025-01-05", lastStudiedAt: "2025-01-20" },
  { id: "en9",  learnerId: "u10", courseId: "c1", courseSessionId: "se3", status: "ACTIVE",    progress: 0,   enrolledAt: "2025-03-15" },
  { id: "en10", learnerId: "u7",  courseId: "c2", courseSessionId: "se7", status: "ACTIVE",    progress: 0,   enrolledAt: "2025-03-16" },
  { id: "en11", learnerId: "u6",  courseId: "c4", courseSessionId: "se5", status: "ACTIVE",    progress: 75,  enrolledAt: "2025-03-11", lastStudiedAt: "2025-03-17" },
  { id: "en12", learnerId: "u9",  courseId: "c3", courseSessionId: "se8", status: "ACTIVE",    progress: 55,  enrolledAt: "2025-03-12", lastStudiedAt: "2025-03-13" },
];

export const learnerNames: Record<string, string> = {
  u5: "김민준", u6: "이서연", u7: "박지호", u8: "최유진", u9: "정하은", u10: "홍민재",
};

export const courseTitlesMap: Record<string, string> = {
  c1: "React 기초", c2: "TypeScript 심화", c3: "Next.js 마스터", c4: "AWS 클라우드 입문",
};

export const sessionNamesMap: Record<string, string> = {
  se2: "React 기초 2기", se3: "React 기초 3기", se4: "AWS 클라우드 2기", se5: "AWS 클라우드 4기",
  se7: "TypeScript 심화 1기", se8: "Next.js 마스터 1기",
};
