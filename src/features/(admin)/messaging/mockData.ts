export type {
  MessageChannel,
  MessageStatus,
  KakaoApprovalStatus,
  AutomationTrigger,
  AutomationTriggerDef,
  MessageHistory,
  MessageTemplate,
  VariableDef,
  MessageConfig,
  MessageEventRule,
  CreditTransaction,
  CreditTransactionType,
} from "@/lib/models";
import type {
  MessageChannel,
  AutomationTrigger,
  AutomationTriggerDef,
  MessageHistory,
  MessageTemplate,
  VariableDef,
  MessageConfig,
  MessageEventRule,
  CreditTransaction,
} from "@/lib/models";

// ── 단일 크레딧 풀 ────────────────────────────────────────

export const CREDITS_PER_MESSAGE: Record<MessageChannel, number> = {
  SMS: 5,
  KAKAO: 3,
  EMAIL: 1,
};

export const creditPool = {
  balance: 10000,
  autoTopUp: true,
  autoTopUpThreshold: 2000,
  autoTopUpAmount: 10000,
};

export const automationTriggerDefs: AutomationTriggerDef[] = [
  {
    trigger: "ENROLLMENT_CREATED",
    label: "수강 등록 완료",
    desc: "학습자가 과정에 수강 등록할 때",
  },
  {
    trigger: "COURSE_COMPLETED",
    label: "과정 완료",
    desc: "학습자가 과정을 100% 완료할 때",
  },
  {
    trigger: "ASSIGNMENT_DUE_D3",
    label: "과제 마감 D-3",
    desc: "과제 마감일 3일 전 자동 발송",
  },
  {
    trigger: "SESSION_REMINDER_1H",
    label: "라이브 세션 1시간 전",
    desc: "예약된 라이브 세션 1시간 전 발송",
  },
  {
    trigger: "CERTIFICATE_ISSUED",
    label: "수료증 발급",
    desc: "수료증이 발급될 때",
  },
  {
    trigger: "ACCOUNT_INVITED",
    label: "계정 초대",
    desc: "관리자가 유저를 초대할 때",
  },
];

// ── 발송 이력 ─────────────────────────────────────────────

export const messageHistory: MessageHistory[] = [
  {
    id: "m1",
    sentAt: "2025-03-14 09:00",
    recipient: "전체 학습자",
    recipientCount: 8,
    channel: "EMAIL",
    subject: "3월 신규 과정 안내",
    preview: "안녕하세요. 이번 달 신규 과정이 오픈되었습니다...",
    status: "SENT",
    templateId: "t3",
  },
  {
    id: "m2",
    sentAt: "2025-03-13 14:30",
    recipient: "React 기초 수강생",
    recipientCount: 5,
    channel: "KAKAO",
    preview: "[Lotte] 과제 제출 마감이 3일 남았습니다.",
    status: "SENT",
    templateId: "t2",
  },
  {
    id: "m3",
    sentAt: "2025-03-12 10:00",
    recipient: "TypeScript 심화 수강생",
    recipientCount: 3,
    channel: "SMS",
    preview: "[Lotte] 세션 시작 1시간 전 알림입니다.",
    status: "SENT",
    templateId: "t1",
  },
  {
    id: "m4",
    sentAt: "2025-03-11 16:00",
    recipient: "홍민재",
    recipientCount: 1,
    channel: "EMAIL",
    subject: "가입을 환영합니다",
    preview: "Lotte LMS에 오신 것을 환영합니다...",
    status: "SENT",
    templateId: "t5",
  },
  {
    id: "m5",
    sentAt: "2025-03-10 09:00",
    recipient: "정하은",
    recipientCount: 1,
    channel: "SMS",
    preview: "[Lotte] 계정이 비활성화되었습니다.",
    status: "FAILED",
  },
  {
    id: "m6",
    sentAt: "2025-03-16 09:00",
    recipient: "전체 학습자",
    recipientCount: 8,
    channel: "KAKAO",
    preview: "[Lotte] 4월 교육 일정을 안내드립니다.",
    status: "SCHEDULED",
    templateId: "t4",
  },
  {
    id: "h7",
    sentAt: "2026-03-20 14:00",
    recipient: "전체 학습자",
    recipientCount: 142,
    channel: "EMAIL",
    subject: "[Lotte] 3월 학습 현황 안내",
    preview: "안녕하세요, {{name}}님. 3월 학습 현황을 안내드립니다.",
    status: "SCHEDULED",
    templateId: "t3",
  },
  {
    id: "h8",
    sentAt: "2026-03-18 10:00",
    recipient: "React 기초 수강생",
    recipientCount: 23,
    channel: "SMS",
    preview: "[Lotte] 3월 과제 마감이 3일 남았습니다.",
    status: "SCHEDULED",
    templateId: "t11",
  },
  {
    id: "h9",
    sentAt: "2026-03-22 09:00",
    recipient: "TypeScript 심화 수강생",
    recipientCount: 11,
    channel: "KAKAO",
    preview: "[Lotte] 라이브 세션 참가를 잊지 마세요.",
    status: "SCHEDULED",
    templateId: "t8",
  },
];

