export type {
  BankQuestionKind,
  QuestionType,
  SurveyQuestionType,
  BankQuestion,
  CompositionRule,
  ExamSubType,
  ExamTemplate,
  SubmissionType,
  RubricItem,
  AssignmentTemplate,
  SurveyTriggerType,
  SurveyTemplate,
} from "@/lib/models";
import type { BankQuestion, ExamTemplate, AssignmentTemplate, SurveyTemplate } from "@/lib/models";

// ── Mock: 문항 뱅크 ──────────────────────────
export const bankQuestions: BankQuestion[] = [
  // EXAM — 직장내괴롭힘
  {
    id: "bq1", kind: "EXAM", type: "SINGLE",
    text: "직장 내 괴롭힘의 법적 정의에 해당하지 않는 것은?",
    options: [
      { id: "o1", text: "신체적 폭행", correct: false },
      { id: "o2", text: "업무 외 강요",  correct: false },
      { id: "o3", text: "정당한 업무 지시", correct: true },
      { id: "o4", text: "지속적 욕설", correct: false },
    ],
    tags: ["직장내괴롭힘", "법정의무"],
    createdAt: "2025-01-05",
  },
  {
    id: "bq2", kind: "EXAM", type: "TRUE_FALSE",
    text: "직장 내 괴롭힘은 사용자도 가해자가 될 수 있다.",
    options: [
      { id: "tf_t", text: "True", correct: true },
      { id: "tf_f", text: "False", correct: false },
    ],
    tags: ["직장내괴롭힘", "법정의무"],
    createdAt: "2025-01-06",
  },
  {
    id: "bq3", kind: "EXAM", type: "SHORT",
    text: "직장 내 괴롭힘 피해 발생 시 사용자의 의무 2가지를 서술하시오.",
    answer: "조사 실시 의무, 피해자 보호 조치 의무",
    tags: ["직장내괴롭힘", "법정의무", "사용자의무"],
    createdAt: "2025-01-07",
  },
  {
    id: "bq4", kind: "EXAM", type: "MULTIPLE",
    text: "직장 내 괴롭힘에 해당할 수 있는 행위를 모두 고르시오.",
    options: [
      { id: "o1", text: "반복적인 모욕적 발언", correct: true },
      { id: "o2", text: "업무 배제·고립", correct: true },
      { id: "o3", text: "성과 개선 피드백", correct: false },
      { id: "o4", text: "사적 심부름 강요", correct: true },
    ],
    tags: ["직장내괴롭힘", "법정의무"],
    createdAt: "2025-01-08",
  },
  // EXAM — 성희롱예방
  {
    id: "bq5", kind: "EXAM", type: "SINGLE",
    text: "직장 내 성희롱 예방교육의 법정 실시 주기는?",
    options: [
      { id: "o1", text: "6개월 1회 이상", correct: false },
      { id: "o2", text: "연 1회 이상", correct: true },
      { id: "o3", text: "2년 1회 이상", correct: false },
      { id: "o4", text: "입사 시 1회", correct: false },
    ],
    tags: ["성희롱예방", "법정의무"],
    createdAt: "2025-01-10",
  },
  {
    id: "bq6", kind: "EXAM", type: "TRUE_FALSE",
    text: "성희롱은 신체 접촉이 없어도 성립할 수 있다.",
    options: [
      { id: "tf_t", text: "True", correct: true },
      { id: "tf_f", text: "False", correct: false },
    ],
    tags: ["성희롱예방", "법정의무"],
    createdAt: "2025-01-11",
  },
  {
    id: "bq7", kind: "EXAM", type: "SHORT",
    text: "성희롱 피해자가 신고를 꺼리는 대표적인 이유를 2가지 이상 서술하시오.",
    answer: "2차 피해 우려, 직장 내 불이익 걱정",
    tags: ["성희롱예방", "법정의무"],
    createdAt: "2025-01-12",
  },
  // EXAM — 개인정보보호
  {
    id: "bq8", kind: "EXAM", type: "SINGLE",
    text: "개인정보 보호법에서 '민감정보'에 해당하지 않는 것은?",
    options: [
      { id: "o1", text: "건강정보", correct: false },
      { id: "o2", text: "종교", correct: false },
      { id: "o3", text: "직장 이메일 주소", correct: true },
      { id: "o4", text: "생체인식 정보", correct: false },
    ],
    tags: ["개인정보보호", "법정의무"],
    createdAt: "2025-01-15",
  },
  {
    id: "bq9", kind: "EXAM", type: "TRUE_FALSE",
    text: "개인정보 처리 목적이 달성된 후에도 보관할 수 있다.",
    options: [
      { id: "tf_t", text: "True", correct: false },
      { id: "tf_f", text: "False", correct: true },
    ],
    tags: ["개인정보보호", "법정의무"],
    createdAt: "2025-01-16",
  },
  // SURVEY — 만족도
  {
    id: "bq10", kind: "SURVEY", type: "LIKERT",
    text: "전반적인 강의 만족도는 어떠셨나요?",
    scale: 5,
    tags: ["만족도", "강의평가"],
    createdAt: "2025-02-01",
  },
  {
    id: "bq11", kind: "SURVEY", type: "LIKERT",
    text: "강의 난이도가 적절했나요?",
    scale: 5,
    tags: ["만족도", "강의평가"],
    createdAt: "2025-02-01",
  },
  {
    id: "bq12", kind: "SURVEY", type: "TEXT",
    text: "개선이 필요한 점이 있다면 자유롭게 작성해 주세요.",
    tags: ["만족도", "개선의견"],
    createdAt: "2025-02-02",
  },
  {
    id: "bq13", kind: "SURVEY", type: "SINGLE",
    text: "이 과정을 동료에게 추천하시겠습니까?",
    options: [
      { id: "o1", text: "적극 추천" },
      { id: "o2", text: "추천" },
      { id: "o3", text: "보통" },
      { id: "o4", text: "비추천" },
    ],
    tags: ["만족도", "추천의향"],
    createdAt: "2025-02-03",
  },
  {
    id: "bq14", kind: "SURVEY", type: "MULTIPLE",
    text: "본 교육에서 가장 유익했던 부분을 모두 선택해 주세요.",
    options: [
      { id: "o1", text: "사례 중심 설명" },
      { id: "o2", text: "실습 과제" },
      { id: "o3", text: "퀴즈 및 자가점검" },
      { id: "o4", text: "강사 Q&A" },
    ],
    tags: ["만족도", "개선의견"],
    createdAt: "2025-02-04",
  },
];

