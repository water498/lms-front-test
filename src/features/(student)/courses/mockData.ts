import type { CourseSubject, InstructorProfile, CourseReview, CourseSession } from "@/lib/models";

export interface CourseDetail {
  description: string;
  whatYouLearn: string[];
  requirements: string[];
  subjects: CourseSubject[];
  instructor: InstructorProfile;
  reviews: CourseReview[];
  sessions?: CourseSession[];
}

// ── Instructors ─────────────────────────────────────────────────────────────

const instructorKimHyunsu: InstructorProfile = {
  id: "inst-1",
  userId: "user-inst-1",
  headline: "안전보건 전문가 · 前 한국산업안전보건공단",
  bio: "20년 이상의 산업안전 실무 경험을 바탕으로 현장에 바로 적용 가능한 안전 교육을 제공합니다. 한국산업안전보건공단 재직 시 중소기업 안전컨설팅 100여 건을 수행했으며, 안전보건관리체계 구축 및 법규 해석 분야의 최고 전문가입니다.",
  profileImageUrl: undefined,
  expertise: ["안전보건관리체계", "법규해석", "안전문화", "중대재해처벌법", "안전경영"],
  affiliatedCompany: "안전경영연구소",
};

const instructorLeeJeongmin: InstructorProfile = {
  id: "inst-2",
  userId: "user-inst-2",
  headline: "건설안전기사 · 現장 안전관리 15년",
  bio: "건설 현장에서 15년간 안전관리자로 근무하며 실질적인 사고 예방 노하우를 전달합니다. 수강생이 현장에서 바로 활용할 수 있는 실습 중심 교육을 지향합니다. 롯데건설·GS건설 안전관리 수석 경력 보유.",
  profileImageUrl: undefined,
  expertise: ["현장안전", "핵심안전수칙", "사고예방", "보호구관리", "행동기반안전"],
  affiliatedCompany: undefined,
};

const instructorParkSunghun: InstructorProfile = {
  id: "inst-3",
  userId: "user-inst-3",
  headline: "산업안전지도사 · 위험성평가 전문",
  bio: "위험성 평가와 재해 통계 분석 전문가로서 데이터 기반의 안전관리 방법론을 가르칩니다. 중대재해처벌법 대응 컨설팅 경험 다수 보유. 리스크매니지먼트 컨설팅 대표로 현업 활동 중입니다.",
  profileImageUrl: undefined,
  expertise: ["위험관리", "재해통계", "리스크평가", "위험성평가", "안전지표분석"],
  affiliatedCompany: "리스크매니지먼트 컨설팅",
};

// ── Reviews ─────────────────────────────────────────────────────────────────

const reviewsHero1: CourseReview[] = [
  {
    id: "rv-1-1", courseId: "hero-1", userId: "u1", userName: "김태현",
    rating: 5, body: "법규 내용을 현장 사례와 연결해 설명해주셔서 이해하기 쉬웠습니다. 안전보건관리체계 구축에 실질적인 도움이 됐어요.",
    createdAt: "2026-03-01", visible: true,
  },
  {
    id: "rv-1-2", courseId: "hero-1", userId: "u2", userName: "박수민",
    rating: 5, body: "중대재해처벌법 관련 내용을 이렇게 체계적으로 정리한 강의는 처음입니다. 관리자로서 꼭 들어야 할 과정입니다.",
    createdAt: "2026-02-18", visible: true,
  },
  {
    id: "rv-1-3", courseId: "hero-1", userId: "u3", userName: "이재원",
    rating: 4, body: "전반적으로 훌륭합니다. 다만 후반부 법규 파트는 내용이 방대해서 여러 번 복습이 필요했어요. 전체적으로 만족스럽습니다.",
    createdAt: "2026-02-05", visible: true,
  },
  {
    id: "rv-1-4", courseId: "hero-1", userId: "u4", userName: "최지은",
    rating: 5, body: "이 가격에 이 퀄리티면 무조건 들어야 합니다. 현장 사례부터 법적 의무까지 전 과정을 커버하는 강의는 드뭅니다.",
    createdAt: "2026-01-20", visible: true,
  },
];

