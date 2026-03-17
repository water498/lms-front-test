export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type CourseMode = "ONLINE" | "OFFLINE" | "BLENDED";

export interface CertConfig {
  templateId: string;
  completionRate: number; // 0~100
  requireExam: boolean;
  autoIssue: boolean;
}

export interface CancellationRule {
  daysBeforeStart: number; // N일 이상 전 취소
  refundPct: number;       // 0~100
}

export interface CancellationPolicy {
  rules: CancellationRule[];  // daysBeforeStart 내림차순 정렬
  noRefundAfterStart: boolean;
}

export const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
  rules: [
    { daysBeforeStart: 7, refundPct: 100 },
    { daysBeforeStart: 3, refundPct: 50 },
    { daysBeforeStart: 1, refundPct: 0 },
  ],
  noRefundAfterStart: true,
};

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
  description?: string;
  price?: number;               // B2C 판매가. undefined = 무료. B2B hide 예정.
  cancellationPolicy: CancellationPolicy;
}

export const courses: Course[] = [
  { id: "c1", title: "React 기초",            instructor: "이준혁", status: "PUBLISHED", mode: "ONLINE",  sessions: 4, enrollees: 312, createdAt: "2024-12-01", category: "프론트엔드", tags: ["React", "JavaScript", "초급"],        certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  }, description: "React의 핵심 개념부터 컴포넌트 설계까지 배우는 입문 과정입니다. JSX, 상태 관리, 이벤트 처리를 실습 중심으로 학습합니다.", price: 89000,  cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c2", title: "TypeScript 심화",        instructor: "박소연", status: "PUBLISHED", mode: "ONLINE",  sessions: 3, enrollees: 198, createdAt: "2025-01-10", category: "프론트엔드", tags: ["TypeScript", "중급"],                  certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  }, description: "타입 시스템을 깊이 이해하고 제네릭, 유틸리티 타입, 고급 패턴을 다룹니다. 중급 이상 개발자를 대상으로 합니다.", price: 109000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c3", title: "Next.js 마스터",         instructor: "이준혁", status: "PUBLISHED", mode: "ONLINE",  sessions: 5, enrollees: 254, createdAt: "2025-01-20", category: "프론트엔드", tags: ["Next.js", "React", "고급"],            certConfig: { templateId: "t1", completionRate: 90,  requireExam: false, autoIssue: true  }, description: "App Router 기반 Next.js 풀스택 개발. 서버 컴포넌트, 캐싱 전략, 배포까지 실무 수준으로 다룹니다.",               price: 149000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c4", title: "AWS 클라우드 입문",       instructor: "김태호", status: "PUBLISHED", mode: "OFFLINE", sessions: 6, enrollees: 421, createdAt: "2025-02-05", category: "클라우드",   tags: ["AWS", "Cloud", "초급"],               certConfig: { templateId: "t2", completionRate: 100, requireExam: true,  autoIssue: false }, description: "EC2, S3, RDS, IAM 등 핵심 서비스를 실습하며 클라우드 아키텍처의 기초를 다집니다.",                              price: 199000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c5", title: "Docker & Kubernetes",   instructor: "최민서", status: "DRAFT",     mode: "ONLINE",  sessions: 2, enrollees: 0,   createdAt: "2025-03-01", category: "DevOps",     tags: ["Docker", "K8s", "중급"],              certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  }, description: "컨테이너 기반 개발 환경 구성과 쿠버네티스 오케스트레이션 기초를 배웁니다.",                                       price: 129000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c6", title: "Python 데이터 분석",      instructor: "정유진", status: "DRAFT",     mode: "ONLINE",  sessions: 0, enrollees: 0,   createdAt: "2025-03-10", category: "데이터",     tags: ["Python", "Pandas", "초급"],           certConfig: { templateId: "t1", completionRate: 60,  requireExam: false, autoIssue: true  },                                                                                                                              cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c7", title: "SQL 마스터",             instructor: "박소연", status: "ARCHIVED",  mode: "ONLINE",  sessions: 3, enrollees: 88,  createdAt: "2024-08-15", category: "데이터",     tags: ["SQL", "DB", "중급"],                  certConfig: { templateId: "t2", completionRate: 100, requireExam: true,  autoIssue: false }, description: "관계형 DB 설계부터 복잡한 쿼리 최적화까지. 실무 데이터셋으로 실습합니다.",                                        price: 79000,  cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c8", title: "CSS 레이아웃 심화",       instructor: "김태호", status: "DRAFT",     mode: "BLENDED", sessions: 1, enrollees: 0,   createdAt: "2025-03-12", category: "프론트엔드", tags: ["CSS", "Flexbox", "Grid", "중급"],      certConfig: { templateId: "t1", completionRate: 80,  requireExam: false, autoIssue: true  },                                                                                                                              cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
];

export const instructors = ["이준혁", "박소연", "김태호", "최민서", "정유진"];
export const categories = ["프론트엔드", "백엔드", "클라우드", "데이터", "DevOps"];
