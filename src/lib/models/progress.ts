// Progress & learning history models — split from lib/models.ts

// 액티비티별 완료 기록
export interface ActivityCompletion {
  id: string;
  learnerId: string;
  learnerName: string;
  activityId: string;
  activityTitle: string;
  courseSessionId: string;
  completedAt: string;
  durationSec: number;
}

// 시험 응시 기록
export interface ExamAttempt {
  id: string;
  learnerId: string;
  learnerName: string;
  examTemplateId: string;
  examTitle: string;
  courseSessionId: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  durationSec?: number;
}

// 시험 문항별 개별 답안 (오답노트)
export interface ExamAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionIds?: string; // 콤마 구분 옵션 ID (선택형)
  textAnswer?: string;        // 주관식 답안 (SHORT)
  correct: boolean;
  score: number;
}

// 과제 제출 기록
export interface AssignmentSubmission {
  id: string;
  learnerId: string;
  learnerName: string;
  assignmentTemplateId: string;
  courseSessionId: string;
  submittedAt: string;
  fileUrl?: string;
  textContent?: string;
  grade?: number;
  passed?: boolean | null; // null=미채점, true=통과, false=미통과
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

// 설문 응답 기록
export interface SurveyResponse {
  id: string;
  learnerId: string;
  surveyTemplateId: string;
  courseSessionId: string;
  submittedAt: string;
  anonymous: boolean;
}

// 동영상 시청 진행 기록
export interface VideoProgress {
  id: string;
  enrollmentId: string;
  activityId: string;
  learnerId: string;
  watchedSec: number;
  totalSec: number;
  lastPosition: number; // 마지막 재생 위치 (초)
  completed: boolean;
  updatedAt: string;
}

export interface ScormRuntime {
  id: string;
  enrollmentId: string;
  scoId: string; // ScormSco.id
  learnerId: string;
  lessonStatus: "not attempted" | "incomplete" | "completed" | "passed" | "failed";
  suspendData?: string;
  scoreRaw?: number;
  scoreMin?: number;
  scoreMax?: number;
  sessionTime?: string; // HH:MM:SS
  totalTime?: string;
  updatedAt: string;
}
