export type MessageChannel = "SMS" | "EMAIL" | "KAKAO";
export type MessageStatus = "SENT" | "FAILED" | "SCHEDULED";
export type KakaoApprovalStatus = "APPROVED" | "PENDING" | "REJECTED";
export type AutomationTrigger =
  | "ENROLLMENT_CREATED"
  | "COURSE_COMPLETED"
  | "ASSIGNMENT_DUE_D3"
  | "SESSION_REMINDER_1H"
  | "CERTIFICATE_ISSUED"
  | "ACCOUNT_INVITED";

// ── 발송 이력 ─────────────────────────────────────────────

export interface MessageHistory {
  id: string;
  sentAt: string;
  recipient: string;
  recipientCount: number;
  channel: MessageChannel;
  subject?: string;
  preview: string;
  status: MessageStatus;
  templateId?: string;
}

export const messageHistory: MessageHistory[] = [
  { id: "m1", sentAt: "2025-03-14 09:00", recipient: "전체 학습자",            recipientCount: 8, channel: "EMAIL", subject: "3월 신규 과정 안내",   preview: "안녕하세요. 이번 달 신규 과정이 오픈되었습니다...", status: "SENT",      templateId: "t3" },
  { id: "m2", sentAt: "2025-03-13 14:30", recipient: "React 기초 수강생",      recipientCount: 5, channel: "KAKAO",                                   preview: "[ACME] 과제 제출 마감이 3일 남았습니다.",          status: "SENT",      templateId: "t2" },
  { id: "m3", sentAt: "2025-03-12 10:00", recipient: "TypeScript 심화 수강생", recipientCount: 3, channel: "SMS",                                     preview: "[ACME] 세션 시작 1시간 전 알림입니다.",            status: "SENT",      templateId: "t1" },
  { id: "m4", sentAt: "2025-03-11 16:00", recipient: "홍민재",                 recipientCount: 1, channel: "EMAIL", subject: "가입을 환영합니다",      preview: "ACME Corp LMS에 오신 것을 환영합니다...",          status: "SENT",      templateId: "t5" },
  { id: "m5", sentAt: "2025-03-10 09:00", recipient: "정하은",                 recipientCount: 1, channel: "SMS",                                     preview: "[ACME] 계정이 비활성화되었습니다.",                status: "FAILED" },
  { id: "m6", sentAt: "2025-03-16 09:00", recipient: "전체 학습자",            recipientCount: 8, channel: "KAKAO",                                   preview: "[ACME] 4월 교육 일정을 안내드립니다.",             status: "SCHEDULED", templateId: "t4" },
];

// ── 템플릿 ────────────────────────────────────────────────

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string;           // EMAIL
  content: string;
  variables: string[];        // ["name", "courseName"]
  charCount?: number;         // SMS 자동 계산
  kakaoCode?: string;
  kakaoApproval?: KakaoApprovalStatus;
  kakaoButtons?: { text: string; url: string }[];
  createdAt: string;
}

export const messageTemplates: MessageTemplate[] = [
  {
    id: "t1",
    name: "세션 시작 알림 (SMS)",
    channel: "SMS",
    content: "[ACME] {{name}}님, {{sessionName}} 세션이 1시간 후 시작됩니다. 접속 링크: {{link}}",
    variables: ["name", "sessionName", "link"],
    charCount: 62,
    createdAt: "2025-01-10",
  },
  {
    id: "t2",
    name: "과제 마감 리마인더 (알림톡)",
    channel: "KAKAO",
    content: "안녕하세요, {{name}}님.\n\n{{courseName}} 과제 마감이 {{dueDate}}까지입니다.\n지금 바로 제출해 주세요.",
    variables: ["name", "courseName", "dueDate"],
    kakaoCode: "TMP_20250110_001",
    kakaoApproval: "APPROVED",
    kakaoButtons: [{ text: "과제 제출하기", url: "https://acme.lms.io/assignments" }],
    createdAt: "2025-01-10",
  },
  {
    id: "t3",
    name: "신규 과정 안내 (이메일)",
    channel: "EMAIL",
    subject: "[ACME] {{month}} 신규 과정이 오픈되었습니다",
    content: "안녕하세요, {{name}}님.\n\n이번 달 새로운 과정 {{courseList}}이 오픈되었습니다.\n지금 바로 확인해 보세요!",
    variables: ["name", "month", "courseList"],
    createdAt: "2025-01-15",
  },
  {
    id: "t4",
    name: "수료 축하 (알림톡)",
    channel: "KAKAO",
    content: "축하합니다, {{name}}님!\n\n{{courseName}} 과정을 성공적으로 완료하셨습니다.\n수료증을 확인해 보세요.",
    variables: ["name", "courseName"],
    kakaoCode: "TMP_20250115_002",
    kakaoApproval: "APPROVED",
    kakaoButtons: [{ text: "수료증 확인하기", url: "https://acme.lms.io/certificates" }],
    createdAt: "2025-01-15",
  },
  {
    id: "t5",
    name: "계정 초대 (이메일)",
    channel: "EMAIL",
    subject: "[ACME] {{orgName}} LMS에 초대되었습니다",
    content: "안녕하세요, {{name}}님.\n\n{{orgName}} 학습 플랫폼에 초대되었습니다.\n아래 버튼을 클릭해 계정을 활성화하세요.",
    variables: ["name", "orgName"],
    createdAt: "2025-01-20",
  },
  {
    id: "t6",
    name: "수료증 발급 안내 (이메일)",
    channel: "EMAIL",
    subject: "[ACME] {{courseName}} 수료증이 발급되었습니다",
    content: "{{name}}님의 {{courseName}} 수료증이 발급되었습니다.\n아래에서 다운로드하실 수 있습니다.",
    variables: ["name", "courseName"],
    createdAt: "2025-02-01",
  },
  {
    id: "t7",
    name: "수강 안내 SMS",
    channel: "SMS",
    content: "[ACME] {{name}}님, {{courseName}} 수강이 등록되었습니다. 지금 바로 학습을 시작해 보세요!",
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
];

// ── 자동화 규칙 ───────────────────────────────────────────

export interface AutomationRule {
  id: string;
  trigger: AutomationTrigger;
  triggerLabel: string;
  triggerDesc: string;
  channel: MessageChannel;
  templateId: string;
  active: boolean;
}

export const automationRules: AutomationRule[] = [
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

export interface ChannelConfig {
  sms:   { senderNumber: string; apiKey: string; connected: boolean };
  email: { senderEmail: string; smtpHost: string; smtpPort: string; connected: boolean };
  kakao: { channelId: string; channelKey: string; connected: boolean };
}

export const channelConfig: ChannelConfig = {
  sms:   { senderNumber: "02-1234-5678", apiKey: "sk_live_••••••••••••", connected: true },
  email: { senderEmail: "noreply@acme.com", smtpHost: "smtp.acme.com", smtpPort: "587", connected: true },
  kakao: { channelId: "@acme-lms", channelKey: "••••••••••••••••", connected: false },
};
