import type { CourseSubject, InstructorProfile, CourseReview } from "@/lib/models";

export interface CourseDetail {
  description: string;
  whatYouLearn: string[];
  requirements: string[];
  subjects: CourseSubject[];
  instructor: InstructorProfile;
  reviews: CourseReview[];
}

// ── Instructors ─────────────────────────────────────────────────────────────

const instructorKimMinjun: InstructorProfile = {
  id: "inst-1",
  userId: "user-inst-1",
  type: "CREATOR",
  headline: "AI/ML 전문 강사 · 전 네이버 AI Lab",
  bio: "10년 이상의 머신러닝·딥러닝 실무 경험을 보유한 AI 전문가입니다. 네이버 AI Lab에서 추천 시스템과 자연어 처리 프로젝트를 리드했으며, 현재는 국내외 기업 대상 AI 교육과 컨설팅을 진행하고 있습니다. TensorFlow, PyTorch 공인 강사로 활동 중입니다.",
  profileImageUrl: undefined,
  expertise: ["Python", "TensorFlow", "PyTorch", "자연어 처리", "컴퓨터 비전", "MLOps"],
  affiliatedCompany: undefined,
};

const instructorLeeSeoyeon: InstructorProfile = {
  id: "inst-2",
  userId: "user-inst-2",
  type: "CREATOR",
  headline: "프론트엔드 아키텍트 · React 코어 컨트리뷰터",
  bio: "카카오, 토스를 거친 시니어 프론트엔드 개발자입니다. React 생태계와 TypeScript 기반 대규모 앱 아키텍처 설계 경험을 강의로 공유합니다. GitHub Star 프로젝트 다수 보유, 오픈소스 기여 활동 중입니다.",
  profileImageUrl: undefined,
  expertise: ["React", "TypeScript", "Next.js", "Zustand", "성능 최적화"],
  affiliatedCompany: undefined,
};

const instructorParkJiho: InstructorProfile = {
  id: "inst-3",
  userId: "user-inst-3",
  type: "CREATOR",
  headline: "데이터 엔지니어 · 전 삼성 SDS 빅데이터팀",
  bio: "삼성 SDS 빅데이터팀에서 대용량 데이터 파이프라인 설계·운영을 담당했습니다. 현재는 스타트업 CTO로 재직하며 데이터 분석 교육 콘텐츠를 제작하고 있습니다. SQL, Python, Spark를 활용한 실무 중심 강의로 누적 수강생 2만 명 이상을 배출했습니다.",
  profileImageUrl: undefined,
  expertise: ["SQL", "Python", "Spark", "데이터 엔지니어링", "PostgreSQL"],
  affiliatedCompany: undefined,
};

// ── Reviews ─────────────────────────────────────────────────────────────────

const reviewsHero1: CourseReview[] = [
  {
    id: "rv-1-1", courseId: "hero-1", userId: "u1", userName: "김태현",
    rating: 5, body: "실무에 바로 적용할 수 있는 내용들로 가득합니다. 특히 MLOps 파트가 압도적으로 좋았어요. 강사님이 현업 경험을 녹여 설명해주셔서 이해가 쏙쏙 됩니다.",
    createdAt: "2026-03-01", visible: true,
  },
  {
    id: "rv-1-2", courseId: "hero-1", userId: "u2", userName: "박수민",
    rating: 5, body: "파이썬 기초 정도만 알고 들었는데 커리큘럼이 단계적으로 잘 구성돼 있어 따라가기 수월했습니다. 프로젝트 실습이 특히 도움됐어요.",
    createdAt: "2026-02-18", visible: true,
  },
  {
    id: "rv-1-3", courseId: "hero-1", userId: "u3", userName: "이재원",
    rating: 4, body: "전반적으로 훌륭합니다. 다만 후반부 딥러닝 파트는 속도가 좀 빠른 편이라 복습이 필요했어요. 전체적으로 만족스럽습니다.",
    createdAt: "2026-02-05", visible: true,
  },
  {
    id: "rv-1-4", courseId: "hero-1", userId: "u4", userName: "최지은",
    rating: 5, body: "이 가격에 이 퀄리티면 무조건 들어야 합니다. 데이터 전처리부터 모델 배포까지 전 과정을 커버하는 강의는 드물어요.",
    createdAt: "2026-01-20", visible: true,
  },
];

