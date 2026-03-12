// ── Types ──────────────────────────────────────────────────────────────────

export type Course = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  categoryLabel: string;
  thumbnail: string;        // CSS gradient string
  accentColor: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: "입문" | "초급" | "중급" | "고급";
  tags: string[];
  price: number;
  isNew: boolean;
  isBestseller: boolean;
};

export type EnrolledCourse = Course & {
  progress: number;
  lastAccessedAt: string;
  nextLessonTitle: string;
};

export type Category = { id: string; label: string };

export type Announcement = {
  id: string;
  type: "공지" | "이벤트" | "업데이트";
  title: string;
  date: string;
  isNew: boolean;
};

export type UserStats = {
  completedCourses: number;
  inProgressCourses: number;
  totalLearningMinutes: number;
  certificates: number;
};

// ── Hero ───────────────────────────────────────────────────────────────────

export const heroCourse: EnrolledCourse = {
  id: "hero-1",
  title: "실무 중심 AI·머신러닝 완성 과정",
  instructor: "김민준",
  category: "ai",
  categoryLabel: "AI/ML",
  thumbnail: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  accentColor: "#a78bfa",
  rating: 4.9,
  reviewCount: 3842,
  duration: "48시간 20분",
  level: "중급",
  tags: ["Python", "TensorFlow", "실무 프로젝트"],
  price: 89000,
  isNew: false,
  isBestseller: true,
  progress: 34,
  lastAccessedAt: "2026-03-11",
  nextLessonTitle: "7-3. 모델 성능 평가 지표 완전 정복",
};

// ── In-progress courses ────────────────────────────────────────────────────

export const inProgressCourses: EnrolledCourse[] = [
  heroCourse,
  {
    id: "ip-2",
    title: "React + TypeScript 실전 프로젝트",
    instructor: "이서연",
    category: "frontend",
    categoryLabel: "프론트엔드",
    thumbnail: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    accentColor: "#38bdf8",
    rating: 4.8,
    reviewCount: 2100,
    duration: "22시간",
    level: "중급",
    tags: ["React", "TypeScript"],
    price: 69000,
    isNew: true,
    isBestseller: false,
    progress: 67,
    lastAccessedAt: "2026-03-09",
    nextLessonTitle: "11-2. Zustand 전역 상태 관리 패턴",
  },
  {
    id: "ip-3",
    title: "SQL 마스터: 데이터 분석 실무",
    instructor: "박지호",
    category: "data",
    categoryLabel: "데이터",
    thumbnail: "linear-gradient(135deg, #134e5e, #71b280)",
    accentColor: "#4ade80",
    rating: 4.7,
    reviewCount: 1580,
    duration: "18시간",
    level: "초급",
    tags: ["SQL", "데이터 분석"],
    price: 49000,
    isNew: false,
    isBestseller: true,
    progress: 12,
    lastAccessedAt: "2026-03-05",
    nextLessonTitle: "3-1. JOIN 완전 이해",
  },
];

// ── Recommended courses ────────────────────────────────────────────────────

