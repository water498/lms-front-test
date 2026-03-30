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
    instructor: "김현수",
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
    instructor: "이정민",
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
    instructor: "박성훈",
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
      body: "7-3 강의에서 안전보건관리체계 구축 시 중소기업과 대기업의 접근 방식이 다른가요? 실무적으로 어떻게 차이를 두어야 할지 궁금합니다.",
      createdAt: "2026-03-20",
      isAnswered: true,
      activityTitle: "7-3. 안전보건관리체계 구축 실전 사례",
      answer: {
        authorName: "김현수 강사",
        body: "중소기업은 인력과 예산의 제약이 있으므로 핵심 위험요인 중심의 '린(Lean) 안전관리'를 권장합니다. 대기업은 부서별 안전담당자 지정과 시스템화된 점검 절차가 중요합니다. 다음 강의에서 규모별 체계 구축 사례를 비교해서 다룰 예정입니다.",
        createdAt: "2026-03-21",
      },
    },
    {
      id: "sq2",
      authorName: "박준혁",
      authorInitial: "박",
      body: "중대재해처벌법에서 '경영책임자'의 범위가 궁금합니다. 안전보건 담당 임원도 포함되나요?",
      createdAt: "2026-03-22",
      isAnswered: false,
    },
  ],
  "ss-2": [
    {
      id: "sq3",
      authorName: "김나연",
      authorInitial: "김",
      body: "개인보호장구 착용 의무가 있는데도 현장에서 잘 안 지켜지는 경우가 많습니다. 현실적으로 준수율을 높이는 방법이 있을까요?",
      createdAt: "2026-03-18",
      isAnswered: true,
      activityTitle: "5-2. 위험 유형별 핵심 수칙 적용",
      answer: {
        authorName: "이정민 강사",
        body: "행동기반안전(BBS) 접근법이 효과적입니다. 처벌보다는 긍정적 강화(칭찬, 인센티브)를 활용하고, 관리자가 먼저 솔선수범하는 것이 핵심입니다. 또한 착용 불편을 줄이는 인체공학적 보호구 선정도 준수율 향상에 도움이 됩니다.",
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
      body: "4월 21일(월) 오후 7시에 안전보건관리체계 실전 사례 라이브 세션이 진행됩니다. Zoom 링크는 당일 오전에 공지됩니다.",
      authorName: "김현수 강사",
      createdAt: "2026-04-14",
      type: "INFO",
    },
    {
      id: "an2",
      title: "최종 체계 구축 과제 제출 기한 안내",
      body: "최종 과제(자사 안전보건관리체계 진단 보고서) 제출 기한은 4월 28일(월) 자정까지입니다. 늦은 제출은 수료 기준에 영향을 줄 수 있습니다.",
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
      title: "개강 전 사전 자료 확인 안내",
      body: "개강 전 위험성 평가 관련 기본 자료(고용노동부 위험성평가 지침)를 미리 읽어오시면 강의 이해에 도움이 됩니다. 자료는 커리큘럼 1-1에서 확인하실 수 있습니다.",
      authorName: "박성훈 강사",
      createdAt: "2026-04-01",
      type: "INFO",
    },
  ],
};
