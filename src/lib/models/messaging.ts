// Domain: messaging — 메시지 발송, 크레딧, 자동화, 템플릿

export type MessageChannel = "SMS" | "EMAIL" | "KAKAO";
export type CreditTransactionType = "TOPUP" | "GRANT" | "USAGE";
export type CreditServiceType = "MESSAGING" | "AI";

export interface CreditServiceRate {
  id: string;
  serviceType: CreditServiceType;
  subType: string;               // MESSAGING: "SMS"|"EMAIL"|"KAKAO" / AI: 모델 ID
  aiTokenDirection?: "INPUT" | "OUTPUT"; // AI 토큰 방향 (MESSAGING은 undefined)
  creditsPerUnit: number;
  unitSize: number;              // 1 (메시지 1건) | 1000 (1K 토큰)
  unitLabel: string;             // "메시지" | "1K 토큰"
  effectiveFrom: string;        // ISO date
}

export interface CreditTransaction {
  id: string;
  tenantId: string;
  type: CreditTransactionType;
  serviceType?: CreditServiceType; // USAGE일 때만
  channel?: MessageChannel;        // serviceType === "MESSAGING"일 때
  amount: number;      // 양수=충전/지급, 음수=사용
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
  tenantId: string;
  templateId?: string;
  sentAt: string;
  channel: MessageChannel;
  emailSubject?: string;     // EMAIL only
  preview: string;
  recipientCount: number;
  status: MessageStatus;
}

export interface MessageDelivery {
  id: string;
  historyId: string;           // FK → MessageHistory
  recipientUserId?: string;    // FK → User. SET NULL
  recipientContact: string;   // email/phone 스냅샷
  status: "PENDING" | "DELIVERED" | "FAILED" | "BOUNCED";
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface MessageTemplate {
  id: string;
  tenantId: string;
  name: string;
  channel: MessageChannel;
  emailSubject?: string;     // EMAIL only
  content: string;           // {{variable}} 치환
  variables?: string;        // comma-separated
  smsCharCount?: number;     // SMS only
  kakaoCode?: string;        // KAKAO only
  kakaoApproval?: KakaoApprovalStatus; // KAKAO only
  tags?: string;             // comma-separated
  isSystemDefault?: boolean; // true이면 삭제 불가
  createdAt: string;
}

export interface VariableDef {
  key: string;
  label: string;
  source: string;
  channels: MessageChannel[] | "ALL";
}

export interface MessageConfig {
  tenantId: string;
  smsSenderNumber?: string;
  smsApiKey?: string;
  smsConnected: boolean;
  emailSender?: string;
  emailSmtpHost?: string;
  emailSmtpPort?: number;
  emailConnected: boolean;
  kakaoChannelId?: string;
  kakaoChannelKey?: string;
  kakaoConnected: boolean;
}

export interface MessageEventRule {
  id: string;
  trigger: AutomationTrigger;
  channel: MessageChannel;
  templateId?: string; // FK → MessageTemplate. SET NULL
  active: boolean;
  // [UI-only]
  triggerLabel?: string;
  triggerDesc?: string;
}
