import { type Course, courses } from "../courses/mockData";

export type ActivityType = "VIDEO" | "SCORM" | "QUIZ" | "ASSIGNMENT" | "LIVE";

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  duration?: number;      // 분 (VIDEO일 때)
  questionCount?: number; // QUIZ/ASSIGNMENT일 때
}

export interface Subject {
  id: string;
  title: string;
  order: number;
  activities: Activity[];
}

export type SessionStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface CourseSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  instructor: string;
  status: SessionStatus;
  venue?: string; // 오프라인일 때
}

export interface CourseEnrollee {
  id: string;
  learner: string;
  session: string;
  progress: number;
  enrolledAt: string;
}

const curricula: Record<string, Subject[]> = {
  c1: [
    {
      id: "s1", title: "React 기초 개념", order: 1,
      activities: [
        { id: "a1", title: "React란 무엇인가",    type: "VIDEO",      duration: 12 },
        { id: "a2", title: "컴포넌트 개념",        type: "SCORM" },
        { id: "a3", title: "개념 확인 퀴즈",       type: "QUIZ",       questionCount: 5 },
      ],
    },
    {
      id: "s2", title: "State와 Props", order: 2,
      activities: [
        { id: "a4", title: "useState 사용법",      type: "VIDEO",      duration: 18 },
        { id: "a5", title: "Props 전달과 타입",    type: "VIDEO",      duration: 14 },
        { id: "a6", title: "실습 과제",             type: "ASSIGNMENT", questionCount: 1 },
      ],
    },
    {
      id: "s3", title: "이벤트와 폼 처리", order: 3,
      activities: [
        { id: "a7", title: "이벤트 핸들링",        type: "VIDEO",      duration: 10 },
        { id: "a8", title: "라이브 Q&A 세션",      type: "LIVE" },
      ],
    },
  ],
};

const sessions: Record<string, CourseSession[]> = {
  c1: [
    { id: "se1", name: "2025-01기", startDate: "2025-01-06", endDate: "2025-02-28", capacity: 50, enrolled: 48, instructor: "이준혁", status: "CLOSED" },
    { id: "se2", name: "2025-02기", startDate: "2025-02-03", endDate: "2025-03-28", capacity: 50, enrolled: 50, instructor: "이준혁", status: "IN_PROGRESS" },
    { id: "se3", name: "2025-03기", startDate: "2025-03-31", endDate: "2025-05-23", capacity: 60, enrolled: 12, instructor: "이준혁", status: "OPEN" },
  ],
  c4: [
    { id: "se4", name: "2025-02기", startDate: "2025-02-10", endDate: "2025-03-21", capacity: 30, enrolled: 30, instructor: "김태호", status: "IN_PROGRESS", venue: "강남교육센터 3F" },
    { id: "se5", name: "2025-04기", startDate: "2025-04-07", endDate: "2025-04-25", capacity: 30, enrolled: 8,  instructor: "김태호", status: "OPEN",        venue: "강남교육센터 3F" },
  ],
};

const enrollees: Record<string, CourseEnrollee[]> = {
  c1: [
    { id: "e1", learner: "김민준", session: "2025-03기", progress: 45,  enrolledAt: "2025-03-14" },
    { id: "e2", learner: "이서연", session: "2025-03기", progress: 30,  enrolledAt: "2025-03-13" },
    { id: "e3", learner: "박지호", session: "2025-02기", progress: 100, enrolledAt: "2025-02-20" },
    { id: "e4", learner: "최유진", session: "2025-02기", progress: 72,  enrolledAt: "2025-02-03" },
  ],
};

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId) ?? courses[0];
}

export function getCurriculum(courseId: string): Subject[] {
  return curricula[courseId] ?? curricula["c1"];
}

export function getSessions(courseId: string): CourseSession[] {
  return sessions[courseId] ?? sessions["c1"];
}

export function getEnrollees(courseId: string): CourseEnrollee[] {
  return enrollees[courseId] ?? enrollees["c1"];
}
