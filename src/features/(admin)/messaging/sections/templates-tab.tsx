"use client";

import { useState } from "react";
import { MessageSquare, Mail, AlertCircle, CheckCircle, Clock, Plus, Edit2, Trash2 } from "lucide-react";
import { messageTemplates, type MessageChannel, type MessageTemplate, type KakaoApprovalStatus } from "../mockData";

const CHANNEL_FILTER: { id: MessageChannel | "ALL"; label: string }[] = [
  { id: "ALL",   label: "전체" },
  { id: "SMS",   label: "SMS" },
  { id: "EMAIL", label: "이메일" },
  { id: "KAKAO", label: "알림톡" },
];

const KAKAO_APPROVAL_CONFIG: Record<KakaoApprovalStatus, { label: string; icon: React.ElementType; className: string }> = {
  APPROVED: { label: "승인완료", icon: CheckCircle, className: "text-emerald-600" },
  PENDING:  { label: "심사중",   icon: Clock,        className: "text-amber-500" },
  REJECTED: { label: "반려",     icon: AlertCircle,  className: "text-red-500" },
};

function SmsCard({ t }: { t: MessageTemplate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">SMS</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{t.name}</h3>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 size={13} /></button>
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 font-mono leading-relaxed">
        {t.content}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {t.variables.map((v) => (
            <span key={v} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono">{`{{${v}}}`}</span>
          ))}
        </div>
        <span className={`text-xs tabular-nums ${(t.charCount ?? 0) > 80 ? "text-amber-600" : "text-slate-400"}`}>
          {t.charCount ?? 0}자 / 90자
        </span>
      </div>
    </div>
  );
}

function EmailCard({ t }: { t: MessageTemplate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={14} className="text-violet-500" />
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">이메일</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{t.name}</h3>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 size={13} /></button>
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      <div className="bg-slate-50 rounded-lg px-3 py-2">
        <p className="text-xs text-slate-500 mb-0.5">제목</p>
        <p className="text-xs font-medium text-slate-700">{t.subject}</p>
      </div>
      {/* HTML 본문 미리보기 mock */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-3 py-1.5 text-xs text-slate-400 border-b border-slate-200">본문 미리보기</div>
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="h-2.5 bg-slate-200 rounded w-3/4" />
          <div className="h-2 bg-slate-100 rounded w-full" />
          <div className="h-2 bg-slate-100 rounded w-5/6" />
          <div className="h-7 bg-violet-100 rounded w-1/3 mt-1" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {t.variables.map((v) => (
          <span key={v} className="text-xs bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded font-mono">{`{{${v}}}`}</span>
        ))}
      </div>
    </div>
  );
}

function KakaoCard({ t }: { t: MessageTemplate }) {
  const approval = t.kakaoApproval ? KAKAO_APPROVAL_CONFIG[t.kakaoApproval] : null;
  const ApprovalIcon = approval?.icon;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">알림톡</span>
            {approval && ApprovalIcon && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${approval.className}`}>
                <ApprovalIcon size={12} /> {approval.label}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{t.name}</h3>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 size={13} /></button>
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      {t.kakaoCode && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">템플릿 코드</span>
          <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded">{t.kakaoCode}</span>
        </div>
      )}
      <p className="text-xs text-slate-600 bg-amber-50 rounded-lg px-3 py-2 leading-relaxed whitespace-pre-line">
        {t.content}
      </p>
      {t.kakaoButtons && t.kakaoButtons.length > 0 && (
        <div className="flex flex-col gap-1">
          {t.kakaoButtons.map((btn, i) => (
            <div key={i} className="text-xs border border-slate-200 rounded px-3 py-1.5 text-slate-600 text-center">
              {btn.text} →
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {t.variables.map((v) => (
          <span key={v} className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-mono">{`{{${v}}}`}</span>
        ))}
      </div>
    </div>
  );
}

interface Props {
  onCreateClick: () => void;
}

export default function TemplatesTab({ onCreateClick }: Props) {
  const [channelFilter, setChannelFilter] = useState<MessageChannel | "ALL">("ALL");

  const filtered = messageTemplates.filter(
    (t) => channelFilter === "ALL" || t.channel === channelFilter
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {CHANNEL_FILTER.map((f) => (
            <button
              key={f.id}
              onClick={() => setChannelFilter(f.id as MessageChannel | "ALL")}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                channelFilter === f.id
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">
                {f.id === "ALL" ? messageTemplates.length : messageTemplates.filter((t) => t.channel === f.id).length}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus size={14} /> 템플릿 추가
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((t) => {
          if (t.channel === "SMS")   return <SmsCard   key={t.id} t={t} />;
          if (t.channel === "EMAIL") return <EmailCard key={t.id} t={t} />;
          if (t.channel === "KAKAO") return <KakaoCard key={t.id} t={t} />;
          return null;
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400 text-sm">
            템플릿이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