// ── 템플릿 ────────────────────────────────────────────────

export const messageTemplates: MessageTemplate[] = [
  {
    id: "t1",
    name: "세션 시작 알림 (SMS)",
    channel: "SMS",
    content:
      "[롯데건설] {{name}}님, {{sessionName}} 세션이 1시간 후 시작됩니다. 접속 링크: {{link}}",
    variables: ["name", "sessionName", "link"],
    charCount: 62,
    createdAt: "2025-01-10",
  },
  {
    id: "t2",
    name: "과제 마감 리마인더 (알림톡)",
    channel: "KAKAO",
    content:
      "안녕하세요, {{name}}님.\n\n{{courseName}} 과제 마감이 {{dueDate}}까지입니다.\n지금 바로 제출해 주세요.",
    variables: ["name", "courseName", "dueDate"],
    kakaoCode: "TMP_20250110_001",
    kakaoApproval: "APPROVED",
    kakaoButtons: [
      { text: "과제 제출하기", url: "https://acme.lms.io/assignments" },
    ],
    createdAt: "2025-01-10",
  },
  {
    id: "t3",
    name: "신규 과정 안내 (이메일)",
    channel: "EMAIL",
    subject: "[롯데건설] {{month}} 신규 과정이 오픈되었습니다",
    content:
      "안녕하세요, {{name}}님.\n\n이번 달 새로운 과정 {{courseList}}이 오픈되었습니다.\n지금 바로 확인해 보세요!",
    variables: ["name", "month", "courseList"],
    createdAt: "2025-01-15",
  },
  {
    id: "t4",
    name: "수료 축하 (알림톡)",
    channel: "KAKAO",
    content:
      "축하합니다, {{name}}님!\n\n{{courseName}} 과정을 성공적으로 완료하셨습니다.\n수료증을 확인해 보세요.",
    variables: ["name", "courseName"],
    kakaoCode: "TMP_20250115_002",
    kakaoApproval: "APPROVED",
    kakaoButtons: [
      { text: "수료증 확인하기", url: "https://acme.lms.io/certificates" },
    ],
    createdAt: "2025-01-15",
  },
  {
    id: "t5",
    name: "계정 초대 (이메일)",
    channel: "EMAIL",
    subject: "[롯데건설] {{orgName}} LMS에 초대되었습니다",
    content:
      "안녕하세요, {{name}}님.\n\n{{orgName}} 학습 플랫폼에 초대되었습니다.\n아래 버튼을 클릭해 계정을 활성화하세요.",
    variables: ["name", "orgName"],
    createdAt: "2025-01-20",
  },
  {
    id: "t6",
    name: "수료증 발급 안내 (이메일)",
    channel: "EMAIL",
    subject: "[롯데건설] {{courseName}} 수료증이 발급되었습니다",
    content:
      "{{name}}님의 {{courseName}} 수료증이 발급되었습니다.\n아래에서 다운로드하실 수 있습니다.",
    variables: ["name", "courseName"],
    createdAt: "2025-02-01",
  },
  {
    id: "t7",
    name: "수강 안내 SMS",
    channel: "SMS",
    content:
      "[롯데건설] {{name}}님, {{courseName}} 수강이 등록되었습니다. 지금 바로 학습을 시작해 보세요!",
    variables: ["name", "courseName"],
    charCount: 56,
    createdAt: "2025-02-05",
  },
  {
    id: "t8",
    name: "카카오 세션 알림 (심사 중)",
    channel: "KAKAO",
    content: "{{name}}님, {{sessionName}} 라이브 세션이 곧 시작됩니다.",
    variables: ["name", "sessionName"],
    kakaoCode: "TMP_20250301_003",
    kakaoApproval: "PENDING",
    createdAt: "2025-03-01",
  },
  {
    id: "t9",
    name: "수강 시작 독려 (이메일)",
    channel: "EMAIL",
    subject: "[롯데건설] {{courseName}} 수강을 시작해 보세요",
    content:
      "안녕하세요, {{name}}님.\n\n아직 {{courseName}} 수강을 시작하지 않으셨네요.\n지금 바로 시작해 지식을 쌓아보세요!",
    variables: ["name", "courseName"],
    tags: ["독려"],
    createdAt: "2025-03-10",
  },
  {
    id: "t10",
    name: "진도 독려 (알림톡)",
    channel: "KAKAO",
    content:
      "안녕하세요, {{name}}님.\n\n{{courseName}} 과정 수료까지 얼마 남지 않았습니다.\n마지막까지 화이팅!",
    variables: ["name", "courseName"],
    kakaoCode: "TMP_20250310_004",
    kakaoApproval: "APPROVED",
    kakaoButtons: [{ text: "학습 이어하기", url: "https://acme.lms.io/learn" }],
    tags: ["독려"],
    createdAt: "2025-03-10",
  },
  {
    id: "t11",
    name: "마감 임박 알림 (SMS)",
    channel: "SMS",
    content:
      "[롯데건설] {{name}}님, {{courseName}} 수강 마감이 {{daysLeft}}일 남았습니다. 빠른 수강을 권장드립니다.",
    variables: ["name", "courseName", "daysLeft"],
    charCount: 65,
    tags: ["독려"],
    createdAt: "2025-03-10",
  },
  {
    id: "t12",
    name: "개강 안내 (이메일)",
    channel: "EMAIL",
    subject: "[{{sessionName}}] 개강 안내",
    content:
      "안녕하세요, {{name}}님.\n\n{{sessionName}} 과정이 {{daysLeft}}일 후 개강합니다.\n\n수강 준비를 미리 해두시면 더욱 원활하게 학습하실 수 있습니다.\n개강 전 커리큘럼을 확인하고 준비해 주세요.\n\n감사합니다.",
    variables: ["name", "sessionName", "daysLeft"],
    tags: ["세션알림"],
    isSystemDefault: true,
    defaultFor: "SESSION_OPEN",
    createdAt: "2026-03-26",
  },
  {
    id: "t13",
    name: "종강 안내 (이메일)",
    channel: "EMAIL",
    subject: "[{{sessionName}}] 종강 안내",
    content:
      "안녕하세요, {{name}}님.\n\n{{sessionName}} 과정이 {{daysLeft}}일 후 종료됩니다.\n\n수료 기준을 달성하지 못하신 경우, 남은 기간 동안 학습을 완료해 주세요.\n\n감사합니다.",
    variables: ["name", "sessionName", "daysLeft"],
    tags: ["세션알림"],
    isSystemDefault: true,
    defaultFor: "SESSION_CLOSE",
    createdAt: "2026-03-26",
  },
  {
    id: "t14",
    name: "진도 독려 — 세션 (알림톡)",
    channel: "KAKAO",
    content:
      "안녕하세요, {{name}}님.\n\n{{sessionName}} 과정 수료 기준 달성을 위해 꾸준한 학습을 권장드립니다.\n지금 바로 학습을 이어가 보세요!",
    variables: ["name", "sessionName"],
    kakaoCode: "TMP_20260326_005",
    kakaoApproval: "PENDING",
    kakaoButtons: [{ text: "학습 이어하기", url: "https://acme.lms.io/learn" }],
    tags: ["세션알림"],
    isSystemDefault: true,
    defaultFor: "SESSION_ENCOURAGE",
    createdAt: "2026-03-26",
  },
];

