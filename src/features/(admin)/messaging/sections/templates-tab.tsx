"use client";

import { useState } from "react";
import { MessageSquare, Mail, AlertCircle, CheckCircle, Clock, Plus, Edit2, Trash2 } from "lucide-react";
import { messageTemplates, variableDefs, type MessageChannel, type MessageTemplate, type KakaoApprovalStatus } from "../mockData";

const KAKAO_APPROVAL_CONFIG: Record<KakaoApprovalStatus, { label: string; icon: React.ElementType; className: string }> = {
  APPROVED: { label: "승인완료", icon: CheckCircle, className: "text-emerald-600" },
  PENDING:  { label: "심사중",   icon: Clock,        className: "text-amber-500" },
  REJECTED: { label: "반려",     icon: AlertCircle,  className: "text-red-500" },
};

function extractVariables(text: string): string[] {
  return [...new Set([...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
}

function VariableBadge({ v, channel }: { v: string; channel: MessageChannel }) {
  const def = variableDefs.find((d) => d.key === v);
  const colorMap: Record<MessageChannel, string> = {
    SMS:   "bg-blue-50 text-blue-600",
    EMAIL: "bg-violet-50 text-violet-600",
    KAKAO: "bg-amber-50 text-amber-600",
  };
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${colorMap[channel]}`} title={def?.label}>
      {`{{${v}}}`}
    </span>
  );
}

function SmsCard({ t, selected, onClick, onEditClick, onDeleteClick }: {
  t: MessageTemplate; selected: boolean;
  onClick: () => void; onEditClick: () => void; onDeleteClick: () => void;
}) {
  const vars = extractVariables(t.content);
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 flex flex-col gap-3 cursor-pointer transition-colors ${
        selected ? "border-violet-400 ring-1 ring-violet-300" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">SMS</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{t.name}</h3>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEditClick} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 size={13} /></button>
          <button onClick={onDeleteClick} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 font-mono leading-relaxed line-clamp-3">
        {t.content}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {vars.map((v) => <VariableBadge key={v} v={v} channel="SMS" />)}
        </div>
        <span className={`text-xs tabular-nums ${(t.charCount ?? 0) > 80 ? "text-amber-600" : "text-slate-400"}`}>
          {t.charCount ?? 0}자 / 90자
        </span>
      </div>
    </div>
  );
}

function EmailCard({ t, selected, onClick, onEditClick, onDeleteClick }: {
  t: MessageTemplate; selected: boolean;
  onClick: () => void; onEditClick: () => void; onDeleteClick: () => void;
}) {
  const vars = extractVariables(t.content + (t.subject ?? ""));
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 flex flex-col gap-3 cursor-pointer transition-colors ${
        selected ? "border-violet-400 ring-1 ring-violet-300" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={14} className="text-violet-500" />
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">이메일</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{t.name}</h3>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEditClick} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 size={13} /></button>
          <button onClick={onDeleteClick} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      <div className="bg-slate-50 rounded-lg px-3 py-2">
        <p className="text-xs text-slate-500 mb-0.5">제목</p>
        <p className="text-xs font-medium text-slate-700 truncate">{t.subject}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {vars.map((v) => <VariableBadge key={v} v={v} channel="EMAIL" />)}
      </div>
    </div>
  );
}

function KakaoCard({ t, selected, onClick, onEditClick, onDeleteClick }: {
  t: MessageTemplate; selected: boolean;
  onClick: () => void; onEditClick: () => void; onDeleteClick: () => void;
}) {
  const approval = t.kakaoApproval ? KAKAO_APPROVAL_CONFIG[t.kakaoApproval] : null;
  const ApprovalIcon = approval?.icon;
  const vars = extractVariables(t.content);
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 flex flex-col gap-3 cursor-pointer transition-colors ${
        selected ? "border-violet-400 ring-1 ring-violet-300" : "border-slate-200 hover:border-slate-300"
      }`}
    >
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
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEditClick} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 size={13} /></button>
          <button onClick={onDeleteClick} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      {t.kakaoCode && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">템플릿 코드</span>
          <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded">{t.kakaoCode}</span>
        </div>
      )}
      <p className="text-xs text-slate-600 bg-amber-50 rounded-lg px-3 py-2 leading-relaxed line-clamp-3">
        {t.content}
      </p>
      <div className="flex flex-wrap gap-1">
        {vars.map((v) => <VariableBadge key={v} v={v} channel="KAKAO" />)}
      </div>
    </div>
  );
}

