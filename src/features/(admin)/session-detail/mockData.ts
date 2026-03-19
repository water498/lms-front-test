import type { ActivityCompletion, ExamAttempt, WaitList } from "@/lib/models";

// se2 수강생: u7 박지호(100%), u8 최유진(72%)
// se1 수강생: u10-u19 (진도율 분포)
const activityCompletions: Record<string, ActivityCompletion[]> = {
  se2: [
    // 박지호 (u7) — 전 레슨 완료
    { id: "lc1",  learnerId: "u7", learnerName: "박지호", activityId: "a1", activityTitle: "React란 무엇인가",   courseSessionId: "se2", completedAt: "2025-02-05 10:30", durationSec: 780  },
    { id: "lc2",  learnerId: "u7", learnerName: "박지호", activityId: "a2", activityTitle: "컴포넌트 개념",      courseSessionId: "se2", completedAt: "2025-02-05 11:05", durationSec: 1240 },
    { id: "lc3",  learnerId: "u7", learnerName: "박지호", activityId: "a3", activityTitle: "개념 확인 퀴즈",     courseSessionId: "se2", completedAt: "2025-02-05 11:30", durationSec: 320  },
    { id: "lc4",  learnerId: "u7", learnerName: "박지호", activityId: "a4", activityTitle: "useState 사용법",    courseSessionId: "se2", completedAt: "2025-02-07 09:20", durationSec: 1140 },
    { id: "lc5",  learnerId: "u7", learnerName: "박지호", activityId: "a5", activityTitle: "Props 전달과 타입",  courseSessionId: "se2", completedAt: "2025-02-07 09:48", durationSec: 900  },
    { id: "lc6",  learnerId: "u7", learnerName: "박지호", activityId: "a6", activityTitle: "실습 과제",           courseSessionId: "se2", completedAt: "2025-02-10 14:00", durationSec: 3600 },
    { id: "lc7",  learnerId: "u7", learnerName: "박지호", activityId: "a7", activityTitle: "이벤트 핸들링",      courseSessionId: "se2", completedAt: "2025-02-12 10:15", durationSec: 680  },
    { id: "lc8",  learnerId: "u7", learnerName: "박지호", activityId: "a8", activityTitle: "폼 제출 실습 과제",  courseSessionId: "se2", completedAt: "2025-02-14 15:30", durationSec: 4200 },
    // 최유진 (u8) — 72% (a1~a5 완료, a6~a8 미완료)
    { id: "lc9",  learnerId: "u8", learnerName: "최유진", activityId: "a1", activityTitle: "React란 무엇인가",   courseSessionId: "se2", completedAt: "2025-02-05 14:20", durationSec: 840  },
    { id: "lc10", learnerId: "u8", learnerName: "최유진", activityId: "a2", activityTitle: "컴포넌트 개념",      courseSessionId: "se2", completedAt: "2025-02-06 09:00", durationSec: 1500 },
    { id: "lc11", learnerId: "u8", learnerName: "최유진", activityId: "a3", activityTitle: "개념 확인 퀴즈",     courseSessionId: "se2", completedAt: "2025-02-06 09:30", durationSec: 480  },
    { id: "lc12", learnerId: "u8", learnerName: "최유진", activityId: "a4", activityTitle: "useState 사용법",    courseSessionId: "se2", completedAt: "2025-02-10 11:00", durationSec: 1320 },
    { id: "lc13", learnerId: "u8", learnerName: "최유진", activityId: "a5", activityTitle: "Props 전달과 타입",  courseSessionId: "se2", completedAt: "2025-02-10 11:30", durationSec: 960  },
  ],
  se1: [
    { id: "lc20", learnerId: "u19", learnerName: "신재호", activityId: "a1", activityTitle: "React란 무엇인가",  courseSessionId: "se1", completedAt: "2025-01-13 10:00", durationSec: 760  },
    { id: "lc21", learnerId: "u19", learnerName: "신재호", activityId: "a2", activityTitle: "컴포넌트 개념",     courseSessionId: "se1", completedAt: "2025-01-13 10:25", durationSec: 980  },
    { id: "lc22", learnerId: "u19", learnerName: "신재호", activityId: "a4", activityTitle: "useState 사용법",   courseSessionId: "se1", completedAt: "2025-01-14 09:30", durationSec: 1100 },
    { id: "lc23", learnerId: "u19", learnerName: "신재호", activityId: "a7", activityTitle: "이벤트 핸들링",     courseSessionId: "se1", completedAt: "2025-01-15 11:00", durationSec: 640  },
    { id: "lc24", learnerId: "u18", learnerName: "권나연", activityId: "a1", activityTitle: "React란 무엇인가",  courseSessionId: "se1", completedAt: "2025-01-13 14:00", durationSec: 820  },
    { id: "lc25", learnerId: "u18", learnerName: "권나연", activityId: "a4", activityTitle: "useState 사용법",   courseSessionId: "se1", completedAt: "2025-01-15 10:00", durationSec: 1200 },
    { id: "lc26", learnerId: "u17", learnerName: "장도윤", activityId: "a1", activityTitle: "React란 무엇인가",  courseSessionId: "se1", completedAt: "2025-01-14 13:00", durationSec: 740  },
    { id: "lc27", learnerId: "u17", learnerName: "장도윤", activityId: "a4", activityTitle: "useState 사용법",   courseSessionId: "se1", completedAt: "2025-01-16 09:00", durationSec: 1080 },
  ],
};

