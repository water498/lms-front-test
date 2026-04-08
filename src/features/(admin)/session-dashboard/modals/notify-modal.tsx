"use client";

import { useState } from "react";
import { X, Lock } from "lucide-react";
import { type CourseSession } from "../../course-layout/mockData";
import { getSessionNotifyTemplates, type MessageChannel } from "../../messaging/mockData";
import type { MessageTemplate } from "@/lib/models";

interface Props {
  session: CourseSession;
  totalEnrolled: number;
  belowThresholdCount: number;
  context?: string; // 자동 선택 컨텍스트
  onClose: () => void;
}

type RecipientType = "ALL" | "BELOW_THRESHOLD" | "UNENROLLED";
type ScheduleType = "NOW" | "SCHEDULED";

const CUSTOM_ID = "custom";

const CHANNEL_BADGE: Record<MessageChannel, { label: string; className: string }> = {
  EMAIL: { label: "이메일",  className: "bg-blue-100 text-blue-700" },
  KAKAO: { label: "알림톡",  className: "bg-yellow-100 text-yellow-700" },
  SMS:   { label: "SMS",     className: "bg-slate-100 text-slate-600" },
};

export default function NotifyModal({ session, totalEnrolled, belowThresholdCount, context, onClose }: Props) {
  const sessionTemplates = getSessionNotifyTemplates();

  // context가 있으면 첫 번째 매칭 템플릿, 없으면 첫 번째 템플릿
  const autoTemplate = sessionTemplates[0];
  const defaultId = autoTemplate?.id ?? CUSTOM_ID;

  const [recipient, setRecipient] = useState<RecipientType>("ALL");
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [subject, setSubject] = useState(() => {
    return autoTemplate?.channel === "EMAIL" && autoTemplate.emailSubject ? autoTemplate.emailSubject : "";
  });
  const [body, setBody] = useState(() => autoTemplate?.content ?? "");
  const [schedule, setSchedule] = useState<ScheduleType>("NOW");
  const [scheduledDate, setScheduledDate] = useState("");
  const [sent, setSent] = useState(false);

  function handleTemplateChange(tpl: MessageTemplate | null) {
    if (!tpl) {
      setSelectedId(CUSTOM_ID);
      setSubject("");
      setBody("");
    } else {
      setSelectedId(tpl.id);
      setSubject(tpl.channel === "EMAIL" && tpl.emailSubject ? tpl.emailSubject : "");
      setBody(tpl.content);
    }
  }

  const recipientCount =
    recipient === "ALL" ? totalEnrolled :
    recipient === "BELOW_THRESHOLD" ? belowThresholdCount : 0;

  const canSend = body.trim().length > 0 && (schedule === "NOW" || scheduledDate.length > 0);

  function handleSend() {
    console.log("알림 발송", {
      sessionId: session.id,
      recipient,
      recipientCount,
      templateId: selectedId !== CUSTOM_ID ? selectedId : null,
      subject,
      body,
      schedule,
      scheduledDate: schedule === "SCHEDULED" ? scheduledDate : null,
    });
    setSent(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-800">알림 발송</h2>
            <p className="text-xs text-slate-400 mt-0.5">{session.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm font-semibold text-slate-700">발송 완료</p>
              <p className="text-xs text-slate-400 mt-1">{recipientCount > 0 ? `${recipientCount}명에게 알림이 전송되었습니다.` : "알림이 전송되었습니다."}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
              {/* Recipients */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">수신 대상</p>
                <div className="flex flex-col gap-1.5">
                  <RecipientOption id="ALL" current={recipient} onChange={setRecipient}
                    label={`등록 수강생 전체 (${totalEnrolled}명)`} />
                  <RecipientOption id="BELOW_THRESHOLD" current={recipient} onChange={setRecipient}
                    label={`수료 기준 미달 수강생 (${belowThresholdCount}명)`} />
                  <RecipientOption id="UNENROLLED" current={recipient} onChange={setRecipient}
                    label="미등록 대상자 (B2B 수강 대상자 중 미등록)" />
                </div>
              </div>

              {/* Template selection */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">메시지 템플릿</p>
                <div className="flex flex-col gap-2">
                  {sessionTemplates.map((tpl) => {
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
                          name="notify-template"
                          value={tpl.id}
                          checked={selectedId === tpl.id}
                          onChange={() => handleTemplateChange(tpl)}
                          className="mt-0.5 accent-violet-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-700">{tpl.name}</p>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge.className}`}>
                              {badge.label}
                            </span>
                            {tpl.isSystemDefault && (
                              <span title="시스템 기본 템플릿">
                                <Lock size={11} className="text-slate-400" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            &ldquo;{tpl.content.split("\n")[0]}&rdquo;
                          </p>
                        </div>
                      </label>
                    );
                  })}
                  {/* 직접 작성 */}
                  <label
                    className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                      selectedId === CUSTOM_ID
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="notify-template"
                      value={CUSTOM_ID}
                      checked={selectedId === CUSTOM_ID}
                      onChange={() => handleTemplateChange(null)}
                      className="mt-0.5 accent-violet-600"
                    />
                    <p className="text-sm font-medium text-slate-700">직접 작성</p>
                  </label>
                </div>
              </div>

              {/* Subject (EMAIL only) */}
              {(selectedId === CUSTOM_ID || sessionTemplates.find((t) => t.id === selectedId)?.channel === "EMAIL") && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">제목</p>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="알림 제목을 입력하세요"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  />
                </div>
              )}

              {/* Body */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">내용</p>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="알림 내용을 입력하세요"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                />
              </div>

              {/* Schedule */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">발송 시점</p>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="notify-schedule" checked={schedule === "NOW"}
                      onChange={() => setSchedule("NOW")} className="accent-violet-600" />
                    <span className="text-sm text-slate-700">즉시 발송</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="notify-schedule" checked={schedule === "SCHEDULED"}
                      onChange={() => setSchedule("SCHEDULED")} className="accent-violet-600" />
                    <span className="text-sm text-slate-700">날짜 지정</span>
                    {schedule === "SCHEDULED" && (
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="ml-2 border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 shrink-0">
              <span className="text-xs text-slate-400">
                {recipientCount > 0 ? `${recipientCount}명에게 발송` : ""}
              </span>
              <div className="flex gap-2">
                <button onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                  취소
                </button>
                <button onClick={handleSend} disabled={!canSend}
                  className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  발송{recipientCount > 0 ? ` (${recipientCount}명)` : ""}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RecipientOption({
  id, current, onChange, label,
}: {
  id: RecipientType;
  current: RecipientType;
  onChange: (v: RecipientType) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="notify-recipient" checked={current === id}
        onChange={() => onChange(id)} className="accent-violet-600" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