const reviewsIp2: CourseReview[] = [
  {
    id: "rv-2-1", courseId: "ip-2", userId: "u5", userName: "정민서",
    rating: 5, body: "현장에서 바로 쓸 수 있는 안전수칙을 체계적으로 정리해준 최고의 강의입니다. 강사님 현장 경험이 느껴져요.",
    createdAt: "2026-03-10", visible: true,
  },
  {
    id: "rv-2-2", courseId: "ip-2", userId: "u6", userName: "한유빈",
    rating: 5, body: "사고 예방 원리부터 실제 적용까지 실습 위주로 배울 수 있어서 좋았어요. 현장관리자에게 강력 추천합니다.",
    createdAt: "2026-02-25", visible: true,
  },
  {
    id: "rv-2-3", courseId: "ip-2", userId: "u7", userName: "오승준",
    rating: 4, body: "사례가 풍부하고 강사님 설명이 명확합니다. 현장 신입 직원에게 딱 맞는 난이도예요.",
    createdAt: "2026-02-12", visible: true,
  },
];

const reviewsIp3: CourseReview[] = [
  {
    id: "rv-3-1", courseId: "ip-3", userId: "u8", userName: "윤채원",
    rating: 5, body: "위험성 평가 방법을 단계적으로 설명해줘서 도움이 됐습니다. 실습 과제가 현장 상황과 유사해서 실질적으로 유용했어요.",
    createdAt: "2026-03-05", visible: true,
  },
  {
    id: "rv-3-2", courseId: "ip-3", userId: "u9", userName: "신동현",
    rating: 5, body: "재해 통계 분석 방법을 체계적으로 배울 수 있었습니다. 데이터 기반 안전관리에 관심 있는 분께 추천합니다.",
    createdAt: "2026-02-20", visible: true,
  },
  {
    id: "rv-3-3", courseId: "ip-3", userId: "u10", userName: "임소연",
    rating: 4, body: "개념 설명이 명확하고 실습이 충실합니다. 위험관리 이론을 탄탄히 다질 수 있어서 좋았습니다.",
    createdAt: "2026-01-30", visible: true,
  },
];

// ── Subjects (Curriculum) ───────────────────────────────────────────────────

