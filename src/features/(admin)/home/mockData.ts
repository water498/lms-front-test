export const kpiStats = [
  { label: "총 수강생",      value: "1,284",  change: "+12%",  positive: true },
  { label: "활성 코스",      value: "38",     change: "+3",    positive: true },
  { label: "이번 달 수료율", value: "74.2%",  change: "-1.8%", positive: false },
  { label: "진행 중 수강",   value: "3,512",  change: "+204",  positive: true },
];

export const courseStatusCounts = {
  PUBLISHED: 28,
  DRAFT: 7,
  ARCHIVED: 3,
};

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface RecentEnrollment {
  id: string;
  learner: string;
  course: string;
  session: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export const recentEnrollments: RecentEnrollment[] = [
  { id: "e1", learner: "김민준", course: "React 기초",        session: "2025-03기",  status: "ACTIVE",    enrolledAt: "2025-03-14" },
  { id: "e2", learner: "이서연", course: "TypeScript 심화",   session: "2025-03기",  status: "ACTIVE",    enrolledAt: "2025-03-13" },
  { id: "e3", learner: "박지호", course: "Next.js 마스터",    session: "2025-02기",  status: "COMPLETED", enrolledAt: "2025-02-20" },
  { id: "e4", learner: "최유진", course: "AWS 클라우드 입문", session: "2025-03기",  status: "ACTIVE",    enrolledAt: "2025-03-12" },
  { id: "e5", learner: "정하은", course: "React 기초",        session: "2025-03기",  status: "CANCELLED", enrolledAt: "2025-03-10" },
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