export function getEncourageTemplates() {
  return messageTemplates.filter((t) => t.tags?.includes("독려"));
}

export function getSessionNotifyTemplates() {
  return messageTemplates.filter((t) => t.tags?.includes("세션알림"));
}

// ── 변수 레지스트리 ───────────────────────────────────────

export const variableDefs: VariableDef[] = [
  {
    key: "name",
    label: "수신자 이름",
    source: "user.firstName",
    channels: "ALL",
  },
  {
    key: "courseName",
    label: "과정명",
    source: "enrollment.course.name",
    channels: "ALL",
  },
  {
    key: "sessionName",
    label: "세션명",
    source: "session.name",
    channels: "ALL",
  },
  {
    key: "dueDate",
    label: "마감일",
    source: "assignment.dueDate",
    channels: "ALL",
  },
  { key: "orgName", label: "조직명", source: "tenant.name", channels: "ALL" },
  {
    key: "link",
    label: "링크 URL",
    source: "context.url",
    channels: ["SMS", "EMAIL"],
  },
  {
    key: "month",
    label: "월",
    source: "context.currentMonth",
    channels: "ALL",
  },
  {
    key: "courseList",
    label: "과정 목록",
    source: "context.courseList",
    channels: ["EMAIL"],
  },
  {
    key: "daysLeft",
    label: "남은 일수",
    source: "context.daysLeft",
    channels: ["SMS", "KAKAO"],
  },
];

