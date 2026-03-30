import type { OrgAnnouncement } from "@/lib/models";
export type { OrgAnnouncement } from "@/lib/models";

export const announcements: OrgAnnouncement[] = [
  { id: "an1", tenantId: "t-001", subtype: "공지",   title: "2026년 2분기 안전 교육 과정 안내",                  targetType: "ALL_MEMBERS",     status: "PUBLISHED", sentAt: "2026-03-01", views: 892,  createdAt: "2026-02-28T10:00:00Z" },
  { id: "an2", tenantId: "t-001", subtype: "공지",   title: "핵심안전수칙 이해 4월기 개강 알림",                  targetType: "SPECIFIC_COURSE", targetCourseId: "c1", status: "PUBLISHED", sentAt: "2026-03-05", views: 314,  createdAt: "2026-03-04T10:00:00Z" },
  { id: "an3", tenantId: "t-001", subtype: "시스템", title: "시스템 점검 안내 (4/3 02:00-04:00)",               targetType: "ALL_MEMBERS",     status: "PUBLISHED", sentAt: "2026-03-14", views: 1204, createdAt: "2026-03-13T10:00:00Z" },
  { id: "an4", tenantId: "t-001", subtype: "공지",   title: "안전보건관리체계 과정 과제 제출 마감 연장 안내",       targetType: "SPECIFIC_COURSE", targetCourseId: "c2", status: "PUBLISHED", sentAt: "2026-03-10", views: 198,  createdAt: "2026-03-09T10:00:00Z" },
  { id: "an5", tenantId: "t-001", subtype: "공지",   title: "위험관리실무 오프라인 과정 사전 준비물 안내",          targetType: "SPECIFIC_COURSE", targetCourseId: "c4", status: "PUBLISHED", sentAt: "2026-03-08", views: 421,  createdAt: "2026-03-07T10:00:00Z" },
];
