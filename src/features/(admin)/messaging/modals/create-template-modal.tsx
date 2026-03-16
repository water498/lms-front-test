"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getVariableDefsForChannel, variableDefs, type MessageChannel, type MessageTemplate } from "../mockData";

interface Props {
  channel: MessageChannel;
  initialTemplate?: MessageTemplate;
  onClose: () => void;
}

const CHANNEL_BADGE: Record<MessageChannel, { label: string; className: string }> = {
  SMS:   { label: "SMS",    className: "bg-blue-100 text-blue-700" },
  EMAIL: { label: "이메일", className: "bg-violet-100 text-violet-700" },
  KAKAO: { label: "알림톡", className: "bg-amber-100 text-amber-700" },
};

function extractVariables(text: string): string[] {
  return [...new Set([...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
}

// ── 미리보기 컴포넌트 ───────────────────────────────────────

function SmsPreview({ content }: { content: string }) {
  return (
    <div className="flex flex-col items-end gap-2 p-4">
      <div className="bg-slate-200 rounded-2xl rounded-tr-sm px-4 py-3 max-w-full">
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{content}</p>
      </div>
      <p className="text-xs text-slate-400 tabular-nums">{content.length}자</p>
    </div>
  );
}

function KakaoPreview({ content, buttons }: { content: string; buttons: { text: string; url: string }[] }) {
  return (
    <div className="flex flex-col items-start gap-2 p-4 bg-[#b2c7d9]/20 rounded-xl">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">K</div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-600">알림톡</p>
          <div className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{content}</p>
            {buttons.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-2 flex flex-col gap-1">
                {buttons.map((btn, i) => (
                  <div key={i} className="text-center text-xs text-blue-500 font-medium py-1 border border-blue-200 rounded-lg bg-blue-50">
                    {btn.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ subject, content }: { subject: string; content: string }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
        <p className="text-slate-500">제목</p>
        <p className="font-semibold text-slate-700 mt-0.5">{subject || "(제목 없음)"}</p>
      </div>
      <div className="bg-white px-4 py-4 flex flex-col gap-2">
        <div className="h-2.5 bg-slate-200 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-full" />
        <div className="h-2 bg-slate-100 rounded w-5/6" />
        <div className="h-2 bg-slate-100 rounded w-4/6" />
        <div className="h-7 bg-violet-100 rounded w-1/3 mt-2" />
      </div>
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
        <p className="text-slate-400 text-xs whitespace-pre-line leading-relaxed line-clamp-4">{content}</p>
      </div>
    </div>
  );
}

export default function CreateTemplateModal({ channel, initialTemplate, onClose }: Props) {
  const [name, setName]             = useState(initialTemplate?.name ?? "");
  const [subject, setSubject]       = useState(initialTemplate?.subject ?? "");
  const [content, setContent]       = useState(initialTemplate?.content ?? "");
  const [kakaoCode, setKakaoCode]   = useState(initialTemplate?.kakaoCode ?? "");
  const [buttonText, setButtonText] = useState(initialTemplate?.kakaoButtons?.[0]?.text ?? "");
  const [buttonUrl, setButtonUrl]   = useState(initialTemplate?.kakaoButtons?.[0]?.url ?? "");

  const insertVariable = (v: string) => setContent((c) => c + `{{${v}}}`);
  const badge = CHANNEL_BADGE[channel];
  const isEdit = !!initialTemplate;

  const kakaoButtons = buttonText ? [{ text: buttonText, url: buttonUrl }] : [];
  const channelVars = getVariableDefsForChannel(channel);
  const detectedVars = extractVariables(content + (channel === "EMAIL" ? subject : ""));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-800">
              {isEdit ? "템플릿 수정" : "템플릿 추가"}
            </h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="flex gap-6">
          {/* 폼 */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* 이름 */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">템플릿 이름</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="수강 등록 안내"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL: 제목 / KAKAO: 템플릿 코드 */}
            {(channel === "EMAIL" || channel === "KAKAO") && (
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  {channel === "EMAIL" ? "이메일 제목" : "카카오 템플릿 코드"}
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder={channel === "EMAIL" ? "[ACME] {{courseName}} 수강 안내" : "TMP_20250101_001"}
                  value={channel === "EMAIL" ? subject : kakaoCode}
                  onChange={(e) => channel === "EMAIL" ? setSubject(e.target.value) : setKakaoCode(e.target.value)}
                />
                {channel === "KAKAO" && (
                  <p className="text-xs text-amber-600 mt-1">
                    카카오 비즈니스 채널에서 사전 승인받은 템플릿 코드를 입력하세요.
                  </p>
                )}
              </div>
            )}

            {/* 내용 */}
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none font-mono"
                rows={5}
                placeholder={
                  channel === "SMS"
                    ? "[ACME] {{name}}님, {{courseName}} 수강이 시작됩니다."
                    : "안녕하세요, {{name}}님.\n\n내용을 입력하세요."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {/* 변수 삽입 — 레지스트리 기반 */}
              <div className="mt-2">
                <p className="text-xs text-slate-400 mb-1.5">변수 삽입 <span className="text-slate-300">({channel} 사용 가능)</span></p>
                <div className="flex flex-wrap gap-1">
                  {channelVars.map((v) => (
                    <button
                      key={v.key}
                      onClick={() => insertVariable(v.key)}
                      title={`소스: ${v.source}`}
                      className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
                    >
                      <span className="font-mono">{`{{${v.key}}}`}</span>
                      <span className="text-slate-400 text-[10px]">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* 현재 내용에서 감지된 변수 */}
              {detectedVars.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-slate-400">감지된 변수:</span>
                  {detectedVars.map((v) => {
                    const def = variableDefs.find((d) => d.key === v);
                    const isKnown = !!def;
                    return (
                      <span
                        key={v}
                        className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                          isKnown ? "bg-violet-50 text-violet-600" : "bg-amber-50 text-amber-600"
                        }`}
                        title={isKnown ? def!.source : "레지스트리에 없는 변수"}
                      >
                        {`{{${v}}}`}
                        {!isKnown && <span className="ml-0.5 text-[9px]">?</span>}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* KAKAO: 버튼 설정 */}
            {channel === "KAKAO" && (
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">버튼 (선택)</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="버튼 텍스트"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                  />
                  <input
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="https://..."
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 미리보기 */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-0">
              <p className="text-xs font-medium text-slate-500 mb-3">미리보기</p>
              {content ? (
                <>
                  {channel === "SMS"   && <SmsPreview   content={content} />}
                  {channel === "KAKAO" && <KakaoPreview content={content} buttons={kakaoButtons} />}
                  {channel === "EMAIL" && <EmailPreview subject={subject} content={content} />}
                </>
              ) : (
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-5 text-center text-slate-400 text-xs leading-relaxed">
                  내용을 입력하면<br />미리보기가 표시됩니다.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            disabled={!name || !content}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