const subjectsHero1: CourseSubject[] = [
  {
    id: "s1-1", courseId: "hero-1", title: "강의 소개 및 학습 방향", phase: "LEARNING", order: 1,
    activities: [
      { id: "a1-1-1", subjectId: "s1-1", title: "강의 소개 및 학습 로드맵", type: "VIDEO", videoDurationMin: 12, order: 1, isDeleted: false },
      { id: "a1-1-2", subjectId: "s1-1", title: "산업안전보건법 체계 개요", type: "VIDEO", videoDurationMin: 18, order: 2, isDeleted: false },
    ],
  },
  {
    id: "s1-2", courseId: "hero-1", title: "안전보건관리체계 기초", phase: "LEARNING", order: 2,
    activities: [
      { id: "a1-2-1", subjectId: "s1-2", title: "안전보건관리체계란? 핵심 개념과 구조", type: "VIDEO", videoDurationMin: 20, order: 1, isDeleted: false },
      { id: "a1-2-2", subjectId: "s1-2", title: "10대 필수 안전수칙 전체 개요", type: "VIDEO", videoDurationMin: 28, order: 2, isDeleted: false },
      { id: "a1-2-3", subjectId: "s1-2", title: "조직 내 안전 역할과 책임 분담", type: "VIDEO", videoDurationMin: 22, order: 3, isDeleted: false },
      { id: "a1-2-4", subjectId: "s1-2", title: "섹션 2 개념 확인 퀴즈", type: "QUIZ", questionCount: 10, order: 4, isDeleted: false },
    ],
  },
  {
    id: "s1-3", courseId: "hero-1", title: "핵심 안전수칙 실천", phase: "LEARNING", order: 3,
    activities: [
      { id: "a1-3-1", subjectId: "s1-3", title: "개인보호장구 착용 및 관리", type: "VIDEO", videoDurationMin: 25, order: 1, isDeleted: false },
      { id: "a1-3-2", subjectId: "s1-3", title: "위험구역 식별 및 통제 방법", type: "VIDEO", videoDurationMin: 30, order: 2, isDeleted: false },
      { id: "a1-3-3", subjectId: "s1-3", title: "작업 전 안전 점검(TBM) 운영법", type: "VIDEO", videoDurationMin: 20, order: 3, isDeleted: false },
      { id: "a1-3-4", subjectId: "s1-3", title: "안전수칙 현장 적용 과제", type: "ASSIGNMENT", questionCount: 2, order: 4, isDeleted: false },
    ],
  },
  {
    id: "s1-4", courseId: "hero-1", title: "중대재해처벌법 이해", phase: "LEARNING", order: 4,
    activities: [
      { id: "a1-4-1", subjectId: "s1-4", title: "중대재해처벌법 주요 의무사항", type: "VIDEO", videoDurationMin: 35, order: 1, isDeleted: false },
      { id: "a1-4-2", subjectId: "s1-4", title: "경영책임자 의무와 처벌 사례", type: "VIDEO", videoDurationMin: 30, order: 2, isDeleted: false },
      { id: "a1-4-3", subjectId: "s1-4", title: "법규 준수 체크리스트 활용", type: "SCORM", mediaAssetId: "ma7", order: 3, isDeleted: false },
      { id: "a1-4-4", subjectId: "s1-4", title: "법규 이해 평가", type: "QUIZ", questionCount: 8, order: 4, isDeleted: false },
    ],
  },
  {
    id: "s1-5", courseId: "hero-1", title: "안전문화 구축", phase: "LEARNING", order: 5,
    activities: [
      { id: "a1-5-1", subjectId: "s1-5", title: "안전문화 성숙도 진단", type: "VIDEO", videoDurationMin: 22, order: 1, isDeleted: false },
      { id: "a1-5-2", subjectId: "s1-5", title: "안전 리더십과 의사소통", type: "VIDEO", videoDurationMin: 28, order: 2, isDeleted: false },
      { id: "a1-5-3", subjectId: "s1-5", title: "안전문화 퀴즈", type: "QUIZ", questionCount: 6, order: 3, isDeleted: false },
    ],
  },
  {
    id: "s1-6", courseId: "hero-1", title: "안전보건관리체계 구축 실전", phase: "LEARNING", order: 6,
    activities: [
      { id: "a1-6-1", subjectId: "s1-6", title: "안전보건관리체계 구축 실전 사례", type: "VIDEO", videoDurationMin: 38, order: 1, isDeleted: false },
      { id: "a1-6-2", subjectId: "s1-6", title: "자사 안전보건관리체계 진단 및 개선", type: "VIDEO", videoDurationMin: 32, order: 2, isDeleted: false },
      { id: "a1-6-3", subjectId: "s1-6", title: "최종 체계 구축 과제", type: "ASSIGNMENT", questionCount: 1, order: 3, isDeleted: false },
    ],
  },
];

const subjectsIp2: CourseSubject[] = [
  {
    id: "s2-1", courseId: "ip-2", title: "안전수칙 기초 이해", phase: "LEARNING", order: 1,
    activities: [
      { id: "a2-1-1", subjectId: "s2-1", title: "핵심안전수칙이란 무엇인가", type: "VIDEO", videoDurationMin: 15, order: 1, isDeleted: false },
      { id: "a2-1-2", subjectId: "s2-1", title: "개인보호장구(PPE) 종류와 착용법", type: "VIDEO", videoDurationMin: 22, order: 2, isDeleted: false },
      { id: "a2-1-3", subjectId: "s2-1", title: "기초 안전수칙 퀴즈", type: "QUIZ", questionCount: 8, order: 3, isDeleted: false },
    ],
  },
  {
    id: "s2-2", courseId: "ip-2", title: "위험 유형별 수칙 적용", phase: "LEARNING", order: 2,
    activities: [
      { id: "a2-2-1", subjectId: "s2-2", title: "추락·전도 사고 예방 수칙", type: "VIDEO", videoDurationMin: 28, order: 1, isDeleted: false },
      { id: "a2-2-2", subjectId: "s2-2", title: "끼임·충돌 위험 통제 방법", type: "VIDEO", videoDurationMin: 24, order: 2, isDeleted: false },
      { id: "a2-2-3", subjectId: "s2-2", title: "위험 유형별 핵심 수칙 적용", type: "VIDEO", videoDurationMin: 30, order: 3, isDeleted: false },
    ],
  },
  {
    id: "s2-3", courseId: "ip-2", title: "현장 안전 실습 및 종합", phase: "LEARNING", order: 3,
    activities: [
      { id: "a2-3-1", subjectId: "s2-3", title: "작업 전 위험요인 발굴 실습", type: "VIDEO", videoDurationMin: 20, order: 1, isDeleted: false },
      { id: "a2-3-2", subjectId: "s2-3", title: "TBM(작업 전 회의) 운영 실습", type: "VIDEO", videoDurationMin: 25, order: 2, isDeleted: false },
      { id: "a2-3-3", subjectId: "s2-3", title: "현장 안전 점검 시뮬레이션", type: "SCORM", mediaAssetId: "ma8", order: 3, isDeleted: false },
      { id: "a2-3-4", subjectId: "s2-3", title: "현장 안전계획 수립 과제", type: "ASSIGNMENT", questionCount: 1, order: 4, isDeleted: false },
    ],
  },
];

