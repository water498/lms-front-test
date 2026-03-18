export type { AnnouncementTarget, AnnouncementType, Announcement } from "@/lib/models";
import type { Announcement } from "@/lib/models";

export const announcements: Announcement[] = [
  { id: "an1", title: "2025년 3월 신규 과정 안내",            type: "ANNOUNCEMENT",  target: "ALL",    sentAt: "2025-03-01", views: 892 },
  { id: "an2", title: "React 기초 3월기 개강 알림",           type: "ANNOUNCEMENT",  target: "COURSE", targetCourse: "React 기초",        sentAt: "2025-03-05", views: 314 },
  { id: "an3", title: "시스템 점검 안내 (3/20 02:00-04:00)",  type: "SYSTEM_NOTICE", target: "ALL",    sentAt: "2025-03-14", views: 1204 },
  { id: "an4", title: "TypeScript 심화 과제 제출 마감 연장",   type: "ANNOUNCEMENT",  target: "COURSE", targetCourse: "TypeScript 심화",  sentAt: "2025-03-10", views: 198 },
  { id: "an5", title: "AWS 인증 시험 응시 혜택 안내",          type: "ANNOUNCEMENT",  target: "COURSE", targetCourse: "AWS 클라우드 입문", sentAt: "2025-03-08", views: 421 },
];
