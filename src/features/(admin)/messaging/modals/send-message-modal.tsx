"use client";

import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { messageTemplates, type MessageChannel } from "../mockData";

interface Props {
  onClose: () => void;
}

type ComposeMode = "direct" | "template";
type Step = "mode" | "compose" | "send";

const CHANNELS: { id: MessageChannel; label: string; desc: string }[] = [
  { id: "SMS",   label: "SMS",    desc: "문자 메시지" },
  { id: "EMAIL", label: "이메일", desc: "SMTP 이메일" },
  { id: "KAKAO", label: "알림톡", desc: "카카오 알림톡" },
];

export default function SendMessageModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<ComposeMode>("template");
  const [channel, setChannel] = useState<MessageChannel>("EMAIL");
  const [templateId, setTemplateId] = useState("");
  const [recipient, setRecipient] = useState("ALL");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const availableTemplates = messageTemplates.filter((t) => t.channel === channel);
  const selectedTemplate = messageTemplates.find((t) => t.id === templateId);

  const handleModeNext = () => {
    if (mode === "template") {
      setStep("compose");
    } else {
      setStep("compose");
    }
  };

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    const t = messageTemplates.find((tmpl) => tmpl.id === id);
    if (t) {
      if (t.subject) setSubject(t.subject);
      setContent(t.content);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-slate-800">메시지 발송</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
          <span className={step === "mode"    ? "text-violet-600 font-medium" : ""}>1. 작성 방식</span>
          <ChevronRight size={12} />
          <span className={step === "compose" ? "text-violet-600 font-medium" : ""}>2. 내용 구성</span>
          <ChevronRight size={12} />
          <span className={step === "send"    ? "text-violet-600 font-medium" : ""}>3. 발송</span>
        </div>

        {/* Step 1: 작성 방식 */}
        {step === "mode" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              {([
                { id: "template" as ComposeMode, label: "템플릿 사용", desc: "미리 만들어둔 템플릿을 선택해 발송합니다." },
                { id: "direct"   as ComposeMode, label: "직접 작성",   desc: "내용을 직접 입력해 발송합니다." },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 border rounded-xl p-4 text-left transition-colors ${
                    mode === m.id
                      ? "border-violet-400 bg-violet-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className={`text-sm font-semibold mb-1 ${mode === m.id ? "text-violet-700" : "text-slate-700"}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleModeNext}
                className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 내용 구성 */}
        {step === "compose" && (
          <div className="flex flex-col gap-4">
            {/* 채널 선택 */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">채널</label>
              <div className="flex gap-2">
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setChannel(c.id); setTemplateId(""); setSubject(""); setContent(""); }}
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                      channel === c.id
                        ? "border-violet-400 bg-violet-50 text-violet-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <p className="font-medium">{c.label}</p>
                    <p className="text-xs opacity-60 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 템플릿 선택 (template 모드) */}
            {mode === "template" && (
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">템플릿 선택</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  value={templateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {availableTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {availableTemplates.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">이 채널에 등록된 템플릿이 없습니다.</p>
                )}
                {selectedTemplate && (
                  <div className="mt-2 bg-slate-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-400 mb-1">미리보기</p>
                    {selectedTemplate.subject && (
                      <p className="text-xs font-medium text-slate-700 mb-1">{selectedTemplate.subject}</p>
                    )}
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                      {selectedTemplate.content}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 직접 작성 */}
            {mode === "direct" && (
              <>
                {(channel === "EMAIL" || channel === "KAKAO") && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">제목</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="메시지 제목"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-600">내용</label>
                    {channel === "SMS" && (
                      <span className={`text-xs ${content.length > 80 ? "text-amber-600" : "text-slate-400"}`}>
                        {content.length} / 90자
                      </span>
                    )}
                  </div>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                    rows={5}
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setStep("mode")}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                이전
              </button>
              <button
                onClick={() => setStep("send")}
                disabled={mode === "template" ? !templateId : !content}
                className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 수신자 + 발송 */}
        {step === "send" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">수신자</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="ALL">전체 학습자 (8명)</option>
                <option value="react">React 기초 수강생 (5명)</option>
                <option value="typescript">TypeScript 심화 수강생 (3명)</option>
                <option value="nextjs">Next.js 마스터 수강생 (4명)</option>
                <option value="individual">개별 유저 선택</option>
              </select>
            </div>

            {/* 발송 요약 */}
            <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-600 flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-slate-400">채널</span>
                <span className="font-medium">{channel}</span>
              </div>
              {selectedTemplate && (
                <div className="flex justify-between">
                  <span className="text-slate-400">템플릿</span>
                  <span className="font-medium">{selectedTemplate.name}</span>
                </div>
              )}
            </div>

            {/* 예약 */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-violet-600"
                  checked={scheduled}
                  onChange={(e) => setScheduled(e.target.checked)}
                />
                <span className="text-sm text-slate-600">예약 발송</span>
              </label>
              {scheduled && (
                <input
                  type="datetime-local"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              )}
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setStep("compose")}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                이전
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                {scheduled ? "예약 등록" : "즉시 발송"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
