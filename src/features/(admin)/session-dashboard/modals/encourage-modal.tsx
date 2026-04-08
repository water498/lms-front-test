"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getEncourageTemplates, type MessageChannel } from "../../messaging-automation/mockData";

interface Learner {
  id: string;
  name: string;
}

interface Props {
  learners: Learner[];
  onClose: () => void;
}

const CHANNEL_BADGE: Record<MessageChannel, { label: string; className: string }> = {
  EMAIL: { label: "이메일",  className: "bg-blue-100 text-blue-700" },
  KAKAO: { label: "알림톡",  className: "bg-yellow-100 text-yellow-700" },
  SMS:   { label: "SMS",     className: "bg-slate-100 text-slate-600" },
};

const CUSTOM_ID = "custom";

export default function EncourageModal({ learners, onClose }: Props) {
  const encourageTemplates = getEncourageTemplates();
  const defaultId = encourageTemplates[1]?.id ?? encourageTemplates[0]?.id ?? CUSTOM_ID;

  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [message, setMessage] = useState(
    encourageTemplates.find((t) => t.id === defaultId)?.content ?? ""
  );

  function handleTemplateChange(id: string) {
    setSelectedId(id);
    if (id === CUSTOM_ID) {
      setMessage("");
    } else {
      const tpl = encourageTemplates.find((t) => t.id === id);
      setMessage(tpl?.content ?? "");
    }
  }

  function handleSend() {
    const tpl = encourageTemplates.find((t) => t.id === selectedId);
    console.log("독려 메시지 발송", { recipients: learners, message, templateId: tpl?.id ?? null });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">수강 독려 메시지 발송</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Recipients */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">발송 대상 ({learners.length}명)</p>
            <div className="flex flex-wrap gap-1.5">
              {learners.map((l) => (
                <span
                  key={l.id}
                  className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {l.name}
                </span>
              ))}
            </div>
          </div>

          {/* Template selection */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">메시지 템플릿</p>
            <div className="flex flex-col gap-2">
              {encourageTemplates.map((tpl) => {
                const badge = CHANNEL_BADGE[tpl.channel];
                return (
                  <label
                    key={tpl.id}
                    className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                      selectedId === tpl.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={tpl.id}
                      checked={selectedId === tpl.id}
                      onChange={() => handleTemplateChange(tpl.id)}
                      className="mt-0.5 accent-violet-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-700">{tpl.name}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">"{tpl.content.split("\n")[0]}"</p>
                    </div>
                  </label>
                );
              })}

              {/* 직접 입력 */}
              <label
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                  selectedId === CUSTOM_ID
                    ? "border-violet-400 bg-violet-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={CUSTOM_ID}
                  checked={selectedId === CUSTOM_ID}
                  onChange={() => handleTemplateChange(CUSTOM_ID)}
                  className="mt-0.5 accent-violet-600"
                />
                <p className="text-sm font-medium text-slate-700">직접 입력</p>
              </label>
            </div>
          </div>

          {/* Message preview / input */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">메시지 미리보기 / 입력</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="메시지를 입력하세요"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            발송 ({learners.length}명)
          </button>
        </div>
      </div>
    </div>
  );
}
