export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface Enrollment {
  id: string;
  learner: string;
  course: string;
  session: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
}

export const enrollments: Enrollment[] = [
  { id: "en1",  learner: "김민준", course: "React 기초",           session: "2025-03기", status: "ACTIVE",    progress: 45,  enrolledAt: "2025-03-14" },
  { id: "en2",  learner: "이서연", course: "TypeScript 심화",      session: "2025-03기", status: "ACTIVE",    progress: 30,  enrolledAt: "2025-03-13" },
  { id: "en3",  learner: "박지호", course: "Next.js 마스터",       session: "2025-02기", status: "COMPLETED", progress: 100, enrolledAt: "2025-02-20" },
  { id: "en4",  learner: "최유진", course: "AWS 클라우드 입문",    session: "2025-03기", status: "ACTIVE",    progress: 20,  enrolledAt: "2025-03-12" },
  { id: "en5",  learner: "정하은", course: "React 기초",           session: "2025-03기", status: "CANCELLED", progress: 10,  enrolledAt: "2025-03-10" },
  { id: "en6",  learner: "김민준", course: "AWS 클라우드 입문",    session: "2025-02기", status: "COMPLETED", progress: 100, enrolledAt: "2025-02-01" },
  { id: "en7",  learner: "이서연", course: "React 기초",           session: "2025-02기", status: "COMPLETED", progress: 100, enrolledAt: "2025-02-03" },
  { id: "en8",  learner: "최유진", course: "Next.js 마스터",       session: "2025-01기", status: "EXPIRED",   progress: 60,  enrolledAt: "2025-01-05" },
];