export const recommendedCourses: Course[] = [
  {
    id: "r-1",
    title: "Next.js 14 풀스택 개발 완성",
    instructor: "최유진",
    category: "frontend",
    categoryLabel: "프론트엔드",
    thumbnail: "linear-gradient(135deg, #1a1a2e, #16213e)",
    accentColor: "#818cf8",
    rating: 4.9,
    reviewCount: 2840,
    duration: "30시간",
    level: "중급",
    tags: ["Next.js", "Prisma", "tRPC"],
    price: 79000,
    isNew: true,
    isBestseller: true,
  },
  {
    id: "r-2",
    title: "Node.js 백엔드 완성 과정",
    instructor: "강현우",
    category: "backend",
    categoryLabel: "백엔드",
    thumbnail: "linear-gradient(135deg, #0d1117, #21262d)",
    accentColor: "#4ade80",
    rating: 4.8,
    reviewCount: 1920,
    duration: "35시간",
    level: "중급",
    tags: ["Node.js", "Express", "MongoDB"],
    price: 75000,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "r-3",
    title: "UX 디자인: 기초부터 실무까지",
    instructor: "한소희",
    category: "design",
    categoryLabel: "디자인",
    thumbnail: "linear-gradient(135deg, #4a0080, #7b2ff7)",
    accentColor: "#e879f9",
    rating: 4.7,
    reviewCount: 1340,
    duration: "20시간",
    level: "초급",
    tags: ["Figma", "UX", "프로토타입"],
    price: 59000,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "r-4",
    title: "Docker & Kubernetes 실전",
    instructor: "임도현",
    category: "devops",
    categoryLabel: "DevOps",
    thumbnail: "linear-gradient(135deg, #003049, #0077b6)",
    accentColor: "#38bdf8",
    rating: 4.8,
    reviewCount: 987,
    duration: "28시간",
    level: "고급",
    tags: ["Docker", "K8s", "CI/CD"],
    price: 89000,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "r-5",
    title: "iOS 앱 개발: Swift 완성",
    instructor: "오민아",
    category: "mobile",
    categoryLabel: "모바일",
    thumbnail: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
    accentColor: "#fb923c",
    rating: 4.6,
    reviewCount: 760,
    duration: "40시간",
    level: "초급",
    tags: ["Swift", "SwiftUI", "Xcode"],
    price: 89000,
    isNew: true,
    isBestseller: false,
  },
  {
    id: "r-6",
    title: "Spring Boot 백엔드 마스터",
    instructor: "정재민",
    category: "backend",
    categoryLabel: "백엔드",
    thumbnail: "linear-gradient(135deg, #1a3a2a, #2d7a4f)",
    accentColor: "#4ade80",
    rating: 4.7,
    reviewCount: 1560,
    duration: "45시간",
    level: "중급",
    tags: ["Java", "Spring Boot", "JPA"],
    price: 85000,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "r-7",
    title: "파이썬 데이터 분석 입문",
    instructor: "윤하늘",
    category: "data",
    categoryLabel: "데이터",
    thumbnail: "linear-gradient(135deg, #1e3a5f, #2563eb)",
    accentColor: "#60a5fa",
    rating: 4.8,
    reviewCount: 3200,
    duration: "16시간",
    level: "입문",
    tags: ["Python", "Pandas", "Matplotlib"],
    price: 0,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "r-8",
    title: "AWS 클라우드 실무 자격증",
    instructor: "서준혁",
    category: "devops",
    categoryLabel: "DevOps",
    thumbnail: "linear-gradient(135deg, #1a0a00, #c75000)",
    accentColor: "#fb923c",
    rating: 4.9,
    reviewCount: 2100,
    duration: "32시간",
    level: "중급",
    tags: ["AWS", "SAA-C03", "클라우드"],
    price: 95000,
    isNew: false,
    isBestseller: true,
  },
];

// ── Popular courses ────────────────────────────────────────────────────────