const subjectsIp3: CourseSubject[] = [
  {
    id: "s3-1", courseId: "ip-3", title: "위험관리 기초", phase: "LEARNING", order: 1,
    activities: [
      { id: "a3-1-1", subjectId: "s3-1", title: "위험관리란? 핵심 개념과 용어", type: "VIDEO", videoDurationMin: 15, order: 1, isDeleted: false },
      { id: "a3-1-2", subjectId: "s3-1", title: "위험성 평가 5단계 프로세스", type: "VIDEO", videoDurationMin: 28, order: 2, isDeleted: false },
      { id: "a3-1-3", subjectId: "s3-1", title: "위험관리 기초 퀴즈", type: "QUIZ", questionCount: 10, order: 3, isDeleted: false },
    ],
  },
  {
    id: "s3-2", courseId: "ip-3", title: "위험성 평가 실무", phase: "LEARNING", order: 2,
    activities: [
      { id: "a3-2-1", subjectId: "s3-2", title: "체크리스트법·HAZOP 활용", type: "VIDEO", videoDurationMin: 32, order: 1, isDeleted: false },
      { id: "a3-2-2", subjectId: "s3-2", title: "위험도 산정 및 우선순위 결정", type: "VIDEO", videoDurationMin: 26, order: 2, isDeleted: false },
      { id: "a3-2-3", subjectId: "s3-2", title: "위험 감소 대책 수립", type: "VIDEO", videoDurationMin: 28, order: 3, isDeleted: false },
      { id: "a3-2-4", subjectId: "s3-2", title: "위험성 평가 실습 과제", type: "ASSIGNMENT", questionCount: 2, order: 4, isDeleted: false },
    ],
  },
  {
    id: "s3-3", courseId: "ip-3", title: "재해 통계 분석 & 사후 관리", phase: "LEARNING", order: 3,
    activities: [
      { id: "a3-3-1", subjectId: "s3-3", title: "재해 통계 지표 이해 (도수율, 강도율)", type: "VIDEO", videoDurationMin: 30, order: 1, isDeleted: false },
      { id: "a3-3-2", subjectId: "s3-3", title: "사고 원인 분석 기법 (FTA, 4M)", type: "VIDEO", videoDurationMin: 28, order: 2, isDeleted: false },
      { id: "a3-3-3", subjectId: "s3-3", title: "위험관리 종합 프로젝트", type: "ASSIGNMENT", questionCount: 1, order: 3, isDeleted: false },
    ],
  },
];

// ── CourseDetails ────────────────────────────────────────────────────────────

