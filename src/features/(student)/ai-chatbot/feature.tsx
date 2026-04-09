"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import type { AiChatMessage } from "@/lib/models";
import { mockSession, mockMessages, getNextMockResponse } from "./mockData";

export default function AiChatFeature() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage: AiChatMessage = {
      id: `acm-${Date.now()}`,
      sessionId: mockSession.id,
      role: "USER",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response after 500ms
    setTimeout(() => {
      const aiMessage: AiChatMessage = {
        id: `acm-${Date.now()}-ai`,
        sessionId: mockSession.id,
        role: "ASSISTANT",
        content: getNextMockResponse(),
        inputTokens: 150,
        outputTokens: 280,
        model: "claude-3.5-sonnet",
        source: "DIRECT",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 500);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const CONTEXT_LABEL: Record<string, string> = {
    LANDING: "일반 질문",
    COURSE: "과정 학습",
    SESSION: "세션 학습",
    LEARNING: "학습 중",
  };

  return (
    <>
      {/* FAB button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-violet-600 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">AI 학습 도우미</h3>
              <span className="text-xs text-violet-200">
                {CONTEXT_LABEL[mockSession.contextType]}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-violet-200 hover:text-white hover:bg-violet-500 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => {
              if (msg.role === "SYSTEM") {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="bg-violet-50 text-violet-700 text-xs px-4 py-2 rounded-xl max-w-[85%] text-center leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const isUser = msg.role === "USER";
              return (
                <div key={msg.id} className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isUser ? "bg-slate-200" : "bg-violet-100"
                    }`}
                  >
                    {isUser ? (
                      <User size={14} className="text-slate-500" />
                    ) : (
                      <Bot size={14} className="text-violet-600" />
                    )}
                  </div>
                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-violet-100">
                  <Bot size={14} className="text-violet-600" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200 bg-white shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요..."
                rows={1}
                className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent max-h-24 leading-relaxed"
                style={{ minHeight: "38px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              AI 응답은 참고용이며, 정확하지 않을 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