const reviewsIp2: CourseReview[] = [
  {
    id: "rv-2-1", courseId: "ip-2", userId: "u5", userName: "정민서",
    rating: 5, body: "TypeScript와 React를 함께 다루는 강의 중 단연 최고입니다. 제네릭 타입 활용법을 이렇게 실용적으로 가르쳐주는 강의를 처음 봤어요.",
    createdAt: "2026-03-10", visible: true,
  },
  {
    id: "rv-2-2", courseId: "ip-2", userId: "u6", userName: "한유빈",
    rating: 5, body: "커스텀 훅 패턴, Zustand 상태 관리, 성능 최적화까지 실무에서 쓰는 모든 것을 배울 수 있었습니다. 강력 추천합니다.",
    createdAt: "2026-02-25", visible: true,
  },
  {
    id: "rv-2-3", courseId: "ip-2", userId: "u7", userName: "오승준",
    rating: 4, body: "코드 예제가 잘 구성되어 있고 강사님 설명이 명확합니다. 중급자에게 딱 맞는 난이도예요.",
    createdAt: "2026-02-12", visible: true,
  },
];

const reviewsIp3: CourseReview[] = [
  {
    id: "rv-3-1", courseId: "ip-3", userId: "u8", userName: "윤채원",
    rating: 5, body: "SQL을 처음 배우는 분들에게 최고의 입문 강의입니다. 복잡한 JOIN이나 서브쿼리도 쉽게 설명해주세요.",
    createdAt: "2026-03-05", visible: true,
  },
  {
    id: "rv-3-2", courseId: "ip-3", userId: "u9", userName: "신동현",
    rating: 5, body: "실무 데이터 분석에 바로 쓸 수 있는 예제들로 가득합니다. 윈도우 함수 파트가 특히 훌륭해요.",
    createdAt: "2026-02-20", visible: true,
  },
  {
    id: "rv-3-3", courseId: "ip-3", userId: "u10", userName: "임소연",
    rating: 4, body: "개념 설명이 명확하고 실습이 충실합니다. 약간 기초적인 부분이 많지만 탄탄히 다질 수 있어서 좋았습니다.",
    createdAt: "2026-01-30", visible: true,
  },
];

// ── Subjects (Curriculum) ───────────────────────────────────────────────────

const subjectsHero1: CourseSubject[] = [
  {
    id: "s1-1", title: "강의 소개 및 환경 설정", order: 1,
    activities: [
      { id: "a1-1-1", title: "강의 소개 및 학습 로드맵", type: "VIDEO", duration: 12 },
      { id: "a1-1-2", title: "개발 환경 설정 (Python, Jupyter, VS Code)", type: "VIDEO", duration: 18 },
    ],
  },
  {
    id: "s1-2", title: "머신러닝 기초", order: 2,
    activities: [
      { id: "a1-2-1", title: "머신러닝이란? 지도·비지도·강화학습 개요", type: "VIDEO", duration: 20 },
      { id: "a1-2-2", title: "데이터 전처리와 피처 엔지니어링", type: "VIDEO", duration: 35 },
      { id: "a1-2-3", title: "사이킷런으로 첫 분류 모델 만들기", type: "VIDEO", duration: 28 },
      { id: "a1-2-4", title: "섹션 2 개념 확인 퀴즈", type: "QUIZ", questionCount: 10 },
    ],
  },
  {
    id: "s1-3", title: "핵심 알고리즘 마스터", order: 3,
    activities: [
      { id: "a1-3-1", title: "선형·로지스틱 회귀 완전 정복", type: "VIDEO", duration: 32 },
      { id: "a1-3-2", title: "의사결정나무와 랜덤 포레스트", type: "VIDEO", duration: 30 },
      { id: "a1-3-3", title: "SVM과 앙상블 기법", type: "VIDEO", duration: 25 },
      { id: "a1-3-4", title: "모델 성능 평가 지표 완전 정복", type: "VIDEO", duration: 22 },
      { id: "a1-3-5", title: "알고리즘 선택 과제", type: "ASSIGNMENT", questionCount: 3 },
    ],
  },
  {
    id: "s1-4", title: "딥러닝 입문", order: 4,
    activities: [
      { id: "a1-4-1", title: "신경망 기초와 역전파 이해", type: "VIDEO", duration: 38 },
      { id: "a1-4-2", title: "TensorFlow/Keras로 첫 딥러닝 모델", type: "VIDEO", duration: 42 },
      { id: "a1-4-3", title: "CNN으로 이미지 분류하기", type: "VIDEO", duration: 45 },
      { id: "a1-4-4", title: "딥러닝 구현 과제", type: "ASSIGNMENT", questionCount: 2 },
    ],
  },
  {
    id: "s1-5", title: "자연어 처리 (NLP)", order: 5,
    activities: [
      { id: "a1-5-1", title: "텍스트 전처리와 임베딩", type: "VIDEO", duration: 28 },
      { id: "a1-5-2", title: "RNN, LSTM으로 시퀀스 모델링", type: "VIDEO", duration: 35 },
      { id: "a1-5-3", title: "트랜스포머와 BERT 활용", type: "VIDEO", duration: 40 },
      { id: "a1-5-4", title: "NLP 퀴즈", type: "QUIZ", questionCount: 8 },
    ],
  },
  {
    id: "s1-6", title: "MLOps & 모델 배포", order: 6,
    activities: [
      { id: "a1-6-1", title: "MLflow로 실험 관리하기", type: "VIDEO", duration: 30 },
      { id: "a1-6-2", title: "Docker & FastAPI로 모델 서빙", type: "VIDEO", duration: 38 },
      { id: "a1-6-3", title: "CI/CD 파이프라인 구축", type: "VIDEO", duration: 32 },
      { id: "a1-6-4", title: "최종 프로젝트 과제", type: "ASSIGNMENT", questionCount: 1 },
    ],
  },
];

