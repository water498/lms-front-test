export type UserRole = "LEARNER" | "INSTRUCTOR" | "ORG_ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  enrolledCourses: number;
  lastLogin: string;
  joinedAt: string;
  employeeId?: string;    // 사번
  siteId?: string;        // Site.id
  departmentId?: string;  // DeptNode.id
  jobGradeId?: string;    // JobGrade.id
}

export const orgUsers: OrgUser[] = [
  { id: "u2",  name: "홍길동",      email: "admin@acme.com",    role: "ORG_ADMIN",   status: "ACTIVE",   enrolledCourses: 0, lastLogin: "2025-03-15", joinedAt: "2024-06-01" },
  { id: "u3",  name: "이준혁",      email: "lee@acme.com",      role: "INSTRUCTOR",  status: "ACTIVE",   enrolledCourses: 0, lastLogin: "2025-03-14", joinedAt: "2024-08-10", employeeId: "EMP-0003" },
  { id: "u4",  name: "박소연",      email: "park@acme.com",     role: "INSTRUCTOR",  status: "ACTIVE",   enrolledCourses: 0, lastLogin: "2025-03-13", joinedAt: "2024-09-01", employeeId: "EMP-0004" },
  { id: "u5",  name: "김민준",      email: "kim.mj@acme.com",   role: "LEARNER",     status: "ACTIVE",   enrolledCourses: 3, lastLogin: "2025-03-14", joinedAt: "2025-01-10", employeeId: "EMP-0005", siteId: "site-1", departmentId: "dept-2", jobGradeId: "grade-2" },
  { id: "u6",  name: "이서연",      email: "lee.sy@acme.com",   role: "LEARNER",     status: "ACTIVE",   enrolledCourses: 2, lastLogin: "2025-03-13", joinedAt: "2025-01-15", employeeId: "EMP-0006", siteId: "site-1", departmentId: "dept-7", jobGradeId: "grade-1" },
  { id: "u7",  name: "박지호",      email: "park.jh@acme.com",  role: "LEARNER",     status: "ACTIVE",   enrolledCourses: 1, lastLogin: "2025-03-10", joinedAt: "2025-02-01", employeeId: "EMP-0007", siteId: "site-2", departmentId: "dept-2", jobGradeId: "grade-1" },
  { id: "u8",  name: "최유진",      email: "choi@acme.com",     role: "LEARNER",     status: "ACTIVE",   enrolledCourses: 2, lastLogin: "2025-03-12", joinedAt: "2025-02-05", employeeId: "EMP-0008", siteId: "site-1", departmentId: "dept-6", jobGradeId: "grade-3" },
  { id: "u9",  name: "정하은",      email: "jung@acme.com",     role: "LEARNER",     status: "INACTIVE", enrolledCourses: 0, lastLogin: "2025-02-01", joinedAt: "2024-11-01", siteId: "site-2", departmentId: "dept-6", jobGradeId: "grade-4" },
  { id: "u10", name: "홍민재",      email: "hong@acme.com",     role: "LEARNER",     status: "INACTIVE", enrolledCourses: 0, lastLogin: "-",          joinedAt: "-",          siteId: "site-1", departmentId: "dept-2", jobGradeId: "grade-1" },
];

export const userStats = {
  total: 9,
  active: 7,
  inactive: 2,
};
