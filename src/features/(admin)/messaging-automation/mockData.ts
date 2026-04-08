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
  MessageDelivery,
} from "@/lib/models";
import type {
  MessageChannel,
  AutomationTrigger,
  AutomationTriggerDef,
  MessageHistory,
  MessageTemplate,
  MessageDelivery,
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
    tenantId: "t1",
    sentAt: "2025-03-14 09:00",
    recipientCount: 8,
    channel: "EMAIL",
    emailSubject: "3월 신규 과정 안내",
    preview: "안녕하세요. 이번 달 신규 과정이 오픈되었습니다...",
    status: "SENT",
    templateId: "t3",
  },
  {
    id: "m2",
    tenantId: "t1",
    sentAt: "2025-03-13 14:30",
    recipientCount: 5,
    channel: "KAKAO",
    preview: "[Lotte] 과제 제출 마감이 3일 남았습니다.",
    status: "SENT",
    templateId: "t2",
  },
  {
    id: "m3",
    tenantId: "t1",
    sentAt: "2025-03-12 10:00",
    recipientCount: 3,
    channel: "SMS",
    preview: "[Lotte] 세션 시작 1시간 전 알림입니다.",
    status: "SENT",
    templateId: "t1",
  },
  {
    id: "m4",
    tenantId: "t1",
    sentAt: "2025-03-11 16:00",
    recipientCount: 1,
    channel: "EMAIL",
    emailSubject: "가입을 환영합니다",
    preview: "Lotte LMS에 오신 것을 환영합니다...",
    status: "SENT",
    templateId: "t5",
  },
  {
    id: "m5",
    tenantId: "t1",
    sentAt: "2025-03-10 09:00",
    recipientCount: 1,
    channel: "SMS",
    preview: "[Lotte] 계정이 비활성화되었습니다.",
    status: "FAILED",
  },
  {
    id: "m6",
    tenantId: "t1",
    sentAt: "2025-03-16 09:00",
    recipientCount: 8,
    channel: "KAKAO",
    preview: "[Lotte] 4월 교육 일정을 안내드립니다.",
    status: "SCHEDULED",
    templateId: "t4",
  },
  {
    id: "h7",
    tenantId: "t1",
    sentAt: "2026-03-20 14:00",
    recipientCount: 142,
    channel: "EMAIL",
    emailSubject: "[Lotte] 3월 학습 현황 안내",
    preview: "안녕하세요, {{name}}님. 3월 학습 현황을 안내드립니다.",
    status: "SCHEDULED",
    templateId: "t3",
  },
  {
    id: "h8",
    tenantId: "t1",
    sentAt: "2026-03-18 10:00",
    recipientCount: 23,
    channel: "SMS",
    preview: "[Lotte] 3월 과제 마감이 3일 남았습니다.",
    status: "SCHEDULED",
    templateId: "t11",
  },
  {
    id: "h9",
    tenantId: "t1",
    sentAt: "2026-03-22 09:00",
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
    id: "t1", tenantId: "t1", name: "세션 시작 알림 (SMS)", channel: "SMS",
    content: "[롯데건설] {{name}}님, {{sessionName}} 세션이 1시간 후 시작됩니다. 접속 링크: {{link}}",
    variables: "name,sessionName,link", smsCharCount: 62, createdAt: "2025-01-10",
  },
  {
    id: "t2", tenantId: "t1", name: "과제 마감 리마인더 (알림톡)", channel: "KAKAO",
    content: "안녕하세요, {{name}}님.\n\n{{courseName}} 과제 마감이 {{dueDate}}까지입니다.\n지금 바로 제출해 주세요.",
    variables: "name,courseName,dueDate", kakaoCode: "TMP_20250110_001", kakaoApproval: "APPROVED", createdAt: "2025-01-10",
  },
  {
    id: "t3", tenantId: "t1", name: "신규 과정 안내 (이메일)", channel: "EMAIL",
    emailSubject: "[롯데건설] {{month}} 신규 과정이 오픈되었습니다",
    content: "안녕하세요, {{name}}님.\n\n이번 달 새로운 과정 {{courseList}}이 오픈되었습니다.\n지금 바로 확인해 보세요!",
    variables: "name,month,courseList", createdAt: "2025-01-15",
  },
  {
    id: "t4", tenantId: "t1", name: "수료 축하 (알림톡)", channel: "KAKAO",
    content: "축하합니다, {{name}}님!\n\n{{courseName}} 과정을 성공적으로 완료하셨습니다.\n수료증을 확인해 보세요.",
    variables: "name,courseName", kakaoCode: "TMP_20250115_002", kakaoApproval: "APPROVED", createdAt: "2025-01-15",
  },
  {
    id: "t5", tenantId: "t1", name: "계정 초대 (이메일)", channel: "EMAIL",
    emailSubject: "[롯데건설] {{orgName}} LMS에 초대되었습니다",
    content: "안녕하세요, {{name}}님.\n\n{{orgName}} 학습 플랫폼에 초대되었습니다.\n아래 버튼을 클릭해 계정을 활성화하세요.",
    variables: "name,orgName", createdAt: "2025-01-20",
  },
  {
    id: "t6", tenantId: "t1", name: "수료증 발급 안내 (이메일)", channel: "EMAIL",
    emailSubject: "[롯데건설] {{courseName}} 수료증이 발급되었습니다",
    content: "{{name}}님의 {{courseName}} 수료증이 발급되었습니다.\n아래에서 다운로드하실 수 있습니다.",
    variables: "name,courseName", createdAt: "2025-02-01",
  },
  {
    id: "t7", tenantId: "t1", name: "수강 안내 SMS", channel: "SMS",
    content: "[롯데건설] {{name}}님, {{courseName}} 수강이 등록되었습니다. 지금 바로 학습을 시작해 보세요!",
    variables: "name,courseName", smsCharCount: 56, createdAt: "2025-02-05",
  },
  {
    id: "t8", tenantId: "t1", name: "카카오 세션 알림 (심사 중)", channel: "KAKAO",
    content: "{{name}}님, {{sessionName}} 라이브 세션이 곧 시작됩니다.",
    variables: "name,sessionName", kakaoCode: "TMP_20250301_003", kakaoApproval: "PENDING", createdAt: "2025-03-01",
  },
  {
    id: "t9", tenantId: "t1", name: "수강 시작 독려 (이메일)", channel: "EMAIL",
    emailSubject: "[롯데건설] {{courseName}} 수강을 시작해 보세요",
    content: "안녕하세요, {{name}}님.\n\n아직 {{courseName}} 수강을 시작하지 않으셨네요.\n지금 바로 시작해 지식을 쌓아보세요!",
    variables: "name,courseName", tags: "독려", createdAt: "2025-03-10",
  },
  {
    id: "t10", tenantId: "t1", name: "진도 독려 (알림톡)", channel: "KAKAO",
    content: "안녕하세요, {{name}}님.\n\n{{courseName}} 과정 수료까지 얼마 남지 않았습니다.\n마지막까지 화이팅!",
    variables: "name,courseName", kakaoCode: "TMP_20250310_004", kakaoApproval: "APPROVED",
    tags: "독려", createdAt: "2025-03-10",
  },
  {
    id: "t11", tenantId: "t1", name: "마감 임박 알림 (SMS)", channel: "SMS",
    content: "[롯데건설] {{name}}님, {{courseName}} 수강 마감이 {{daysLeft}}일 남았습니다. 빠른 수강을 권장드립니다.",
    variables: "name,courseName,daysLeft", smsCharCount: 65, tags: "독려", createdAt: "2025-03-10",
  },
  {
    id: "t12", tenantId: "t1", name: "개강 안내 (이메일)", channel: "EMAIL",
    emailSubject: "[{{sessionName}}] 개강 안내",
    content: "안녕하세요, {{name}}님.\n\n{{sessionName}} 과정이 {{daysLeft}}일 후 개강합니다.\n\n수강 준비를 미리 해두시면 더욱 원활하게 학습하실 수 있습니다.\n개강 전 커리큘럼을 확인하고 준비해 주세요.\n\n감사합니다.",
    variables: "name,sessionName,daysLeft", tags: "세션알림", isSystemDefault: true, createdAt: "2026-03-26",
  },
  {
    id: "t13", tenantId: "t1", name: "종강 안내 (이메일)", channel: "EMAIL",
    emailSubject: "[{{sessionName}}] 종강 안내",
    content: "안녕하세요, {{name}}님.\n\n{{sessionName}} 과정이 {{daysLeft}}일 후 종료됩니다.\n\n수료 기준을 달성하지 못하신 경우, 남은 기간 동안 학습을 완료해 주세요.\n\n감사합니다.",
    variables: "name,sessionName,daysLeft", tags: "세션알림", isSystemDefault: true, createdAt: "2026-03-26",
  },
  {
    id: "t14", tenantId: "t1", name: "진도 독려 — 세션 (알림톡)", channel: "KAKAO",
    content: "안녕하세요, {{name}}님.\n\n{{sessionName}} 과정 수료 기준 달성을 위해 꾸준한 학습을 권장드립니다.\n지금 바로 학습을 이어가 보세요!",
    variables: "name,sessionName", kakaoCode: "TMP_20260326_005", kakaoApproval: "PENDING",
    tags: "세션알림", isSystemDefault: true, createdAt: "2026-03-26",
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
  { key: "name", label: "수신자 이름", source: "user.firstName", channels: "ALL" },
  { key: "courseName", label: "과정명", source: "enrollment.course.name", channels: "ALL" },
  { key: "sessionName", label: "세션명", source: "session.name", channels: "ALL" },
  { key: "dueDate", label: "마감일", source: "assignment.dueDate", channels: "ALL" },
  { key: "orgName", label: "조직명", source: "tenant.name", channels: "ALL" },
  { key: "link", label: "링크 URL", source: "context.url", channels: ["SMS", "EMAIL"] },
  { key: "month", label: "월", source: "context.currentMonth", channels: "ALL" },
  { key: "courseList", label: "과정 목록", source: "context.courseList", channels: ["EMAIL"] },
  { key: "daysLeft", label: "남은 일수", source: "context.daysLeft", channels: ["SMS", "KAKAO"] },
];

