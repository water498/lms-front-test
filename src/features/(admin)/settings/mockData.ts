export const orgSettings = {
  name: "ACME Corp",
  description: "기업 교육 플랫폼 — ACME Corporation 임직원 대상 LMS",
  contactEmail: "lms-admin@acme.com",
  language: "ko",
  brandColor: "#7C3AED",
  subdomain: "acme",
  logoUrl: null as string | null,
};

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  permission: "OWNER" | "ADMIN";
  invitedAt: string;
}

export const adminMembers: AdminMember[] = [
  { id: "m1", name: "관리자",  email: "admin@acme.com",  permission: "OWNER", invitedAt: "2024-10-01" },
  { id: "m2", name: "이준혁",  email: "lee@acme.com",    permission: "ADMIN", invitedAt: "2024-12-15" },
];
