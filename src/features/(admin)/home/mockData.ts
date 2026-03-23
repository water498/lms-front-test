export const kpiStats = [
  { label: "총 수강생",      value: "1,284",  change: "+12%",  positive: true },
  { label: "활성 과정",      value: "38",     change: "+3",    positive: true },
  { label: "이번 달 수료율", value: "74.2%",  change: "-1.8%", positive: false },
  { label: "진행 중 수강",   value: "3,512",  change: "+204",  positive: true },
];

export const courseStatusCounts = {
  PUBLISHED: 28,
  DRAFT: 7,
  ARCHIVED: 3,
};

export type { EnrollmentStatus } from "@/lib/models";
import type { EnrollmentStatus } from "@/lib/models";

export interface RecentEnrollment {
  id: string;
  learnerId: string;
  courseId: string;
  courseSessionId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export const recentEnrollments: RecentEnrollment[] = [
  { id: "e1", learnerId: "u5",  courseId: "c1", courseSessionId: "se3", status: "ACTIVE",    enrolledAt: "2025-03-14" },
  { id: "e2", learnerId: "u6",  courseId: "c2", courseSessionId: "se7", status: "ACTIVE",    enrolledAt: "2025-03-13" },
  { id: "e3", learnerId: "u7",  courseId: "c3", courseSessionId: "se8", status: "COMPLETED", enrolledAt: "2025-02-20" },
  { id: "e4", learnerId: "u8",  courseId: "c4", courseSessionId: "se5", status: "ACTIVE",    enrolledAt: "2025-03-12" },
  { id: "e5", learnerId: "u9",  courseId: "c1", courseSessionId: "se3", status: "CANCELLED", enrolledAt: "2025-03-10" },
];

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
  type: "enroll" | "publish" | "cancel" | "invite";
}

export const activityFeed: ActivityItem[] = [
  { id: "a1", message: "관리자가 TypeScript 심화를 게시했습니다",      time: "10분 전",   type: "publish" },
  { id: "a2", message: "정하은이 React 기초 수강을 취소했습니다",       time: "34분 전",   type: "cancel" },
  { id: "a3", message: "최유진이 AWS 클라우드 입문에 수강 신청했습니다", time: "1시간 전",  type: "enroll" },
  { id: "a4", message: "관리자가 홍길동을 초대했습니다",                time: "2시간 전",  type: "invite" },
  { id: "a5", message: "이서연이 TypeScript 심화에 수강 신청했습니다",  time: "3시간 전",  type: "enroll" },
];
