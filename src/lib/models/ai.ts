// Domain: ai — AI 챗봇 세션, 메시지, 사용량 로그

export type AiChatContextType = "LANDING" | "COURSE" | "SESSION" | "LEARNING";
export type AiChatRole = "USER" | "ASSISTANT" | "SYSTEM";
export type AiChatSource = "DIRECT" | "RAG" | "DB";

export interface AiChatSession {
  id: string;
  tenantId?: string;
  userId?: string;
  contextType: AiChatContextType;
  contextId?: string; // LANDING일 때 null
  createdAt: string;
  lastMessageAt?: string;
}

export interface AiChatMessage {
  id: string;
  sessionId: string;
  role: AiChatRole;
  content: string;
  inputTokens?: number;  // ASSISTANT only
  outputTokens?: number; // ASSISTANT only
  model?: string;        // ASSISTANT only
  source?: AiChatSource; // ASSISTANT only
  createdAt: string;
}

export interface AiUsageLog {
  id: string;
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  createdAt: string;
}
