// Assessment domain models — split from lib/models.ts

export type QuestionKind = "EXAM" | "SURVEY";
export type QuestionType = "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT";
export type SurveyQuestionType = "LIKERT" | "SINGLE" | "MULTIPLE" | "TEXT";

export interface QuestionGroup {
  id: string;
  title: string;
  kind: QuestionKind;
  type: QuestionType | SurveyQuestionType; // 그룹 고정 타입. 소속 문항은 반드시 이 타입이어야 함
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
  order: number;
}

export interface AssessmentSection {
  id: string;
  templateId: string; // 소속 템플릿 ID (ExamTemplate 또는 SurveyTemplate)
  templateKind: "EXAM" | "SURVEY";
  label: string;
  groupId: string; // 출제에 사용할 문항 그룹 ID
  count: number;
  shuffle: boolean;
  order: number;
}

export type ExamSubType = "SHORT" | "FINAL";

export interface ExamTemplate {
  id: string;
  title: string;
  subType: ExamSubType;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number | null; // null = 무제한
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
