// Assessment domain models — split from lib/models.ts

export type QuestionKind = "EXAM" | "SURVEY";
export type QuestionType = "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT";
export type SurveyQuestionType = "LIKERT" | "SINGLE" | "MULTIPLE" | "TEXT";

export interface QuestionGroup {
  id: string;
  title: string;
  kind: QuestionKind;
  // type 제거됨 — 그룹은 주제별 분류, 유형 혼재 허용. 유형 필터는 AssessmentSection.typeFilter에서 처리
  description?: string;
  isArchived: boolean;
  questionCount?: number; // 소속 문항 수 (캐시)
  createdAt: string;
}

export interface Question {
  id: string;
  kind: QuestionKind;
  type: QuestionType | SurveyQuestionType;
  groupId?: string;        // 소속 문항 그룹. undefined = 미배정
  text: string;
  options?: QuestionOption[];
  answer?: string; // SHORT 모범답안
  explanation?: string; // 해설
  likertScale?: number; // LIKERT 척도
  tags: string[];  // 검색 보조용. 출제 기준은 groupId 사용
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  correct?: boolean; // EXAM 전용. SURVEY는 undefined
  /** 보기별 해설. 왜 이 보기가 정답/오답인지. null이면 Question.explanation만 표시 */
  explanation?: string;
  order: number;
}

export interface AssessmentSection {
  id: string;
  templateId: string; // 소속 템플릿 ID (ExamTemplate 또는 SurveyTemplate)
  templateKind: "EXAM" | "SURVEY";
  label: string;
  groupId: string; // 출제에 사용할 문항 그룹 ID
  /** 출제 유형 필터. null이면 그룹 내 모든 유형에서 랜덤, 값 있으면 해당 유형만 */
  typeFilter?: QuestionType | SurveyQuestionType;
  count: number;
  shuffle: boolean;
  order: number;
}

export type ExamSubType = "SHORT" | "FINAL";
export type ExplanationPolicy = "IMMEDIATE" | "AFTER_CLOSE" | "AFTER_ALL_ATTEMPTS" | "HIDDEN";

export interface ExamTemplate {
  id: string;
  title: string;
  subType: ExamSubType;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number | null; // null = 무제한
  /** 해설 공개 정책. IMMEDIATE=즉시, AFTER_CLOSE=차수 종료 후, AFTER_ALL_ATTEMPTS=재시험 소진 후, HIDDEN=비공개 */
  explanationPolicy: ExplanationPolicy;
  usageCount: number;
  rules: AssessmentSection[]; // [UI convenience] AssessmentSection JOIN 결과
  isArchived?: boolean; // [UI-only] backend에 없음
  createdAt: string;
}

export type SubmissionType = "FILE" | "TEXT" | "BOTH";

export interface AssignmentRubricItem {
  id: string;
  criteria: string;
  points: number;
  order: number;
}

export interface AssignmentTemplate {
  id: string;
  title: string;
  instructions: string;
  submissionType: SubmissionType;
  passingScore?: number | null; // null이면 제출만으로 통과. 설정 시 grade >= passingScore 필요
  usageCount: number;
  rubric: AssignmentRubricItem[]; // [UI convenience] RubricItem JOIN 결과
  isArchived?: boolean; // [UI-only] backend에 없음
  createdAt: string;
}

export type SurveyTriggerType = "MANUAL" | "COURSE_COMPLETE";

export interface SurveyTemplate {
  id: string;
  title: string;
  anonymous: boolean;
  triggerType: SurveyTriggerType;
  responseCount: number;
  status: "ACTIVE" | "CLOSED";
  rules: AssessmentSection[]; // [UI convenience] AssessmentSection JOIN 결과
  createdAt: string;
}

export interface SurveyAnswer {
  id: string;
  responseId: string; // FK → SurveyResponse
  questionId: string;
  value: string; // 옵션 ID 또는 텍스트 응답
}