// se1은 finalExamTemplateId: "ex1" 설정됨
const examAttempts: Record<string, ExamAttempt[]> = {
  se1: [
    { id: "ea1", learnerId: "u19", learnerName: "신재호", examTemplateId: "ex1", examTitle: "React 기초 수료 시험", courseSessionId: "se1", score: 92, passed: true,  submittedAt: "2025-02-25 14:30", durationSec: 1800 },
    { id: "ea2", learnerId: "u18", learnerName: "권나연", examTemplateId: "ex1", examTitle: "React 기초 수료 시험", courseSessionId: "se1", score: 88, passed: true,  submittedAt: "2025-02-25 15:10", durationSec: 2100 },
    { id: "ea3", learnerId: "u17", learnerName: "장도윤", examTemplateId: "ex1", examTitle: "React 기초 수료 시험", courseSessionId: "se1", score: 74, passed: false, submittedAt: "2025-02-25 15:45", durationSec: 2400 },
    { id: "ea4", learnerId: "u16", learnerName: "배수아", examTemplateId: "ex1", examTitle: "React 기초 수료 시험", courseSessionId: "se1", score: 85, passed: true,  submittedAt: "2025-02-26 09:15", durationSec: 1950 },
    { id: "ea5", learnerId: "u15", learnerName: "송현우", examTemplateId: "ex1", examTitle: "React 기초 수료 시험", courseSessionId: "se1", score: 62, passed: false, submittedAt: "2025-02-26 10:00", durationSec: 2700 },
    // 재시험 (장도윤 — 2회차)
    { id: "ea6", learnerId: "u17", learnerName: "장도윤", examTemplateId: "ex1", examTitle: "React 기초 수료 시험", courseSessionId: "se1", score: 82, passed: true,  submittedAt: "2025-02-27 11:00", durationSec: 1800 },
  ],
};

export function getActivityCompletions(sessionId: string): ActivityCompletion[] {
  return activityCompletions[sessionId] ?? [];
}

export function getExamAttempts(sessionId: string): ExamAttempt[] {
  return examAttempts[sessionId] ?? [];
}

// ── 대기자 목록 ──────────────────────────────────────────────
const waitLists: Record<string, WaitList[]> = {
  se2: [
    { id: "wl1", courseSessionId: "se2", userId: "u20", userName: "김지수", requestedAt: "2025-02-10", status: "WAITING"   },
    { id: "wl2", courseSessionId: "se2", userId: "u21", userName: "이현우", requestedAt: "2025-02-11", status: "APPROVED"  },
    { id: "wl3", courseSessionId: "se2", userId: "u22", userName: "박소연", requestedAt: "2025-02-12", status: "WAITING"   },
    { id: "wl4", courseSessionId: "se2", userId: "u23", userName: "최준혁", requestedAt: "2025-02-13", status: "CANCELLED" },
  ],
};

export function getWaitList(sessionId: string): WaitList[] {
  return waitLists[sessionId] ?? [];
}