// ── 채널별 미리보기 패널 ─────────────────────────────────

function SmsPreview({ t }: { t: MessageTemplate }) {
  return (
    <div className="flex flex-col items-end gap-2 p-4">
      <div className="bg-slate-200 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{t.content}</p>
      </div>
      <p className="text-xs text-slate-400 tabular-nums">{t.charCount ?? 0}자</p>
    </div>
  );
}

function KakaoPreview({ t }: { t: MessageTemplate }) {
  return (
    <div className="flex flex-col items-start gap-2 p-4 bg-[#b2c7d9]/20 rounded-xl">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">K</div>
        <div className="flex flex-col gap-1 max-w-[220px]">
          <p className="text-xs font-semibold text-slate-600">알림톡</p>
          <div className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{t.content}</p>
            {t.kakaoButtons && t.kakaoButtons.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-2 flex flex-col gap-1">
                {t.kakaoButtons.map((btn, i) => (
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

function EmailPreview({ t }: { t: MessageTemplate }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
        <p className="text-slate-500">제목</p>
        <p className="font-semibold text-slate-700 mt-0.5">{t.subject}</p>
      </div>
      <div className="bg-white px-4 py-4 flex flex-col gap-2">
        <div className="h-2.5 bg-slate-200 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-full" />
        <div className="h-2 bg-slate-100 rounded w-5/6" />
        <div className="h-2 bg-slate-100 rounded w-4/6" />
        <div className="h-7 bg-violet-100 rounded w-1/3 mt-2" />
      </div>
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
        <p className="text-slate-400 text-xs whitespace-pre-line leading-relaxed line-clamp-4">{t.content}</p>
      </div>
    </div>
  );
}

function PreviewPanel({ template, channel }: { template: MessageTemplate; channel: MessageChannel }) {
  const vars = extractVariables(template.content + (template.subject ?? ""));
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">미리보기</p>
        <p className="text-sm font-semibold text-slate-800">{template.name}</p>
      </div>
      {channel === "SMS"   && <SmsPreview   t={template} />}
      {channel === "KAKAO" && <KakaoPreview t={template} />}
      {channel === "EMAIL" && <EmailPreview t={template} />}
      <div>
        <p className="text-xs text-slate-400 mb-1.5">변수</p>
        <div className="flex flex-wrap gap-1">
          {vars.map((v) => {
            const def = variableDefs.find((d) => d.key === v);
            return (
              <span key={v} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded" title={def?.source}>
                <span className="font-mono">{`{{${v}}}`}</span>
                {def && <span className="text-slate-400 text-[10px]">{def.label}</span>}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface Props {
  channel: MessageChannel;
  onCreateClick: () => void;
  onEditClick: (template: MessageTemplate) => void;
}

export default function TemplatesTab({ channel, onCreateClick, onEditClick }: Props) {
  const [templates, setTemplates] = useState(messageTemplates);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = templates.filter((t) => t.channel === channel);
  const selectedTemplate = filtered.find((t) => t.id === selectedId) ?? null;

  const deleteTemplate = (id: string) => {
    if (selectedId === id) setSelectedId(null);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{filtered.length}개</p>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus size={14} /> 템플릿 추가
        </button>
      </div>

      <div className="flex gap-4">
        {/* 템플릿 목록 */}
        <div className="flex-1 flex flex-col gap-3">
          {filtered.map((t) => {
            const sel = t.id === selectedId;
            const common = {
              selected: sel,
              onClick: () => setSelectedId(sel ? null : t.id),
              onEditClick: () => onEditClick(t),
              onDeleteClick: () => deleteTemplate(t.id),
            };
            if (t.channel === "SMS")   return <SmsCard   key={t.id} t={t} {...common} />;
            if (t.channel === "EMAIL") return <EmailCard key={t.id} t={t} {...common} />;
            if (t.channel === "KAKAO") return <KakaoCard key={t.id} t={t} {...common} />;
            return null;
          })}
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400 text-sm">
              템플릿이 없습니다.
            </div>
          )}
        </div>

        {/* 미리보기 패널 */}
        <div className="w-72 flex-shrink-0">
          {selectedTemplate ? (
            <div className="sticky top-4 bg-white rounded-xl border border-slate-200 p-5">
              <PreviewPanel template={selectedTemplate} channel={channel} />
            </div>
          ) : (
            <div className="sticky top-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-5 text-center text-slate-400 text-xs">
              템플릿을 선택하면<br />미리보기가 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
