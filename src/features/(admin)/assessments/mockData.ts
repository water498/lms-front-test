export type {
  QuestionBankKind,
  QuestionType,
  SurveyQuestionType,
  QuestionPool,
  QuestionBank,
  QuestionCompositionRule,
  ExamSubType,
  ExamTemplate,
  SubmissionType,
  AssignmentRubricItem,
  AssignmentTemplate,
  SurveyTriggerType,
  SurveyTemplate,
} from "@/lib/models";
import type { QuestionPool, QuestionBank, ExamTemplate, AssignmentTemplate, SurveyTemplate } from "@/lib/models";

// ── Mock: 문항 그룹 ──────────────────────────
// EXAM 그룹 — 타입별로 분리하여 랜덤 출제 시 타입 일관성 보장
export const questionPools: QuestionPool[] = [
  // EXAM
  { id: "ep1", title: "안전 기초 — 단일 선택",   kind: "EXAM",   type: "SINGLE",     isArchived: false, questionCount: 3, createdAt: "2025-01-05" },
  { id: "ep2", title: "안전 기초 — O/X 판별",    kind: "EXAM",   type: "TRUE_FALSE",  isArchived: false, questionCount: 3, createdAt: "2025-01-05" },
  { id: "ep3", title: "안전 기초 — 복수 선택",   kind: "EXAM",   type: "MULTIPLE",    isArchived: false, questionCount: 1, createdAt: "2025-01-08" },
  { id: "ep4", title: "안전 기초 — 주관식 서술", kind: "EXAM",   type: "SHORT",       isArchived: false, questionCount: 2, createdAt: "2025-01-07" },
  // SURVEY
  { id: "sp1", title: "만족도 — 리커트 척도",    kind: "SURVEY", type: "LIKERT",      isArchived: false, questionCount: 2, createdAt: "2025-02-01" },
  { id: "sp2", title: "만족도 — 단일 선택",      kind: "SURVEY", type: "SINGLE",      isArchived: false, questionCount: 1, createdAt: "2025-02-03" },
  { id: "sp3", title: "만족도 — 복수 선택",      kind: "SURVEY", type: "MULTIPLE",    isArchived: false, questionCount: 1, createdAt: "2025-02-04" },
  { id: "sp4", title: "만족도 — 자유 서술",      kind: "SURVEY", type: "TEXT",        isArchived: false, questionCount: 1, createdAt: "2025-02-02" },
];

