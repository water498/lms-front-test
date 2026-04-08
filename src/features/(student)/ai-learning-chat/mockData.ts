import type { AiChatSession, AiChatMessage } from "@/lib/models";

export const mockSession: AiChatSession = {
  id: "acs1",
  tenantId: "t1",
  userId: "u1",
  contextType: "LANDING",
  createdAt: "2026-04-04T09:00:00Z",
  lastMessageAt: "2026-04-04T09:05:00Z",
};

export const mockMessages: AiChatMessage[] = [
  {
    id: "acm1",
    sessionId: "acs1",
    role: "SYSTEM",
    content: "안녕하세요! AI 학습 도우미입니다. 학습 중 궁금한 점이 있으면 언제든 질문해 주세요.",
    createdAt: "2026-04-04T09:00:00Z",
  },
];

const mockResponses = [
  "좋은 질문이네요! 해당 내용은 강의 3장에서 자세히 다루고 있습니다. 핵심 포인트를 정리해 드릴게요.\n\n1. 먼저 기본 개념을 이해하는 것이 중요합니다.\n2. 실습을 통해 직접 경험해 보세요.\n3. 복습 퀴즈를 통해 이해도를 확인해 보세요.",
  "네, 그 부분은 많은 학습자분들이 어려워하시는 부분이에요. 쉽게 설명해 드릴게요.\n\n핵심은 반복 학습입니다. 관련 보충 자료를 추천해 드릴까요?",
  "해당 과정의 진도율을 확인해 봤어요. 현재 65% 진행 중이시네요! 남은 세션을 완료하시면 수료증을 받으실 수 있습니다.",
  "그 주제에 대해서는 다음 자료를 참고하시면 도움이 될 거예요:\n\n- 공식 문서: 기초 가이드\n- 추천 영상: 실전 예제 모음\n- 연습 문제: 챕터별 복습 퀴즈",
  "물론이죠! 해당 개념을 다른 관점에서 설명해 드릴게요. 실생활 예시를 들어보면 이해가 더 쉬울 거예요.",
];

let responseIndex = 0;

export function getNextMockResponse(): string {
  const response = mockResponses[responseIndex % mockResponses.length];
  responseIndex++;
  return response;
}
