"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { MessageChannel } from "../mockData";

interface Props {
  onClose: () => void;
}

const CHANNELS: { id: MessageChannel; label: string; desc: string }[] = [
  { id: "SMS",   label: "SMS",    desc: "90자 이내 문자" },
  { id: "EMAIL", label: "이메일", desc: "HTML 이메일" },
  { id: "KAKAO", label: "알림톡", desc: "카카오 사전 승인 필요" },
];

const VARIABLE_HINTS = ["name", "courseName", "sessionName", "dueDate", "orgName", "link", "month"];

export default function CreateTemplateModal({ onClose }: Props) {
  const [channel, setChannel] = useState<MessageChannel>("EMAIL");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [kakaoCode, setKakaoCode] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  const insertVariable = (v: string) => setContent((c) => c + `{{${v}}}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">템플릿 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="flex flex-col gap-4">
          {/* 채널 선택 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">채널</label>
            <div className="flex gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  className={`flex-1 border rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                    channel === c.id
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <p className="font-medium">{c.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

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

          {/* EMAIL: 제목 */}
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
            {/* 변수 힌트 */}
            <div className="mt-2">
              <p className="text-xs text-slate-400 mb-1">변수 삽입:</p>
              <div className="flex flex-wrap gap-1">
                {VARIABLE_HINTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono transition-colors"
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>
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