export const popularCourses: Course[] = [
  {
    id: "p-1",
    title: "ChatGPT API 활용 서비스 개발",
    instructor: "김민준",
    category: "ai",
    categoryLabel: "AI/ML",
    thumbnail: "linear-gradient(135deg, #064e3b, #065f46)",
    accentColor: "#34d399",
    rating: 4.9,
    reviewCount: 4100,
    duration: "14시간",
    level: "초급",
    tags: ["OpenAI", "GPT-4", "LangChain"],
    price: 69000,
    isNew: true,
    isBestseller: true,
  },
  {
    id: "p-2",
    title: "Flutter 크로스 플랫폼 앱",
    instructor: "배지수",
    category: "mobile",
    categoryLabel: "모바일",
    thumbnail: "linear-gradient(135deg, #023e8a, #0077b6)",
    accentColor: "#38bdf8",
    rating: 4.7,
    reviewCount: 890,
    duration: "38시간",
    level: "초급",
    tags: ["Flutter", "Dart", "Firebase"],
    price: 79000,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "p-3",
    title: "게임 개발: Unity 입문",
    instructor: "신재원",
    category: "etc",
    categoryLabel: "기타",
    thumbnail: "linear-gradient(135deg, #18181b, #3f3f46)",
    accentColor: "#a1a1aa",
    rating: 4.6,
    reviewCount: 1230,
    duration: "50시간",
    level: "입문",
    tags: ["Unity", "C#", "게임 개발"],
    price: 89000,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "p-4",
    title: "사이버 보안 실무 과정",
    instructor: "문재현",
    category: "etc",
    categoryLabel: "기타",
    thumbnail: "linear-gradient(135deg, #1a0000, #7f1d1d)",
    accentColor: "#f87171",
    rating: 4.8,
    reviewCount: 740,
    duration: "42시간",
    level: "중급",
    tags: ["보안", "해킹 방어", "CTF"],
    price: 110000,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "p-5",
    title: "영상 편집: 프리미어 프로 완성",
    instructor: "장예린",
    category: "design",
    categoryLabel: "디자인",
    thumbnail: "linear-gradient(135deg, #1a0030, #6b21a8)",
    accentColor: "#c084fc",
    rating: 4.7,
    reviewCount: 1880,
    duration: "24시간",
    level: "초급",
    tags: ["Premiere Pro", "영상 편집", "유튜브"],
    price: 55000,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "p-6",
    title: "엑셀 VBA 업무 자동화",
    instructor: "조미래",
    category: "etc",
    categoryLabel: "기타",
    thumbnail: "linear-gradient(135deg, #14532d, #16a34a)",
    accentColor: "#4ade80",
    rating: 4.8,
    reviewCount: 2640,
    duration: "12시간",
    level: "초급",
    tags: ["Excel", "VBA", "업무 자동화"],
    price: 39000,
    isNew: false,
    isBestseller: true,
  },
];

// ── Categories ─────────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: "all",      label: "전체" },
  { id: "frontend", label: "프론트엔드" },
  { id: "backend",  label: "백엔드" },
  { id: "data",     label: "데이터" },
  { id: "ai",       label: "AI/ML" },
  { id: "mobile",   label: "모바일" },
  { id: "design",   label: "디자인" },
  { id: "devops",   label: "DevOps" },
];

// ── Courses by category ────────────────────────────────────────────────────

const allCourses = [...recommendedCourses, ...popularCourses];

export const coursesByCategory: Record<string, Course[]> = {
  all:      allCourses,
  frontend: allCourses.filter((c) => c.category === "frontend"),
  backend:  allCourses.filter((c) => c.category === "backend"),
  data:     allCourses.filter((c) => c.category === "data"),
  ai:       allCourses.filter((c) => c.category === "ai"),
  mobile:   allCourses.filter((c) => c.category === "mobile"),
  design:   allCourses.filter((c) => c.category === "design"),
  devops:   allCourses.filter((c) => c.category === "devops"),
};

// ── User stats ─────────────────────────────────────────────────────────────

export const userStats: UserStats = {
  completedCourses: 12,
  inProgressCourses: 3,
  totalLearningMinutes: 3240,
  certificates: 8,
};

// ── Announcements ──────────────────────────────────────────────────────────

export const announcements: Announcement[] = [
  { id: "a1", type: "이벤트",   title: "봄맞이 전 강의 30% 할인 — 3/31까지",           date: "2026-03-10", isNew: true },
  { id: "a2", type: "공지",     title: "수료증 발급 시스템 개선 안내",                  date: "2026-03-08", isNew: true },
  { id: "a3", type: "업데이트", title: "모바일 앱 v3.2 업데이트 — 오프라인 재생 지원", date: "2026-03-05", isNew: false },
  { id: "a4", type: "공지",     title: "[필독] 개인정보 처리방침 개정 안내",            date: "2026-02-28", isNew: false },
  { id: "a5", type: "이벤트",   title: "친구 초대 이벤트 — 수강권 증정",               date: "2026-02-20", isNew: false },
  { id: "a6", type: "공지",     title: "연휴 기간 CS 운영 시간 안내",                  date: "2026-01-25", isNew: false },
];
