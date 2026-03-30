import type { CancellationPolicy, Course } from "@/lib/models";
export type {
  CourseStatus,
  CourseMode,
  CertConfig,
  CancellationRule,
  CancellationPolicy,
  Course,
} from "@/lib/models";

export const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
  rules: [
    { daysBeforeStart: 7, refundPct: 100 },
    { daysBeforeStart: 3, refundPct: 50 },
    { daysBeforeStart: 1, refundPct: 0 },
  ],
  noRefundAfterStart: true,
};

export const courses: Course[] = [
  { id: "c1", title: "핵심안전수칙 이해",                          instructor: "이정민", status: "PUBLISHED", mode: "ONLINE",  sessions: 4, enrollees: 312, createdAt: "2024-12-01", category: "안전관리",  tags: ["안전수칙", "기초", "초급"],           certConfig: { templateId: "t1", completionRate: 80,  autoIssue: true  }, description: "현장 작업자가 반드시 알아야 할 핵심 안전수칙을 체계적으로 학습합니다. 개인보호장구 착용, 위험구역 식별, 비상대응 절차를 실습 중심으로 다룹니다.", price: 89000,  defaultMinEnrollment: 10, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c2", title: "안전보건관리체계와 10대 필수 안전수칙 이해",   instructor: "김현수", status: "PUBLISHED", mode: "ONLINE",  sessions: 3, enrollees: 198, createdAt: "2025-01-10", category: "법규·규정", tags: ["안전보건", "KOSHA", "중급"],          certConfig: { templateId: "t1", completionRate: 80,  autoIssue: true  }, description: "산업안전보건법 기반 안전보건관리체계 구축 방법과 10대 필수 안전수칙을 이해합니다. 중간관리자 이상을 대상으로 합니다.", price: 109000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c3", title: "안전문화 주도 및 경영 역량",                  instructor: "김현수", status: "PUBLISHED", mode: "ONLINE",  sessions: 5, enrollees: 254, createdAt: "2025-01-20", category: "안전문화",  tags: ["안전경영", "안전문화", "고급"],        certConfig: { templateId: "t1", completionRate: 90,  autoIssue: true  }, description: "경영진 및 관리자를 위한 안전문화 구축 리더십 과정. 안전 비전 수립, 구성원 동기부여, 성과 관리까지 실무 수준으로 다룹니다.",               price: 149000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c4", title: "위험관리실무",                                instructor: "박성훈", status: "PUBLISHED", mode: "OFFLINE", sessions: 6, enrollees: 421, createdAt: "2025-02-05", category: "리스크관리", tags: ["위험성평가", "리스크", "중급"],        certConfig: { templateId: "t2", completionRate: 100, autoIssue: false }, description: "위험성 평가 절차, 위험 식별·분석·평가·처리 방법을 실습합니다. 현장 적용 사례 중심으로 학습합니다.",                              price: 199000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c5", title: "사고 예방 기본 역량",                         instructor: "이정민", status: "DRAFT",     mode: "ONLINE",  sessions: 2, enrollees: 0,   createdAt: "2025-03-01", category: "안전관리",  tags: ["사고예방", "현장안전", "초급"],        certConfig: { templateId: "t1", completionRate: 80,  autoIssue: true  }, description: "사고 발생 메커니즘과 예방 원리를 이해하고 실질적인 예방 역량을 기릅니다.",                                       price: 129000, cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c6", title: "재해 통계 분석",                              instructor: "박성훈", status: "DRAFT",     mode: "ONLINE",  sessions: 0, enrollees: 0,   createdAt: "2025-03-10", category: "법규·규정", tags: ["재해통계", "데이터분석", "중급"],      certConfig: { templateId: "t1", completionRate: 60,  autoIssue: true  },                                                                                                                              cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c7", title: "법규해석 및 이해",                            instructor: "김현수", status: "ARCHIVED",  mode: "ONLINE",  sessions: 3, enrollees: 88,  createdAt: "2024-08-15", category: "법규·규정", tags: ["산업안전보건법", "법규", "중급"],      certConfig: { templateId: "t2", completionRate: 100, autoIssue: false }, description: "산업안전보건법, 중대재해처벌법 등 핵심 법규를 해석하고 현장에 적용하는 방법을 학습합니다.",                                        price: 79000,  cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
  { id: "c8", title: "안전마인드 향상",                             instructor: "이정민", status: "DRAFT",     mode: "BLENDED", sessions: 1, enrollees: 0,   createdAt: "2025-03-12", category: "안전문화",  tags: ["안전의식", "행동변화", "초급"],        certConfig: { templateId: "t1", completionRate: 80,  autoIssue: true  },                                                                                                                              cancellationPolicy: DEFAULT_CANCELLATION_POLICY },
];

export const instructors = ["김현수", "이정민", "박성훈", "최민서", "정유진"];
export const categories = ["안전관리", "법규·규정", "리스크관리", "안전문화", "비상대응"];
