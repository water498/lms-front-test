// Progress & learning history models — split from lib/models.ts

// 액티비티별 완료 기록
export interface ActivityCompletion {
  id: string;
  learnerId: string;
  activityId: string;
  courseSessionId: string;
  completedAt: string;
  durationSec: number;
  // [UI-only]
  learnerName?: string;
  activityTitle?: string;
}

// 시험 응시 기록 (backend: assessment/exam/models/exam_attempt.py)
export interface ExamAttempt {
  id: string;
  learnerId: string;       // backend: learner_id
  examTemplateId: string;
  courseSessionId: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  durationSec?: number;
  // [UI-only]
  learnerName?: string;
  examTitle?: string;
}

// 시험 문항별 개별 답안 — 오답노트 (backend: assessment/exam/models/exam_answer.py)
export interface ExamAnswer {
  id: string;
  attemptId: string;       // FK → ExamAttempt. backend: exam_attempt_id
  questionId: string;
  selectedOptionIds?: string; // 콤마 구분 옵션 ID (선택형)
  textAnswer?: string;        // 주관식 답안 (SHORT)
  correct: boolean;
  score: number;
  // 주관식(SHORT) 수동 채점 필드
  gradedScore?: number;       // null이면 미채점
  gradedBy?: string;          // 채점자 User ID
  gradedAt?: string;
  gradeFeedback?: string;     // 문항별 피드백
}

// 과제 제출 기록 (backend: assessment/assignment/models/assignment_submission.py)
export interface AssignmentSubmission {
  id: string;
  learnerId: string;
  assignmentTemplateId: string;
  courseSessionId: string;
  submittedAt: string;
  fileUrl?: string;
  textContent?: string;
  grade?: number;          // null = 미채점
  passed?: boolean | null; // null=미채점, true=통과, false=미통과
  feedback?: string;
  gradedBy?: string;       // FK → User. SET NULL
  gradedAt?: string;
  // [UI-only]
  learnerName?: string;
}

// 설문 응답 기록 (backend: assessment/survey/models/survey_response.py)
export interface SurveyResponse {
  id: string;
  learnerId: string;
  surveyTemplateId: string;
  courseSessionId: string;
  submittedAt: string;
  anonymous: boolean; // template.anonymous 스냅샷
}

// 동영상 시청 진행 기록
export interface VideoProgress {
  id: string;
  enrollmentId: string;
  activityId: string;
  learnerId: string;
  watchedSec: number;
  totalSec: number;
  lastPositionSec: number; // 마지막 재생 위치 (초). 이어보기 시작 지점
  completed: boolean;
  updatedAt: string;
}

export interface ScormRuntime {
  id: string;
  enrollmentId: string;
  scoId: string; // FK → ScormSco
  learnerId: string;
  suspendData?: string;
  lessonStatus?: string;     // [1.2] passed/failed/incomplete/completed
  completionStatus?: string; // [2004] completed/incomplete/not_attempted
  successStatus?: string;    // [2004] passed/failed/unknown
  scoreRaw?: string | null;  // backend: String(20)
  scoreMax?: string | null;  // backend: String(20)
  totalTime?: string;        // ISO 8601 duration
  updatedAt: string;
}
