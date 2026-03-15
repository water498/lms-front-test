export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type CourseMode = "ONLINE" | "OFFLINE" | "BLENDED";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  status: CourseStatus;
  mode: CourseMode;
  sessions: number;
  enrollees: number;
  createdAt: string;
}

export const courses: Course[] = [
  { id: "c1", title: "React 기초",            instructor: "이준혁", status: "PUBLISHED", mode: "ONLINE",  sessions: 4, enrollees: 312, createdAt: "2024-12-01" },
  { id: "c2", title: "TypeScript 심화",        instructor: "박소연", status: "PUBLISHED", mode: "ONLINE",  sessions: 3, enrollees: 198, createdAt: "2025-01-10" },
  { id: "c3", title: "Next.js 마스터",         instructor: "이준혁", status: "PUBLISHED", mode: "ONLINE",  sessions: 5, enrollees: 254, createdAt: "2025-01-20" },
  { id: "c4", title: "AWS 클라우드 입문",       instructor: "김태호", status: "PUBLISHED", mode: "OFFLINE", sessions: 6, enrollees: 421, createdAt: "2025-02-05" },
  { id: "c5", title: "Docker & Kubernetes",   instructor: "최민서", status: "DRAFT",     mode: "ONLINE",  sessions: 2, enrollees: 0,   createdAt: "2025-03-01" },
  { id: "c6", title: "Python 데이터 분석",      instructor: "정유진", status: "DRAFT",     mode: "ONLINE",  sessions: 0, enrollees: 0,   createdAt: "2025-03-10" },
  { id: "c7", title: "SQL 마스터",             instructor: "박소연", status: "ARCHIVED",  mode: "ONLINE",  sessions: 3, enrollees: 88,  createdAt: "2024-08-15" },
  { id: "c8", title: "CSS 레이아웃 심화",       instructor: "김태호", status: "DRAFT",     mode: "BLENDED", sessions: 1, enrollees: 0,   createdAt: "2025-03-12" },
];

export const instructors = ["이준혁", "박소연", "김태호", "최민서", "정유진"];
export const categories = ["프론트엔드", "백엔드", "클라우드", "데이터", "DevOps"];
