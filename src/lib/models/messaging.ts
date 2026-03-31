// Domain: messaging — 메시지 발송, 크레딧, 자동화, 템플릿

export type MessageChannel = "SMS" | "EMAIL" | "KAKAO";
export type CreditTransactionType = "TOPUP" | "GRANT" | "USAGE";
export type CreditServiceType = "MESSAGING" | "AI";

export interface CreditServiceRate {
  id: string;
  serviceType: CreditServiceType;
  subType: string;        // MESSAGING: "SMS"|"EMAIL"|"KAKAO" / AI: 모델 ID (e.g. "claude-sonnet-4-6")
  direction?: "INPUT" | "OUTPUT"; // AI 토큰 방향 (MESSAGING은 undefined)
  creditsPerUnit: number; // 크레딧 / unitSize
  unitSize: number;       // 1 (메시지 1건) | 1000 (1K 토큰)
  unitLabel: string;      // "메시지" | "1K 토큰"
  effectiveFrom: string;  // ISO date — 요율 이력 관리
}

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  serviceType?: CreditServiceType; // USAGE일 때만 의미 있음
  channel?: MessageChannel;        // serviceType === "MESSAGING"일 때
  aiUsage?: {                      // serviceType === "AI"일 때
    model: string;
    inputTokens: number;
    outputTokens: number;
  };
  amount: number;      // 양수=충전/지급, 음수=사용 (크레딧 단위)
  description: string;
  createdAt: string;
}

export interface CreditBalance {
  tenantId: string;
  balance: number;
  autoTopUp: boolean;
  autoTopUpThreshold?: number;
  autoTopUpAmount?: number;
}

export type MessageStatus = "SENT" | "FAILED" | "SCHEDULED";
export type KakaoApprovalStatus = "APPROVED" | "PENDING" | "REJECTED";
export type AutomationTrigger =
  | "ENROLLMENT_CREATED"
  | "COURSE_COMPLETED"
  | "ASSIGNMENT_DUE_D3"
  | "SESSION_REMINDER_1H"
  | "CERTIFICATE_ISSUED"
  | "ACCOUNT_INVITED";

export interface AutomationTriggerDef {
  trigger: AutomationTrigger;
  label: string;
  desc: string;
}

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

export type SessionNotifyContext = "SESSION_OPEN" | "SESSION_CLOSE" | "SESSION_ENCOURAGE";

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string; // EMAIL
  content: string;
  variables: string[];
  charCount?: number; // SMS
  kakaoCode?: string;
  kakaoApproval?: KakaoApprovalStatus;
  kakaoButtons?: { text: string; url: string }[];
  tags?: string[];
  isSystemDefault?: boolean;           // 시스템 기본 템플릿 (삭제/채널변경 불가)
  defaultFor?: SessionNotifyContext;   // 라이프사이클 단계별 자동 선택 컨텍스트
  createdAt: string;
}

export interface VariableDef {
  key: string;
  label: string;
  source: string;
  channels: MessageChannel[] | "ALL";
}

export interface MessageConfig {
  sms: { senderNumber: string; apiKey: string; connected: boolean };
  email: {
    senderEmail: string;
    smtpHost: string;
    smtpPort: string;
    connected: boolean;
  };
  kakao: { channelId: string; channelKey: string; connected: boolean };
}

export interface MessageEventRule {
  id: string;
  trigger: AutomationTrigger;
  triggerLabel: string;
  triggerDesc: string;
  channel: MessageChannel;
  templateId: string;
  active: boolean;
}