// ── Mock: 시험 템플릿 ─────────────────────────
export const examTemplates: ExamTemplate[] = [
  {
    id: "ex1",
    title: "법정의무교육 종합 평가",
    subType: "FINAL",
    passingScore: 70,
    timeLimit: 30,
    maxAttempts: 1,
    usageCount: 3,
    createdAt: "2025-01-10",
    rules: [
      { id: "r1", label: "직장내괴롭힘 섹션", tagFilter: ["직장내괴롭힘"], count: 5, shuffle: true },
      { id: "r2", label: "성희롱예방 섹션",   tagFilter: ["성희롱예방"],   count: 3, shuffle: true },
      { id: "r3", label: "개인정보보호 섹션", tagFilter: ["개인정보보호"], count: 2, shuffle: false },
    ],
  },
  {
    id: "ex2",
    title: "TypeScript 타입 시험",
    subType: "SHORT",
    passingScore: 75,
    timeLimit: 15,
    maxAttempts: null,
    usageCount: 2,
    createdAt: "2025-01-15",
    rules: [],
  },
  {
    id: "ex3",
    title: "AWS 최종 평가",
    subType: "FINAL",
    passingScore: 80,
    timeLimit: 60,
    maxAttempts: 2,
    usageCount: 1,
    createdAt: "2025-02-01",
    rules: [],
  },
];

// ── Mock: 과제 템플릿 ─────────────────────────
export const assignmentTemplates: AssignmentTemplate[] = [
  {
    id: "as1",
    title: "React Todo 앱 구현",
    instructions: "useState, useEffect를 활용하여 Todo 앱을 구현하세요.\n항목 추가, 삭제, 완료 처리 기능이 포함되어야 합니다.",
    submissionType: "FILE",
    usageCount: 4,
    createdAt: "2025-01-12",
    rubric: [
      { id: "r1", criteria: "기능 구현 완성도", points: 50 },
      { id: "r2", criteria: "코드 품질 및 가독성", points: 30 },
      { id: "r3", criteria: "README 작성", points: 20 },
    ],
  },
  {
    id: "as2",
    title: "폼 제출 실습",
    instructions: "React Hook Form을 활용하여 회원가입 폼을 구현하세요.",
    submissionType: "BOTH",
    usageCount: 2,
    createdAt: "2025-02-05",
    rubric: [
      { id: "r4", criteria: "유효성 검사 구현", points: 60 },
      { id: "r5", criteria: "에러 메시지 UX", points: 40 },
    ],
  },
];

// ── Mock: 설문 템플릿 ─────────────────────────
export const surveyTemplates: SurveyTemplate[] = [
  {
    id: "sv1",
    title: "React 기초 만족도 조사",
    anonymous: true,
    triggerType: "COURSE_COMPLETE",
    responseCount: 98,
    status: "ACTIVE",
    createdAt: "2025-01-20",
    rules: [
      { id: "sr1", label: "만족도 문항", tagFilter: ["만족도"], count: 3, shuffle: false },
    ],
  },
  {
    id: "sv2",
    title: "TypeScript 강의 피드백",
    anonymous: false,
    triggerType: "MANUAL",
    responseCount: 67,
    status: "ACTIVE",
    createdAt: "2025-02-10",
    rules: [],
  },
  {
    id: "sv3",
    title: "AWS 과정 사후 평가",
    anonymous: true,
    triggerType: "COURSE_COMPLETE",
    responseCount: 210,
    status: "CLOSED",
    createdAt: "2025-03-01",
    rules: [],
  },
];
