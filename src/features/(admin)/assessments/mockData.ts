export type AssessmentType = "QUIZ" | "EXAM";

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  course: string;
  questionCount: number;
  passingScore: number;
  timeLimit: number | null; // 분, null=무제한
  attempts: number;
}

export interface Survey {
  id: string;
  title: string;
  course: string;
  responseCount: number;
  anonymous: boolean;
  status: "ACTIVE" | "CLOSED";
}

export const assessments: Assessment[] = [
  { id: "q1", title: "React 기초 개념 확인",     type: "QUIZ", course: "React 기초",        questionCount: 10, passingScore: 70, timeLimit: 20,   attempts: 234 },
  { id: "q2", title: "TypeScript 타입 퀴즈",     type: "QUIZ", course: "TypeScript 심화",   questionCount: 8,  passingScore: 75, timeLimit: 15,   attempts: 189 },
  { id: "q3", title: "AWS 최종 평가",            type: "EXAM", course: "AWS 클라우드 입문", questionCount: 30, passingScore: 80, timeLimit: 60,   attempts: 412 },
  { id: "q4", title: "Next.js 프로젝트 평가",    type: "EXAM", course: "Next.js 마스터",    questionCount: 20, passingScore: 80, timeLimit: 45,   attempts: 198 },
  { id: "q5", title: "State & Props 이해도",     type: "QUIZ", course: "React 기초",        questionCount: 5,  passingScore: 60, timeLimit: null, attempts: 156 },
];

export const surveys: Survey[] = [
  { id: "sv1", title: "React 기초 만족도 조사",     course: "React 기초",        responseCount: 98,  anonymous: true,  status: "ACTIVE" },
  { id: "sv2", title: "TypeScript 강의 피드백",     course: "TypeScript 심화",   responseCount: 67,  anonymous: false, status: "ACTIVE" },
  { id: "sv3", title: "AWS 과정 사후 평가",         course: "AWS 클라우드 입문", responseCount: 210, anonymous: true,  status: "CLOSED" },
];
