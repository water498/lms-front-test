"use client";

import { useState } from "react";
import { channelConfig, type MessageChannel } from "../mockData";

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        connected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {connected ? "연동됨" : "미연동"}
    </span>
  );
}

function ChannelCard({
  title,
  connected,
  children,
}: {
  title: string;
  connected: boolean;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          <ConnectionBadge connected={connected} />
        </div>
        <div className="flex gap-2">
          <button
            className="text-xs px-3 py-1.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "취소" : "수정"}
          </button>
          <button className="text-xs px-3 py-1.5 text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
            연동 테스트
          </button>
        </div>
      </div>
      <div className={`grid gap-3 ${editing ? "opacity-100" : "opacity-60 pointer-events-none"}`}>
        {children}
      </div>
      {editing && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
      />
    </div>
  );
}

interface Props {
  channel: MessageChannel;
}

export default function ChannelSettingsTab({ channel }: Props) {
  const cfg = channelConfig;

  return (
    <div className="flex flex-col gap-4">
      {channel === "SMS" && (
        <ChannelCard title="SMS" connected={cfg.smsConnected}>
          <Field label="발신번호" value={cfg.smsSenderNumber ?? ""} />
          <Field label="API Key"  value={cfg.smsApiKey ?? ""} type="password" />
        </ChannelCard>
      )}

      {channel === "EMAIL" && (
        <ChannelCard title="이메일 (SMTP)" connected={cfg.emailConnected}>
          <Field label="발신 이메일" value={cfg.emailSender ?? ""} type="email" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="SMTP 서버" value={cfg.emailSmtpHost ?? ""} />
            <Field label="포트"      value={String(cfg.emailSmtpPort ?? "")} />
          </div>
        </ChannelCard>
      )}

      {channel === "KAKAO" && (
        <ChannelCard title="알림톡 (카카오)" connected={cfg.kakaoConnected}>
          <Field label="채널 검색용 ID" value={cfg.kakaoChannelId ?? ""} />
          <Field label="채널키"         value={cfg.kakaoChannelKey ?? ""} type="password" />
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            알림톡은 사업자 등록 및 카카오 채널 개설 후 사용 가능합니다.
          </p>
        </ChannelCard>
      )}
    </div>
  );
}