const subjectsIp2: CourseSubject[] = [
  {
    id: "s2-1", title: "TypeScript 핵심 개념", order: 1,
    activities: [
      { id: "a2-1-1", title: "타입 시스템 완전 이해", type: "VIDEO", duration: 25 },
      { id: "a2-1-2", title: "제네릭과 유틸리티 타입 실전 활용", type: "VIDEO", duration: 30 },
      { id: "a2-1-3", title: "TypeScript 퀴즈", type: "QUIZ", questionCount: 8 },
    ],
  },
  {
    id: "s2-2", title: "React 심화", order: 2,
    activities: [
      { id: "a2-2-1", title: "커스텀 훅 설계 패턴", type: "VIDEO", duration: 28 },
      { id: "a2-2-2", title: "Context API vs Zustand 비교", type: "VIDEO", duration: 22 },
      { id: "a2-2-3", title: "Zustand 전역 상태 관리 패턴", type: "VIDEO", duration: 35 },
    ],
  },
  {
    id: "s2-3", title: "실전 프로젝트 구축", order: 3,
    activities: [
      { id: "a2-3-1", title: "프로젝트 아키텍처 설계", type: "VIDEO", duration: 20 },
      { id: "a2-3-2", title: "API 연동 및 에러 처리", type: "VIDEO", duration: 32 },
      { id: "a2-3-3", title: "성능 최적화 실전 (메모이제이션, 코드 스플리팅)", type: "VIDEO", duration: 40 },
      { id: "a2-3-4", title: "테스트 코드 작성 (Jest + RTL)", type: "VIDEO", duration: 35 },
      { id: "a2-3-5", title: "프로젝트 제출 과제", type: "ASSIGNMENT", questionCount: 1 },
    ],
  },
];

const subjectsIp3: CourseSubject[] = [
  {
    id: "s3-1", title: "SQL 기초", order: 1,
    activities: [
      { id: "a3-1-1", title: "데이터베이스와 SQL 소개", type: "VIDEO", duration: 15 },
      { id: "a3-1-2", title: "SELECT, WHERE, ORDER BY 완전 정복", type: "VIDEO", duration: 25 },
      { id: "a3-1-3", title: "기초 퀴즈", type: "QUIZ", questionCount: 10 },
    ],
  },
  {
    id: "s3-2", title: "JOIN & 집계 함수", order: 2,
    activities: [
      { id: "a3-2-1", title: "JOIN 완전 이해 (INNER, LEFT, RIGHT, FULL)", type: "VIDEO", duration: 35 },
      { id: "a3-2-2", title: "GROUP BY와 집계 함수 실전", type: "VIDEO", duration: 28 },
      { id: "a3-2-3", title: "서브쿼리와 CTE", type: "VIDEO", duration: 30 },
      { id: "a3-2-4", title: "JOIN 실습 과제", type: "ASSIGNMENT", questionCount: 3 },
    ],
  },
  {
    id: "s3-3", title: "고급 SQL & 분석 함수", order: 3,
    activities: [
      { id: "a3-3-1", title: "윈도우 함수 실전 (ROW_NUMBER, RANK, LAG/LEAD)", type: "VIDEO", duration: 38 },
      { id: "a3-3-2", title: "인덱스와 쿼리 최적화", type: "VIDEO", duration: 30 },
      { id: "a3-3-3", title: "실무 분석 프로젝트", type: "ASSIGNMENT", questionCount: 2 },
    ],
  },
];