export const courseDetails: Record<string, CourseDetail> = {
  "hero-1": {
    description: "산업안전보건법의 핵심 요구사항부터 중대재해처벌법 대응까지, 안전보건관리체계 구축에 필요한 모든 것을 다룹니다. 10대 필수 안전수칙을 현장에 바로 적용할 수 있도록 실전 사례 중심으로 설계되었습니다.",
    whatYouLearn: [
      "안전보건관리체계 핵심 구성요소 이해 및 실무 적용",
      "10대 필수 안전수칙 체계적 습득 및 현장 실천",
      "중대재해처벌법 의무사항과 경영책임자 역할 이해",
      "안전보건 조직 체계 및 역할·책임 명확화",
      "작업 전 안전 점검(TBM) 운영법 습득",
      "자사 안전보건관리체계 진단 및 개선 계획 수립",
    ],
    requirements: [
      "현장 안전에 대한 기본적인 관심",
      "산업안전보건법에 대한 기초 지식 (선택)",
      "업무에서 안전관리 역할을 담당하고 있거나 담당 예정인 분",
    ],
    subjects: subjectsHero1,
    instructor: instructorKimHyunsu,
    reviews: reviewsHero1,
  },
  "ip-2": {
    description: "현장에서 매일 마주치는 위험에 대응하는 핵심 안전수칙을 실습 중심으로 학습합니다. 단순한 이론이 아닌 실제 현장 사례를 통해, 수강 즉시 적용 가능한 안전 역량을 키웁니다.",
    whatYouLearn: [
      "개인보호장구(PPE) 종류별 올바른 착용법과 관리 방법",
      "추락·전도·끼임 등 주요 재해 유형별 예방 수칙",
      "작업 전 위험요인 발굴 및 TBM 운영 방법",
      "위험 유형별 핵심 수칙의 현장 적용 실습",
      "현장 안전 점검 체크리스트 작성 및 활용",
      "동료와 함께하는 안전 행동 실천 방법",
    ],
    requirements: [
      "현장 근무 경험 또는 현장 출입 경험",
      "별도의 사전 지식 불필요 — 입문자 환영",
    ],
    subjects: subjectsIp2,
    instructor: instructorLeeJeongmin,
    reviews: reviewsIp2,
  },
  "ip-3": {
    description: "데이터 기반의 과학적 안전관리를 위한 위험성 평가 실무와 재해 통계 분석 방법론을 학습합니다. 현장 위험요인 도출부터 통계 지표 산출, 사고 원인 분석까지 종합적인 위험관리 역량을 갖출 수 있습니다.",
    whatYouLearn: [
      "위험성 평가 5단계 프로세스 이해 및 실전 적용",
      "체크리스트법, HAZOP 등 위험성 평가 기법 활용",
      "재해 통계 주요 지표(도수율, 강도율) 산출 및 해석",
      "FTA, 4M 등 사고 원인 분석 기법 습득",
      "위험 감소 대책 수립 및 우선순위 결정",
      "자사 위험관리 체계 진단 및 개선 방안 도출",
    ],
    requirements: [
      "현장 안전관리 업무 경험 또는 관련 업무 담당자",
      "기초 안전 이론 이해 (안전보건관리체계 과정 이수 권장)",
    ],
    subjects: subjectsIp3,
    instructor: instructorParkSunghun,
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
      id: "s-default-1", courseId: "default", title: "강의 소개", phase: "LEARNING", order: 1,
      activities: [
        { id: "a-default-1-1", subjectId: "s-default-1", title: "강의 오리엔테이션", type: "VIDEO", videoDurationMin: 10, order: 1, isDeleted: false },
      ],
    },
  ],
  instructor: instructorKimHyunsu,
  reviews: [],
};

// ── 과정별 차수 (B2B 수강 대상 필터 데모용) ──────────────────────────────────

export const sessionsByCourse: Record<string, CourseSession[]> = {
  "hero-1": [
    {
      id: "se-h1-1",
      courseId: "hero-1",
      name: "2026 2분기 — 현장관리팀 대상",
      type: "COHORT",
      cohortNumber: 3,
      startDate: "2026-04-07",
      endDate: "2026-05-30",
      capacity: 30,
      enrolled: 18,
      status: "OPEN",
      visible: true,
      forSale: false,
      instructors: [{ name: "김현수", role: "PRIMARY" }],
      completionThreshold: 80,
      targetAudience: {
        departments: ["team-field"],
        jobGrades: [],
        sites: ["site-seoul"],
      },
    },
    {
      id: "se-h1-2",
      courseId: "hero-1",
      name: "2026 2분기 — 전체 대상",
      type: "COHORT",
      cohortNumber: 4,
      startDate: "2026-04-14",
      endDate: "2026-06-06",
      capacity: 50,
      enrolled: 12,
      status: "OPEN",
      visible: true,
      forSale: false,
      instructors: [{ name: "김현수", role: "PRIMARY" }],
      completionThreshold: 80,
      targetAudience: undefined,
    },
  ],
  "hero-2": [
    {
      id: "se-h2-1",
      courseId: "hero-2",
      name: "2026 2분기",
      type: "COHORT",
      cohortNumber: 2,
      startDate: "2026-04-01",
      endDate: "2026-05-16",
      capacity: 40,
      enrolled: 35,
      status: "OPEN",
      visible: true,
      forSale: false,
      instructors: [{ name: "이정민", role: "PRIMARY" }],
      completionThreshold: 70,
      targetAudience: {
        departments: ["team-safety", "team-mgmt"],
        jobGrades: [],
        sites: [],
      },
    },
  ],
};
