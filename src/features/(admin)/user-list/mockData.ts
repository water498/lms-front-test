export type { UserRole, UserStatus, User } from "@/lib/models";
import type { User } from "@/lib/models";

const AUTH_DEFAULTS = { authProvider: "SSO" as const, emailVerified: true, failedLoginAttempts: 0, mfaEnabled: false, completedCourses: 0, mustChangePassword: false, marketingEmailAgreed: false, marketingSmsAgreed: false };
const B2C_DEFAULTS  = { authProvider: "LOCAL" as const, emailVerified: true, failedLoginAttempts: 0, mfaEnabled: false, completedCourses: 0, mustChangePassword: false, marketingEmailAgreed: true, marketingSmsAgreed: false };

export const users: User[] = [
  { id: "u2",  tenantId: "t1", name: "홍길동", email: "admin@acme.com",   roleId: "role-org-admin",  role: "ORG_ADMIN",  status: "ACTIVE",   enrolledCourses: 0, lastLoginAt: "2025-03-15", joinedAt: "2024-06-01", ...AUTH_DEFAULTS },
  { id: "u3",  tenantId: "t1", name: "이준혁", email: "lee@acme.com",     roleId: "role-instructor", role: "INSTRUCTOR", status: "ACTIVE",   enrolledCourses: 0, lastLoginAt: "2025-03-14", joinedAt: "2024-08-10", employeeId: "EMP-0003", ...AUTH_DEFAULTS },
  { id: "u4",  tenantId: "t1", name: "박소연", email: "park@acme.com",    roleId: "role-instructor", role: "INSTRUCTOR", status: "ACTIVE",   enrolledCourses: 0, lastLoginAt: "2025-03-13", joinedAt: "2024-09-01", employeeId: "EMP-0004", ...AUTH_DEFAULTS },
  { id: "u5",  tenantId: "t1", name: "김민준", email: "kim.mj@acme.com",  roleId: "role-learner",    role: "LEARNER",    status: "ACTIVE",   enrolledCourses: 3, lastLoginAt: "2025-03-14", joinedAt: "2025-01-10", employeeId: "EMP-0005", orgSiteId:"site-1", orgTeamId:"dept-2", orgPositionId:"grade-2", ...AUTH_DEFAULTS },
  { id: "u6",  tenantId: "t1", name: "이서연", email: "lee.sy@acme.com",  roleId: "role-learner",    role: "LEARNER",    status: "ACTIVE",   enrolledCourses: 2, lastLoginAt: "2025-03-13", joinedAt: "2025-01-15", employeeId: "EMP-0006", orgSiteId:"site-1", orgTeamId:"dept-7", orgPositionId:"grade-1", ...AUTH_DEFAULTS },
  { id: "u7",  tenantId: "t1", name: "박지호", email: "park.jh@acme.com", roleId: "role-learner",    role: "LEARNER",    status: "ACTIVE",   enrolledCourses: 1, lastLoginAt: "2025-03-10", joinedAt: "2025-02-01", employeeId: "EMP-0007", orgSiteId:"site-2", orgTeamId:"dept-2", orgPositionId:"grade-1", ...AUTH_DEFAULTS },
  { id: "u8",  tenantId: "t1", name: "최유진", email: "choi@acme.com",    roleId: "role-learner",    role: "LEARNER",    status: "ACTIVE",   enrolledCourses: 2, lastLoginAt: "2025-03-12", joinedAt: "2025-02-05", employeeId: "EMP-0008", orgSiteId:"site-1", orgTeamId:"dept-6", orgPositionId:"grade-3", ...AUTH_DEFAULTS },
  { id: "u9",  tenantId: "t1", name: "정하은", email: "jung@acme.com",    roleId: "role-learner",    role: "LEARNER",    status: "INACTIVE", enrolledCourses: 0, lastLoginAt: "2025-02-01", joinedAt: "2024-11-01", orgSiteId:"site-2", orgTeamId:"dept-6", orgPositionId:"grade-4", ...AUTH_DEFAULTS },
  { id: "u10", tenantId: "t1", name: "홍민재", email: "hong@acme.com",    roleId: "role-learner",    role: "LEARNER",    status: "INACTIVE", enrolledCourses: 0, lastLoginAt: undefined,    joinedAt: "-",          orgSiteId:"site-1", orgTeamId:"dept-2", orgPositionId:"grade-1", ...AUTH_DEFAULTS },
  // B2C — 이메일/비밀번호 로그인
  { id: "u11", tenantId: "t1", name: "오지현", email: "oh.jh@gmail.com",  roleId: "role-learner",    role: "LEARNER",    status: "ACTIVE",   enrolledCourses: 1, lastLoginAt: "2025-03-14", joinedAt: "2025-03-01", ...B2C_DEFAULTS },
  // B2C — 소셜(구글) 로그인
  { id: "u12", tenantId: "t1", name: "강현우", email: "kang.hw@gmail.com", roleId: "role-learner",   role: "LEARNER",    status: "ACTIVE",   enrolledCourses: 2, lastLoginAt: "2025-03-15", joinedAt: "2025-03-05", ...B2C_DEFAULTS, authProvider: "SOCIAL" as const, socialProvider: "GOOGLE" as const, socialProviderId: "google-uid-kang-001" },
];

export const userStats = {
  total: 11,
  active: 9,
  inactive: 2,
};