export function getVariableDefsForChannel(channel: MessageChannel): VariableDef[] {
  return variableDefs.filter(
    (v) => v.channels === "ALL" || (v.channels as MessageChannel[]).includes(channel),
  );
}

export const creditTransactions: CreditTransaction[] = [
  { id: "cl1", tenantId: "t1", type: "GRANT", amount: 10000, description: "플랫폼 기본 지급", createdAt: "2025-01-01 09:00" },
  { id: "cl2", tenantId: "t1", type: "TOPUP", amount: 5000, description: "셀프 충전", createdAt: "2025-02-15 11:30" },
  { id: "cl3", tenantId: "t1", type: "USAGE", serviceType: "MESSAGING", channel: "SMS", amount: -15, description: "세션 시작 알림 (3건 × 5)", createdAt: "2025-03-12 10:00" },
  { id: "cl4", tenantId: "t1", type: "USAGE", serviceType: "MESSAGING", channel: "EMAIL", amount: -8, description: "신규 과정 안내 (8건 × 1)", createdAt: "2025-03-14 09:00" },
  { id: "cl5", tenantId: "t1", type: "USAGE", serviceType: "MESSAGING", channel: "KAKAO", amount: -15, description: "과제 리마인더 (5건 × 3)", createdAt: "2025-03-13 14:30" },
  { id: "cl6", tenantId: "t1", type: "USAGE", serviceType: "MESSAGING", channel: "SMS", amount: -115, description: "마감 임박 알림 (23건 × 5)", createdAt: "2026-03-18 10:00" },
  { id: "cl7", tenantId: "t1", type: "USAGE", serviceType: "MESSAGING", channel: "EMAIL", amount: -142, description: "월 학습현황 안내 (142건 × 1)", createdAt: "2026-03-20 14:00" },
  { id: "cl8", tenantId: "t1", type: "USAGE", serviceType: "MESSAGING", channel: "KAKAO", amount: -33, description: "라이브 세션 알림 (11건 × 3)", createdAt: "2026-03-22 09:00" },
];

