import { orgUsers } from "../mockData";

export { orgUsers };

export interface UserEnrollment {
  courseTitle: string;
  session: string;
  progress: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  hasCertificate: boolean;
}

export interface ActivityLog {
  date: string;
  action: string;
  detail: string;
}

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

export const activityLogs: Record<string, ActivityLog[]> = {
  u5: [
    { date: "2025-03-14 09:12", action: "로그인",        detail: "Chrome / macOS" },
    { date: "2025-03-14 09:15", action: "강의 시청",     detail: "React 기초 > useState 기초" },
    { date: "2025-03-14 09:48", action: "강의 시청",     detail: "React 기초 > useEffect 활용" },
    { date: "2025-03-13 14:22", action: "퀴즈 제출",     detail: "TypeScript 심화 > 제네릭 퀴즈 (92점)" },
    { date: "2025-03-12 10:05", action: "로그인",        detail: "Safari / iOS" },
    { date: "2025-03-12 10:08", action: "강의 시청",     detail: "Next.js 마스터 > App Router 개요" },
    { date: "2025-03-10 16:30", action: "수료증 발급",   detail: "TypeScript 심화 완료" },
  ],
};
