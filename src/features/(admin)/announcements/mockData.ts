import type { Announcement } from "@/lib/models";
export type { Announcement } from "@/lib/models";

export const announcements: Announcement[] = [
  { id: "an1", scope: "ORG", tenantId: "t-001", subtype: "공지",   title: "2025년 3월 신규 과정 안내",           targetType: "ALL_MEMBERS",     status: "PUBLISHED", sentAt: "2025-03-01", views: 892,  createdAt: "2025-02-28T10:00:00Z" },
  { id: "an2", scope: "ORG", tenantId: "t-001", subtype: "공지",   title: "React 기초 3월기 개강 알림",          targetType: "SPECIFIC_COURSE", targetCourseId: "course-react-basics",       status: "PUBLISHED", sentAt: "2025-03-05", views: 314,  createdAt: "2025-03-04T10:00:00Z" },
  { id: "an3", scope: "ORG", tenantId: "t-001", subtype: "시스템", title: "시스템 점검 안내 (3/20 02:00-04:00)", targetType: "ALL_MEMBERS",     status: "PUBLISHED", sentAt: "2025-03-14", views: 1204, createdAt: "2025-03-13T10:00:00Z" },
  { id: "an4", scope: "ORG", tenantId: "t-001", subtype: "공지",   title: "TypeScript 심화 과제 제출 마감 연장",  targetType: "SPECIFIC_COURSE", targetCourseId: "course-ts-advanced",        status: "PUBLISHED", sentAt: "2025-03-10", views: 198,  createdAt: "2025-03-09T10:00:00Z" },
  { id: "an5", scope: "ORG", tenantId: "t-001", subtype: "공지",   title: "AWS 인증 시험 응시 혜택 안내",         targetType: "SPECIFIC_COURSE", targetCourseId: "course-aws-intro",          status: "PUBLISHED", sentAt: "2025-03-08", views: 421,  createdAt: "2025-03-07T10:00:00Z" },
];