// ── 자동화 규칙 ───────────────────────────────────────────

export const automationRules: MessageEventRule[] = [
  { id: "a1", trigger: "ENROLLMENT_CREATED", triggerLabel: "수강 등록 완료", triggerDesc: "학습자가 과정에 수강 등록할 때", channel: "EMAIL", templateId: "t5", active: true },
  { id: "a2", trigger: "COURSE_COMPLETED", triggerLabel: "과정 완료", triggerDesc: "학습자가 과정을 100% 완료할 때", channel: "KAKAO", templateId: "t4", active: true },
  { id: "a3", trigger: "ASSIGNMENT_DUE_D3", triggerLabel: "과제 마감 D-3", triggerDesc: "과제 마감일 3일 전 자동 발송", channel: "KAKAO", templateId: "t2", active: true },
  { id: "a4", trigger: "SESSION_REMINDER_1H", triggerLabel: "라이브 세션 1시간 전", triggerDesc: "예약된 라이브 세션 1시간 전 발송", channel: "SMS", templateId: "t1", active: false },
  { id: "a5", trigger: "CERTIFICATE_ISSUED", triggerLabel: "수료증 발급", triggerDesc: "수료증이 발급될 때", channel: "EMAIL", templateId: "t6", active: true },
  { id: "a6", trigger: "ACCOUNT_INVITED", triggerLabel: "계정 초대", triggerDesc: "관리자가 유저를 초대할 때", channel: "EMAIL", templateId: "t5", active: true },
];

// ── 채널 설정 ─────────────────────────────────────────────