// ── Mock: 문항 뱅크 ──────────────────────────
export const bankQuestions: QuestionBank[] = [
  // EXAM — ep1 (SINGLE)
  {
    id: "bq1", kind: "EXAM", type: "SINGLE", poolId: "ep1",
    text: "산업안전보건법상 개인보호장구 착용 의무자에 해당하지 않는 것은?",
    options: [
      { id: "o1", text: "유해·위험작업 종사 근로자", correct: false, order: 1 },
      { id: "o2", text: "현장 방문 외부 방문객", correct: false, order: 2 },
      { id: "o3", text: "사무실 내 일반 사무 업무 직원", correct: true, order: 3 },
      { id: "o4", text: "작업지휘자", correct: false, order: 4 },
    ],
    tags: ["안전수칙", "보호구"],
    createdAt: "2025-01-05",
  },
  // EXAM — ep2 (TRUE_FALSE)
  {
    id: "bq2", kind: "EXAM", type: "TRUE_FALSE", poolId: "ep2",
    text: "작업 전 TBM(Tool Box Meeting)은 법적 의무 사항이다.",
    options: [
      { id: "tf_t", text: "True", correct: false, order: 1 },
      { id: "tf_f", text: "False", correct: true, order: 2 },
    ],
    tags: ["안전수칙", "TBM"],
    createdAt: "2025-01-06",
  },
  // EXAM — ep4 (SHORT)
  {
    id: "bq3", kind: "EXAM", type: "SHORT", poolId: "ep4",
    text: "개인보호장구를 착용하기 전 반드시 확인해야 할 사항 2가지를 서술하시오.",
    answer: "파손·결함 여부 확인, 작업 유형에 맞는 보호구 선정",
    tags: ["안전수칙", "보호구", "착용법"],
    createdAt: "2025-01-07",
  },
  // EXAM — ep3 (MULTIPLE)
  {
    id: "bq4", kind: "EXAM", type: "MULTIPLE", poolId: "ep3",
    text: "추락 재해 예방을 위한 조치로 올바른 것을 모두 고르시오.",
    options: [
      { id: "o1", text: "안전난간 설치", correct: true, order: 1 },
      { id: "o2", text: "안전대(안전벨트) 착용", correct: true, order: 2 },
      { id: "o3", text: "작업발판 폭 10cm 이상 확보", correct: false, order: 3 },
      { id: "o4", text: "개구부 덮개 설치 및 고정", correct: true, order: 4 },
    ],
    tags: ["안전수칙", "추락예방"],
    createdAt: "2025-01-08",
  },
  // EXAM — ep1 (SINGLE)
  {
    id: "bq5", kind: "EXAM", type: "SINGLE", poolId: "ep1",
    text: "위험성 평가에서 '위험성'을 구성하는 두 가지 요소는?",
    options: [
      { id: "o1", text: "빈도와 강도", correct: false, order: 1 },
      { id: "o2", text: "가능성(발생확률)과 중대성(피해정도)", correct: true, order: 2 },
      { id: "o3", text: "원인과 결과", correct: false, order: 3 },
      { id: "o4", text: "위험요인과 노출시간", correct: false, order: 4 },
    ],
    tags: ["위험성평가", "리스크관리"],
    createdAt: "2025-01-10",
  },
  // EXAM — ep2 (TRUE_FALSE)
  {
    id: "bq6", kind: "EXAM", type: "TRUE_FALSE", poolId: "ep2",
    text: "위험성 평가는 사업주의 의무이며, 근로자 참여 없이 진행할 수 있다.",
    options: [
      { id: "tf_t", text: "True", correct: false, order: 1 },
      { id: "tf_f", text: "False", correct: true, order: 2 },
    ],
    tags: ["위험성평가", "법규"],
    createdAt: "2025-01-11",
  },
  // EXAM — ep4 (SHORT)
  {
    id: "bq7", kind: "EXAM", type: "SHORT", poolId: "ep4",
    text: "위험성 평가 절차 5단계를 순서대로 서술하시오.",
    answer: "사전준비 → 유해·위험요인 파악 → 위험성 결정 → 위험성 감소대책 수립·실행 → 기록 및 공유",
    tags: ["위험성평가", "절차"],
    createdAt: "2025-01-12",
  },
  // EXAM — ep1 (SINGLE)
  {
    id: "bq8", kind: "EXAM", type: "SINGLE", poolId: "ep1",
    text: "중대재해처벌법에서 '중대산업재해'에 해당하지 않는 것은?",
    options: [
      { id: "o1", text: "사망자 1명 이상 발생", correct: false, order: 1 },
      { id: "o2", text: "6개월 이상 치료 필요 부상자 2명 이상", correct: false, order: 2 },
      { id: "o3", text: "경상자 5명 이상 동시 발생", correct: true, order: 3 },
      { id: "o4", text: "직업성 질병자 1년 내 3명 이상", correct: false, order: 4 },
    ],
    tags: ["중대재해처벌법", "법규"],
    createdAt: "2025-01-15",
  },
  // EXAM — ep2 (TRUE_FALSE)
  {
    id: "bq9", kind: "EXAM", type: "TRUE_FALSE", poolId: "ep2",
    text: "중대재해처벌법은 상시 근로자 5인 미만 사업장에도 동일하게 적용된다.",
    options: [
      { id: "tf_t", text: "True", correct: false, order: 1 },
      { id: "tf_f", text: "False", correct: true, order: 2 },
    ],
    tags: ["중대재해처벌법", "적용범위"],
    createdAt: "2025-01-16",
  },
  // SURVEY — sp1 (LIKERT)
  {
    id: "bq10", kind: "SURVEY", type: "LIKERT", poolId: "sp1",
    text: "전반적인 강의 만족도는 어떠셨나요?",
    scale: 5,
    tags: ["만족도", "강의평가"],
    createdAt: "2025-02-01",
  },
  {
    id: "bq11", kind: "SURVEY", type: "LIKERT", poolId: "sp1",
    text: "강의 내용이 현장 업무에 실질적으로 도움이 됐나요?",
    scale: 5,
    tags: ["만족도", "현장적용"],
    createdAt: "2025-02-01",
  },
  // SURVEY — sp4 (TEXT)
  {
    id: "bq12", kind: "SURVEY", type: "TEXT", poolId: "sp4",
    text: "개선이 필요한 점이 있다면 자유롭게 작성해 주세요.",
    tags: ["만족도", "개선의견"],
    createdAt: "2025-02-02",
  },
  // SURVEY — sp2 (SINGLE)
  {
    id: "bq13", kind: "SURVEY", type: "SINGLE", poolId: "sp2",
    text: "이 과정을 동료에게 추천하시겠습니까?",
    options: [
      { id: "o1", text: "적극 추천", order: 1 },
      { id: "o2", text: "추천", order: 2 },
      { id: "o3", text: "보통", order: 3 },
      { id: "o4", text: "비추천", order: 4 },
    ],
    tags: ["만족도", "추천의향"],
    createdAt: "2025-02-03",
  },
  // SURVEY — sp3 (MULTIPLE)
  {
    id: "bq14", kind: "SURVEY", type: "MULTIPLE", poolId: "sp3",
    text: "본 교육에서 가장 유익했던 부분을 모두 선택해 주세요.",
    options: [
      { id: "o1", text: "현장 사례 중심 설명", order: 1 },
      { id: "o2", text: "실습 과제", order: 2 },
      { id: "o3", text: "퀴즈 및 자가점검", order: 3 },
      { id: "o4", text: "강사 Q&A", order: 4 },
    ],
    tags: ["만족도", "개선의견"],
    createdAt: "2025-02-04",
  },
];