// ── CourseDetails ────────────────────────────────────────────────────────────

export const courseDetails: Record<string, CourseDetail> = {
  "hero-1": {
    description: "머신러닝과 딥러닝의 핵심 이론부터 MLOps를 통한 실제 배포까지, 현업 AI 엔지니어가 되기 위한 모든 것을 다룹니다. Python 기초 지식만 있다면 누구나 시작할 수 있도록 커리큘럼이 설계되었습니다.",
    whatYouLearn: [
      "머신러닝 핵심 알고리즘 (회귀, 분류, 클러스터링) 완전 정복",
      "TensorFlow/Keras를 활용한 딥러닝 모델 구현",
      "CNN, RNN, Transformer 기반 자연어 처리",
      "MLflow를 이용한 실험 관리 및 모델 버전 관리",
      "Docker & FastAPI를 활용한 모델 서빙",
      "실무 수준의 AI 프로젝트 포트폴리오 완성",
    ],
    requirements: [
      "Python 기초 문법 (변수, 함수, 리스트, 딕셔너리)",
      "고등학교 수준의 통계·수학 (평균, 분산, 행렬 기초)",
      "개발 환경 설정 가능한 PC (Windows/Mac/Linux 모두 가능)",
    ],
    subjects: subjectsHero1,
    instructor: instructorKimMinjun,
    reviews: reviewsHero1,
  },
  "ip-2": {
    description: "React와 TypeScript를 함께 사용하는 실전 프로젝트 중심 강의입니다. 단순한 문법 설명을 넘어, 실제 서비스를 만들 때 마주치는 아키텍처 설계, 상태 관리, 성능 최적화 문제를 함께 해결합니다.",
    whatYouLearn: [
      "TypeScript 제네릭, 유틸리티 타입을 활용한 안전한 코드 작성",
      "커스텀 훅으로 비즈니스 로직 분리 및 재사용",
      "Zustand로 확장 가능한 전역 상태 설계",
      "코드 스플리팅·메모이제이션을 활용한 성능 최적화",
      "Jest + React Testing Library로 테스트 작성",
      "실무 수준의 React 프로젝트 아키텍처 설계",
    ],
    requirements: [
      "JavaScript 기초 (ES6+ 문법)",
      "React 기본 개념 (useState, useEffect, props)",
      "npm/yarn 패키지 매니저 사용 경험",
    ],
    subjects: subjectsIp2,
    instructor: instructorLeeSeoyeon,
    reviews: reviewsIp2,
  },
  "ip-3": {
    description: "데이터 분석 실무에서 매일 사용하는 SQL을 기초부터 고급까지 완전 정복하는 강의입니다. 이론 위주가 아닌 실제 비즈니스 데이터셋을 활용한 실습 중심으로 구성되어 있습니다.",
    whatYouLearn: [
      "SELECT, JOIN, GROUP BY 등 핵심 SQL 문법 완전 이해",
      "복잡한 다중 테이블 JOIN과 서브쿼리 작성",
      "CTE(Common Table Expression)로 가독성 높은 쿼리 작성",
      "ROW_NUMBER, RANK, LAG/LEAD 등 윈도우 함수 활용",
      "인덱스 원리를 이해하고 쿼리 성능 최적화",
      "실무 비즈니스 인사이트 추출 프로젝트",
    ],
    requirements: [
      "컴퓨터 기본 조작 능력",
      "엑셀 또는 스프레드시트 기본 사용 경험 (선택)",
    ],
    subjects: subjectsIp3,
    instructor: instructorParkJiho,
    reviews: reviewsIp3,
  },
};

// ── Fallback (for courses without detailed data) ─────────────────────────────

export const defaultCourseDetail: CourseDetail = {
  description: "강의 상세 정보를 준비 중입니다.",
  whatYouLearn: ["강의 내용을 확인하세요"],
  requirements: ["기본 학습 의지"],
  subjects: [
    {
      id: "s-default-1", title: "강의 소개", order: 1,
      activities: [
        { id: "a-default-1-1", title: "강의 오리엔테이션", type: "VIDEO", duration: 10 },
      ],
    },
  ],
  instructor: instructorKimMinjun,
  reviews: [],
};
