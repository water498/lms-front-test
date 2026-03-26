import type { EnrolledCourse } from "@/lib/models";
import { inProgressCourses } from "../home/mockData";
import { courseDetails, defaultCourseDetail } from "../courses/mockData";

// ── Session meta (학생 포털 전용) ────────────────────────────────────────

export interface StudentSession {
  id: string;               // ss-1, ss-2, ...
  courseId: string;
  name: string;             // "3기 (2026 2분기)"
  status: "OPEN" | "ONGOING" | "CLOSED";
  startDate: string;
  endDate: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  completionThreshold: number;
}

export const studentSessions: StudentSession[] = [
  {
    id: "ss-1",
    courseId: "hero-1",
    name: "3기 (2026 2분기)",
    status: "ONGOING",
    startDate: "2026-02-10",
    endDate: "2026-04-30",
    instructor: "김민준",
    capacity: 60,
    enrolled: 42,
    completionThreshold: 80,
  },
  {
    id: "ss-2",
    courseId: "ip-2",
    name: "2기 (2026 1분기)",
    status: "CLOSED",
    startDate: "2026-01-20",
    endDate: "2026-03-31",
    instructor: "이서연",
    capacity: 40,
    enrolled: 35,
    completionThreshold: 70,
  },
  {
    id: "ss-3",
    courseId: "ip-3",
    name: "4기 (2026 2분기)",
    status: "OPEN",
    startDate: "2026-04-07",
    endDate: "2026-05-16",
    instructor: "박지호",
    capacity: 30,
    enrolled: 12,
    completionThreshold: 75,
  },
];

export function getStudentSession(sessionId: string): StudentSession | undefined {
  return studentSessions.find((s) => s.id === sessionId);
}

export function getEnrolledCourseBySession(sessionId: string): EnrolledCourse | undefined {
  return inProgressCourses.find((c) => c.sessionId === sessionId);
}

export function getCurriculumBySession(sessionId: string) {
  const session = getStudentSession(sessionId);
  if (!session) return defaultCourseDetail.subjects;
  return (courseDetails[session.courseId] ?? defaultCourseDetail).subjects;
}

// ── Session-scoped Q&A ────────────────────────────────────────────────────

export interface SessionQnaItem {
  id: string;
  authorName: string;
  authorInitial: string;
  body: string;
  createdAt: string;
  isAnswered: boolean;
  activityTitle?: string;
  answer?: {
    authorName: string;
    body: string;
    createdAt: string;
  };
}

export const sessionQnaBySession: Record<string, SessionQnaItem[]> = {
  "ss-1": [
    {
      id: "sq1",
      authorName: "이민서",
      authorInitial: "이",
      body: "7-3 강의에서 F1 Score와 AUC-ROC 중 어떤 지표를 우선시해야 하나요? 불균형 데이터 상황에서요.",
      createdAt: "2026-03-20",
      isAnswered: true,
      activityTitle: "7-3. 모델 성능 평가 지표 완전 정복",
      answer: {
        authorName: "김민준 강사",
        body: "불균형 데이터에서는 일반적으로 AUC-ROC보다 F1 Score 또는 PR-AUC를 우선합니다. 특히 양성 클래스가 희귀한 경우 PR 곡선이 더 informative합니다. 자세한 내용은 다음 강의에서 다룰 예정입니다!",
        createdAt: "2026-03-21",
      },
    },
    {
      id: "sq2",
      authorName: "박준혁",
      authorInitial: "박",
      body: "TensorFlow 2.x에서 model.fit() 시 validation_split을 쓰면 shuffle이 먼저 일어나나요?",
      createdAt: "2026-03-22",
      isAnswered: false,
    },
  ],
  "ss-2": [
    {
      id: "sq3",
      authorName: "김나연",
      authorInitial: "김",
      body: "Zustand의 immer 미들웨어 없이 중첩 객체를 업데이트할 때 불변성을 어떻게 유지해야 하나요?",
      createdAt: "2026-03-18",
      isAnswered: true,
      activityTitle: "11-2. Zustand 전역 상태 관리 패턴",
      answer: {
        authorName: "이서연 강사",
        body: "스프레드 연산자로 중첩 복사하거나, structuredClone을 활용하는 방법이 있습니다. 복잡한 중첩 상태라면 immer 미들웨어 사용을 적극 권장드립니다.",
        createdAt: "2026-03-19",
      },
    },
  ],
  "ss-3": [],
};

// ── Session announcements ─────────────────────────────────────────────────

export interface SessionAnnouncement {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  type: "INFO" | "URGENT";
}

export const announcementsBySession: Record<string, SessionAnnouncement[]> = {
  "ss-1": [
    {
      id: "an1",
      title: "4월 3주차 라이브 세션 일정 안내",
      body: "4월 21일(월) 오후 7시에 모델 배포 실습 라이브 세션이 진행됩니다. Zoom 링크는 당일 오전에 공지됩니다.",
      authorName: "김민준 강사",
      createdAt: "2026-04-14",
      type: "INFO",
    },
    {
      id: "an2",
      title: "최종 프로젝트 제출 기한 안내",
      body: "최종 프로젝트 제출 기한은 4월 28일(월) 자정까지입니다. 늦은 제출은 수료 기준에 영향을 줄 수 있습니다.",
      authorName: "관리자",
      createdAt: "2026-04-10",
      type: "URGENT",
    },
  ],
  "ss-2": [
    {
      id: "an3",
      title: "3월 종강 안내 및 수료 기준 확인",
      body: "3월 31일에 과정이 종료됩니다. 수료 기준(70% 이상)을 달성하지 못하신 경우 남은 기간 내 학습을 완료해 주세요.",
      authorName: "관리자",
      createdAt: "2026-03-24",
      type: "URGENT",
    },
  ],
  "ss-3": [
    {
      id: "an4",
      title: "개강 전 환경 설정 안내",
      body: "개강 전 MySQL 8.0 및 DBeaver 설치를 완료해 주세요. 설치 가이드는 커리큘럼 1-1에서 확인하실 수 있습니다.",
      authorName: "박지호 강사",
      createdAt: "2026-04-01",
      type: "INFO",
    },
  ],
};