export const channelConfig: MessageConfig = {
  tenantId: "t1",
  smsSenderNumber: "02-1234-5678",
  smsApiKey: "sk_live_••••••••••••",
  smsConnected: true,
  emailSender: "noreply@acme.com",
  emailSmtpHost: "smtp.acme.com",
  emailSmtpPort: 587,
  emailConnected: true,
  kakaoChannelId: "@acme-lms",
  kakaoChannelKey: "••••••••••••••••",
  kakaoConnected: false,
};

// ── 수신자별 발송 상세 ───────────────────────────────────────

export const messageDeliveries: MessageDelivery[] = [
  // m1 — EMAIL 8명
  { id: "d1",  historyId: "m1", recipientUserId: "u1",  recipientContact: "kim@lotte.com",    status: "DELIVERED", sentAt: "2025-03-14 09:00", deliveredAt: "2025-03-14 09:01" },
  { id: "d2",  historyId: "m1", recipientUserId: "u2",  recipientContact: "lee@lotte.com",    status: "DELIVERED", sentAt: "2025-03-14 09:00", deliveredAt: "2025-03-14 09:02" },
  { id: "d3",  historyId: "m1", recipientUserId: "u3",  recipientContact: "park@lotte.com",   status: "FAILED",   sentAt: "2025-03-14 09:00", errorMessage: "Invalid email" },
  { id: "d4",  historyId: "m1", recipientUserId: "u4",  recipientContact: "choi@lotte.com",   status: "DELIVERED", sentAt: "2025-03-14 09:00", deliveredAt: "2025-03-14 09:01" },
  { id: "d5",  historyId: "m1", recipientUserId: "u5",  recipientContact: "jung@lotte.com",   status: "DELIVERED", sentAt: "2025-03-14 09:00", deliveredAt: "2025-03-14 09:03" },
  { id: "d6",  historyId: "m1", recipientUserId: "u6",  recipientContact: "kang@lotte.com",   status: "DELIVERED", sentAt: "2025-03-14 09:00", deliveredAt: "2025-03-14 09:01" },
  { id: "d7",  historyId: "m1", recipientUserId: "u7",  recipientContact: "yoon@lotte.com",   status: "BOUNCED",  sentAt: "2025-03-14 09:00", errorMessage: "Mailbox full" },
  { id: "d8",  historyId: "m1", recipientUserId: "u8",  recipientContact: "lim@lotte.com",    status: "DELIVERED", sentAt: "2025-03-14 09:00", deliveredAt: "2025-03-14 09:02" },
  // m2 — KAKAO 5명
  { id: "d9",  historyId: "m2", recipientUserId: "u1",  recipientContact: "010-1234-5678",    status: "DELIVERED", sentAt: "2025-03-13 14:30", deliveredAt: "2025-03-13 14:31" },
  { id: "d10", historyId: "m2", recipientUserId: "u2",  recipientContact: "010-2345-6789",    status: "DELIVERED", sentAt: "2025-03-13 14:30", deliveredAt: "2025-03-13 14:31" },
  { id: "d11", historyId: "m2", recipientUserId: "u3",  recipientContact: "010-3456-7890",    status: "DELIVERED", sentAt: "2025-03-13 14:30", deliveredAt: "2025-03-13 14:32" },
  { id: "d12", historyId: "m2", recipientUserId: "u4",  recipientContact: "010-4567-8901",    status: "FAILED",   sentAt: "2025-03-13 14:30", errorMessage: "User blocked" },
  { id: "d13", historyId: "m2", recipientUserId: "u5",  recipientContact: "010-5678-9012",    status: "DELIVERED", sentAt: "2025-03-13 14:30", deliveredAt: "2025-03-13 14:31" },
  // m3 — SMS 3명
  { id: "d14", historyId: "m3", recipientUserId: "u1",  recipientContact: "010-1234-5678",    status: "DELIVERED", sentAt: "2025-03-12 10:00", deliveredAt: "2025-03-12 10:01" },
  { id: "d15", historyId: "m3", recipientUserId: "u2",  recipientContact: "010-2345-6789",    status: "DELIVERED", sentAt: "2025-03-12 10:00", deliveredAt: "2025-03-12 10:01" },
  { id: "d16", historyId: "m3", recipientUserId: "u3",  recipientContact: "010-3456-7890",    status: "PENDING",  sentAt: "2025-03-12 10:00" },
  // m5 — SMS 1명 (FAILED)
  { id: "d17", historyId: "m5", recipientUserId: "u9",  recipientContact: "010-9999-0000",    status: "FAILED",   sentAt: "2025-03-10 09:00", errorMessage: "Number not in service" },
];

export function getDeliveriesForHistory(historyId: string): MessageDelivery[] {
  return messageDeliveries.filter((d) => d.historyId === historyId);
}
