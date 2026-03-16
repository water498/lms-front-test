export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type CourseMode = "ONLINE" | "OFFLINE" | "BLENDED";

export interface CertConfig {
  templateId: string;
  completionRate: number; // 0~100
  requireExam: boolean;
  autoIssue: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  status: CourseStatus;
  mode: CourseMode;
  sessions: number;
  enrollees: number;
  createdAt: string;
  category: string;
  tags: string[];
  certConfig: CertConfig | null;
}

export const courses: Course[] = [
  { id: "c1", title: "React 기초",            instructor: "이준혁", status: "PUBLISHED", mode: "ONLINE",  sessions: 4, enrollees: 312, createdAt: "2024-12-01", category: "프론트엔드", tags: ["React", "JavaScript", "초급"],        certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  } },
  { id: "c2", title: "TypeScript 심화",        instructor: "박소연", status: "PUBLISHED", mode: "ONLINE",  sessions: 3, enrollees: 198, createdAt: "2025-01-10", category: "프론트엔드", tags: ["TypeScript", "중급"],                  certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  } },
  { id: "c3", title: "Next.js 마스터",         instructor: "이준혁", status: "PUBLISHED", mode: "ONLINE",  sessions: 5, enrollees: 254, createdAt: "2025-01-20", category: "프론트엔드", tags: ["Next.js", "React", "고급"],            certConfig: { templateId: "t1", completionRate: 90,  requireExam: false, autoIssue: true  } },
  { id: "c4", title: "AWS 클라우드 입문",       instructor: "김태호", status: "PUBLISHED", mode: "OFFLINE", sessions: 6, enrollees: 421, createdAt: "2025-02-05", category: "클라우드",   tags: ["AWS", "Cloud", "초급"],               certConfig: { templateId: "t2", completionRate: 100, requireExam: true,  autoIssue: false } },
  { id: "c5", title: "Docker & Kubernetes",   instructor: "최민서", status: "DRAFT",     mode: "ONLINE",  sessions: 2, enrollees: 0,   createdAt: "2025-03-01", category: "DevOps",     tags: ["Docker", "K8s", "중급"],              certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  } },
  { id: "c6", title: "Python 데이터 분석",      instructor: "정유진", status: "DRAFT",     mode: "ONLINE",  sessions: 0, enrollees: 0,   createdAt: "2025-03-10", category: "데이터",     tags: ["Python", "Pandas", "초급"],           certConfig: { templateId: "t1", completionRate: 60,  requireExam: false, autoIssue: true  } },
  { id: "c7", title: "SQL 마스터",             instructor: "박소연", status: "ARCHIVED",  mode: "ONLINE",  sessions: 3, enrollees: 88,  createdAt: "2024-08-15", category: "데이터",     tags: ["SQL", "DB", "중급"],                  certConfig: { templateId: "t2", completionRate: 100, requireExam: true,  autoIssue: false } },
  { id: "c8", title: "CSS 레이아웃 심화",       instructor: "김태호", status: "DRAFT",     mode: "BLENDED", sessions: 1, enrollees: 0,   createdAt: "2025-03-12", category: "프론트엔드", tags: ["CSS", "Flexbox", "Grid", "중급"],      certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  } },
];

export const instructors = ["이준혁", "박소연", "김태호", "최민서", "정유진"];
export const categories = ["프론트엔드", "백엔드", "클라우드", "데이터", "DevOps"];