// ── Mock: 시험 템플릿 ─────────────────────────
export const examTemplates: ExamTemplate[] = [
  {
    id: "ex1",
    title: "안전보건 종합 평가",
    subType: "FINAL",
    passingScore: 70,
    timeLimit: 30,
    maxAttempts: 1,
    usageCount: 3,
    createdAt: "2025-01-10",
    rules: [
      { id: "r1", label: "단일 선택 섹션",  poolId: "ep1", count: 5, shuffle: true  },
      { id: "r2", label: "O/X 판별 섹션",   poolId: "ep2", count: 3, shuffle: true  },
      { id: "r3", label: "주관식 서술 섹션", poolId: "ep4", count: 2, shuffle: false },
    ],
  },
  {
    id: "ex2",
    title: "위험성 평가 실무 시험",
    subType: "SHORT",
    passingScore: 75,
    timeLimit: 20,
    maxAttempts: null,
    usageCount: 2,
    createdAt: "2025-01-15",
    rules: [],
  },
  {
    id: "ex3",
    title: "안전관리체계 최종 평가",
    subType: "FINAL",
    passingScore: 80,
    timeLimit: 60,
    maxAttempts: 2,
    usageCount: 1,
    createdAt: "2025-02-01",
    rules: [],
  },
  {
    id: "ex4",
    title: "구 버전 안전교육 시험 (보관됨)",
    subType: "SHORT",
    passingScore: 60,
    timeLimit: 15,
    maxAttempts: null,
    usageCount: 0,
    isArchived: true,
    createdAt: "2024-08-10",
    rules: [],
  },
];

// ── Mock: 과제 템플릿 ─────────────────────────
export const assignmentTemplates: AssignmentTemplate[] = [
  {
    id: "as1",
    title: "자사 안전보건관리체계 진단 보고서",
    instructions: "현재 재직 중인 사업장의 안전보건관리체계를 진단하고 개선 방안을 보고서로 작성하세요.\n① 현황 분석 ② 위험요인 도출 ③ 개선 과제 3가지 이상 포함.",
    submissionType: "FILE",
    usageCount: 4,
    createdAt: "2025-01-12",
    rubric: [
      { id: "r1", criteria: "현황 분석 완성도", points: 40, order: 1 },
      { id: "r2", criteria: "위험요인 식별 정확성", points: 30, order: 2 },
      { id: "r3", criteria: "개선 과제 실현 가능성", points: 30, order: 3 },
    ],
  },
  {
    id: "as2",
    title: "현장 위험성 평가 실습",
    instructions: "제시된 현장 사진 및 작업 시나리오를 바탕으로 위험성 평가 5단계를 수행하고 결과를 제출하세요.",
    submissionType: "BOTH",
    usageCount: 2,
    createdAt: "2025-02-05",
    rubric: [
      { id: "r4", criteria: "유해·위험요인 파악 완성도", points: 50, order: 1 },
      { id: "r5", criteria: "위험 감소 대책 적절성", points: 50, order: 2 },
    ],
  },
  {
    id: "as3",
    title: "구 버전 현장 보고서 과제 (보관됨)",
    instructions: "이전 양식의 현장 보고서 과제입니다. 현재 사용하지 않습니다.",
    submissionType: "FILE",
    usageCount: 0,
    isArchived: true,
    createdAt: "2024-06-01",
    rubric: [
      { id: "r6", criteria: "보고서 형식 준수", points: 50, order: 1 },
      { id: "r7", criteria: "내용 완성도", points: 50, order: 2 },
    ],
  },
];

// ── Mock: 설문 템플릿 ─────────────────────────
export const surveyTemplates: SurveyTemplate[] = [
  {
    id: "sv1",
    title: "안전교육 사후 만족도 조사",
    anonymous: true,
    triggerType: "COURSE_COMPLETE",
    responseCount: 98,
    status: "ACTIVE",
    createdAt: "2025-01-20",
    rules: [
      { id: "sr1", label: "만족도 리커트 문항", poolId: "sp1", count: 2, shuffle: false },
    ],
  },
  {
    id: "sv2",
    title: "위험성 평가 과정 사전 수요 조사",
    anonymous: false,
    triggerType: "MANUAL",
    responseCount: 67,
    status: "ACTIVE",
    createdAt: "2025-02-10",
    rules: [],
  },
  {
    id: "sv3",
    title: "안전보건관리체계 과정 사후 평가",
    anonymous: true,
    triggerType: "COURSE_COMPLETE",
    responseCount: 210,
    status: "CLOSED",
    createdAt: "2025-03-01",
    rules: [],
  },
];