export function getVariableDefsForChannel(
  channel: MessageChannel,
): VariableDef[] {
  return variableDefs.filter(
    (v) =>
      v.channels === "ALL" ||
      (v.channels as MessageChannel[]).includes(channel),
  );
}

export const creditTransactions: CreditTransaction[] = [
  {
    id: "cl1",
    type: "GRANT",
    amount: 10000,
    description: "플랫폼 기본 지급",
    createdAt: "2025-01-01 09:00",
  },
  {
    id: "cl2",
    type: "TOPUP",
    amount: 5000,
    description: "셀프 충전",
    createdAt: "2025-02-15 11:30",
  },
  {
    id: "cl3",
    type: "USAGE",
    serviceType: "MESSAGING",
    channel: "SMS",
    amount: -15,
    description: "세션 시작 알림 (3건 × 5)",
    createdAt: "2025-03-12 10:00",
  },
  {
    id: "cl4",
    type: "USAGE",
    serviceType: "MESSAGING",
    channel: "EMAIL",
    amount: -8,
    description: "신규 과정 안내 (8건 × 1)",
    createdAt: "2025-03-14 09:00",
  },
  {
    id: "cl5",
    type: "USAGE",
    serviceType: "MESSAGING",
    channel: "KAKAO",
    amount: -15,
    description: "과제 리마인더 (5건 × 3)",
    createdAt: "2025-03-13 14:30",
  },
  {
    id: "cl6",
    type: "USAGE",
    serviceType: "MESSAGING",
    channel: "SMS",
    amount: -115,
    description: "마감 임박 알림 (23건 × 5)",
    createdAt: "2026-03-18 10:00",
  },
  {
    id: "cl7",
    type: "USAGE",
    serviceType: "MESSAGING",
    channel: "EMAIL",
    amount: -142,
    description: "월 학습현황 안내 (142건 × 1)",
    createdAt: "2026-03-20 14:00",
  },
  {
    id: "cl8",
    type: "USAGE",
    serviceType: "MESSAGING",
    channel: "KAKAO",
    amount: -33,
    description: "라이브 세션 알림 (11건 × 3)",
    createdAt: "2026-03-22 09:00",
  },
];

// ── 자동화 규칙 ───────────────────────────────────────────

export const automationRules: MessageEventRule[] = [
  {
    id: "a1",
    trigger: "ENROLLMENT_CREATED",
    triggerLabel: "수강 등록 완료",
    triggerDesc: "학습자가 과정에 수강 등록할 때",
    channel: "EMAIL",
    templateId: "t5",
    active: true,
  },
  {
    id: "a2",
    trigger: "COURSE_COMPLETED",
    triggerLabel: "과정 완료",
    triggerDesc: "학습자가 과정을 100% 완료할 때",
    channel: "KAKAO",
    templateId: "t4",
    active: true,
  },
  {
    id: "a3",
    trigger: "ASSIGNMENT_DUE_D3",
    triggerLabel: "과제 마감 D-3",
    triggerDesc: "과제 마감일 3일 전 자동 발송",
    channel: "KAKAO",
    templateId: "t2",
    active: true,
  },
  {
    id: "a4",
    trigger: "SESSION_REMINDER_1H",
    triggerLabel: "라이브 세션 1시간 전",
    triggerDesc: "예약된 라이브 세션 1시간 전 발송",
    channel: "SMS",
    templateId: "t1",
    active: false,
  },
  {
    id: "a5",
    trigger: "CERTIFICATE_ISSUED",
    triggerLabel: "수료증 발급",
    triggerDesc: "수료증이 발급될 때",
    channel: "EMAIL",
    templateId: "t6",
    active: true,
  },
  {
    id: "a6",
    trigger: "ACCOUNT_INVITED",
    triggerLabel: "계정 초대",
    triggerDesc: "관리자가 유저를 초대할 때",
    channel: "EMAIL",
    templateId: "t5",
    active: true,
  },
];

// ── 채널 설정 ─────────────────────────────────────────────

export const channelConfig: MessageConfig = {
  sms: {
    senderNumber: "02-1234-5678",
    apiKey: "sk_live_••••••••••••",
    connected: true,
  },
  email: {
    senderEmail: "noreply@acme.com",
    smtpHost: "smtp.acme.com",
    smtpPort: "587",
    connected: true,
  },
  kakao: {
    channelId: "@acme-lms",
    channelKey: "••••••••••••••••",
    connected: false,
  },
};
